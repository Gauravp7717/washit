import React, { useState, useEffect } from 'react';

const ServiceModal = ({ service, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedServiceType, setSelectedServiceType] = useState('');

    useEffect(() => {
        // Reset quantity and selected service type when service changes
        setQuantity(1);
        if (service && Object.keys(service.prices).length > 0) {
            setSelectedServiceType(Object.keys(service.prices)[0]); // Set default to first service type
        }
    }, [service]);

    if (!service) return null;

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0) {
            setQuantity(value);
        } else {
            setQuantity(1); // Minimum quantity is 1
        }
    };

    const handleAddToCart = () => {
        if (selectedServiceType) {
            const serviceToAdd = {
                ...service,
                price: service.prices[selectedServiceType], // Use the price of the selected service type
                serviceType: selectedServiceType, // Add the selected service type
                _id: `${service._id}-${selectedServiceType}` // Unique ID for cart item
            };
            onAddToCart(serviceToAdd, quantity);
            onClose();
        } else {
            alert('Please select a service type.');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <h2 className="text-2xl font-bold mb-4">{service.name}</h2>
                <img
                    src={service.imageUrl || '/api/placeholder/400/200'} // Use service's image or placeholder
                    alt={service.name}
                    className="w-full h-40 object-cover rounded-md mb-4"
                />
                <p className="text-gray-700 mb-4">{service.description}</p>

                <div className="mb-4">
                    <label htmlFor="serviceType" className="block text-gray-700 font-semibold mb-2">
                        Select Service Type:
                    </label>
                    <select
                        id="serviceType"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedServiceType}
                        onChange={(e) => setSelectedServiceType(e.target.value)}
                    >
                        <option value="">Choose a service type</option>
                        {Object.entries(service.prices).map(([type, price]) => (
                            <option key={type} value={type}>
                                {type} - ₹{price.toFixed(2)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="quantity" className="block text-gray-700 font-semibold mb-2">
                        Quantity:
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        min="1"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-bold text-blue-600">
                        Total: ₹{selectedServiceType ? (service.prices[selectedServiceType] * quantity).toFixed(2) : '0.00'}
                    </span>
                    <button
                        onClick={handleAddToCart}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        disabled={!selectedServiceType}
                    >
                        Add to Cart
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ServiceModal;