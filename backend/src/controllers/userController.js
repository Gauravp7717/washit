// D:\frontend-washit\backend\controllers\userController.js
const User = require('../models/User'); // Import your existing User model
const asyncHandler = require('express-async-handler'); // For async error handling
const bcrypt = require('bcryptjs'); // For password comparison
const jwt = require('jsonwebtoken'); // For generating JWTs
const mongoose = require('mongoose'); // For isValidObjectId

// Helper function to generate JWT (since it's not a method on your User model)
const generateToken = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE || '1h', // Use JWT_EXPIRE from .env, default to 1 hour
        }
    );
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    // 1. Basic validation
    if (!username || !email || !password) {
        res.status(400);
        throw new Error('Please enter all required fields: username, email, password.');
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists with this email.');
    }

    // 3. Create user (password will be hashed by the pre-save hook in your User model)
    const user = await User.create({
        username,
        email,
        password,
        role: role || 'user', // Default to 'user' if not provided
    });

    if (user) {
        // 4. Generate JWT for the new user
        const token = generateToken(user._id, user.email, user.role);

        res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            token, // Send token to frontend
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data provided.');
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
        res.status(400);
        throw new Error('Please enter email and password.');
    }

    // 2. Check for user by email
    const user = await User.findOne({ email }); // Password is included by default in your model

    if (!user) {
        res.status(401); // Unauthorized
        throw new Error('Invalid credentials (email not found).');
    }

    // 3. Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
        // 4. Generate JWT
        const token = generateToken(user._id, user.email, user.role);

        res.status(200).json({
            success: true,
            message: 'Login successful.',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                // Add any other user fields you want to send to the frontend, e.g.,
                // firstName: user.firstName,
                // lastName: user.lastName,
                // phone: user.phone,
                // address: user.address,
            },
            token, // Send token to frontend
        });
    } else {
        res.status(401); // Unauthorized
        throw new Error('Invalid credentials (incorrect password).');
    }
});

// @desc    Get current user's profile
// @route   GET /api/users/profile
// @access  Private (requires token)
// This is an alternative to /api/users/:id for fetching current user's profile
const getMyProfile = asyncHandler(async (req, res) => {
    // req.user is populated by the 'auth' middleware
    const user = await User.findById(req.user.id).select('-password'); // Exclude password

    if (user) {
        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                // Add any other fields you want to send, like address, phone etc.
                // address: user.address,
                // phone: user.phone,
            },
        });
    } else {
        res.status(404);
        throw new Error('User not found.'); // Should ideally not happen if token is valid
    }
});

// @desc    Get user by ID (for specific lookup, can be user's own or admin lookup)
// @route   GET /api/users/:id
// @access  Private (User can get their own, Admin can get any)
const getUserById = asyncHandler(async (req, res) => {
    // Validate that the ID format is correct
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid user ID format.');
    }

    const user = await User.findById(req.params.id).select('-password'); // Exclude password

    if (user) {
        // Security check: A regular user can only fetch their own profile.
        // An admin can fetch any user's profile.
        if (req.user.role === 'admin' || req.user.id.toString() === user._id.toString()) {
            // console.log("User data requested:", user); // For debugging
            res.status(200).json({
                success: true,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    // Include address and other optional fields if they exist in your model and you want them in the response
                    // For example:
                    // address: user.address,
                    // phone: user.phone,
                }
            });
        } else {
            res.status(403); // Forbidden
            throw new Error('Not authorized to view this user profile.');
        }
    } else {
        res.status(404);
        throw new Error('User not found.');
    }
});


// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id); // Get user from auth middleware

    if (user) {
        // Update fields if provided in the request body
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        // You can add more fields here like firstName, lastName, phone, address etc.
        // user.firstName = req.body.firstName || user.firstName;
        // user.lastName = req.body.lastName || user.lastName;
        // user.phone = req.body.phone || user.phone;
        // if (req.body.address) {
        //     user.address = { ...user.address, ...req.body.address };
        // }

        // Handle password change (if provided)
        if (req.body.password) {
            if (req.body.password.length < 6) {
                res.status(400);
                throw new Error('Password must be at least 6 characters long.');
            }
            user.password = req.body.password; // Pre-save hook will hash it
        }

        const updatedUser = await user.save();

        // Generate a new token if essential fields changed (e.g., role, email)
        const token = generateToken(updatedUser._id, updatedUser.email, updatedUser.role);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            user: {
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
            },
            token,
        });
    } else {
        res.status(404);
        throw new Error('User not found.');
    }
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password'); // Fetch all users, exclude passwords
    res.status(200).json({
        success: true,
        count: users.length,
        users,
    });
});

module.exports = {
    registerUser,
    loginUser,
    getMyProfile,
    getUserById,
    updateUserProfile,
    getAllUsers,
};