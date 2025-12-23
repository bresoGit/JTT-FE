import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ["jtt-fe.onrender.com"],
    host: true, // same as 0.0.0.0
    port: 4173, // optional; Render will still use $PORT if you pass it in command
  },
});
