
import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";


export default defineConfig({
  base: '/cat-swipe/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});