import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    // Load cart from local storage on initial render
    useEffect(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
        }
    }, []);

    // Update local storage whenever cartItems changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        calculateTotal();
    }, [cartItems]);

    const calculateTotal = () => {
        const total = cartItems.reduce((acc, item) => acc + (item.priceAtOrder * item.quantity), 0);
        setCartTotal(total);
    };

    const addToCart = (service, quantity) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item => item.service._id === service._id);

            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += quantity;
                return updatedItems;
            } else {
                return [...prevItems, { service, quantity, priceAtOrder: service.price }];
            }
        });
    };

    const removeFromCart = (serviceId) => {
        setCartItems(prevItems => prevItems.filter(item => item.service._id !== serviceId));
    };

    const updateCartItemQuantity = (serviceId, newQuantity) => {
        setCartItems(prevItems => {
            return prevItems.map(item =>
                item.service._id === serviceId ? { ...item, quantity: newQuantity } : item
            );
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartContextValue = {
        cartItems,
        cartTotal,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
    };

    return (
        <CartContext.Provider value={cartContextValue}>
            {children}
        </CartContext.Provider>
    );
};