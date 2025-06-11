import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, Calendar } from "lucide-react";
import { loadRazorpayScript, initiatePayment } from "../utils/razorpay"; // New utility file
import axios from "axios";

const Cart = () => {
  const { cartItems, cartTotal, removeFromCart, updateCartItemQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  // State for address details (you might fetch this from a user profile API)
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });
  const [pickupDate, setPickupDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [user, setUser] = useState(null); // Assuming user data is available after login
  const [token, setToken] = useState(null); // State to store the authentication token

  // Fetch user details and token on component mount
  useEffect(() => {
    const fetchUserAndToken = async () => {
      const storedToken = localStorage.getItem('token'); // Get token from local storage
      console.log("token", token);
      const userId = localStorage.getItem('userId'); // Get user ID from local storage

      if (storedToken && userId) {
        setToken(storedToken);
        try {
          // Add Authorization header to fetch user data
          const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          setUser(response.data);
          // Pre-fill address if user has a default address
          if (response.data.address) {
            setAddress(response.data.address);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Handle error (e.g., redirect to login if unauthorized or token expired)
          // navigate('/signin'); // Example: redirect to signin
        }
      } else {
        // If no user ID or token, prompt for login or show address form
        // navigate('/signin'); // Example: redirect to signin
      }
    };
    fetchUserAndToken();
  }, []);

  const handleQuantityChange = (serviceId, newQuantity) => {
    if (newQuantity > 0) {
      updateCartItemQuantity(serviceId, newQuantity);
    }
  };

  const calculateDeliveryDate = (pickupDate) => {
    if (pickupDate) {
      const date = new Date(pickupDate);
      date.setDate(date.getDate() + 3); // Example: 3 days for delivery
      return date.toISOString().split('T')[0];
    }
    return "";
  };

  useEffect(() => {
    setDeliveryDate(calculateDeliveryDate(pickupDate));
  }, [pickupDate]);

  const handleCheckout = async () => {
    setLoadingCheckout(true);
    setCheckoutError(null);

    if (cartItems.length === 0) {
      setCheckoutError("Your cart is empty.");
      setLoadingCheckout(false);
      return;
    }

    if (!token) {
      setCheckoutError("Please sign in to place an order.");
      setLoadingCheckout(false);
      // Optionally redirect to login
      navigate('/signin');
      return;
    }

    if (!address.street || !address.city || !address.state || !address.zipCode || !pickupDate || !deliveryDate) {
      setCheckoutError("Please fill in all address and date details.");
      setLoadingCheckout(false);
      return;
    }

    const orderData = {
      // The user ID is now sent from the backend after authentication, so we don't need to explicitly send user._id here.
      // The backend will get it from req.user._id set by the auth middleware.
      services: cartItems.map((item) => ({
        serviceId: item.service._id, // Use the full service._id from the cart item
        quantity: item.quantity,
        priceAtOrder: item.priceAtOrder,
        type: item.service.serviceType, // Pass serviceType as 'type'
      })),
      totalAmount: cartTotal,
      pickupDate: new Date(pickupDate).toISOString(),
      deliveryDate: new Date(deliveryDate).toISOString(),
      address: address,
      notes: notes,
    };

    try {
      // 1. Create Order on your backend
      const orderResponse = await axios.post("http://localhost:5000/api/orders/place", orderData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the authentication token
        },
      });
      const orderDetails = orderResponse.data.order; // Access the 'order' object from the response

      // 2. Initiate Razorpay payment (if using)
      // This part remains largely the same as you had it, assuming your Razorpay backend integration handles order creation on Razorpay's side.
      // Make sure your backend's placeOrder endpoint also creates the Razorpay order and returns `razorpayOrderId`.

      // A simple placeholder if you don't have Razorpay integrated fully yet
      alert("Order placed successfully! Proceeding to payment (Razorpay simulation).");
      clearCart();
      navigate(`/order-confirmation/${orderDetails._id}`); // Redirect to order confirmation with the actual order ID

      /*
      // If you have Razorpay fully set up to create the order on your backend and return the razorpayOrderId:
      await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");

      const paymentResult = await initiatePayment({
        amount: orderDetails.totalAmount * 100, // Razorpay expects amount in paisa
        currency: "INR", // Or your currency
        order_id: orderDetails.razorpayOrderId, // Order ID from your backend (should be included in orderDetails)
        name: "Washit",
        description: "Laundry Service Payment",
        image: "https://example.com/your_logo.png", // Your logo
        handler: async (response) => {
          // This function is called on successful payment
          try {
            await axios.post("http://localhost:5000/api/payments/verify", {
              // Your backend endpoint for payment verification
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderDetails._id, // Your internal order ID
            }, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            alert("Payment Successful! Your order has been placed.");
            clearCart();
            navigate(`/order-confirmation/${orderDetails._id}`); // Redirect to order confirmation
          } catch (verifyError) {
            console.error("Payment verification failed:", verifyError);
            setCheckoutError("Payment verification failed. Please contact support.");
            // You might want to update the order status to 'Failed' on your backend here
          }
        },
        prefill: {
          name: user.name, // Pre-fill user name
          email: user.email, // Pre-fill user email
          contact: user.phone, // Pre-fill user phone
        },
        notes: {
          address: `${address.street}, ${address.city}`,
        },
        theme: {
          color: "#3399CC",
        },
      });
      */

    } catch (err) {
      console.error("Checkout error:", err);
      // More robust error handling:
      if (err.response && err.response.data && err.response.data.message) {
        setCheckoutError(err.response.data.message);
      } else {
        setCheckoutError("Failed to process checkout. Please try again.");
      }
    } finally {
      setLoadingCheckout(false);
    }
  };


  return (
    <div className="container mx-auto p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <ShoppingCart size={64} className="text-gray-400 mb-4" />
          <p className="text-xl text-gray-600 mb-6">Your cart is empty.</p>
          <Link
            to="/pricing"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Items in your cart</h2>
            {cartItems.map((item) => (
              <div
                key={item.service._id}
                className="flex items-center justify-between border-b border-gray-200 py-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.service.imageUrl || 'https://via.placeholder.com/100'} // Placeholder image
                    alt={item.service.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{item.service.name} ({item.service.serviceType})</h3>
                    <p className="text-gray-600">₹{item.priceAtOrder.toFixed(2)} / item</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.service._id, parseInt(e.target.value))
                    }
                    className="w-20 p-2 border border-gray-300 rounded-md text-center"
                  />
                  <p className="text-xl font-bold text-blue-600">
                    ₹{(item.priceAtOrder * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.service._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-6 flex justify-end">
              <button
                onClick={clearCart}
                className="text-gray-600 hover:text-red-500 px-4 py-2 rounded-lg border border-gray-300 hover:border-red-500 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary and Address */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit sticky top-8">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <span className="text-gray-700">Subtotal</span>
              <span className="font-semibold text-lg">₹{cartTotal.toFixed(2)}</span>
            </div>
            {/* Add more summary lines like delivery fee, tax if applicable */}
            <div className="flex justify-between items-center font-bold text-xl mb-6">
              <span>Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>

            <h3 className="text-xl font-semibold mb-4">Pickup & Delivery Details</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="street" className="block text-gray-700 text-sm font-bold mb-2">Street Address</label>
                <input
                  type="text"
                  id="street"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main St"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">City</label>
                  <input
                    type="text"
                    id="city"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">State</label>
                  <input
                    type="text"
                    id="state"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="State"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-gray-700 text-sm font-bold mb-2">Zip Code</label>
                <input
                  type="text"
                  id="zipCode"
                  value={address.zipCode}
                  onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="12345"
                  required
                />
              </div>
              <div>
                <label htmlFor="pickupDate" className="block text-gray-700 text-sm font-bold mb-2">Pickup Date</label>
                <input
                  type="date"
                  id="pickupDate"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="deliveryDate" className="block text-gray-700 text-sm font-bold mb-2">Estimated Delivery Date</label>
                <input
                  type="date"
                  id="deliveryDate"
                  value={deliveryDate}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">Notes (optional)</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any special instructions?"
                ></textarea>
              </div>
            </div>

            {checkoutError && (
              <p className="text-red-500 text-sm mb-4">{checkoutError}</p>
            )}

            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              disabled={loadingCheckout || cartItems.length === 0}
            >
              {loadingCheckout ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Calendar className="mr-2" />
              )}
              {loadingCheckout ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;