const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes - require authentication
router.use(protect);
router.get('/profile', userController.getProfile);
router.put('/password', userController.updatePassword);
router.post('/favorites', userController.toggleFavorite);

module.exports = router; 