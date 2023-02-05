module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["next", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "prettier"],
  rules: {},
};
