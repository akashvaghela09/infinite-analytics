const express = require('express');
const authController = require('../controllers/authController');
const passport = require('passport');
const protect = require('../middleware/protect');

const router = express.Router();

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

router.get('/me', protect, authController.getCurrentUser);

// Logout route
router.post('/logout', authController.logout);

// Google OAuth routes
router.get(
  '/google',
  (req, res, next) => {
    console.log('Google OAuth initiated');
    console.log('Callback URL:', process.env.GOOGLE_CALLBACK_URL);
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  (req, res, next) => {
    console.log('Google OAuth callback received');
    console.log('Query params:', req.query);
    next();
  },
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/api/auth/google/failed'
  }),
  authController.googleCallback
);

// Google OAuth failure handler
router.get('/google/failed', (req, res) => {
  console.error('Google OAuth authentication failed');
  res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
});

module.exports = router;