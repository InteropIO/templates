import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    port: 4242,
    host: "localhost",
  },
  build: {
    commonjsOptions: {
      include: [/@interopio\/components-react/, /node_modules/],
    },
  },
});
