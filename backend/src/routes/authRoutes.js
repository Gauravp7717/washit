const express = require('express');
const {
    signup,
    login
    
} = require('../controllers/authController');
const {auth,isAdmin} = require('../middleware/authMiddleware'); // Import the JWT protection middleware

const router = express.Router();

// Public routes
router.post('/register', signup); // Register a new user
router.post('/login', login);       // Log in a user and get a token

// Private/Protected routes
// The `protect` middleware ensures only authenticated users can access this route
// router.get('/profile', protect, getUserProfile); // Get the profile of the logged-in user

module.exports = router;
