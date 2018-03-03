const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const app = require('./helpers/app.js');
const env = require('./helpers/env.js');
const webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-source-map',
  // Separate vendor packages for more aggressive caching
  entry: {
    vendor: [
      'babel-polyfill',
      'prop-types',
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-dom',
      'react-router-redux',
      'redux',
      'redux-logger',
      'redux-devtools-extension',
      'redux-promise-middleware',
      'whatwg-fetch',
    ],
    app: app.indexJs,
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: app.htmlTemplate,
      favicon: app.favicon,
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
    new CopyWebpackPlugin([
      {
        from: app.public,
        to: app.dist,
        ignore: ['.**'],
      },
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env.NODE_ENV),
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: app.src,
        use: ['babel-loader'],
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    symlinks: false,
  },
};
