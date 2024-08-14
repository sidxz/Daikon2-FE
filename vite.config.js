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
