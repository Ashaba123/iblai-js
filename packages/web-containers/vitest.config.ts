import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setupTests.ts'],
  },
  resolve: {
    alias: {
      '@web-containers': path.resolve(__dirname, './src'),
      '@iblai/data-layer': path.resolve(__dirname, '../data-layer/src'),
      '@iblai/web-utils': path.resolve(__dirname, '../web-utils/src'),
    },
  },
});
