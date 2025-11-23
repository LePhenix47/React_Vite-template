import { defineConfig } from "vite";
import path from "path";
import autoprefixer from "autoprefixer";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  plugins: [TanStackRouterVite(), react(), tsconfigPaths()],
  envPrefix: ["VITE_"],
  server: {
    port: 5173, // Change the port to your preferred one
    host: "0.0.0.0", // Allows access to your local IP address
    open: true, // Optional: Opens the browser automatically
  },
  base: mode === 'production' ? "/React_Vite-template/" : "/",
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    minify: "terser",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
}));
