
// import { useState } from "react"

// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
// import { useDispatch } from "react-redux"
// import { useNavigate } from "react-router-dom"

// // import { sendOtp } from "../../../services/operations/authAPI"
// import { setSignupData } from "../slices/authSlice"

// function SignupForm() {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "user",
//   })

//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [errors, setErrors] = useState({})

//   const { username, email, password, confirmPassword, role } = formData

//   const validateName = (name) => /^[a-zA-Z]+$/.test(name)
//   const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email)
//   const validatePassword = (password) =>
//     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)

//   const handleOnChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }))
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }))
//     }
//   }

//   const validateForm = () => {
//     const newErrors = {}

//     if (!username.trim()) {
//       newErrors.username = "Last name is required"
//     } else if (!validateName(username)) {
//       newErrors.username = "Last name should contain only letters"
//     }

//     if (!email.trim()) {
//       newErrors.email = "Email is required"
//     } else if (!validateEmail(email)) {
//       newErrors.email = "Please enter a valid Gmail address"
//     }

//     if (!password) {
//       newErrors.password = "Password is required"
//     } else if (!validatePassword(password)) {
//       newErrors.password =
//         "Password must be at least 8 characters with uppercase, lowercase, and number"
//     }

//     if (!confirmPassword) {
//       newErrors.confirmPassword = "Please confirm your password"
//     } else if (password !== confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match"
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleOnSubmit = (e) => {
//     e.preventDefault()

//     if (!validateForm()) {
//       return
//     }

//     const signupData = { ...formData }

//     dispatch(setSignupData(signupData))
//     dispatch(sendOtp(formData.email, navigate))

//     setFormData({
//       username: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       role: "user",
//     })
//   }

//   return (
//     <div>
//       <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
//         <div className="flex gap-x-4">
//           <label className="w-full">
//             <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
//               Username <sup className="text-pink-200">*</sup>
//             </p>
//             <input
//               required
//               type="text"
//               name="username"
//               value={username}
//               onChange={handleOnChange}
//               placeholder="Enter first name"
//               style={{
//                 boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
//               }}
//               className={`w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 outline-none ${
//                 errors.username ? "border border-pink-500" : ""
//               }`}
//             />
//             {errors.username && (
//               <p className="mt-1 text-xs text-pink-500">{errors.username}</p>
//             )}
//           </label>
//         </div>

//         <label className="w-full">
//           <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
//             Email Address <sup className="text-pink-200">*</sup>
//           </p>
//           <input
//             required
//             type="email"
//             name="email"
//             value={email}
//             onChange={handleOnChange}
//             placeholder="Enter Gmail address"
//             style={{
//               boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
//             }}
//             className={`w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 outline-none ${
//               errors.email ? "border border-pink-500" : ""
//             }`}
//           />
//           {errors.email && (
//             <p className="mt-1 text-xs text-pink-500">{errors.email}</p>
//           )}
//         </label>

       
//         <div className="flex gap-x-4">
//           <label className="relative w-full">
//             <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
//               Create Password <sup className="text-pink-200">*</sup>
//             </p>
//             <input
//               required
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={password}
//               onChange={handleOnChange}
//               placeholder="Enter Password (min 8 chars with uppercase, lowercase, number)"
//               style={{
//                 boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
//               }}
//               className={`w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5 outline-none ${
//                 errors.password ? "border border-pink-500" : ""
//               }`}
//             />
//             <span
//               onClick={() => setShowPassword((prev) => !prev)}
//               className="absolute right-3 top-[38px] z-[10] cursor-pointer"
//             >
//               {showPassword ? (
//                 <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
//               ) : (
//                 <AiOutlineEye fontSize={24} fill="#AFB2BF" />
//               )}
//             </span>
//             {errors.password && (
//               <p className="mt-1 text-xs text-pink-500">{errors.password}</p>
//             )}
//           </label>

//           <label className="relative w-full">
//             <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
//               Confirm Password <sup className="text-pink-200">*</sup>
//             </p>
//             <input
//               required
//               type={showConfirmPassword ? "text" : "password"}
//               name="confirmPassword"
//               value={confirmPassword}
//               onChange={handleOnChange}
//               placeholder="Confirm Password"
//               style={{
//                 boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
//               }}
//               className={`w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5 outline-none ${
//                 errors.confirmPassword ? "border border-pink-500" : ""
//               }`}
//             />
//             <span
//               onClick={() => setShowConfirmPassword((prev) => !prev)}
//               className="absolute right-3 top-[38px] z-[10] cursor-pointer"
//             >
//               {showConfirmPassword ? (
//                 <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
//               ) : (
//                 <AiOutlineEye fontSize={24} fill="#AFB2BF" />
//               )}
//             </span>
//             {errors.confirmPassword && (
//               <p className="mt-1 text-xs text-pink-500">
//                 {errors.confirmPassword}
//               </p>
//             )}
//           </label>
//         </div>

//         <button
//           type="submit"
//           className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900 hover:bg-yellow-100 transition-colors duration-200"
//         >
//           Create Account
//         </button>
//       </form>
//     </div>
//   )
// }

// export default SignupForm

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import {signUp} from "../services/operations/authapi"


import { setSignupData } from "../slices/authSlice";
// import { sendOtp } from "../services/operations/authAPI";

function SignupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const { username, email, password, confirmPassword, role } = formData;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic inline validation
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    dispatch(signUp(role, username, email, password, confirmPassword, navigate));

    // Send OTP to user for verification
    
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-600">
            Create a new account to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleOnChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleOnChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="name@example.com"
              required
            />
          </div>

         

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              placeholder="Enter password"
              required
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              placeholder="Re-enter password"
              required
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] cursor-pointer"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </span>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Sign Up
          </button>

         
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:text-blue-600 text-sm cursor-pointer"
            >
              Already have an account? Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupForm;
