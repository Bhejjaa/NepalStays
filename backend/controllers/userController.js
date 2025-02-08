const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Booking = require('../models/Booking');

const userController = {
  // Get user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id)
        .populate({
          path: 'bookingHistory',
          populate: {
            path: 'property',
            select: 'name images location'
          }
        })
        .populate({
          path: 'wishlist',
          select: 'name images location price'
        });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          location: user.location,
          profileImage: user.profileImage,
          bookings: user.bookingHistory,
          favorites: user.wishlist
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Update password
  updatePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.id);

      // Check current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Password updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Toggle property in wishlist
  toggleFavorite: async (req, res) => {
    try {
      const { propertyId } = req.body;
      const user = await User.findById(req.user.id);

      const index = user.wishlist.indexOf(propertyId);
      if (index === -1) {
        user.wishlist.push(propertyId);
      } else {
        user.wishlist.splice(index, 1);
      }

      await user.save();

      res.status(200).json({
        success: true,
        data: user.wishlist
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Add this new method
  getBookings: async (req, res) => {
    try {
      const bookings = await Booking.find({ user: req.user.id })
        .populate('property', 'name images location price')
        .sort('-createdAt');

      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = userController; 