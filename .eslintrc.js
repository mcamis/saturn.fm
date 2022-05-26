module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "prettier",
  ],
  parserOptions: {
    sourceType: "module",
    allowImportExportEverywhere: true,
    project: ["tsconfig.json"],
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ["react", "@typescript-eslint", "prettier", "import"],
  rules: {
    camelcase: 0,
    "react/destructuring-assignment": 0,
    "react/jsx-one-expression-per-line": 0,
    "import/prefer-default-export": 0,
    "import/extensions": 0,
    "@typescript-eslint/no-use-before-define": "off",
    "prettier/prettier": "error",
    "@typescript-eslint/lines-between-class-members": "off",
    "react/prop-types": "off",
    "no-unused-vars": "off", // Eslint has trouble TS stuff like enums
    "@typescript-eslint/no-unused-vars": "error"
  
  },
  globals: {
    after: true,
    afterEach: true,
    before: true,
    beforeEach: true,
    context: true,
    describe: true,
    expect: true,
    it: true,
  },
  settings: {
    react: {
      version: '18.1.0',
    },
  },
};
