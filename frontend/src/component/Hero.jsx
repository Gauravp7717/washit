// import React from "react";
import {
  Shirt,
  Sparkles,
  Timer,
  Truck,
  ArrowRight,
  Percent,
} from "lucide-react";

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
      image:
        "https://images.pexels.com/photos/3951363/pexels-photo-3951363.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      title: "Business Services",
      icon: <Truck className="w-8 h-8" />,
      description: "Corporate & bulk laundry solutions",
      price: "Custom Quote",
      image:
        "https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Banner Section */}
        <div className="relative bg-blue-600 text-white rounded-xl p-8 mb-16 shadow-lg text-center">
          <div className="flex items-center justify-center mb-4">
            <Percent className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-bold mb-2">Limited Time Offer!</h2>
          <p className="text-lg mb-4">
            Get 20% off on all laundry services. Book now!
          </p>
          <button className="bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition">
            Claim Offer
          </button>
        </div>

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
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-transform transform hover:scale-105 duration-300 relative group"
            >
              {/* Image Section */}
              <div className="relative overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm shadow-lg">
                  {service.price}
                </div>
              </div>

              {/* Service Details */}
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg shadow-md transition-transform duration-300 group-hover:rotate-12">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold ml-3">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>

                {/* CTA Button */}
                <button className="w-full bg-gray-50 text-blue-600 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg">
                  Learn More{" "}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" />
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
