const merge = require('webpack-merge');

const TerserPlugin = require('terser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ManifestPlugin = require('webpack-manifest-plugin');
const app = require('./helpers/app.js');
const common = require('./webpack.config.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: app.dist,
    filename: 'js/[name].[chunkhash].js',
    publicPath: './',
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
              exclude: /gltf/,
              outputPath: 'images/',
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
              outputPath: 'songs/',
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
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'sass-loader', // compiles Sass to CSS
          },
        ],
      },
    ],
  },

  optimization: {
    minimizer: [new TerserPlugin()],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'initial',
        },
      },
    },
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/app[chunkhash].css',
      allChunks: true,
    }),
    new CleanWebpackPlugin(['dist'], {
      root: app.root,
    }),
    new ManifestPlugin({
      fileName: 'webpack-asset-manifest.json',
    }),
  ],
});
