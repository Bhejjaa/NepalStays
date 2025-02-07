const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const esewaService = require('../services/esewaService');

const paymentController = {
  initiatePayment: async (req, res) => {
    try {
      const { bookingId } = req.body;
      
      // Get booking details
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Generate eSewa payment details
      const paymentDetails = esewaService.generatePaymentDetails(booking);

      // Create payment record
      const payment = await Payment.create({
        booking: bookingId,
        amount: booking.totalPrice,
        paymentMethod: 'esewa',
        status: 'pending',
        transactionId: paymentDetails.pid
      });

      res.status(200).json({
        success: true,
        data: {
          paymentId: payment._id,
          esewaParams: paymentDetails,
          paymentUrl: process.env.NODE_ENV === 'production' 
            ? ESEWA_CONFIG.productionUrl 
            : ESEWA_CONFIG.testUrl
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

      // Verify payment with eSewa
      const verification = await esewaService.verifyPayment({
        oid,
        amt,
        refId
      });

      if (verification.success) {
        // Update payment status
        const payment = await Payment.findOneAndUpdate(
          { transactionId: oid },
          { 
            status: 'completed',
            paymentGatewayResponse: verification
          },
          { new: true }
        );

        // Update booking status
        await Booking.findByIdAndUpdate(
          payment.booking,
          { status: 'confirmed' }
        );

        res.redirect(ESEWA_CONFIG.successUrl);
      } else {
        res.redirect(ESEWA_CONFIG.failureUrl);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      res.redirect(ESEWA_CONFIG.failureUrl);
    }
  }
};

module.exports = paymentController; 