// routes/paymentRoutes.js
const express = require('express');
const { verifyPayment } = require('../controllers/paymentController');
const { auth } = require('../middleware/authMiddleware'); // Import auth middleware

const router = express.Router();

// Route for payment verification (protected to ensure only logged-in users initiate this)
router.post('/verify', auth, verifyPayment);

module.exports = router;