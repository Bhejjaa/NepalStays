const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Destination = require('../models/Destination');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

// Protect all admin routes
router.use(protect);
router.use(isAdmin);

// Admin Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const propertyCount = await Property.countDocuments();
    const bookingCount = await Booking.countDocuments();
    const destinationCount = await Destination.countDocuments();

    res.json({
      success: true,
      data: {
        users: userCount,
        properties: propertyCount,
        bookings: bookingCount,
        destinations: destinationCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;