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
        // Vite 8 bundles with Rolldown, which dropped Rollup's object form of
        // `manualChunks` (package-name -> chunk) in favour of `codeSplitting.groups`.
        // `test` matches against resolved module ids, not package names, so each
        // pattern anchors on the `node_modules/<pkg>/` segment: under pnpm an id looks
        // like `.../node_modules/.pnpm/react-dom@19.2.8_react@19.2.8/node_modules/react-dom/...`,
        // and a bare substring like /react/ would swallow most of the dependency tree.
        // The trailing separator keeps `react` from also capturing `react-dom` and
        // `react-redux`. Groups are mutually exclusive here, so priority is left at 0.
        codeSplitting: {
          groups: [
            {
              name: "vendor-react",
              test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
            },
            {
              name: "vendor-redux",
              test: /[\\/]node_modules[\\/](@reduxjs[\\/]toolkit|react-redux|redux|redux-thunk|immer|reselect)[\\/]/,
            },
            {
              name: "vendor-mui",
              test: /[\\/]node_modules[\\/](@mui|@emotion)[\\/]/,
            },
            {
              name: "vendor-motion",
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            },
          ],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "@mui/material", "framer-motion"],
  },
});
