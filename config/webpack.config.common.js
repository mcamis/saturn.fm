const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webpack = require("webpack");
// const nodeExternals = require('webpack-node-externals');
const app = require("./helpers/app.js");
const env = require("./helpers/env.js");

module.exports = {
  devtool: "cheap-module-source-map",
  // Separate vendor packages for more aggressive caching
  entry: {
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
    new CopyWebpackPlugin({
      patterns: [
        {
          from: app.public,
          to: app.dist,
        },
      ],
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(env.NODE_ENV),
      },
    }),
    new MiniCssExtractPlugin({
      filename: "linaria.css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: app.src,
        use: ["babel-loader"],
      },
      {
        test: /\.(tsx|ts)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: [
          { loader: "babel-loader" },
          {
            loader: "@linaria/webpack-loader",
            options: {
              sourceMap: process.env.NODE_ENV !== "production",
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: process.env.NODE_ENV !== "production",
            },
          },
        ],
      },
    ],
  },

  node: {
    fs: "empty",
  },

  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".ts"],
    symlinks: false,
  },
};
