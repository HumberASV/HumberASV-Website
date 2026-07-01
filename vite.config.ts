import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    // react-isometric-engine is consumed via a local symlink and carries its own
    // node_modules/react (a devDependency for its own build). Without deduping, Vite
    // can resolve that second copy for the package's hooks, breaking hook calls since
    // they'd run against a different React instance than the one rendering the tree.
    dedupe: ["react", "react-dom"],
  },
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
