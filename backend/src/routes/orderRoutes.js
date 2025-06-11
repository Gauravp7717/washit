const express = require('express');
const {
    placeOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    setOrderDates,
} = require('../controllers/orderController');
const { auth, isAdmin } = require('../middleware/authMiddleware'); // For JWT authentication
const authorize = require('../middleware/authorizeMiddleware'); // For role-based authorization

const router = express.Router();

// User routes (protected by JWT authentication)
router.post('/place', auth, placeOrder);         // Place a new order
router.get('/my-orders', auth, getMyOrders); // Get orders for the logged-in user
router.get('/:id', auth, getOrderById); // Get a specific order (user can view their own, admin can view any)


// Admin-only routes (protected by JWT and role authorization)
// FIX: Added auth and authorize('admin') middlewares here
router.get('/', auth, authorize('admin'), getAllOrders); // Get all orders in the system
router.put('/:id/status', auth, authorize('admin'), updateOrderStatus); // Update order status
router.put('/:id/dates', auth, authorize('admin'), setOrderDates); // Set pickup/delivery dates

module.exports = router;