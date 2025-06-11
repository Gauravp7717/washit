const express = require('express');
const {
    addService,
    getServices,
    getServiceById,
    updateService,
    deleteService,
} = require('../controllers/serviceController');
const {auth,isAdmin} = require('../middleware/authMiddleware'); // For JWT authentication
const authorize = require('../middleware/authorizeMiddleware'); // For role-based authorization

const router = express.Router();

// Public route to get all active services (users can view)
router.get('/', getServices);

// Public route to get a single service by ID (users can view)
router.get('/:id', getServiceById);


// Admin-only routes (authed by JWT and role authorization)
router.post('/', addService);       // Add new service
router.put('/:id', updateService);   // Update existing service
router.delete('/:id', deleteService); // Delete a service

module.exports = router;
