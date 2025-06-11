import { useState } from "react";
import { Waves, Search, ShoppingCart, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useSelector, useDispatch } from "react-redux";
import { clearToken } from "../slices/authSlice";

const Navbar = () => {
  const [activeNav, setActiveNav] = useState("home");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { cartItems } = useCart();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const isLoggedIn = Boolean(token);
  const user = useSelector((state) => state.auth.user) || {
    name: "User",
    email: "user@example.com",
  };

  // Stable avatar generation using robust API with consistent hashing
  const getStableAvatar = () => {
    // Create a simple hash from the user's name/email for consistency
    const seed = user.email ? user.email : user.name;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Using a premium-looking avatar service with consistent output
    return `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4&radius=50`;
  };

  const userAvatar = getStableAvatar();

  const handleLogout = () => {
    dispatch(clearToken());
    setDropdownOpen(false);
    navigate("/login");
  };

  const mainNavLinks = [
    { id: "", label: "Home" },
    { id: "service", label: "Service" },
    { id: "pricing", label: "Pricing" },
    { id: "my-orders", label: "My Orders" },
    { id: "location", label: "Locations" },
    { id: "about", label: "About Us" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <div className="bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Waves className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800">Washit</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.id}
                  to={`/${link.id}`}
                  className={`text-gray-600 hover:text-blue-600 transition-colors cursor-pointer ${
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

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="text-gray-600 hover:text-blue-600 relative cursor-pointer"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* Conditional: User Profile Dropdown or Signup */}
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center justify-center rounded-full border-2 border-transparent hover:border-blue-200 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                      <img 
                        src={userAvatar} 
                        alt={user.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.parentElement.classList.remove('bg-gray-100');
                          e.target.parentElement.classList.add('bg-blue-100');
                          e.target.replaceWith(
                            <User className="w-4 h-4 text-blue-600" />
                          );
                        }}
                      />
                    </div>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg py-2 z-50 border border-gray-100">
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                          <img 
                            src={userAvatar} 
                            alt={user.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.parentElement.classList.remove('bg-gray-100');
                              e.target.parentElement.classList.add('bg-blue-100');
                              e.target.replaceWith(
                                <User className="w-5 h-5 text-blue-600" />
                              );
                            }}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 truncate max-w-[160px]">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-[160px]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> 
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/signup">
                  <button className="text-gray-600 hover:text-blue-600 cursor-pointer">
                    <User className="w-6 h-6" />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;