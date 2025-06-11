import { useState, useEffect } from "react";
import {
  Shirt,
  Scissors,
  Umbrella,
  ShoppingBag,
  Package,
  BadgeDollarSign,
  Calendar,
  PlusCircle, // Added for 'Add Service' button
  Edit, // Added for 'Edit Service' button
  Trash2, // Added for 'Delete Service' button
} from "lucide-react";
import axios from "axios";
import ServiceModal from "../component/ServiceModal"; // For regular user 'Select'
import AdminServiceModal from "../component/AdminServiceModal"; // New modal for admin
import DeleteConfirmationModal from "../component/DeleteConfirmationModal"; // New modal for delete confirmation
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Pricing = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false); // For regular user 'Select'
  const [selectedServiceForModal, setSelectedServiceForModal] = useState(null);
  const [isAdminServiceModalOpen, setIsAdminServiceModalOpen] = useState(false); // For admin add/edit
  const [serviceToEdit, setServiceToEdit] = useState(null); // For editing existing service
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // For delete confirmation
  const [serviceToDelete, setServiceToDelete] = useState(null); // Service to be deleted

  const { addToCart } = useCart();

  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.role) {
        setCurrentUserRole(user.role);
      }
    } catch (parseError) {
      console.error("Error parsing user from localStorage:", parseError);
      setCurrentUserRole(null);
    }
  }, []);

  const categories = [
    { id: "all", name: "All Services", icon: BadgeDollarSign },
    { id: "shirts", name: "Shirts", icon: Shirt },
    { id: "pants", name: "Pants & Shorts", icon: Scissors },
    { id: "curtains", name: "Curtains & Blankets", icon: Umbrella },
    { id: "toys", name: "Toys & Plushies", icon: Package },
    { id: "shoes", name: "Shoes & Accessories", icon: ShoppingBag },
    { id: "others", name: "Other Items", icon: BadgeDollarSign },
  ];

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/services");
      setServices(response.data);
    } catch (err) {
      setError("Failed to fetch services. Please try again later.");
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openServiceModal = (service) => {
    setSelectedServiceForModal(service);
    setIsServiceModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsServiceModalOpen(false);
    setSelectedServiceForModal(null);
  };

  const handleAddToCart = (service, quantity) => {
    addToCart(service, quantity);
    alert(`${quantity} x ${service.name} (${service.serviceType}) added to cart!`);
  };

  // Admin functionalities
  const openAddServiceModal = () => {
    setServiceToEdit(null); // Ensure no service is being edited when adding
    setIsAdminServiceModalOpen(true);
  };

  const openEditServiceModal = (service) => {
    setServiceToEdit(service);
    setIsAdminServiceModalOpen(true);
  };

  const closeAdminServiceModal = () => {
    setIsAdminServiceModalOpen(false);
    setServiceToEdit(null);
    fetchServices(); // Refresh services after add/edit
  };

  const openDeleteConfirmationModal = (service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteConfirmationModal = () => {
    setIsDeleteModalOpen(false);
    setServiceToDelete(null);
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      await axios.delete(`http://localhost:5000/api/services/${serviceToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(`${serviceToDelete.name} deleted successfully!`);
      closeDeleteConfirmationModal();
      fetchServices(); // Refresh services after deletion
    } catch (err) {
      console.error("Error deleting service:", err);
      alert("Failed to delete service. Please try again.");
    }
  };

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((service) => service.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 items-center justify-center">
        <p className="text-xl text-gray-700">Loading services...</p>
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
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <nav>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg mb-2 transition-colors ${
                  selectedCategory === category.id
                    ? "bg-blue-600"
                    : "hover:bg-gray-800"
                }`}
              >
                <Icon size={20} />
                <span>{category.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center justify-between">
            {categories.find((c) => c.id === selectedCategory)?.name} - Service
            Options
            {currentUserRole === "admin" && (
              <button
                onClick={openAddServiceModal}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center"
              >
                <PlusCircle className="mr-2" size={18} /> Add New Service
              </button>
            )}
          </h2>
          {filteredServices.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No services available for this category.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div
                  key={service._id}
                  className="bg-gray-100 p-4 rounded-lg shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={service.imageUrl || "/api/placeholder/400/200"}
                      alt={`${service.name} preview`}
                      className="w-full h-32 object-cover rounded-md mb-4"
                    />
                    <h3 className="font-semibold text-lg mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-700 text-sm mb-4">
                      {service.description}
                    </p>
                    <div className="mb-4">
                      {Object.entries(service.prices).map(([type, price]) => (
                        <p key={type} className="text-gray-800">
                          {type}:{" "}
                          <span className="font-bold text-blue-600">
                            ₹{price.toFixed(2)}
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>
                  {currentUserRole === "admin" ? (
                    <div className="flex space-x-2 mt-auto">
                      <button
                        onClick={() => openEditServiceModal(service)}
                        className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 flex items-center justify-center"
                      >
                        <Edit size={18} className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => openDeleteConfirmationModal(service)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center"
                      >
                        <Trash2 size={18} className="mr-1" /> Delete
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => openServiceModal(service)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mt-auto"
                    >
                      Select
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isServiceModalOpen && (
        <ServiceModal
          service={selectedServiceForModal}
          onClose={closeServiceModal}
          onAddToCart={handleAddToCart}
        />
      )}

      {isAdminServiceModalOpen && (
        <AdminServiceModal
          service={serviceToEdit} // Pass service if editing, null if adding
          onClose={closeAdminServiceModal}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          service={serviceToDelete}
          onClose={closeDeleteConfirmationModal}
          onConfirm={handleDeleteService}
        />
      )}
    </div>
  );
};

export default Pricing;