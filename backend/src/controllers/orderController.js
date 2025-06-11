// controllers/orderController.js
const Order = require('../models/Order');
const Service = require('../models/Service');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Razorpay = require('razorpay'); // Import Razorpay

// Initialize Razorpay instance (using environment variables)
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// @desc    Place a new laundry order (User only)
// @route   POST /api/orders/place
// @access  Private/User
const placeOrder = asyncHandler(async (req, res) => {
    const { services, address, notes, pickupDate, deliveryDate } = req.body;

    console.log("--- New Order Placement Request ---");
    console.log("Request Body:", req.body);
    console.log("Authenticated User ID:", req.user ? req.user.id : 'N/A');

    if (!services || services.length === 0 || !address || !pickupDate || !deliveryDate) {
        console.error("Validation Error: Missing required order fields.");
        res.status(400);
        throw new Error('Please provide services, address, pickup date, and delivery date.');
    }

    const now = new Date();
    const parsedPickupDate = new Date(pickupDate);
    const parsedDeliveryDate = new Date(deliveryDate);

    if (parsedPickupDate <= now || parsedDeliveryDate <= now || parsedDeliveryDate <= parsedPickupDate) {
        console.error("Validation Error: Invalid dates provided.");
        res.status(400);
        throw new Error('Pickup and delivery dates must be valid future dates, and delivery must be after pickup.');
    }

    if (!req.user || !req.user.id) {
        console.error("Authentication Error: User not authenticated or ID missing.");
        res.status(401);
        throw new Error('User authentication failed.');
    }

    let totalAmount = 0;
    const orderServices = [];

    console.log("Processing services array...");
    for (const item of services) {
        console.log(`Processing service item: ${JSON.stringify(item)}`);
        if (!item.serviceId || !item.quantity) {
            console.error("Validation Error: Each service item must have serviceId and quantity.");
            res.status(400);
            throw new Error('Each service item must have a serviceId and quantity.');
        }

        const pureServiceId = item.serviceId.split('-')[0]; // Frontend sends full _id now
        console.log(`Extracted pureServiceId: ${pureServiceId}`);

        if (!mongoose.Types.ObjectId.isValid(pureServiceId)) {
            console.error(`Validation Error: Invalid service ID format for ${item.serviceId}.`);
            res.status(400);
            throw new Error(`Invalid service ID format: ${item.serviceId}`);
        }

        const service = await Service.findById(pureServiceId);
        console.log("Service fetched from DB:", service ? service.name : 'Not found');
        if (!service || !service.isActive) {
            console.error(`Service Error: Service with ID ${pureServiceId} not found or is inactive.`);
            res.status(404);
            throw new Error(`Service with ID ${pureServiceId} not found or is inactive.`);
        }

        const serviceType = item.type; // Use item.type from frontend
        let price;

        if (service.prices instanceof Map) {
            price = service.prices.get(serviceType);
            console.log(`Service price from Map: ${price} for type ${serviceType}`);
        } else if (typeof service.prices === 'object' && service.prices !== null) {
            price = service.prices[serviceType];
            console.log(`Service price from Object: ${price} for type ${serviceType}`);
        }

        if (price === undefined || isNaN(Number(price))) {
            console.error(`Price Error: Invalid or missing price for "${service.name}" with type "${serviceType}". Price value: ${price}`);
            res.status(500);
            throw new Error(`Invalid or missing price for "${service.name}" with type "${serviceType}"`);
        }

        const itemPrice = Number(price) * item.quantity;
        totalAmount += itemPrice;
        console.log(`Item price for ${service.name} (${serviceType}, Qty: ${item.quantity}): ${itemPrice.toFixed(2)}. Current total: ${totalAmount.toFixed(2)}`);

        orderServices.push({
            service: service._id,
            quantity: item.quantity,
            priceAtOrder: Number(price),
            itemType: serviceType,
        });
    }

    // Convert totalAmount to paisa for Razorpay (multiply by 100)
    const razorpayAmount = Math.round(totalAmount * 100);
    console.log(`Calculated totalAmount: ${totalAmount.toFixed(2)}.`);
    console.log(`Converted to Razorpay amount (paisa): ${razorpayAmount}.`);

    // 1. Create Order with Razorpay
    const razorpayOrderOptions = {
        amount: razorpayAmount, // amount in the smallest currency unit
        currency: "INR",
        receipt: `order_rcptid_${Date.now()}`, // Unique receipt ID
        // Add notes or other required fields if any
    };
    console.log("Razorpay Order Options:", razorpayOrderOptions);


    let razorpayOrder;
    try {
        console.log("Attempting to create order with Razorpay...");
        razorpayOrder = await instance.orders.create(razorpayOrderOptions); // THIS IS LINE 105
        console.log("SUCCESS: Razorpay Order Created:", razorpayOrder);
    } catch (razorpayError) {
        console.error("ERROR: Failed to create Razorpay order.");
        console.error("  Error Details:");
        if (razorpayError.response) {
            // This is an error response from the Razorpay API itself
            console.error("    Status:", razorpayError.response.status);
            console.error("    Headers:", razorpayError.response.headers);
            console.error("    Data (Razorpay specific error):", razorpayError.response.data); // CRUCIAL: This will contain Razorpay's specific error message
        } else if (razorpayError.code) {
            // This could be an error from the Razorpay SDK or Node.js network issue
            console.error("    Error Code:", razorpayError.code);
            console.error("    Error Message:", razorpayError.message);
        } else {
            // General JavaScript error or unexpected error structure
            console.error("    Unknown Error Object:", razorpayError);
        }
        res.status(500);
        throw new Error("Failed to create Razorpay order.");
    }

    // 2. Create Order in your MongoDB
    console.log("Creating order in MongoDB...");
    const order = await Order.create({
        user: req.user.id, // Use req.user.id as per your auth middleware payload
        services: orderServices,
        totalAmount: Number(totalAmount.toFixed(2)),
        pickupDate: parsedPickupDate,
        deliveryDate: parsedDeliveryDate,
        address,
        notes: notes || '',
        paymentStatus: 'Pending', // Initial status
        paymentDetails: {
            orderId: razorpayOrder.id, // Store Razorpay's order ID
        },
    });

    if (order) {
        console.log("SUCCESS: Order created in MongoDB with ID:", order._id);
        res.status(201).json({
            message: 'Order placed successfully.',
            orderId: order._id, // Your MongoDB Order ID
            razorpayOrderId: razorpayOrder.id, // Razorpay Order ID for frontend
            amount: razorpayAmount, // Amount in paisa
            currency: razorpayOrder.currency,
        });
    } else {
        console.error("MongoDB Order Creation Error: Failed to create order despite valid data.");
        res.status(400);
        throw new Error('Failed to place order. Invalid order data.');
    }
    console.log("--- Order Placement Request End ---");
});

// @desc    Get all orders for the logged-in user (User only)
// @route   GET /api/orders/my-orders
// @access  Private/User
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .populate('services.service', 'name pricePerKg')
        .sort({ createdAt: -1 });

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
    const orders = await Order.find({})
        .populate('user', 'username email')
        .populate('services.service', 'name description')
        .sort({ createdAt: -1 });

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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid order ID format.');
    }

    const order = await Order.findById(req.params.id)
        .populate('user', 'username email')
        .populate('services.service', 'name description pricePerKg');

    if (order) {
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

    const allowedStatuses = ['Pending', 'Picked Up', 'In Progress', 'Out for Delivery', 'Delivered', 'Cancelled'];
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