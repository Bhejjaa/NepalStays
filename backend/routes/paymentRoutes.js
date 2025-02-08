const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { initiatePayment, verifyPayment, getPaymentStatus } = require('../controllers/paymentController');

router.post('/initiate', protect, initiatePayment);
router.get('/verify', verifyPayment);
router.get('/status/:paymentId', protect, getPaymentStatus);

module.exports = router; 