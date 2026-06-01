import { resolve } from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist-builder",
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(process.cwd(), "builder/index.html"),
    },
  },
});
