import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    assetsDir: "assets",
    sourcemap: false,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
});
