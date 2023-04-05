/// <reference types="vitest" />
import { defineConfig } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
  cacheDir: "../../node_modules/.vite/server",

  server: {
    port: 3001,
    host: "localhost",
  },

  preview: {
    port: 3001,
    host: "localhost",
  },

  plugins: [
    viteTsConfigPaths({
      root: "../../",
    }),
    ...VitePluginNode({
      adapter: 'express',

      appPath: './src/index.ts',

      exportName: 'app',

      tsCompiler: 'esbuild'
    })
  ],

  test: {
    globals: true,
    cache: {
      dir: "../../node_modules/.vitest",
    },
    environment: "node",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
});
