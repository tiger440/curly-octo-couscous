import react from '@vitejs/plugin-react';
import path from "path";
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
export default defineConfig({
  // build: {
  //   minify: false // Disable minification for development or debugging
  // },

  plugins: [
    react(),
    checker({
      typescript: true, // Enable type checking for TypeScript files
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"', // Run ESLint for code linting
      },
      overlay: {
        initialIsOpen: false, // Hide the linter overlay by default
      },
    }),
  ],
  optimizeDeps: {
    exclude: ["js-big-decimal"], // Exclude a specific library from optimization
  },
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'), // Resolve `~` alias to node_modules
      },
      // {
      //   find: /\.(woff|woff2)$/,
      //   replacement: path.join(process.cwd(),'public/$1'),
      // },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'), // Resolve `src` alias to the src directory
      },
    ],
  },
});
