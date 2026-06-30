import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react":  ["react", "react-dom", "react-router-dom"],
          "vendor-redux":  ["@reduxjs/toolkit", "react-redux"],
          "vendor-mui":    ["@mui/material", "@mui/icons-material", "@emotion/react", "@emotion/styled"],
          "vendor-motion": ["framer-motion"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "@mui/material", "framer-motion"],
  },
});
