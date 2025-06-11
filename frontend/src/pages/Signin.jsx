import { Facebook } from "lucide-react";
import { checkValidation } from "../utils/Validation";
import { signUp, logIn, adminLogIn } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Signin = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [activeTab, setActiveTab] = useState("user");
  const [name, setName] = useState(""); // Add name state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = checkValidation(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      let response;
      if (activeTab === "user") {
        if (isSignIn) {
          response = await logIn({ email, password });
        } else {
          response = await signUp({ name, email, password }); // Include name in signup
        }
      } else if (activeTab === "admin") {
        response = await adminLogIn({ email, password });
      }

      localStorage.setItem("token", response.data.token);
      setError("");
      navigate("/"); // Redirect to dashboard or home page
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {isSignIn ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-600">
            {isSignIn
              ? "Sign in to your account to continue"
              : "Create a new account to get started"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 border rounded-lg overflow-hidden">
          <button
            className={`flex-1 py-2 ${
              activeTab === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-50 text-gray-700"
            }`}
            onClick={() => setActiveTab("user")}
          >
            User
          </button>
          <button
            className={`flex-1 py-2 ${
              activeTab === "admin"
                ? "bg-blue-500 text-white"
                : "bg-gray-50 text-gray-700"
            }`}
            onClick={() => setActiveTab("admin")}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignIn && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </button>

          {/* Social Login */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => console.log("Google Sign In clicked")}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => console.log("Facebook Sign In clicked")}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Facebook className="w-5 h-5 mr-2" />
              Facebook
            </button>
          </div>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2">
          <button
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            {isSignIn
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
          {isSignIn && (
            <div>
              <button className="text-blue-500 hover:text-blue-600 text-sm">
                Forgot password?
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signin;
