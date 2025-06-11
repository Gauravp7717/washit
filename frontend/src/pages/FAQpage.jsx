import {
  ChevronDown,
  Search,
  ShoppingBag,
  DollarSign,
  Truck,
  Shirt,
  Shield,
} from "lucide-react";
import { useState } from "react";

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState("general");
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      id: "general",
      name: "General",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      id: "pricing",
      name: "Pricing",
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      id: "delivery",
      name: "Pickup & Delivery",
      icon: <Truck className="w-5 h-5" />,
    },
    { id: "services", name: "Services", icon: <Shirt className="w-5 h-5" /> },
    { id: "care", name: "Garment Care", icon: <Shield className="w-5 h-5" /> },
  ];

  const faqData = {
    general: [
      {
        question: "How does your laundry service work?",
        answer:
          "Our service is simple: Schedule a pickup through our website or app, we'll collect your laundry, clean it according to your preferences, and deliver it back to you fresh and clean. You can track your order status throughout the process.",
      },
      {
        question: "What areas do you serve?",
        answer:
          "We currently serve all major neighborhoods in the metropolitan area. Enter your zip code on our location page to check if we service your area and see delivery times.",
      },
      {
        question: "How do I create an account?",
        answer:
          "Click the 'Sign Up' button on our homepage, enter your email and create a password. You'll need to verify your email address and add your delivery information to complete the setup.",
      },
    ],
    pricing: [
      {
        question: "How do you calculate pricing?",
        answer:
          "Our pricing is based on weight for regular wash & fold service ($2.50/lb with 10lb minimum) and per piece for dry cleaning. Special items like formal wear may have specific pricing. View our complete pricing guide on the services page.",
      },
      {
        question: "Are there any additional fees?",
        answer:
          "Delivery is free for orders over $30. Rush service (same-day) incurs an additional $10 fee. Special handling for delicate items may have additional charges, which will be clearly communicated before processing.",
      },
      {
        question: "Do you offer any discounts?",
        answer:
          "Yes! We offer a 10% discount for first-time customers, student discounts with valid ID, and weekly subscription plans that can save up to 20% on regular services.",
      },
    ],
    delivery: [
      {
        question: "What are your pickup and delivery hours?",
        answer:
          "We offer pickup and delivery from 7am to 9pm, 7 days a week. You can schedule specific time slots or choose flexible 2-hour windows that work best for you.",
      },
      {
        question: "How do I schedule a pickup?",
        answer:
          "Log into your account, click 'Schedule Pickup', select your preferred date and time slot, add any special instructions, and confirm your order. You'll receive confirmation via email and text.",
      },
      {
        question: "What if I'm not home during delivery?",
        answer:
          "You can specify a safe place for pickup/delivery in your delivery instructions. We also offer contactless service with photo confirmation. Alternative delivery options can be arranged through customer service.",
      },
    ],
    services: [
      {
        question: "What types of laundry services do you offer?",
        answer:
          "We offer wash & fold, dry cleaning, pressing/ironing, stain removal, alterations, and specialized cleaning for delicate items. Each service can be customized to your preferences.",
      },
      {
        question: "How long does the service take?",
        answer:
          "Standard service takes 24-48 hours. Express service is available for same-day or next-day delivery. Specific turnaround times vary by service type and will be confirmed at booking.",
      },
    ],
    care: [
      {
        question: "How do you handle delicate items?",
        answer:
          "Delicate items are individually inspected, cleaned according to care labels, and processed separately using appropriate cleaning methods and temperatures. Special handling instructions can be added to your order.",
      },
      {
        question: "What if something gets damaged?",
        answer:
          "We have comprehensive insurance coverage. In the rare event of damage, contact customer service within 48 hours of delivery. We'll investigate and resolve the issue promptly according to our guarantee policy.",
      },
    ],
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setActiveCategory("all");
  };

  const filteredQuestions = searchQuery
    ? Object.values(faqData)
        .flat()
        .filter(
          (item) =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : faqData[activeCategory];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Find answers to common questions about our laundry services, pricing,
          delivery, and more.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for answers..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id);
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-colors
              ${
                activeCategory === category.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {category.icon}
            {category.name}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {(searchQuery ? filteredQuestions : faqData[activeCategory]).map(
          (item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center"
                onClick={() =>
                  setExpandedQuestion(expandedQuestion === index ? null : index)
                }
              >
                <span className="font-medium">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200
                  ${expandedQuestion === index ? "transform rotate-180" : ""}`}
                />
              </button>

              {expandedQuestion === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* Contact Section */}
      <div className="mt-12 text-center bg-blue-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
        <p className="text-gray-600 mb-6">
          Our customer service team is here to help you with any other questions
          you might have.
        </p>
        <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default FAQPage;
