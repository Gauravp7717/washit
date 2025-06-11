import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Replace with your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// User Authentication
export const signUp = async (userData) => {
  return api.post("/auth/signup", userData);
};

export const logIn = async (userData) => {
  return api.post("/auth/login", userData);
};

export const adminLogIn = async (adminData) => {
  return api.post("/auth/admin/login", adminData);
};

// Add more API calls as needed
