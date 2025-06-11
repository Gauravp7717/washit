const jwt = require("jsonwebtoken");
require('dotenv').config(); // Load environment variables
const asyncHandler = require('express-async-handler'); // For cleaner async error handling
const User = require('../models/User'); // Assuming your User model path is correct

// ==================== AUTH MIDDLEWARE ====================
// Authenticates user by verifying JWT token and attaching user data to req.user
exports.auth = asyncHandler(async (req, res, next) => {
    // Extract token from request (preference: Header, then Cookies, then Body)
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.token || req.body?.token;

    // Log the token for debugging (remove in production if sensitive)
    console.log("Auth Middleware - Token: ", token);

    // If token is missing, return unauthorized response
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, token is missing');
    }

    try {
        // Verify token with JWT_SECRET from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('Auth Middleware - Decoded Token Payload: ', decoded); // For debugging

        // Attach the decoded user ID to the request for subsequent middleware/controllers
        // It's good practice to fetch the user from DB to ensure they still exist and are valid.
        // Assuming your JWT payload has an 'id' field for the user's MongoDB _id.
        req.user = await User.findById(decoded.id).select('-password'); // Fetch user without password hash

        // If user is not found in DB despite valid token
        if (!req.user) {
            res.status(401);
            throw new Error('Not authorized, user not found in database');
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Auth Middleware - Token verification failed:', error);
        // Specifically handle common JWT errors
        if (error.name === 'TokenExpiredError') {
            res.status(401);
            throw new Error('Not authorized, token expired');
        }
        if (error.name === 'JsonWebTokenError') {
            res.status(401);
            throw new Error('Not authorized, invalid token');
        }
        // Generic error for other issues during decoding
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
});


// ==================== IS ADMIN MIDDLEWARE ====================
// Checks if the authenticated user has an 'Admin' role
exports.isAdmin = (req, res, next) => {
    // This middleware assumes `auth` has already run and populated `req.user`
    if (!req.user) {
        res.status(401);
        throw new Error('User not authenticated. Please log in.');
    }

    // Check the user's role (assuming 'role' or 'accountType' field in req.user)
    // IMPORTANT: Make sure `req.user.role` (or `req.user.accountType`) matches exactly
    // what you store for an admin.
    if (req.user.role && req.user.role === 'admin') { // Changed from 'Admin' to 'admin' - adjust if needed
        next(); // User is an admin, proceed
    } else if (req.user.accountType && req.user.accountType === 'Admin') { // If you consistently use 'accountType'
        next();
    }
    else {
        res.status(403); // Forbidden
        throw new Error('Not authorized as an admin. Access denied.');
    }
};

// You might also want to add other role-based middlewares like isUser, isShipper etc.
// Example:
exports.isUser = (req, res, next) => {
    if (!req.user) {
        res.status(401);
        throw new Error('User not authenticated. Please log in.');
    }
    // Assuming 'user' is the role for regular users
    if (req.user.role && req.user.role === 'user') {
        next();
    } else if (req.user.accountType && req.user.accountType === 'User') {
        next();
    }
    else {
        res.status(403);
        throw new Error('Not authorized as a user. Access denied.');
    }
};