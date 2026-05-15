const express = require('express');
const userController = require('../controllers/userController');
const protect = require('../middleware/protect');
const multer = require('multer');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'), false);
    }
  }
});

router.get('/profile', protect, userController.getUserProfile);

router.put('/profile', protect, userController.updateProfile);

router.post(
  '/photo', 
  protect, 
  upload.single('image'), 
  userController.updateProfilePhoto
);

module.exports = router;