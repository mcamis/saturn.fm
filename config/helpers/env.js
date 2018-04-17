/**
 * Path information about the project for use in the webpack config files.
 */

let {
  env: { NODE_ENV },
} = process;

switch (process.env.MODE) {
  case 'staging':
    NODE_ENV = NODE_ENV || 'development';
    break;
  case 'release':
    NODE_ENV = NODE_ENV || 'production';
    break;
  case 'test':
    NODE_ENV = NODE_ENV || 'test';
    break;
  default:
    NODE_ENV = NODE_ENV || 'development';
}

module.exports = {
  HONEYBADGER_API_KEY_JS: process.env.HONEYBADGER_API_KEY_JS,
  NODE_ENV,
  RAILS_API_URL: process.env.RAILS_API_URL,
  GA_KEY: process.env.GA_KEY,
};
