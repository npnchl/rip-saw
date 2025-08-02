// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background.js'),
      },
      output: {
        entryFileNames: 'background.js',
      },
    },
    minify: false, // Optional: disables minification for easier debugging
  },
});
