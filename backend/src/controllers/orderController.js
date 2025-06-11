const Order = require('../models/Order');
const Service = require('../models/Service');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose'); // Needed for checking valid ObjectId

// @desc    Place a new laundry order (User only)
// @route   POST /api/orders
// @access  Private/User
const placeOrder = asyncHandler(async (req, res) => {
    const { services, address, notes, pickupDate, deliveryDate } = req.body;

    if (!services || services.length === 0 || !address || !pickupDate || !deliveryDate) {
        res.status(400);
        throw new Error('Please provide services, address, pickup date, and delivery date.');
    }

    const now = new Date();
    const parsedPickupDate = new Date(pickupDate);
    const parsedDeliveryDate = new Date(deliveryDate);

    if (parsedPickupDate <= now || parsedDeliveryDate <= now || parsedDeliveryDate <= parsedPickupDate) {
        res.status(400);
        throw new Error('Pickup and delivery dates must be valid future dates, and delivery must be after pickup.');
    }

    if (!req.user || !req.user.id) {
        res.status(401);
        throw new Error('User authentication failed.');
    }

    let totalAmount = 0;
    const orderServices = [];

    for (const item of services) {
        if (!item.serviceId || !item.quantity) {
            res.status(400);
            throw new Error('Each service item must have a serviceId and quantity.');
        }

        const pureServiceId = item.serviceId.split('-')[0];

        if (!mongoose.Types.ObjectId.isValid(pureServiceId)) {
            res.status(400);
            throw new Error(`Invalid service ID format: ${item.serviceId}`);
        }

        const service = await Service.findById(pureServiceId);
        console.log("service Prices",service.prices);
        if (!service || !service.isActive) {
            res.status(404);
            throw new Error(`Service with ID ${pureServiceId} not found or is inactive.`);
        }
        console.log("Service fetched from DB:", service);

        const serviceType = item.type || 'Wash & Fold'; // Default fallback

let price;

// Handle both Map and plain object types
if (service.prices instanceof Map) {
    price = service.prices.get(serviceType);
} else if (typeof service.prices === 'object') {
    price = service.prices[serviceType];
}
console.log("my price",price)
if (price === undefined || isNaN(Number(price))) {
    res.status(500);
    throw new Error(`Invalid or missing price for "${service.name}" with type "${serviceType}"`);
}

const itemPrice = Number(price) * item.quantity;





        // const pricePerKg = Number(service.pricePerKg);
        // if (isNaN(pricePerKg)) {
        //     res.status(500);
        //     throw new Error(`Invalid pricePerKg for service ${service.name}`);
        // }

        
        totalAmount += itemPrice;

        orderServices.push({
            service: service._id,
            quantity: item.quantity,
            priceAtOrder:  Number(price),
            itemType: service.name,
        });
    }

    const order = await Order.create({
        user: req.user._id,
        services: orderServices,
        totalAmount: Number(totalAmount.toFixed(2)), // To prevent NaN and keep precision
        pickupDate: parsedPickupDate,
        deliveryDate: parsedDeliveryDate,
        address,
        notes: notes || '',
    });

    if (order) {
        res.status(201).json({
            message: 'Order placed successfully.',
            order,
        });
    } else {
        res.status(400);
        throw new Error('Failed to place order. Invalid order data.');
    }
});


// @desc    Get all orders for the logged-in user (User only)
// @route   GET /api/orders/my-orders
// @access  Private/User
const getMyOrders = asyncHandler(async (req, res) => {
    // Find orders belonging to the authenticated user and populate service details
    const orders = await Order.find({ user: req.user._id })
        .populate('services.service', 'name pricePerKg') // Populate service name and price from Service model
        .sort({ createdAt: -1 }); // Sort by most recent first

    if (orders.length > 0) {
        res.status(200).json(orders);
    } else {
        res.status(200).json({ message: 'You have no orders yet.' });
    }
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
    // Fetch all orders and populate user and service details
    const orders = await Order.find({})
        .populate('user', 'username email') // Populate username and email from User model
        .populate('services.service', 'name description') // Populate service name and description
        .sort({ createdAt: -1 }); // Sort by most recent first

    if (orders.length > 0) {
        res.status(200).json(orders);
    } else {
        res.status(200).json({ message: 'No orders found in the system.' });
    }
});

// @desc    Get a single order by ID (Admin or User if it's their order)
// @route   GET /api/orders/:id
// @access  Private/Admin or Private/User
const getOrderById = asyncHandler(async (req, res) => {
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid order ID format.');
    }

    const order = await Order.findById(req.params.id)
        .populate('user', 'username email')
        .populate('services.service', 'name description pricePerKg');

    if (order) {
        // If user is admin OR the order belongs to the logged-in user
        if (req.user.role === 'admin' || order.user._id.toString() === req.user._id.toString()) {
            res.status(200).json(order);
        } else {
            res.status(403);
            throw new Error('Forbidden: You are not authorized to view this order.');
        }
    } else {
        res.status(404);
        throw new Error('Order not found.');
    }
});


// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    // Validate status input
    const allowedStatuses = ['Pending', 'Picked Up', 'In Progress', 'Out for Delivery', 'Delivered', 'Cancelled']; // Added 'Cancelled'
    if (!status || !allowedStatuses.includes(status)) {
        res.status(400);
        throw new Error(`Invalid status. Allowed values: ${allowedStatuses.join(', ')}`);
    }

    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = status;
        const updatedOrder = await order.save();
        res.status(200).json({
            message: 'Order status updated successfully.',
            order: updatedOrder,
        });
    } else {
        res.status(404);
        throw new Error('Order not found.');
    }
});

// @desc    Set pickup and delivery dates for an order (Admin only)
// @route   PUT /api/orders/:id/dates
// @access  Private/Admin
const setOrderDates = asyncHandler(async (req, res) => {
    const { pickupDate, deliveryDate } = req.body;

    // Validate input
    if (!pickupDate || !deliveryDate) {
        res.status(400);
        throw new Error('Both pickupDate and deliveryDate are required.');
    }

    const parsedPickupDate = new Date(pickupDate);
    const parsedDeliveryDate = new Date(deliveryDate);
    
    if (isNaN(parsedPickupDate.getTime()) || isNaN(parsedDeliveryDate.getTime())) {
        res.status(400);
        throw new Error('Invalid date format. Please use a valid date string (e.g., YYYY-MM-DDTHH:MM:SSZ).');
    }
    
    if (parsedDeliveryDate <= parsedPickupDate) {
        res.status(400);
        throw new Error('Delivery date must be after pickup date.');
    }
    
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found.');
    }

    order.pickupDate = parsedPickupDate;
    order.deliveryDate = parsedDeliveryDate;

    const updatedOrder = await order.save();
    res.status(200).json({
        message: 'Order pickup and delivery dates updated successfully.',
        order: updatedOrder,
    });
});

module.exports = {
    placeOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    setOrderDates,
};