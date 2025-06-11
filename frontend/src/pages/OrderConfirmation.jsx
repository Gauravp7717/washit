import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderConfirmation = () => {
    const { orderId } = useParams();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
                <p className="text-lg text-gray-600 mb-2">Your order has been placed successfully.</p>
                <p className="text-md text-gray-700 font-semibold mb-6">Order ID: {orderId}</p>
                <p className="text-gray-500 mb-8">You will receive an email with your order details shortly.</p>
                <Link
                    to="/"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmation;