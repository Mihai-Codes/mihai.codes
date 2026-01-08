import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'server'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/**/*.d.ts',
        'src/entry.*.tsx',
        'src/root.tsx',
      ],
      thresholds: {
        // Lower thresholds since Qwik component testing needs special setup
        // Utility functions (sanitize.ts, posts.ts) have 100% coverage
        // TODO: Add @builder.io/qwik-testing for component tests
        global: {
          branches: 0,
          functions: 10,
          lines: 10,
          statements: 10,
        },
      },
    },
  },
});
