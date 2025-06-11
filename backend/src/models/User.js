const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensure usernames are unique
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure emails are unique
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'], // Email format validation
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum password length
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Users can be 'user' or 'admin'
        default: 'user', // Default role is 'user'
    },
    token: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
});




const User = mongoose.model('User', userSchema);

module.exports = User;