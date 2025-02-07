const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User');
const { 
    register, 
    login, 
    getProfile, 
    updateProfile, 
    updatePassword,
    updateProfileImage 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Regular auth routes
router.post('/register', register);
router.post('/login', login);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    // User is authenticated and has token attached from passport strategy
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${req.user.token}`);
  }
);

// Protected routes
router.get('/me', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.put('/profile-image', protect, upload.single('image'), updateProfileImage);

module.exports = router;