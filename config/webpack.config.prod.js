const webpack = require('webpack');

const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');
const app = require('./helpers/app.js');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = merge(common, {
  devtool: 'source-map',
  output: {
    path: app.dist,
    filename: 'js/[name].[chunkhash].js',
    publicPath: '.',
  },

  externals: ['child_process'],

  module: {
    rules: [
      {
        test: /\.js$/,
        include: app.src,
        use: ['babel-loader'],
      },
      {
        test: /\.(ico|svg|png|jpg|gif)$/,
        include: app.src,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '/images/',
            },
          },
        ],
      },
      {
        test: /\.mp3$/,
        include: app.src,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '/songs/',
            },
          },
        ],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        include: app.src,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          publicPath: '../',
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'sass-loader',
            },
          ],
        }),
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'styles/app[chunkhash].css',
      allChunks: true,
    }),
    new CleanWebpackPlugin(['dist'], {
      root: app.root,
    }),
    new ManifestPlugin({
      fileName: 'webpack-asset-manifest.json',
    }),
    new UglifyJSPlugin({
      sourceMap: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
    }),
  ],
});
