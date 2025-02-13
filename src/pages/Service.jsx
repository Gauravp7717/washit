import { Calendar, Clock, Truck, Sparkles, Shirt, Wind } from "lucide-react";

const Service = () => {
  const services = [
    {
      title: "Dry Cleaning",
      description:
        "Professional dry cleaning for delicate garments and fabrics",
      price: "From $8/item",
      icon: <Sparkles className="w-6 h-6 text-blue-500" />,
      features: ["Suits & Formal Wear", "Delicate Fabrics", "Stain Removal"],
    },
    {
      title: "Wash & Fold",
      description: "Regular laundry service with professional folding",
      price: "From $4/lb",
      icon: <Shirt className="w-6 h-6 text-green-500" />,
      features: ["Wash & Dry", "Expert Folding", "Next-Day Service"],
    },
    {
      title: "Express Service",
      description: "Same-day service for urgent cleaning needs",
      price: "From $12/item",
      icon: <Wind className="w-6 h-6 text-purple-500" />,
      features: ["6-Hour Turnaround", "Priority Handling", "Rush Processing"],
    },
  ];

  const handleSchedulePickup = (serviceTitle) => {
    console.log(`Scheduling pickup for ${serviceTitle}`);
    // Add your scheduling logic here
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Our Laundry Services</h1>
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-500" />
            <span>Free Pickup & Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span>Available 7 Days</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span>24/7 Service</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.title}
            className="flex flex-col bg-white rounded-lg shadow-md border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {service.icon}
                <h2 className="text-xl font-semibold">{service.title}</h2>
              </div>
            </div>

            <div className="p-6 flex-grow flex flex-col">
              <p className="text-gray-600 mb-4">{service.description}</p>
              <p className="text-lg font-semibold mb-4">{service.price}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className="mt-auto w-full bg-blue-500 text-white py-2 px-4 rounded-md 
                          hover:bg-blue-600 transition-colors duration-200 font-medium"
                onClick={() => handleSchedulePickup(service.title)}
              >
                Schedule Pickup
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Service;
