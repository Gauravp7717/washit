const Service = require('../models/Service');
const asyncHandler = require('express-async-handler');

// @desc    Add a new laundry service (Admin only)
// @route   POST /api/services
// @access  Private/Admin
const addService = asyncHandler(async (req, res) => {
    // Destructure 'prices' instead of 'pricePerKg'
    const { name, description, prices, imageUrl, isActive, category } = req.body;

    // Validate input: Check if name, description, prices, and category are provided.
    // 'prices' is a Map, so ensure it's an object and not empty.
    if (!name || !description || !prices || Object.keys(prices).length === 0 || !category) {
        res.status(400);
        throw new Error('Please provide all required fields: name, description, prices (with at least one type), and category.');
    }

    // Check if service with the same name already exists
    const serviceExists = await Service.findOne({ name });
    if (serviceExists) {
        res.status(400);
        throw new Error('A service with this name already exists.');
    }

    const service = await Service.create({
        name,
        description,
        prices, // Use the 'prices' Map directly
        imageUrl: imageUrl || undefined,
        isActive: isActive !== undefined ? isActive : true,
        category, // Include category
    });

    if (service) {
        res.status(201).json({
            message: 'Service added successfully',
            service,
        });
    } else {
        res.status(400);
        throw new Error('Invalid service data provided.');
    }
});

// @desc    Get all laundry services (Public, but can be restricted)
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
    // Fetch all active services. You might want to filter by 'isActive: true' for users.
    const services = await Service.find({ isActive: true }); // Only show active services to users

    if (services.length > 0) {
        res.status(200).json(services);
    } else {
        res.status(404);
        throw new Error('No services found.');
    }
});

// @desc    Get a single laundry service by ID (Public)
// @route   GET /api/services/:id
// @access  Public
const getServiceById = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);

    if (service && service.isActive) { // Only return if service exists and is active
        res.status(200).json(service);
    } else if (service && !service.isActive) {
        res.status(404);
        throw new Error('Service found but it is currently inactive.');
    }
    else {
        res.status(404);
        throw new Error('Service not found.');
    }
});


// @desc    Update a laundry service (Admin only)
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, prices, imageUrl, isActive, category } = req.body;

    // Validate input: Check if name, description, prices, and category are provided.
    if (!name || !description || !prices || Object.keys(prices).length === 0 || !category) {
        res.status(400);
        throw new Error('Please provide all required fields for update: name, description, prices (with at least one type), and category.');
    }

    const service = await Service.findById(id);

    if (!service) {
        res.status(404);
        throw new Error('Service not found.');
    }

    // Check if the new name (if changed) conflicts with another existing service
    if (name && name !== service.name) {
        const serviceExists = await Service.findOne({ name });
        if (serviceExists && serviceExists._id.toString() !== id) {
            res.status(400);
            throw new Error('A service with this name already exists.');
        }
    }

    service.name = name || service.name;
    service.description = description || service.description;
    service.prices = prices || service.prices; // Update the 'prices' Map
    service.imageUrl = imageUrl !== undefined ? imageUrl : service.imageUrl; // Allow clearing image
    service.isActive = isActive !== undefined ? isActive : service.isActive;
    service.category = category || service.category;

    const updatedService = await service.save();

    res.status(200).json({
        message: 'Service updated successfully',
        service: updatedService,
    });
});

// @desc    Delete a laundry service (Admin only)
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);

    if (!service) {
        res.status(404);
        throw new Error('Service not found.');
    }

    await service.deleteOne(); // Mongoose 6.x+ uses deleteOne() or deleteMany()

    res.status(200).json({ message: 'Service removed successfully.' });
});

module.exports = {
    addService,
    getServices,
    getServiceById,
    updateService,
    deleteService,
};