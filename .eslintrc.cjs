/* Basic lint rules to discourage hard-coded palette classes/colors */
module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
  plugins: ['react', 'react-hooks'],
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  settings: { react: { version: 'detect' } },
  rules: {
    'no-restricted-syntax': [
      'warn',
      {
        selector: "Literal[value=/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/]",
        message: 'Avoid raw hex colors. Use CSS tokens (var(--color-...)).',
      },
    ],
    'no-restricted-properties': [
      'warn',
      {
        object: 'className',
        property: null,
        message: 'Prefer token-based styles over hard-coded Tailwind color utilities in className.',
      },
    ],
  },
};