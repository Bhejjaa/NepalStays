const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { initiatePayment, verifyPayment } = require('../controllers/paymentController');

router.post('/initiate', protect, initiatePayment);
router.get('/verify', verifyPayment);

module.exports = router; 