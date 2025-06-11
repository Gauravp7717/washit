import { useState, useEffect } from "react";
import axios from "axios";
import {
  Package,
  Calendar,
  DollarSign,
  MapPin,
  ClipboardCheck,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]); // <--- ADDED: State to store services
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Define possible order statuses
  const orderStatuses = [
    "Pending",
    "Confirmed",
    "Picked Up",
    "In Progress", // Added a new status for better flow
    "Delivered",
    "Cancelled",
  ];

  useEffect(() => {
    // Fetch both orders and services when the component mounts
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch services
        const servicesResponse = await axios.get("http://localhost:5000/api/services");
        setServices(servicesResponse.data);

        // Fetch orders
        const ordersResponse = await axios.get("http://localhost:5000/api/orders");
        // Sort orders by creation date, most recent first
        const sortedOrders = ordersResponse.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  const handleStatusChange = async (orderId, newStatus) => {
    if (updatingOrderId === orderId) return; // Prevent multiple updates for the same order

    setUpdatingOrderId(orderId);
    try {
      // Assuming a PUT endpoint for status updates: /api/orders/:orderId/status
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        status: newStatus,
      });
      // Update the order in the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      console.log(`Order ${orderId} status updated to ${newStatus}`);
    } catch (err) {
      setError(
        `Failed to update order ${orderId} status. Please try again.`
      );
      console.error(`Error updating order ${orderId} status:`, err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Confirmed":
        return "bg-blue-100 text-blue-800";
      case "Picked Up":
        return "bg-purple-100 text-purple-800";
      case "In Progress":
        return "bg-indigo-100 text-indigo-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 items-center justify-center">
        <p className="text-xl text-gray-700">Loading orders and services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100 items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar (Placeholder for consistency with Pricing page) */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Order Management</h2>
        <nav>
          {/* You can add filters or other admin-specific navigation here later */}
          <button
            onClick={() => { /* Re-fetch all data */
                setLoading(true); // Manually set loading to true for re-fetch feedback
                const fetchData = async () => {
                    try {
                        const servicesResponse = await axios.get("http://localhost:5000/api/services");
                        setServices(servicesResponse.data);
                        const ordersResponse = await axios.get("http://localhost:5000/api/orders");
                        const sortedOrders = ordersResponse.data.sort(
                            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                        );
                        setOrders(sortedOrders);
                    } catch (err) {
                        setError("Failed to refresh data. Please try again later.");
                        console.error("Error refreshing data:", err);
                    } finally {
                        setLoading(false);
                    }
                };
                fetchData();
            }}
            className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg mb-2 transition-colors hover:bg-gray-800"
          >
            <ClipboardCheck size={20} />
            <span>Refresh Orders</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>

          {orders.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No orders found. Place your first order today!
            </p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-xl text-gray-900 flex items-center">
                        <Package className="mr-2" size={20} /> Order ID:{" "}
                        {order._id.substring(0, 8)}...
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Placed on:{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="mr-2" size={18} />
                      Total Amount:{" "}
                      <span className="font-bold text-blue-600 ml-1">
                        ₹{order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="mr-2" size={18} />
                      Pickup Date:{" "}
                      {new Date(order.pickupDate).toLocaleDateString("en-IN", {
                            year: 'numeric', month: 'short', day: 'numeric'
                        })}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="mr-2" size={18} />
                      Delivery Date:{" "}
                      {new Date(order.deliveryDate).toLocaleDateString("en-IN", {
                            year: 'numeric', month: 'short', day: 'numeric'
                        })}
                    </div>
                    <div className="flex items-start text-gray-700">
                      <MapPin className="mr-2 mt-1" size={18} />
                      Address:{" "}
                      <span>
                        {order.address.street}, {order.address.city},{" "}
                        {order.address.state} - {order.address.zipCode},{" "}
                        {order.address.country}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">
                      Items Ordered:
                    </h4>
                    <ul className="list-disc list-inside text-gray-700">
                      {order.services.map((item, index) => (
                        <li key={index} className="mb-1">
                          <span className="font-semibold">
                            {item.quantity} x {item.itemType}
                          </span>{" "}
                          {
                            // FIX: Use the 'services' state to find the service name
                            services.find((s) => s._id === item.service)
                              ?.name || null
                          }@ ₹{item.priceAtOrder.toFixed(2)} each
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4 text-gray-700">
                    <h4 className="font-medium text-gray-800">Notes:</h4>
                    <p className="text-sm italic">{order.notes || "N/A"}</p>
                  </div>

                  {/* Admin Controls: Update Status */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">
                      Update Status (Admin)
                    </h4>
                    <div className="flex items-center space-x-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={updatingOrderId === order._id}
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      {updatingOrderId === order._id ? (
                        <span className="text-blue-600 flex items-center">
                          <Truck className="animate-pulse mr-1" size={18} />{" "}
                          Updating...
                        </span>
                      ) : (
                        <span className="text-green-600 flex items-center">
                          <CheckCircle className="mr-1" size={18} /> Status
                          Ready
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;