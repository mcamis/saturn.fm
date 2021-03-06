const merge = require("webpack-merge");
const common = require("./webpack.config.common.js");
const app = require("./helpers/app.js");
const webpack = require("webpack");

module.exports = merge(common, {
  mode: "development",
  output: {
    filename: "js/[name].js",
    pathinfo: true,
    publicPath: "/",
  },

  devServer: {
    hot: true,
    host: "0.0.0.0",
    overlay: true,
    port: 3000,
    stats: "minimal",
    historyApiFallback: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin({
      // Options...
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        include: app.src,
        use: ["babel-loader"],
      },
      {
        test: /\.(ico|svg|mp3|png|jpeg|jpg|gif)$/,
        include: app.src,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.(ttf|eot|otf|woff|woff2)$/,
        include: app.src,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.scss$/,
        include: app.src,
        use: [
          {
            loader: "style-loader", // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
          },
          {
            loader: "sass-loader", // compiles Sass to CSS
          },
        ],
      },
    ],
  },
});
