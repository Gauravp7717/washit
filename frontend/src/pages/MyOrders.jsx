import { useState, useEffect, useCallback, useMemo } from "react";
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
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Building2,
  Phone,
  Mail
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

const OrderTimeline = ({ status, isAdmin, onStatusChange, orderId, updatingOrderId }) => {
  const orderStatuses = [
    { name: "Pending", icon: Clock, color: "text-yellow-500", bgColor: "bg-yellow-500" },
    { name: "Picked Up", icon: Package, color: "text-purple-500", bgColor: "bg-purple-500" },
    { name: "In Progress", icon: ClipboardCheck, color: "text-blue-500", bgColor: "bg-blue-500" },
    { name: "Out for Delivery", icon: Truck, color: "text-indigo-500", bgColor: "bg-indigo-500" },
    { name: "Delivered", icon: CheckCircle, color: "text-green-500", bgColor: "bg-green-500" }
  ];

  const currentStatusIndex = orderStatuses.findIndex(s => s.name === status);
  const progressPercentage = currentStatusIndex >= 0 ? ((currentStatusIndex + 1) / orderStatuses.length) * 100 : 0;

  return (
    <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-semibold text-gray-800 flex items-center">
          <Sparkles className="mr-2 text-blue-500" size={18} />
          Order Progress
        </h4>
        {isAdmin && (
          <select
            value={status}
            onChange={(e) => onStatusChange(orderId, e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-md"
            disabled={updatingOrderId === orderId}
          >
            {orderStatuses.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
            <option value="Cancelled">Cancelled</option>
          </select>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Timeline Steps */}
        <div className="flex justify-between relative z-10">
          {orderStatuses.map((step, index) => {
            const Icon = step.icon;
            const isPassed = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            
            return (
              <div key={step.name} className="flex flex-col items-center">
                <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isPassed 
                    ? `${step.bgColor} text-white shadow-lg transform scale-110` 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  <Icon size={20} />
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full animate-ping bg-current opacity-20"></div>
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium transition-colors duration-300 ${
                  isPassed ? step.color : 'text-gray-400'
                }`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Moving Truck */}
        <div 
          className="absolute top-4 transition-all duration-1000 ease-out transform -translate-x-1/2"
          style={{ left: `${Math.min(progressPercentage, 85)}%` }}
        >
          <Truck className="text-blue-600 animate-bounce" size={24} />
        </div>
      </div>

      {/* Status indicator */}
      {status === "Cancelled" && (
        <div className="mt-4 flex items-center justify-center p-2 bg-red-50 rounded-lg">
          <XCircle className="text-red-500 mr-2" size={18} />
          <span className="text-red-700 font-medium">Order Cancelled</span>
        </div>
      )}

      {updatingOrderId === orderId && (
        <div className="mt-4 flex items-center justify-center p-2 bg-blue-50 rounded-lg">
          <RefreshCcw className="text-blue-500 mr-2 animate-spin" size={18} />
          <span className="text-blue-700 font-medium">Updating status...</span>
        </div>
      )}
    </div>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

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

  const loadAuthFromLocalStorage = useAuth().loadAuthFromLocalStorage;

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
            // localStorage.removeItem('user'); // Clear invalid info
            // window.location.reload(); // Force a refresh to re-evaluate auth state
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
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 shadow-yellow-200";
      case "Confirmed":
        return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-blue-200";
      case "Picked Up":
        return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 shadow-purple-200";
      case "In Progress":
        return "bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 shadow-indigo-200";
      case "Out for Delivery":
        return "bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800 shadow-cyan-200";
      case "Delivered":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 shadow-green-200";
      case "Cancelled":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 shadow-red-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 shadow-gray-200";
    }
  };

  // This check should happen BEFORE the loading and error states are handled
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
          <User className="mx-auto mb-4 text-red-500" size={48} />
          <p className="text-xl text-red-600 font-semibold">Please log in to view your orders</p>
          <p className="text-gray-500 mt-2">Access your order history and track deliveries</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-semibold">Loading your orders...</p>
          <p className="text-gray-500 mt-2">Fetching the latest information</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-200">
          <XCircle className="mx-auto mb-4 text-red-500" size={48} />
          <p className="text-xl text-red-600 font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Left Sidebar */}
      <div className="w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              {role === "admin" ? <Building2 size={24} /> : <User size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {role === "admin" ? "Admin Panel" : "My Dashboard"}
              </h2>
              <p className="text-slate-400 text-sm">Order Management</p>
            </div>
          </div>
        </div>
        
        <nav className="p-6">
          <ul className="space-y-3">
            <li>
              <button
                onClick={() => {
                  setLoading(true);
                  // loadAuthFromLocalStorage();
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-slate-700 hover:shadow-lg group"
              >
                <RefreshCcw className="group-hover:rotate-180 transition-transform duration-300" size={20} />
                <span className="font-medium">Refresh Orders</span>
                <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" size={16} />
              </button>
            </li>
            <li>
              <div className="flex items-center space-x-3 px-4 py-3 text-slate-400">
                <Package size={20} />
                <span className="font-medium">Total Orders: {orders.length}</span>
              </div>
            </li>
            {role === "admin" && (
              <li>
                <div className="flex items-center space-x-3 px-4 py-3 text-slate-400">
                  <Sparkles size={20} />
                  <span className="font-medium">Admin Access</span>
                </div>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              {role === "admin" ? "All Orders" : "My Orders"}
            </h1>
            <p className="text-slate-600">
              {role === "admin" 
                ? "Manage and track all customer orders" 
                : "Track your order history and current deliveries"
              }
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto border border-gray-100">
                <Package className="mx-auto mb-6 text-gray-400" size={64} />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Orders Found</h3>
                <p className="text-gray-600 mb-6">
                  {role === "admin"
                    ? "No orders have been placed in the system yet."
                    : "You haven't placed any orders yet. Start shopping today!"}
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                  {role === "admin" ? "Refresh" : "Start Shopping"}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-8">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Package className="text-white" size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 flex items-center">
                            Order #{order._id.substring(0, 8).toUpperCase()}
                            {role === "admin" && order.user && (
                              <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                                {order.user.username || order.user.email}
                              </span>
                            )}
                          </h3>
                          <div className="flex items-center mt-2 text-gray-600">
                            <Calendar size={16} className="mr-2" />
                            <span className="text-sm">
                              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          {expandedOrder === order._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  <div className="p-6">
                    <OrderTimeline 
                      status={order.status}
                      isAdmin={role === "admin"}
                      onStatusChange={handleStatusChange}
                      orderId={order._id}
                      updatingOrderId={updatingOrderId}
                    />
                  </div>

                  {/* Expandable Content */}
                  {expandedOrder === order._id && (
                    <div className="px-6 pb-6 space-y-6">
                      {/* Order Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                          <div className="flex items-center mb-2">
                            <DollarSign className="text-green-600 mr-2" size={20} />
                            <span className="font-semibold text-gray-800">Total Amount</span>
                          </div>
                          <p className="text-2xl font-bold text-green-600">₹{order.totalAmount.toFixed(2)}</p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                          <div className="flex items-center mb-2">
                            <Calendar className="text-blue-600 mr-2" size={20} />
                            <span className="font-semibold text-gray-800">Pickup Date</span>
                          </div>
                          <p className="text-lg font-semibold text-blue-600">
                            {new Date(order.pickupDate).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                          <div className="flex items-center mb-2">
                            <Calendar className="text-purple-600 mr-2" size={20} />
                            <span className="font-semibold text-gray-800">Delivery Date</span>
                          </div>
                          <p className="text-lg font-semibold text-purple-600">
                            {new Date(order.deliveryDate).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200">
                        <div className="flex items-center mb-3">
                          <MapPin className="text-gray-600 mr-2" size={20} />
                          <span className="font-semibold text-gray-800">Delivery Address</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {order.address.street}, {order.address.city}, {order.address.state} - {order.address.zipCode}, {order.address.country}
                        </p>
                      </div>

                      {/* Items Ordered */}
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                          <Package className="text-amber-600 mr-2" size={20} />
                          Items Ordered
                        </h4>
                        <div className="space-y-3">
                          {order.services.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                              <div>
                                <span className="font-semibold text-gray-800">
                                  {item.quantity} × {item.itemType}
                                </span>
                                <p className="text-sm text-gray-600">
                                  {services.find((s) => s._id === item.service)?.name ?? "(Service Not Found)"}
                                </p>
                              </div>
                              <span className="font-bold text-amber-600">
                                ₹{item.priceAtOrder.toFixed(2)} each
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      {order.notes && (
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <ClipboardCheck className="text-indigo-600 mr-2" size={20} />
                            Special Notes
                          </h4>
                          <p className="text-gray-700 italic leading-relaxed bg-white p-4 rounded-lg shadow-sm">
                            "{order.notes}"
                          </p>
                        </div>
                      )}
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