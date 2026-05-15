const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.ia_token;

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in. Please log in to continue.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. Please log in again.'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Your session has expired. Please log in again.'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'An error occurred during authentication.'
    });
  }
};

module.exports = protect;