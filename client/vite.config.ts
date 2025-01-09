import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
const serverUrl = "http://localhost:5000";
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: serverUrl,
        changeOrigin: true,
        secure: false,
      },
      "/socket.io": {
        target: serverUrl,
        changeOrigin: true,
        ws: true,
      },
    },
    cors: true,
  },
});
