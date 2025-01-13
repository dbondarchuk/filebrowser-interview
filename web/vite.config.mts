import { defineConfig } from 'vitest/config';
import tailwindcss from "tailwindcss";
import react from "@vitejs/plugin-react-swc";


const config = defineConfig({
  clearScreen: false,
  server: {
    fs: {
      allow: ['.'],
    },
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  test: {
    include: ['src/**/*.test.ts(x)'],
    environment: 'jsdom',
    setupFiles: [
      'vitest.setup.ts',
    ],
  },
  plugins: [
    react(),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()]
    }
  }
});

export { config as default };
