// seed.js

require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker'); // For generating dummy data

// Import your Mongoose models
const Service = require('./models/Service'); // Adjust path if needed
const Order = require('./models/Order');     // Adjust path if needed
// const User = require('./models/User'); // Uncomment if you want to create dummy users here

// MongoDB connection string
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/washitdb'; // Replace with your actual URI

const seedDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected for seeding!');

        // --- Clear existing data (optional, but good for fresh seeds) ---
        console.log('Clearing existing services and orders...');
        await Service.deleteMany({});
        await Order.deleteMany({});
        // await User.deleteMany({}); // Uncomment if you're seeding users here
        console.log('Existing data cleared.');

        // --- Seed Users (PLACEHOLDER - REPLACE WITH YOUR ACTUAL USER ID OR USER CREATION LOGIC) ---
        let dummyUserId = '60c72b2f9a7b9c001c8e1a3b'; // REPLACE WITH A REAL USER ID FROM YOUR DB
                                                        // or uncomment the user creation logic below

        // Example if you have a User model and want to create one for testing:
        // const User = require('./models/User'); // Make sure to uncomment this
        // let dummyUser = await User.findOne({});
        // if (!dummyUser) {
        //     dummyUser = await User.create({
        //         name: faker.person.fullName(),
        //         email: faker.internet.email(),
        //         phone: faker.phone.number('##########'),
        //         password: 'testpassword', // Use a real hashed password in production
        //         address: {
        //             street: faker.location.streetAddress(),
        //             city: faker.location.city(),
        //             state: faker.location.state(),
        //             zipCode: faker.location.zipCode(),
        //             country: 'India',
        //         },
        //         role: 'user',
        //     });
        //     console.log('Created dummy user:', dummyUser.email);
        // }
        // dummyUserId = dummyUser._id;


        // --- Seed Services ---
        console.log('Seeding services...');
        const servicesData = [
            {
                name: 'Standard Shirt Wash',
                description: 'Regular wash and fold for everyday shirts.',
                prices: { 'Wash & Fold': 3.99, 'Iron Only': 2.50 },
                imageUrl: 'https://images.unsplash.com/photo-1591024340788-b21ac7a869a1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                category: 'shirts',
            },
            {
                name: 'Premium Shirt Dry Clean',
                description: 'Professional dry cleaning for delicate shirts.',
                prices: { 'Dry Clean': 6.99, 'Premium Clean': 9.99 },
                imageUrl: 'https://images.unsplash.com/photo-1621609764095-f9739d665495?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                category: 'shirts',
            },
            {
                name: 'Pants & Shorts Wash',
                description: 'Wash and fold service for all types of pants and shorts.',
                prices: { 'Wash & Fold': 4.50, 'Iron Only': 3.00 },
                imageUrl: 'https://images.unsplash.com/photo-1541099644-48616182103f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                category: 'pants',
            },
            {
                name: 'Pants Dry Clean',
                description: 'Dry cleaning for formal trousers and delicate pants.',
                prices: { 'Dry Clean': 7.50, 'Premium Clean': 10.50 },
                imageUrl: 'https://images.unsplash.com/photo-1594042857445-dfd201a6136d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                category: 'pants',
            },
            {
                name: 'Curtains & Drapes Dry Clean',
                description: 'Specialized dry cleaning for curtains and drapes.',
                prices: { 'Dry Clean': 15.00, 'Premium Clean': 20.00 }, // Price per unit or per weight
                imageUrl: 'https://images.unsplash.com/photo-1582736173456-02e0782f0980?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                category: 'curtains',
            },
            {
                name: 'Blanket & Comforter Wash',
                description: 'Deep cleaning for blankets and comforters.',
                prices: { 'Wash & Fold': 12.00, 'Deep Clean': 18.00 },
                imageUrl: 'https://images.unsplash.com/photo-1627995171732-e069c9b19e91?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                category: 'curtains',
            },
            {
                name: 'Soft Toys & Plushies Clean',
                description: 'Gentle cleaning for all soft toys and plushies.',
                prices: { 'Deep Clean': 8.00 },
                imageUrl: 'https://images.unsplash.com/photo-1623190890259-7171e549d41d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                category: 'toys',
            },
            {
                name: 'Shoe Cleaning',
                description: 'Professional cleaning for all types of footwear.',
                prices: { 'Standard Clean': 10.00, 'Premium Clean': 15.00 },
                imageUrl: 'https://images.unsplash.com/photo-1549298916-f52d727d53b5?q=80&w=2013&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                category: 'shoes',
            },
            {
                name: 'Leather Bag Cleaning',
                description: 'Expert cleaning and conditioning for leather bags.',
                prices: { 'Standard Clean': 25.00, 'Premium Clean': 35.00 },
                imageUrl: 'https://images.unsplash.com/photo-1584917834789-d4217112b322?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                category: 'others',
            },
        ];

        const createdServices = await Service.insertMany(servicesData);
        console.log(`Seeded ${createdServices.length} services.`);

        // --- Seed Orders ---
        console.log('Seeding orders...');

        const ordersData = [];
        const numOrders = 5; // Number of dummy orders to create

        for (let i = 0; i < numOrders; i++) {
            const pickupDate = faker.date.soon({ days: 7, refDate: new Date() });
            // Ensure delivery date is after pickup date and realistic (e.g., +3 days)
            const deliveryDate = new Date(pickupDate);
            deliveryDate.setDate(deliveryDate.getDate() + 3);

            const chosenServices = [];
            let currentTotalAmount = 0;

            // Select 1 to 3 random services for each order
            const servicesToPick = faker.helpers.arrayElements(createdServices, { min: 1, max: 3 });

            for (const service of servicesToPick) {
                // FIX: Get the actual keys from the Mongoose Map
                const serviceTypes = Array.from(service.prices.keys());

                if (serviceTypes.length === 0) {
                    console.warn(`Service "${service.name}" has no defined prices. Skipping.`);
                    continue;
                }
                const randomServiceType = faker.helpers.arrayElement(serviceTypes);
                const quantity = faker.helpers.arrayElement([1, 2, 3]); // Random quantity

                // FIX: Use .get() method to retrieve price from Mongoose Map
                const priceAtOrder = service.prices.get(randomServiceType);

                if (typeof priceAtOrder !== 'number' || isNaN(priceAtOrder)) {
                    console.error(`Invalid price retrieved for service "${service.name}" and type "${randomServiceType}":`, priceAtOrder);
                    continue; // Skip if price is invalid
                }

                chosenServices.push({
                    service: service._id,
                    quantity,
                    priceAtOrder: priceAtOrder,
                    itemType: randomServiceType,
                });
                currentTotalAmount += priceAtOrder * quantity;
            }

            // Ensure currentTotalAmount is a valid number and there are chosen services
            if (isNaN(currentTotalAmount) || chosenServices.length === 0) {
                console.warn('Skipping order due to invalid totalAmount or no chosen services.');
                continue; // Skip this order if it's not valid
            }

            ordersData.push({
                user: dummyUserId,
                services: chosenServices,
                totalAmount: parseFloat(currentTotalAmount.toFixed(2)),
                status: faker.helpers.arrayElement(['Pending', 'Confirmed', 'Picked Up', 'Delivered']),
                pickupDate,
                deliveryDate,
                paymentStatus: faker.helpers.arrayElement(['Pending', 'Paid']),
                paymentDetails: {}, // Can fill with dummy razorpay IDs if needed
                address: {
                    street: faker.location.streetAddress(),
                    city: faker.location.city(),
                    state: faker.location.state(),
                    zipCode: faker.location.zipCode({ format: '######' }), // Indian postal codes
                    country: 'India',
                },
                notes: faker.lorem.sentence(),
            });
        }

        const createdOrders = await Order.insertMany(ordersData);
        console.log(`Seeded ${createdOrders.length} orders.`);

    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

seedDB();