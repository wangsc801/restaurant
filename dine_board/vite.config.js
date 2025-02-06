import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5678,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "sockjs-client": "sockjs-client/dist/sockjs.min.js",
    },
  },
});
