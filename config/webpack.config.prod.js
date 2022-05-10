const { merge } = require("webpack-merge");

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

  externals: { "react-native-fs": "reactNativeFs", fs: "reactNativeFs" },
});
