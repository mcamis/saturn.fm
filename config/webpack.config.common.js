const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
// const nodeExternals = require('webpack-node-externals');
const app = require("./helpers/app.js");
const env = require("./helpers/env.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: /node_modules/,
        use: [
          { loader: "babel-loader" },
          {
            loader: require.resolve("@linaria/webpack-loader"),
            options: {
              sourceMap: process.env.NODE_ENV !== "production",
            },
          },
          { loader: "ts-loader" },
        ],
      },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(ico|svg|png|jpg|jpeg|gif|ttf|woff|woff2)$/,
        include: app.src,
        type: "asset/resource",
      },
      {
        test: /\.mp3$/,
        include: app.src,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "songs/",
            },
          },
        ],
      },
    ],
  },
  externals: { "react-native-fs": "reactNativeFs", fs: "reactNativeFs" },
  resolve: {
    extensions: [".js", ".tsx", ".ts"],
    symlinks: false,
  },
};
