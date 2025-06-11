// controllers/paymentController.js
const Order = require('../models/Order');
const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto'); // Node.js built-in module for crypto operations

// Initialize Razorpay instance
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Verify Razorpay payment signature and update order status
// @route   POST /api/payments/verify
// @access  Private/User
const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
        res.status(400);
        throw new Error('Missing payment verification details.');
    }

    // Find the order in your database using your internal orderId
    const order = await Order.findById(orderId);

    if (!order) {
        res.status(404);
        throw new Error('Order not found in database.');
    }

    // Construct the string to be signed: razorpay_order_id + "|" + razorpay_payment_id
    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');

    // Compare the generated signature with the signature received from Razorpay
    if (generated_signature === razorpay_signature) {
        // Payment is genuine, update order status
        order.paymentStatus = 'Paid';
        order.paymentDetails.paymentId = razorpay_payment_id;
        order.paymentDetails.signature = razorpay_signature; // Store the signature for record-keeping
        order.status = 'Pending'; // Set initial order status after successful payment

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully and order updated.',
            orderId: order._id,
        });
    } else {
        // Payment is not genuine or tampered, update order status to failed
        order.paymentStatus = 'Failed';
        await order.save();

        res.status(400);
        throw new Error('Payment verification failed: Invalid signature.');
    }
});

module.exports = {
    verifyPayment,
};