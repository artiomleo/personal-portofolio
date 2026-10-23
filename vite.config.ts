import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ isSsrBuild }) => ({
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
    // The server build only feeds the prerender script; public/ is copied once by the client build.
    copyPublicDir: !isSsrBuild,
  },
  ssr: {
    noExternal: ["lucide-react"],
  },
}));
