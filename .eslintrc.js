const path = require("path");

module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: ["airbnb", "prettier", "plugin:import/typescript"],
  rules: {
    camelcase: 0,
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "react/destructuring-assignment": 0,
    "react/jsx-one-expression-per-line": 0,
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["to", "hrefLeft", "hrefRight"],
        aspects: ["noHref", "invalidHref", "preferButton"],
      },
    ],
    "import/prefer-default-export": 0,
    "import/extensions": 0,
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
};
