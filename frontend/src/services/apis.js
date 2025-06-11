const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const endpoints = {
    
    SIGNUP_API: BASE_URL + "/auth/register",
    LOGIN_API: BASE_URL + "/auth/login"
    
  }