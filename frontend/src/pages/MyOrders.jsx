import { useState, useEffect, useCallback, useMemo } from "react"; // Added useMemo
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
  RefreshCcw,
} from "lucide-react";

// Refined useAuth hook for better debugging and resilience
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to read from localStorage and update state
  const loadAuthFromLocalStorage = useCallback(() => {
    console.log("useAuth: Attempting to load auth from localStorage...");
    try {
      // Changed to 'user' as per your localStorage structure
      const userInfoString = localStorage.getItem('user'); // <--- Key change
      console.log("useAuth: userInfoString from localStorage (key 'user'):", userInfoString);

      if (userInfoString) {
        const parsedUserInfo = JSON.parse(userInfoString);
        console.log("useAuth: Parsed userInfo:", parsedUserInfo);

        // Basic validation of parsed data
        if (parsedUserInfo.token && parsedUserInfo.role && parsedUserInfo._id) {
          setUser(parsedUserInfo);
          setToken(parsedUserInfo.token);
          setRole(parsedUserInfo.role);
          setIsAuthenticated(true);
          console.log("useAuth: Successfully authenticated from localStorage!");
        } else {
          // Data is there but incomplete
          console.warn("useAuth: userInfo in localStorage (key 'user') is incomplete or malformed.", parsedUserInfo);
          setUser(null);
          setToken(null);
          setRole(null);
          setIsAuthenticated(false);
        }
      } else {
        // No userInfo in localStorage
        console.log("useAuth: No 'user' key found in localStorage.");
        setUser(null);
        setToken(null);
        setRole(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Error parsing JSON (e.g., malformed string in localStorage)
      console.error("useAuth: Error parsing user info from localStorage (key 'user'):", error);
      setUser(null);
      setToken(null);
      setRole(null);
      setIsAuthenticated(false);
    }
  }, []); // useCallback ensures this function isn't recreated unnecessarily

  useEffect(() => {
    // Initial load when the hook mounts
    loadAuthFromLocalStorage();

    // Add an event listener for storage changes (for cross-tab/window sync)
    const handleStorageChange = (event) => {
      if (event.key === 'user') { // <--- Key change for listener
        console.log("useAuth: 'user' localStorage key changed. Re-loading auth state.");
        loadAuthFromLocalStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadAuthFromLocalStorage]);

  return { user, token, role, isAuthenticated };
};


const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const { user, token, role, isAuthenticated } = useAuth();

  // --- START DEBUGGING LOGS IN MyOrders ---
  console.log("--- MyOrders Component Render Cycle ---");
  console.log("MyOrders: isAuthenticated (from useAuth):", isAuthenticated);
  console.log("MyOrders: token (from useAuth):", token ? "Present" : "NOT present");
  console.log("MyOrders: role (from useAuth):", role);
  console.log("MyOrders: user object (from useAuth):", user);
  console.log("--- MyOrders Component Render Cycle End ---");
  // --- END DEBUGGING LOGS IN MyOrders ---


  // Define possible order statuses
  const orderStatuses = [
    "Pending",
    "Picked Up",
    "In Progress",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  // Use useMemo to memoize axiosConfig
  // It will only be re-created if 'token' changes.
  const axiosConfig = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]); // Dependency on token


  useEffect(() => {
    // Check isAuthenticated here. If it's false, we shouldn't proceed with fetching.
    if (!isAuthenticated) {
      console.log("MyOrders useEffect: Not authenticated. Skipping data fetch.");
      setError("Not authenticated. Please log in.");
      setLoading(false);
      return; // Exit early
    }

    // Also check for token, as isAuthenticated might be true but token is null/undefined if data was incomplete
    if (!token) {
        console.log("MyOrders useEffect: Token is missing despite isAuthenticated being true. This indicates an issue.");
        setError("Authentication token is missing. Please log in again.");
        setLoading(false);
        // Optionally, clear localStorage and force logout if token is truly missing
        // localStorage.removeItem('user');
        // window.location.reload();
        return;
    }


    const fetchData = async () => {
      console.log("MyOrders useEffect: Starting data fetch...");
      try {
        setLoading(true);
        setError(null); // Clear previous errors

        // Fetch services (accessible to both user and admin to display item names)
        const servicesResponse = await axios.get(
          "http://localhost:5000/api/services",
          axiosConfig
        );
        setServices(servicesResponse.data);
        console.log("MyOrders useEffect: Services fetched.");

        let ordersResponse;
        if (role === "admin") {
          // Admin fetches all orders
          console.log("MyOrders useEffect: Fetching ALL orders (as admin).");
          ordersResponse = await axios.get(
            "http://localhost:5000/api/orders",
            axiosConfig
          );
        } else {
          // Regular user fetches their own orders
          console.log("MyOrders useEffect: Fetching MY orders (as user).");
          ordersResponse = await axios.get(
            "http://localhost:5000/api/orders/my-orders",
            axiosConfig
          );
        }

        const sortedOrders = ordersResponse.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
        console.log("MyOrders useEffect: Orders fetched and sorted.");

      } catch (err) {
        console.error("MyOrders useEffect: Error fetching data:", err);
        if (err.response) {
          if (err.response.status === 401) {
            setError("Authentication failed. Please log in again. Your session might have expired.");
            // Force logout if token is invalid
            localStorage.removeItem('user'); // Clear invalid info
            window.location.reload(); // Force a refresh to re-evaluate auth state
          } else if (err.response.status === 403) {
            setError("Not authorized to view this content. (Access Denied)");
          } else if (err.response.data && err.response.data.message) {
            setError(`API Error: ${err.response.data.message}`);
          } else {
            setError("Failed to fetch data. A server error occurred or network issue.");
          }
        } else {
          setError("Network error or server unavailable. Please check your connection.");
        }
      } finally {
        setLoading(false);
        console.log("MyOrders useEffect: Data fetch complete.");
      }
    };
    fetchData();
  }, [token, role, isAuthenticated, axiosConfig]); // axiosConfig is now memoized, so this is fine.

  const handleStatusChange = async (orderId, newStatus) => {
    if (updatingOrderId === orderId) return; // Prevent multiple updates
    if (role !== "admin") {
      setError("You are not authorized to update order status.");
      return;
    }

    setUpdatingOrderId(orderId);
    try {
      console.log(`Attempting to update order ${orderId} status to ${newStatus}`);
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        axiosConfig
      );
      // Update the order in the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      console.log(`Order ${orderId} status updated to ${newStatus} locally.`);
    } catch (err) {
      console.error(`Error updating order ${orderId} status:`, err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(
          `Failed to update order ${orderId} status: ${err.response.data.message}`
        );
      } else {
        setError(
          `Failed to update order ${orderId} status. Please try again.`
        );
      }
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
      case "Out for Delivery":
        return "bg-cyan-100 text-cyan-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // This check should happen BEFORE the loading and error states are handled
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-gray-100 items-center justify-center">
        <p className="text-xl text-red-500">Please log in to view your orders.</p>
      </div>
    );
  }

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
        <h2 className="text-xl font-bold mb-4">
          {role === "admin" ? "Admin Dashboard" : "Order Management"}
        </h2>
        <nav>
          <button
            onClick={async () => {
              setLoading(true);
              // Trigger a re-fetch by updating a state that is a useEffect dependency,
              // or by making fetchData a useCallback and calling it directly.
              // For simplicity, let's make fetchData a useCallback and call it.
              // Or, if fetchData is already encapsulated, just call it.
              // Since fetchData is defined inside useEffect, it's not directly callable
              // from here without restructuring. The easiest is to make the `loadAuthFromLocalStorage`
              // which also triggers the useEffect on its dependency `token`, `role`, `isAuthenticated`.
              loadAuthFromLocalStorage(); // This will re-trigger the useEffect if state changes
            }}
            className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg mb-2 transition-colors hover:bg-gray-800"
          >
            <RefreshCcw size={20} />
            <span>Refresh Orders</span>
          </button>
          {role === "admin" && (
            <>
              {/* Add other admin specific links here */}
            </>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {role === "admin" ? "All Orders" : "My Orders"}
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              {role === "admin"
                ? "No orders found in the system."
                : "No orders found. Place your first order today!"}
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
                        {role === "admin" && order.user && (
                          <span className="text-sm text-gray-500 ml-2">
                            (User: {order.user.username || order.user.email})
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Placed on:{" "}
                        {new Date(order.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
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
                      {new Date(order.pickupDate).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="mr-2" size={18} />
                      Delivery Date:{" "}
                      {new Date(order.deliveryDate).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
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
                          {services.find((s) => s._id === item.service)
                            ?.name ?? "(Service Not Found)"}{" "}
                          @ ₹{item.priceAtOrder.toFixed(2)} each
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4 text-gray-700">
                    <h4 className="font-medium text-gray-800">Notes:</h4>
                    <p className="text-sm italic">{order.notes || "N/A"}</p>
                  </div>

                  {/* Admin Controls: Update Status - Only visible to admin */}
                  {role === "admin" && (
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
                  )}
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