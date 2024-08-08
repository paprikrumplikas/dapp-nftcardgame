module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { 
    ecmaVersion: 'latest', 
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // Ensure JSX syntax is supported
    },
  },
  settings: { 
    react: { version: '18.2' } 
  },
  plugins: [
    'react-refresh',
  ],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/no-unknown-property': 'error', // Add this rule to catch unknown properties like 'scr'
    'no-unused-vars': 'warn', // Adjust as needed (this was already catching some issues)
    'react/jsx-no-undef': 'error', // Ensure no undefined elements are used
  },
}
