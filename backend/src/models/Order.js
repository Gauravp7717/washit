// models/Order.js
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    services: [
        {
            service: {
                type: mongoose.Schema.Types.ObjectId, // Reference to the Service
                required: true,
                ref: 'Service',
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            priceAtOrder: {
                type: Number,
                required: true,
                min: 0,
            },
            itemType: { // To store "Dry Clean", "Wash & Fold" etc.
                type: String,
                required: true,
                trim: true,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['Pending', 'Picked Up', 'In Progress', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    pickupDate: {
        type: Date,
        required: true,
    },
    deliveryDate: {
        type: Date,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending',
    },
    paymentDetails: {
        // Add Razorpay specific fields
        orderId: { type: String },    // Razorpay Order ID (rzp_order_...)
        paymentId: { type: String },  // Razorpay Payment ID (pay_...)
        signature: { type: String },  // Razorpay Signature (for verification)
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true, default: 'India' },
    },
    notes: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;