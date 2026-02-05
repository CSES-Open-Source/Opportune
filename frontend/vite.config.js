import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-quill": ["quill"],
          "vendor-react": ["react", "react-dom"],
          "vendor-recharts": ["recharts"],
          "vendor-icons": ["react-icons"],
          "vendor-firebase": ["firebase/app", "firebase/auth"],
        },
      },
    },
  },
});
