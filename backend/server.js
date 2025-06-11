const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db'); // Database connection utility


// Load environment variables from .env file
dotenv.config();

// Create an Express application instance
const app = express();

// Connect to MongoDB database
connectDB();

// Middleware:
// Enable CORS for all routes (to allow requests from your frontend)
app.use(cors());
// Parse JSON bodies of incoming requests
app.use(express.json());

// Define a simple root route for testing if the server is running
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import API routes
const authRoutes = require('./src/routes/authRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes'); // Import your new payment routes
// const paymentRoutes = require('./src/routes/paymentRoutes');
const userRoutes = require('./src/routes/userRoutes');

// Mount routes
// All authentication-related routes will be prefixed with /api/auth
app.use('/api/auth', authRoutes);
// All service-related routes will be prefixed with /api/services
app.use('/api/services', serviceRoutes);
// All order-related routes will be prefixed with /api/orders
app.use('/api/orders', orderRoutes);
// All payment-related routes will be prefixed with /api/payment
// app.use('/api/payment', paymentRoutes);
app.use('/api/payments', paymentRoutes); // Mount your new payment routes
app.use('/api/users', userRoutes); 

// Global Error Handling Middleware
// This middleware catches any errors thrown in your routes or other middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    const statusCode = err.statusCode || 500; // Use custom status code or default to 500
    res.status(statusCode).json({
        message: err.message || 'Something went wrong on the server.',
        success: false,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Send stack in development
    });
});


// Define the port for the server to listen on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});