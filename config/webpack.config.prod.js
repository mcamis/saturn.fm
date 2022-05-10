const { merge } = require("webpack-merge");

const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const app = require("./helpers/app.js");
const common = require("./webpack.config.common.js");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  output: {
    path: app.dist,
    filename: "js/[name].[chunkhash].js",
    publicPath: "./",
  },

  externals: ["child_process"],

  optimization: {
    minimizer: [new TerserPlugin()],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "initial",
        },
      },
    },
  },
});
