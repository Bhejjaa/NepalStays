const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');

const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getAllBookings)
  .post(createBooking);

router.route('/:id')
  .get(getBooking)
  .put(updateBookingStatus)
  .delete(cancelBooking);

module.exports = router; 