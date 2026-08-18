/* ESLint 8 config for the marketing site.
 *
 * `npm run lint` previously failed outright — the eslint/@typescript-eslint/
 * react-hooks/react-refresh devDependencies were all declared but no config
 * file existed anywhere in the tree, so nothing in src/ had ever been linted.
 *
 * `mock-app/` is a separate tracked sub-project with its own package.json and
 * no config of its own; without ignoring it, ESLint walks into it and aborts
 * with "couldn't find a configuration file" before linting anything here.
 */
module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: [
    'dist',
    'build',
    'output',
    'node_modules',
    'mock-app',
    'public',
    '.eslintrc.cjs',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint', 'react-refresh'],
  rules: {
    // Advisory only. The files that trip this (BrandLogo, DocArticle,
    // RcaReportMock, main) export helpers and data alongside their component
    // and are imported that way from a dozen call sites; splitting them is a
    // refactor in its own right, not a lint fix. Left visible as a warning
    // rather than switched off so the debt stays on the record.
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    // TypeScript already reports genuinely unused bindings via noUnusedLocals /
    // noUnusedParameters, and it understands type-only usage that the base rule
    // does not. Keep the TS-aware version and allow the `_foo` opt-out.
    //
    // `ignoreRestSiblings` matters for the react-markdown overrides in
    // BlogPostDetailPage: `({ node, ...props }) => …` destructures `node`
    // precisely to keep it *out* of `props`. That is the omit idiom, not an
    // unused variable.
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],

    // Off deliberately: the 29 hits are pre-existing `any`s concentrated in
    // the analytics/gtag typings, where the honest fix is real type work on
    // third-party globals rather than local suppressions. Turning this on
    // today would only mean 29 inline disables. Worth a dedicated pass.
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
