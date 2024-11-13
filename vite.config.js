import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  base: "./",
  plugins: [vue()],
  root: path.join(__dirname, "ui"),
  build: {
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, "ui/popup.html"),
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
    outDir: path.join(__dirname, "dist"),
    emptyOutDir: true,
  },
});
