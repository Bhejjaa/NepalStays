const crypto = require('crypto');
const ESEWA_CONFIG = require('../config/esewa');

const esewaService = {
  generatePaymentDetails: (booking) => {
    const totalAmount = booking.totalPrice;
    const transactionId = `NPSTAYS${Date.now()}`;
    
    return {
      amt: totalAmount,
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: totalAmount,
      pid: transactionId,
      scd: ESEWA_CONFIG.merchantId,
      su: ESEWA_CONFIG.successUrl,
      fu: ESEWA_CONFIG.failureUrl
    };
  },

  verifyPayment: async (data) => {
    try {
      const { oid, amt, refId } = data;
      
      // Generate verification signature
      const message = `${ESEWA_CONFIG.merchantId},${oid},${amt},${refId}`;
      const signature = crypto
        .createHmac('sha256', ESEWA_CONFIG.merchantSecret)
        .update(message)
        .digest('hex');

      // In production, you would verify this with eSewa's verification API
      // For now, we'll simulate a successful verification
      return {
        success: true,
        signature,
        transactionId: refId
      };
    } catch (error) {
      console.error('eSewa verification error:', error);
      throw new Error('Payment verification failed');
    }
  }
};

module.exports = esewaService;