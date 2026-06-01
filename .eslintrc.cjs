module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', 'node_modules', '.playwright-mcp', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/prop-types': 'off',
    // Operator-console aesthetic uses literal "//" as decorative text in JSX.
    'react/jsx-no-comment-textnodes': 'off',
    // Apostrophes in prose copy are intentional and readable as-is.
    'react/no-unescaped-entities': 'off',
    // Worker SSE read loops are intentional infinite loops.
    'no-constant-condition': ['error', { checkLoops: false }],
  },
  overrides: [
    {
      // Node build scripts + config run outside the browser
      files: ['scripts/**', 'vite.config.js', '*.cjs'],
      env: { node: true, browser: false },
    },
    {
      // Cloudflare Worker runtime globals (Response, addEventListener, caches, ...)
      files: ['workers/**'],
      env: { worker: true, serviceworker: true, browser: true, node: true },
    },
    {
      // Shared lib modules legitimately export helpers alongside components;
      // fast-refresh boundaries don't apply here.
      files: ['src/lib/**'],
      rules: { 'react-refresh/only-export-components': 'off' },
    },
  ],
}
