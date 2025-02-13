// import React from "react";
import { Shirt, Sparkles, Timer, Truck, ArrowRight } from "lucide-react";

const Hero = () => {
  const featuredServices = [
    {
      title: "Wash & Fold",
      icon: <Shirt className="w-8 h-8" />,
      description: "Professional washing and folding service",
      price: "From $2.99/lb",
      image:
        "https://images.pexels.com/photos/250288/pexels-photo-250288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      title: "Dry Cleaning",
      icon: <Sparkles className="w-8 h-8" />,
      description: "Expert dry cleaning for delicate items",
      price: "From $5.99/item",
      image:
        "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      title: "Express Service",
      icon: <Timer className="w-8 h-8" />,
      description: "Same-day delivery service",
      price: "From $4.99/lb",
      image: "/api/placeholder/400/300",
    },
    {
      title: "Business Services",
      icon: <Truck className="w-8 h-8" />,
      description: "Corporate & bulk laundry solutions",
      price: "Custom Quote",
      image: "/api/placeholder/400/300",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Premium Laundry & Dry Cleaning Services
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the convenience of professional laundry services with
            free pickup and delivery at your doorstep.
          </p>
        </div>

        {/* Featured Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredServices.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Image Section */}
              <div className="relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  {service.price}
                </div>
              </div>

              {/* Service Details */}
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold ml-3">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>

                {/* CTA Button */}
                <button className="w-full bg-gray-50 text-blue-600 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center">
                  Learn More <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
