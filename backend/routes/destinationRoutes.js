const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

const {
  getAllDestinations,
  getPopularDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination
} = require('../controllers/destinationController');

const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

// Set up multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public routes
router.get('/', getAllDestinations);
router.get('/popular', getPopularDestinations);
router.get('/:id', getDestination);

// Protected routes with file upload
router.post('/', protect, isAdmin, upload.single('image'), createDestination);
router.put('/:id', protect, isAdmin, upload.single('image'), updateDestination);
router.delete('/:id', protect, isAdmin, deleteDestination);

module.exports = router;