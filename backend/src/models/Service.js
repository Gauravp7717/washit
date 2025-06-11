const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    // Change 'price' to 'prices' to hold different service types and their prices
    prices: {
        type: Map, // This allows flexible key-value pairs (e.g., "Dry Clean": 5.99)
        of: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        default: 'https://placehold.co/100x100/A7F3D0/1F2937?text=Service',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    category: { // Add a category field for filtering in the frontend
        type: String,
        enum: ['shirts', 'pants', 'curtains', 'toys', 'shoes', 'others'], // Example categories
        required: true,
        default: 'others'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;