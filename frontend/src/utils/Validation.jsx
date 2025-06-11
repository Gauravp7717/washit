export const checkValidation = (email, password) => {
  if (!email || !password) {
    return "Email and password are required.";
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return "Invalid email address.";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  return null;
};
