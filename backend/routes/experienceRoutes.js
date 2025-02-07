const express = require('express');
const router = express.Router();
const {
  getAllExperiences,
  getExperiencesByCategory,
  getFeaturedExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience
} = require('../controllers/experienceController');

const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllExperiences);
router.get('/featured', getFeaturedExperiences);
router.get('/category/:category', getExperiencesByCategory);
router.get('/:id', getExperience);

// Protected routes
router.post('/', protect, createExperience);
router.put('/:id', protect, updateExperience);
router.delete('/:id', protect, deleteExperience);

module.exports = router; 