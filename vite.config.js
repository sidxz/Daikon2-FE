import react from "@vitejs/plugin-react";
import sass from "sass";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
      },
    },
  },
  server: {
    port: 3000,
    // Same shape as the container: /api/... goes to the gateway without the /api prefix
    proxy: {
      "/api": {
        target: process.env.DAIKON_API_UPSTREAM ?? "http://localhost:8010",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  optimizeDeps: {
    include: ["@rdkit/rdkit"],
    esbuildOptions: {
      target: "es2020", // Ensure esbuild is set to handle WASM properly
    },
  },
  build: {
    rollupOptions: {
      output: {
        format: "es", // Use ES module format for the output
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
});
