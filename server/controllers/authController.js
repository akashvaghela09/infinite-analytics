const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 8 characters long.'
      });
    }

    const existingLocalUser = await User.findOne({
      'authProviders.provider': 'local',
      'authProviders.email': email
    });

    if (existingLocalUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already in use.'
      });
    }

    const existingGoogleUser = await User.findOne({
      'authProviders': {
        $elemMatch: { provider: 'google', email: email }
      }
    });

    const hasLocalProvider = existingGoogleUser && existingGoogleUser.authProviders.some(
      ap => ap.provider === 'local'
    );

    let user;

    if (existingGoogleUser && !hasLocalProvider) {
      existingGoogleUser.authProviders.push({
        provider: 'local',
        email,
        passwordHash: password
      });
      await existingGoogleUser.save();
      user = existingGoogleUser;
    } else if (existingGoogleUser && hasLocalProvider) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already in use.'
      });
    } else {
      user = await User.create({
        name,
        email, // Canonical email
        authProviders: [{
          provider: 'local',
          email,
          passwordHash: password
        }]
      });
    }

    generateToken(res, user._id);

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      providers: user.providers
    };

    res.status(201).json({
      status: 'success',
      user: userResponse
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already in use.'
      });
    }

    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: errorMessages[0]
      });
    }

    if (error.message === 'Email already in use.') {
      return res.status(400).json({
        status: 'error',
        message: 'Email already in use.'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'An error occurred during registration.'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password.'
      });
    }

    const user = await User.findOne({
      'authProviders.provider': 'local',
      'authProviders.email': email
    });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password.'
      });
    }

    const localProvider = user.authProviders.find(
      ap => ap.provider === 'local' && ap.email === email
    );

    if (!localProvider || !localProvider.passwordHash) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password.'
      });
    }

    const isPasswordCorrect = await User.compareLocalPassword(
      password,
      localProvider.passwordHash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password.'
      });
    }

    generateToken(res, user._id);

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      providers: user.providers
    };

    res.status(200).json({
      status: 'success',
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during login.'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      bio: user.bio,
      phone: user.phone,
      providers: user.providers
    };

    res.status(200).json({
      status: 'success',
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred fetching user details.'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
exports.logout = (req, res) => {
  res.cookie('ia_token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.status(200).json({ 
    status: 'success', 
    message: 'Logged out successfully' 
  });
};

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
exports.googleCallback = async (req, res) => {
  try {
    const googleUser = req.user;

    generateToken(res, googleUser._id);

    res.redirect(`${process.env.CLIENT_URL}/auth/google/callback`);
  } catch (error) {
    res.status(500).redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
};
