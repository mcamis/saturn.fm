const { merge } = require("webpack-merge");
const common = require("./webpack.config.common.js");
const app = require("./helpers/app.js");

module.exports = merge(common, {
  mode: "development",
  stats: { errorDetails: true },

  output: {
    filename: "js/[name].js",
    pathinfo: true,
    publicPath: "/",
  },

  devServer: {
    hot: true,
    host: "0.0.0.0",
    port: 3000,
    historyApiFallback: true,
  },

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
    ],
  },
});
