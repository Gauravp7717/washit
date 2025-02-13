import { useState } from "react";
import { Waves, Search, ShoppingCart, User, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [activeNav, setActiveNav] = useState("home");

  const mainNavLinks = [
    { id: "#home", label: "Home" },
    { id: "service", label: "Service" },
    { id: "#pricing", label: "Pricing" },
    { id: "#locations", label: "Locations" },
    { id: "#about", label: "About Us" },
    { id: "#contact", label: "Contact" },
    { id: "#faq", label: "FAQ" },
  ];

  return (
    <div className=" bg-gray-50">
      {/* Main Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Waves className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800">Washit</span>
            </div>

            {/* Main Nav Links */}
            <div className="hidden lg:flex items-center space-x-8">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.id}
                  to={`/${link.id}`}
                  className={`text-gray-600 hover:text-blue-600 transition-colors ${
                    activeNav === link.id ? "text-blue-600 font-semibold" : ""
                  }`}
                  onClick={() => setActiveNav(link.id)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-6">
              <button className="text-gray-600 hover:text-blue-600">
                <Search className="w-6 h-6" />
              </button>
              <button className="text-gray-600 hover:text-blue-600">
                <Heart className="w-6 h-6" />
              </button>
              <button className="text-gray-600 hover:text-blue-600 relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </button>
              <Link to={"/signin"}>
                <button className="text-gray-600 hover:text-blue-600">
                  <User className="w-6 h-6" />
                </button>
              </Link>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Schedule Pickup
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
