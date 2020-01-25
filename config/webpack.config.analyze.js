const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const merge = require("webpack-merge");
const prod = require("./webpack.config.prod.js");

module.exports = merge(prod, {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerHost: "0.0.0.0",
      analyzerPort: 7777,
    }),
  ],
});
