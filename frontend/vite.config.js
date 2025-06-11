import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Backend server URL
        changeOrigin: true, // Helps with CORS issues
        secure: false, // Avoids issues with HTTPS
        rewrite: (path) => path.replace(/^\/api/, ""), // Removes "/api" prefix if needed
      },
    },
  },
});
