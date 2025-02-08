const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const ESEWA_CONFIG = require('../config/esewa');
const crypto = require('crypto');

const paymentController = {
  initiatePayment: async (req, res) => {
    try {
      const { bookingId } = req.body;
      const booking = await Booking.findById(bookingId)
        .populate('property', 'name');
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Verify booking belongs to user
      if (booking.user.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized'
        });
      }

      const transactionId = `NPSTAYS${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
      
      const payment = await Payment.create({
        booking: bookingId,
        amount: booking.totalPrice,
        transactionId,
        status: 'pending'
      });

      const esewaParams = {
        amt: booking.totalPrice,
        pdc: 0,
        psc: 0,
        txAmt: 0,
        tAmt: booking.totalPrice,
        pid: transactionId,
        scd: ESEWA_CONFIG.merchantId,
        su: ESEWA_CONFIG.successUrl,
        fu: ESEWA_CONFIG.failureUrl
      };

      res.status(200).json({
        success: true,
        data: {
          paymentId: payment._id,
          esewaParams,
          paymentUrl: ESEWA_CONFIG.testUrl,
          bookingDetails: {
            propertyName: booking.property.name,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            guests: booking.guests
          }
        }
      });
    } catch (error) {
      console.error('Payment initiation error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  verifyPayment: async (req, res) => {
    try {
      const { oid, amt, refId } = req.query;
      
      const payment = await Payment.findOne({ transactionId: oid });
      if (!payment) {
        throw new Error('Payment not found');
      }

      // Verify with eSewa
      const verificationData = {
        amt: amt,
        rid: refId,
        pid: oid,
        scd: ESEWA_CONFIG.merchantId
      };

      // Update payment status
      payment.status = 'completed';
      payment.paymentResponse = { refId, verificationData };
      await payment.save();

      // Update booking status
      await Booking.findByIdAndUpdate(payment.booking, { 
        status: 'confirmed',
        updatedAt: Date.now()
      });

      res.redirect(`${process.env.FRONTEND_URL}/payment/success`);
    } catch (error) {
      console.error('Payment verification error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/payment/failure`);
    }
  },

  getPaymentStatus: async (req, res) => {
    try {
      const { paymentId } = req.params;
      
      const payment = await Payment.findById(paymentId)
        .populate({
          path: 'booking',
          select: 'checkIn checkOut guests property',
          populate: {
            path: 'property',
            select: 'name'
          }
        });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      // Verify user owns the payment's booking
      if (payment.booking.user.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          status: payment.status,
          amount: payment.amount,
          transactionId: payment.transactionId,
          createdAt: payment.createdAt,
          bookingDetails: {
            propertyName: payment.booking.property.name,
            checkIn: payment.booking.checkIn,
            checkOut: payment.booking.checkOut,
            guests: payment.booking.guests
          }
        }
      });
    } catch (error) {
      console.error('Get payment status error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = paymentController; 