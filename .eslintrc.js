const path = require('path');

module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: ['airbnb', 'prettier'],
  rules: {
    camelcase: 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'no-unused-expressions': 0,
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to', 'hrefLeft', 'hrefRight'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: [path.resolve(__dirname, 'src')],
      },
    },
  },
  plugins: ['chai-friendly'],
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
