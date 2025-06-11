import {
  Calendar,
  Clock,
  Truck,
  Sparkles,
  Shirt,
  Wind,
  ShoppingBag,
  Gift,
  Layers,
  Box,
} from "lucide-react";

const Service = () => {
  const services = [
    {
      title: "Dry Cleaning",
      description:
        "Professional dry cleaning for delicate garments and fabrics.",
      price: "From ₹80/item",
      icon: <Sparkles className="w-6 h-6 text-blue-500" />,
      image:
        "https://plus.unsplash.com/premium_photo-1682129257696-dfe914806043?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      features: ["Suits & Formal Wear", "Delicate Fabrics", "Stain Removal"],
    },
    {
      title: "Wash & Fold",
      description: "Regular laundry service with professional folding.",
      price: "From ₹200/kg",
      icon: <Shirt className="w-6 h-6 text-green-500" />,
      image:
        "https://as1.ftcdn.net/v2/jpg/04/45/77/66/1000_F_445776622_nc9Czl6P50FvMIJ4s2bjGtuYkdTVTinf.jpg",
      features: ["Wash & Dry", "Expert Folding", "Next-Day Service"],
    },
    {
      title: "Express Service",
      description: "Same-day service for urgent cleaning needs.",
      price: "From ₹120/item",
      icon: <Wind className="w-6 h-6 text-purple-500" />,
      image:
        "https://as1.ftcdn.net/v2/jpg/11/50/59/38/1000_F_1150593859_VIooDrodYa2E0sJF63KQjdzq3AOy2oqM.jpg",
      features: ["6-Hour Turnaround", "Priority Handling", "Rush Processing"],
    },
    {
      title: "Shoe Cleaning",
      description: "Premium shoe cleaning for all types of footwear.",
      price: "From ₹100/pair",
      icon: <ShoppingBag className="w-6 h-6 text-orange-500" />,
      image:
        "https://as2.ftcdn.net/v2/jpg/05/06/36/71/1000_F_506367145_aTN8tLqtKXDYxzHQs5DH4HGsbVT9OgMn.jpg",
      features: ["Sneakers", "Leather Shoes", "Deep Cleaning"],
    },
    {
      title: "Curtains & Blankets",
      description:
        "Professional cleaning for heavy fabrics and household items.",
      price: "From ₹150/item",
      icon: <Layers className="w-6 h-6 text-pink-500" />,
      image:
        "https://as1.ftcdn.net/v2/jpg/01/77/34/06/1000_F_177340650_YyoBi4H1Jtmq2HSTOaiLHmD652pI38JS.jpg",
      features: ["Dust Removal", "Gentle Fabric Care", "Odor Free"],
    },
    {
      title: "Toys & Stuffed Animals",
      description:
        "Safe and hygienic cleaning for kids' toys and stuffed animals.",
      price: "From ₹50/toy",
      icon: <Gift className="w-6 h-6 text-yellow-500" />,
      image:
        "https://as1.ftcdn.net/v2/jpg/10/30/27/20/1000_F_1030272020_ypPGZFn1Y8fMSvrDqoPOib6sj8oNtRsN.jpg",
      features: ["Non-Toxic Cleaning", "Deep Sanitization", "Safe for Kids"],
    },
    {
      title: "Innerwear Cleaning",
      description: "Special care for undergarments and delicate fabrics.",
      price: "From ₹30/item",
      icon: <Box className="w-6 h-6 text-gray-500" />,
      image:
        "https://as2.ftcdn.net/v2/jpg/10/50/06/81/1000_F_1050068173_NWfQPfeIaQZ65gB1a8Wwx6zoOCZPhEH4.jpg",
      features: ["Gentle Wash", "No Shrinkage", "Quick Dry"],
    },
    {
      title: "Monthly Subscription",
      description: "Hassle-free laundry with a monthly subscription plan.",
      price: "From ₹500/month",
      icon: <Calendar className="w-6 h-6 text-blue-500" />,
      image:
        "https://as2.ftcdn.net/v2/jpg/08/61/87/85/1000_F_861878546_zfl9bSjwe06NSEKoGpG3yBpETsVqO9gT.jpg",
      features: ["Unlimited Wash & Fold", "Priority Service", "Free Pickup"],
    },
    {
      title: "Premium Service",
      description: "Exclusive premium laundry service with top-tier care.",
      price: "From ₹200/item",
      icon: <Sparkles className="w-6 h-6 text-gold-500" />,
      image:
        "https://as2.ftcdn.net/v2/jpg/09/69/99/91/1000_F_969999128_PiLOShkbz5A1lma38tMpkTGWLVlZKOKa.jpg",
      features: [
        "Luxury Fabrics",
        "Hand Wash Available",
        "Fragrance Treatment",
      ],
    },
  ];

  const handleSchedulePickup = (serviceTitle) => {
    console.log(`Scheduling pickup for ${serviceTitle}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Our Laundry Services
        </h1>
        <p className="text-gray-600 mb-6">
          Experience top-quality laundry care with our professional services.
        </p>
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
            className="flex flex-col bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl duration-300"
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-40 object-cover"
            />

            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {service.icon}
                <h2 className="text-xl font-semibold text-gray-900">
                  {service.title}
                </h2>
              </div>
            </div>

            <div className="p-6 flex-grow flex flex-col">
              <p className="text-gray-600 mb-4">{service.description}</p>
              <p className="text-lg font-semibold text-blue-600 mb-4">
                {service.price}
              </p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              {/* <button
                className="mt-auto w-full bg-blue-500 text-white py-2 px-4 rounded-md 
                          hover:bg-blue-600 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
                onClick={() => handleSchedulePickup(service.title)}
              >
                Schedule Pickup
              </button>*/}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Service;
