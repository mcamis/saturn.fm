const nodeExternals = require('webpack-node-externals');
const app = require('./helpers/app.js');

module.exports = {
  target: 'node', // webpack should compile node compatible code
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [app.test, app.src],
        use: ['babel-loader'],
      },
      {
        test: /\.(ico|svg|png|jpg|gif)$/,
        include: [app.test, app.src],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
};
