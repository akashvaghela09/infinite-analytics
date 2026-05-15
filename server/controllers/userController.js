const User = require('../models/User');
const bcrypt = require('bcryptjs');
const axios = require('axios');

// @desc    Get user profile
// @route   GET /api/user/profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-authProviders.passwordHash');

    const userResponse = {
      ...user.toObject(),
      providers: user.providers
    };

    res.status(200).json({
      status: 'success',
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred fetching your profile.'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, bio, phone, password, currentPassword } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and email are required.'
      });
    }

    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: req.user.id } 
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is already in use by another account.'
      });
    }

    const updateFields = { name, email, bio, phone };

    const user = await User.findById(req.user.id);
    const localProvider = user.authProviders.find(ap => ap.provider === 'local');

    if (password) {
      if (localProvider) {
        if (!currentPassword) {
          return res.status(400).json({
            status: 'error',
            message: 'Current password is required to change password.'
          });
        }

        const isCurrentPasswordCorrect = await bcrypt.compare(
          currentPassword,
          localProvider.passwordHash
        );

        if (!isCurrentPasswordCorrect) {
          return res.status(401).json({
            status: 'error',
            message: 'Current password is incorrect.'
          });
        }

        localProvider.passwordHash = password;
        await user.save();
      } else {
        user.authProviders.push({
          provider: 'local',
          email: user.email, // Use canonical email
          passwordHash: password // pre-save middleware will hash it
        });
        await user.save();
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      updateFields, 
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-authProviders.passwordHash');

    const userResponse = {
      ...updatedUser.toObject(),
      providers: updatedUser.providers
    };

    res.status(200).json({
      status: 'success',
      user: userResponse
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: errorMessages[0]
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'An error occurred updating your profile.'
    });
  }
};

// @desc    Upload profile photo
// @route   POST /api/user/photo
exports.updateProfilePhoto = async (req, res) => {
  try {
    let photoUrl;

    if (req.file) {
      const base64Image = req.file.buffer.toString('base64');
      const imgbbResponse = await axios.post('https://api.imgbb.com/1/upload', 
        new URLSearchParams({
          key: process.env.IMGBB_API_KEY,
          image: base64Image
        }), 
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      photoUrl = imgbbResponse.data.data.url;
    } 
    else if (req.body.imageUrl) {
      const imageUrl = req.body.imageUrl;

      const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
      if (!urlPattern.test(imageUrl)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid image URL.'
        });
      }

      photoUrl = imageUrl;
    } 
    else {
      return res.status(400).json({
        status: 'error',
        message: 'No image provided.'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      { photo: photoUrl }, 
      { new: true }
    ).select('-authProviders.passwordHash');

    const userResponse = {
      ...updatedUser.toObject(),
      providers: updatedUser.providers
    };

    res.status(200).json({
      status: 'success',
      user: userResponse
    });
  } catch (error) {
    if (error.response) {
      return res.status(400).json({
        status: 'error',
        message: error.response.data.error.message || 'Failed to upload image.'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'An error occurred uploading your photo.'
    });
  }
};
