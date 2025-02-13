import { useState } from "react";
import {
  Shirt,
  Scissors,
  Umbrella,
  ShoppingBag,
  Package,
  BadgeDollarSign,
  Calendar,
} from "lucide-react";

const Pricing = () => {
  const [selectedCategory, setSelectedCategory] = useState("shirts");

  const categories = [
    { id: "shirts", name: "Shirts", icon: Shirt },
    { id: "pants", name: "Pants & Shorts", icon: Scissors },
    { id: "curtains", name: "Curtains & Blankets", icon: Umbrella },
    { id: "toys", name: "Toys & Plushies", icon: Package },
    { id: "shoes", name: "Shoes & Accessories", icon: ShoppingBag },
    { id: "others", name: "Other Items", icon: BadgeDollarSign },
  ];

  const services = {
    shirts: {
      image: "/api/placeholder/400/200",
      prices: {
        "Dry Clean": 5.99,
        "Wash & Fold": 3.99,
        "Iron Only": 2.99,
        "Premium Clean": 7.99,
        "Express Service": 8.99,
      },
    },
    pants: {
      image: "/api/placeholder/400/200",
      prices: {
        "Dry Clean": 6.99,
        "Wash & Fold": 4.99,
        "Iron Only": 3.99,
        "Premium Clean": 8.99,
        "Express Service": 9.99,
      },
    },
  };

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
          <h2 className="text-2xl font-bold mb-4">
            {categories.find((c) => c.id === selectedCategory)?.name} - Service
            Options
          </h2>
          {services[selectedCategory] && (
            <div className="space-y-6">
              <img
                src={services[selectedCategory].image}
                alt={`${selectedCategory} preview`}
                className="w-full rounded-lg shadow-md mb-6"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(services[selectedCategory].prices).map(
                  ([service, price]) => (
                    <div
                      key={service}
                      className="bg-gray-100 p-4 rounded-lg shadow-sm"
                    >
                      <h3 className="font-semibold text-lg mb-2">{service}</h3>
                      <p className="text-2xl font-bold text-blue-600 mb-4">
                        ${price.toFixed(2)}
                      </p>
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                        Select
                      </button>
                    </div>
                  )
                )}
              </div>

              <div className="mt-8 text-center">
                <button className="bg-green-600 text-white py-3 px-6 rounded-lg flex items-center justify-center hover:bg-green-700">
                  <Calendar className="mr-2" /> Schedule Pickup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
