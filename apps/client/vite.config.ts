/// <reference types="vitest" />
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

export default defineConfig({
  cacheDir: "../../node_modules/.vite/client",

  server: {
    port: 3000,
    host: "127.0.0.1",
    cors: true
  },

  preview: {
    port: 3000,
    host: "127.0.0.1",
    cors: true,
  },

  plugins: [
    react(),
    viteTsConfigPaths({
      root: "../../",
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: '../../',
  //    }),
  //  ],
  // },

  test: {
    globals: true,
    cache: {
      dir: "../../node_modules/.vitest",
    },
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
});
