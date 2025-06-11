import {
  Package,
  Truck,
  Workflow,
  Send,
  Clock,
  Droplets,
  Award,
  Shield,
} from "lucide-react";

const AboutUs = () => {
  const processSteps = [
    {
      icon: <Package className="w-12 h-12 text-blue-500" />,
      title: "Order",
      description: "Schedule your pickup through our easy-to-use platform",
    },
    {
      icon: <Truck className="w-12 h-12 text-blue-500" />,
      title: "Pickup",
      description:
        "We collect your laundry from your doorstep at your chosen time",
    },
    {
      icon: <Workflow className="w-12 h-12 text-blue-500" />,
      title: "Washed",
      description:
        "Your clothes are professionally cleaned using eco-friendly methods",
    },
    {
      icon: <Send className="w-12 h-12 text-blue-500" />,
      title: "Deliver",
      description: "Clean, fresh clothes delivered back to your doorstep",
    },
  ];

  const impacts = [
    {
      icon: <Droplets className="w-8 h-8 text-blue-500" />,
      title: "Environmental Impact",
      description:
        "Our bulk washing process saves thousands of gallons of water annually compared to individual washing. We use eco-friendly detergents and energy-efficient machines.",
    },
    {
      icon: <Clock className="w-8 h-8 text-green-500" />,
      title: "Time Saving",
      description:
        "Save up to 5 hours weekly on laundry tasks. Focus on what matters most while we handle your laundry needs with professional care.",
    },
    {
      icon: <Award className="w-8 h-8 text-purple-500" />,
      title: "Quality Service",
      description:
        "Expert handling of different fabrics, stain treatment, and precise folding ensures your clothes receive the best care possible.",
    },
    {
      icon: <Shield className="w-8 h-8 text-indigo-500" />,
      title: "Professional Care",
      description:
        "Our trained staff follows strict protocols for sorting, washing, and handling your garments, ensuring consistent, high-quality results.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">
          Revolutionizing Laundry Care
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're streamlining the laundry process with modern technology and
          eco-friendly practices, making clean clothes more accessible while
          caring for our environment.
        </p>
      </div>

      {/* Process Steps */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Clean Clothes in Four Simple Steps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <div key={step.title} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/4 right-0 transform translate-x-1/2 text-4xl text-gray-300">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Impact Section */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Making a Positive Impact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {impacts.map((impact) => (
            <div
              key={impact.title}
              className="bg-white p-6 rounded-xl shadow-sm flex gap-4"
            >
              <div className="flex-shrink-0">{impact.icon}</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{impact.title}</h3>
                <p className="text-gray-600">{impact.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Statement */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          To provide convenient, eco-friendly, and professional laundry services
          that give our customers more time for what matters most while
          minimizing environmental impact through sustainable practices and
          efficient operations.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
