import { useState, useEffect, useCallback } from "react"; // Added useEffect, useCallback
import { 
  Waves, 
  Search, 
  ShoppingCart, 
  User, 
  LogOut, 
  Home,
  Settings,
  Package,
  DollarSign,
  MapPin,
  Info,
  HelpCircle,
  Menu,
  X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useDispatch } from "react-redux"; // Only useDispatch needed here
import { clearToken } from "../slices/authSlice";

// New hook to manage authentication state for the Navbar
const useAuthForNavbar = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to load auth data from localStorage
  const loadAuthData = useCallback(() => {
    try {
      const userInfoString = localStorage.getItem('user'); // Get the 'user' key
      if (userInfoString) {
        const parsedUserInfo = JSON.parse(userInfoString);
        // Basic validation: ensure it has at least a token or a user identifier
        if (parsedUserInfo.token || parsedUserInfo._id) { // Check for token or _id
          setUser(parsedUserInfo);
          setToken(parsedUserInfo.token);
          setIsLoggedIn(true);
        } else {
          // Parsed but incomplete data
          setUser(null);
          setToken(null);
          setIsLoggedIn(false);
        }
      } else {
        // No 'user' item in localStorage
        setUser(null);
        setToken(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage for Navbar:", error);
      setUser(null);
      setToken(null);
      setIsLoggedIn(false);
    }
  }, []); // useCallback ensures this function is stable

  useEffect(() => {
    // Load data initially
    loadAuthData();

    // Add a storage event listener to react to changes in other tabs/windows
    const handleStorageChange = (event) => {
      if (event.key === 'user') { // Listen specifically for 'user' key changes
        loadAuthData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadAuthData]); // Dependency on loadAuthData

  return { user, token, isLoggedIn };
};

const Navbar = () => {
  const [activeNav, setActiveNav] = useState("home");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { cartItems } = useCart();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use the new hook for auth state
  const { user, token, isLoggedIn } = useAuthForNavbar();

  // Handle case where user might be null initially or after logout
  const displayUser = user || {
    name: "Guest", // Default name for unauthenticated users
    email: "guest@example.com", // Default email
  };

  // Stable avatar generation using robust API with consistent hashing
  const getStableAvatar = () => {
    const seed = displayUser.email ? displayUser.email : displayUser.name;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4&radius=50`;
  };

  const userAvatar = getStableAvatar();

  const handleLogout = () => {
    // Clear Redux state
    dispatch(clearToken());
    // Clear localStorage (this will also be picked up by useAuthForNavbar via storage event)
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Also clear the separate token key if it exists
    localStorage.removeItem('userId'); // And the separate userId key
    
    setDropdownOpen(false);
    navigate("/login");
  };

  const mainNavLinks = [
    { id: "", label: "Home", icon: Home },
    { id: "service", label: "Service", icon: Settings },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "my-orders", label: "My Orders", icon: Package },
    { id: "location", label: "Locations", icon: MapPin },
    { id: "about", label: "About Us", icon: Info },
    { id: "faq", label: "FAQ", icon: HelpCircle },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50/30">
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-xl">
                  <Waves className="h-7 w-7 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Washit
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {mainNavLinks.map((link) => {
                const IconComponent = link.icon;
                const isActive = activeNav === link.id;
                return (
                  <Link
                    key={link.id}
                    to={`/${link.id}`}
                    className={`relative px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                      isActive 
                        ? "text-blue-600 bg-blue-50 shadow-sm" 
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
                    }`}
                    onClick={() => setActiveNav(link.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className={`w-4 h-4 transition-transform duration-300 ${
                        isActive ? "scale-110" : "group-hover:scale-110"
                      }`} />
                      <span className="font-medium">{link.label}</span>
                    </div>
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              {/* <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group">
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </button> */}

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative flex items-center justify-center w-10 h-10 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-lg animate-pulse">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* Conditional: User Profile Dropdown or Signup */}
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-transparent hover:border-blue-200 hover:shadow-lg focus:outline-none focus:border-blue-400 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 overflow-hidden flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
                      <img 
                        src={userAvatar} 
                        alt={displayUser.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.parentElement.classList.remove('bg-gradient-to-br', 'from-blue-100', 'to-cyan-100');
                          e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-500', 'to-cyan-500');
                          e.target.replaceWith(
                            <User className="w-4 h-4 text-white" />
                          );
                        }}
                      />
                    </div>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-lg shadow-xl rounded-2xl py-2 z-50 border border-white/20 animate-in slide-in-from-top-2 duration-200">
                      {/* <div className="px-5 py-4 border-b border-gray-100/80 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 overflow-hidden flex items-center justify-center shadow-md">
                          <img 
                            src={userAvatar} 
                            alt={displayUser.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.parentElement.classList.remove('bg-gradient-to-br', 'from-blue-100', 'to-cyan-100');
                              e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-500', 'to-cyan-500');
                              e.target.replaceWith(
                                <User className="w-5 h-5 text-white" />
                              );
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {displayUser.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {displayUser.email}
                          </p>
                        </div>
                      </div> */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-3 transition-all duration-200 group"
                      >
                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" /> 
                        <span className="font-medium">Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/signup">
                  <button className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign Up</span>
                  </button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-xl border-t border-white/20 z-40 animate-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-6 space-y-2">
                {mainNavLinks.map((link) => {
                  const IconComponent = link.icon;
                  const isActive = activeNav === link.id;
                  return (
                    <Link
                      key={link.id}
                      to={`/${link.id}`}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? "text-blue-600 bg-blue-50 shadow-sm" 
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                      onClick={() => {
                        setActiveNav(link.id);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;