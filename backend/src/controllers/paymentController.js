const Razorpay = require('razorpay');
const crypto = require('crypto'); // Node.js built-in module for cryptographic functions
const Order = require('../models/Order'); // Import the Order model
const asyncHandler = require('express-async-handler');

// Initialize Razorpay instance with your API keys
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a new Razorpay order
// @route   POST /api/payment/create-order
// @access  Private/User (called when user initiates payment for an existing order)
const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
        res.status(400);
        throw new Error('Order ID is required to create a payment order.');
    }

    const order = await Order.findById(orderId).populate('user', 'email').select('+totalAmount');

    if (!order) {
        res.status(404);
        throw new Error('Order not found.');
    }

    // Ensure the order belongs to the authenticated user
    if (order.user._id.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Forbidden: You are not authorized to pay for this order.');
    }

    // Ensure order payment status is 'Pending'
    if (order.paymentStatus === 'Paid') {
        res.status(400);
        throw new Error('This order has already been paid.');
    }

    // Convert amount from INR to paise (Razorpay expects amount in smallest currency unit)
    const amountInPaise = Math.round(order.totalAmount * 100);

    const options = {
        amount: amountInPaise, // Amount in smallest currency unit (e.g., 1000 paise = INR 10)
        currency: 'INR',
        receipt: `receipt_order_${order._id}`, // Unique receipt ID for your reference
        notes: {
            orderId: order._id.toString(),
            userId: req.user._id.toString(),
            userEmail: order.user.email,
        },
    };

    try {
        const razorpayOrder = await razorpayInstance.orders.create(options);

        // Store the Razorpay order ID in your database for later verification
        order.paymentDetails.orderId = razorpayOrder.id;
        await order.save();

        res.status(200).json({
            success: true,
            razorpayOrder,
            orderId: order._id, // Send back your internal order ID
            amount: order.totalAmount, // Send back your internal order amount
            currency: options.currency,
            key_id: process.env.RAZORPAY_KEY_ID, // Send key_id to frontend for checkout
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500);
        throw new Error('Failed to create Razorpay order.');
    }
});


// @desc    Verify Razorpay payment signature (Webhook or direct API call after payment)
// @route   POST /api/payment/verify-payment
// @access  Public (or controlled by webhook secret)
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId // Your internal order ID
    } = req.body;

    // Validate inputs
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
        res.status(400);
        throw new Error('Missing payment verification parameters.');
    }

    // Generate expected signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    // Compare generated signature with the signature received from Razorpay
    if (digest === razorpay_signature) {
        // Payment is successful and verified
        const order = await Order.findById(orderId);

        if (!order) {
            res.status(404);
            throw new Error('Internal order not found during payment verification.');
        }

        // Update your order's payment status and details
        order.paymentStatus = 'Paid';
        order.paymentDetails.paymentId = razorpay_payment_id;
        order.paymentDetails.signature = razorpay_signature;
        // order.paymentDetails.orderId is already set from createRazorpayOrder
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully.',
            orderId: order._id,
        });
    } else {
        // Payment verification failed
        // Optionally, update order status to 'Failed'
        const order = await Order.findById(orderId);
        if (order) {
            order.paymentStatus = 'Failed';
            await order.save();
        }
        res.status(400);
        throw new Error('Payment verification failed. Invalid signature.');
    }
});


module.exports = {
    createRazorpayOrder,
    verifyRazorpayPayment,
};