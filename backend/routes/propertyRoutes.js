const express = require('express');
const router = express.Router();
const {
  getAllProperties,
  getFeaturedProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');

const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 10 // Maximum 10 files
  }
});

// Public routes
router.get('/', getAllProperties);
router.get('/featured', getFeaturedProperties);
router.get('/:id', getProperty);

// Protected routes
router.post('/', protect, (req, res, next) => {
  upload.array('images')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({
        success: false,
        message: `Unknown upload error: ${err.message}`
      });
    }
    // If everything went fine, continue to your controller
    next();
  });
}, createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router; 