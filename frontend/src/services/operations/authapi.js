import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../slices/authSlice"
// import { resetCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../apis"

const {
  
  SIGNUP_API,
  LOGIN_API
  
} = endpoints

// ================ send Otp ================


// ================ sign Up ================
export function signUp(role, username, email, password, confirmPassword,  navigate) {
  return async (dispatch) => {

    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        role,
        username,
        
        email,
        password,
        confirmPassword,
       
      })

      // console.log("SIGNUP API RESPONSE --> ", response);
      if (!response.data.success) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      toast.success("Signup Successful");
      navigate("/login");
    } catch (error) {
      console.log("SIGNUP API ERROR --> ", error);
      // toast.error(error.response.data.message);
      
      // navigate("/signup")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}


// ================ Login ================
export function login(email, password, navigate) {
  return async (dispatch) => {

    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

      console.log("LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Login Successful")
      dispatch(setToken(response.data.token)) // This sets the token in your Redux/toolkit store

      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`

      dispatch(setUser({ ...response.data.user, image: userImage }));

      // FIX: Store the token string directly without JSON.stringify()
      localStorage.setItem("token", response.data?.token); // Corrected line

      // Keep JSON.stringify for the user object as it's an object
      localStorage.setItem("user", JSON.stringify({ ...response.data.user, image: userImage }));

      // Also store userId separately as it's needed in Cart.js
      if (response.data.user?._id) {
        localStorage.setItem("userId", response.data.user._id);
      }

      navigate("/");
    } catch (error) {
      console.log("LOGIN API ERROR.......", error)
      toast.error(error.response?.data?.message)
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}


// ================ get Password Reset Token ================
// export function getPasswordResetToken(email, setEmailSent) {
//   return async (dispatch) => {

//     const toastId = toast.loading("Loading...")
//     dispatch(setLoading(true))
//     try {
//       const response = await apiConnector("POST", RESETPASSTOKEN_API, {
//         email,
//       })

//       console.log("RESET PASS TOKEN RESPONSE............", response)

//       if (!response.data.success) {
//         throw new Error(response.data.message)
//       }

//       toast.success("Reset Email Sent")
//       setEmailSent(true)
//     } catch (error) {
//       console.log("RESET PASS TOKEN ERROR............", error)
//       toast.error(error.response?.data?.message)
//       // toast.error("Failed To Send Reset Email")
//     }
//     toast.dismiss(toastId)
//     dispatch(setLoading(false))
//   }
// }


// // ================ reset Password ================
// export function resetPassword(password, confirmPassword, token, navigate) {
//   return async (dispatch) => {
//     const toastId = toast.loading("Loading...")
//     dispatch(setLoading(true))

//     try {
//       const response = await apiConnector("POST", RESETPASSWORD_API, {
//         password,
//         confirmPassword,
//         token,
//       })

//       console.log("RESETPASSWORD RESPONSE............", response)

//       if (!response.data.success) {
//         throw new Error(response.data.message)
//       }

//       toast.success("Password Reset Successfully")
//       navigate("/login")
//     } catch (error) {
//       console.log("RESETPASSWORD ERROR............", error)
//       toast.error(error.response?.data?.message)
//       // toast.error("Failed To Reset Password");
//     }
//     toast.dismiss(toastId)
//     dispatch(setLoading(false))
//   }
// }


// // ================ Logout ================
export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    // dispatch(resetCart()) // This is commented out in your code, needs to be uncommented or implemented
    localStorage.removeItem("token")
    localStorage.removeItem("user") // This line should remove the 'user' entry
    localStorage.removeItem("userId") // ADDED: If you store userId separately
    toast.success("Logged Out")
    navigate("/")
  }
}
// export const fetchAllUsers = async (token) => {
//   let result = []
//   try {
//     const response = await apiConnector(
//       "GET",
//       GET_ALL_USERS_API,
//       null,
//       {
//         Authorization: `Bearer ${localStorage.getItem("token")?.replace(/^"|"$/g, "")}`,
//       }
//     )
//     console.log("GET ALL USERS API RESPONSE", response)
//     if (!response?.data?.success) {
//       throw new Error("Could Not Fetch Users")
//     }
//     result = response?.data?.data
//   } catch (error) {
//     console.log("GET ALL USERS API ERROR............", error)
//   }
//   return result
// }
