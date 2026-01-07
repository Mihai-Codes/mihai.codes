import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import qwikPlugin from 'eslint-plugin-qwik';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      qwik: qwikPlugin,
    },
    rules: {
      ...qwikPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js'],
  }
);
