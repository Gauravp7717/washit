// D:\frontend-washit\backend\routes\userRoutes.js
const express = require('express');
const {
    registerUser,
    loginUser,
    getMyProfile,
    getUserById,
    updateUserProfile,
    getAllUsers,
} = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/authMiddleware'); // Import your auth and isAdmin middleware

const router = express.Router();

// Public routes (no authentication needed)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (require 'auth' middleware)
router.get('/profile', auth, getMyProfile); // Get logged-in user's profile
router.put('/profile', auth, updateUserProfile); // Update logged-in user's profile

// Get user by ID (protected: user can get their own, admin can get any)
router.get('/:id', auth, getUserById); // This is the specific route `Cart.js` was trying to hit

// Admin-only routes (require 'auth' and 'isAdmin' middleware)
router.get('/', auth, isAdmin, getAllUsers); // Get all users in the system

module.exports = router;