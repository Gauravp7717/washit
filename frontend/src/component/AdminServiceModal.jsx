import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminServiceModal = ({ service, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prices: {
      "Dry Clean": "",
      "Wash & Fold": "",
      Ironing: "",
    }, // Initialize with common service types
    imageUrl: "",
    category: "others", // Default category
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      // If service is provided, it means we are editing
      setFormData({
        name: service.name,
        description: service.description,
        prices: service.prices || {}, // Ensure prices is an object
        imageUrl: service.imageUrl || "",
        category: service.category || "others",
      });
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear error on change
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      prices: {
        ...prevData.prices,
        [name]: parseFloat(value), // Convert price to number
      },
    }));
    setFormErrors((prevErrors) => ({ ...prevErrors, prices: "" })); // Clear error on change
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Service name is required.";
    if (!formData.description.trim())
      errors.description = "Description is required.";
    if (!formData.category) errors.category = "Category is required.";

    const priceValues = Object.values(formData.prices);
    if (priceValues.length === 0 || priceValues.some(p => isNaN(p) || p <= 0)) {
        errors.prices = "At least one valid price is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      if (service) {
        // Update existing service
        await axios.put(
          `http://localhost:5000/api/services/${service._id}`,
          formData,
          config
        );
        alert("Service updated successfully!");
      } else {
        // Add new service
        await axios.post("http://localhost:5000/api/services", formData, config);
        alert("Service added successfully!");
      }
      onClose(); // Close modal on success
    } catch (err) {
      console.error("Error saving service:", err);
      alert("Failed to save service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <h2 className="text-2xl font-bold mb-4">
          {service ? "Edit Service" : "Add New Service"}
        </h2>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Service Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {formErrors.name && (
              <p className="text-red-500 text-xs italic">{formErrors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description:
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
            {formErrors.description && (
              <p className="text-red-500 text-xs italic">
                {formErrors.description}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category:
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select a category</option>
              <option value="shirts">Shirts</option>
              <option value="pants">Pants & Shorts</option>
              <option value="curtains">Curtains & Blankets</option>
              <option value="toys">Toys & Plushies</option>
              <option value="shoes">Shoes & Accessories</option>
              <option value="others">Other Items</option>
            </select>
            {formErrors.category && (
              <p className="text-red-500 text-xs italic">
                {formErrors.category}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Prices:
            </label>
            {Object.keys(formData.prices).map((type) => (
              <div key={type} className="flex items-center mb-2">
                <label className="w-1/3 text-gray-600 text-sm">{type}:</label>
                <input
                  type="number"
                  name={type}
                  value={formData.prices[type] || ""}
                  onChange={handlePriceChange}
                  step="0.01"
                  className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            ))}
            {formErrors.prices && (
              <p className="text-red-500 text-xs italic">{formErrors.prices}</p>
            )}
             <div className="mt-2">
                <p className="text-gray-500 text-xs">
                    * You can add or modify price types by editing the `prices` object in the code.
                </p>
             </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Image URL:
            </label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full"
            disabled={loading}
          >
            {loading ? "Saving..." : service ? "Update Service" : "Add Service"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminServiceModal;