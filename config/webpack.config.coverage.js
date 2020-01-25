const merge = require("webpack-merge");
const test = require("./webpack.config.test.js");

module.exports = merge(
  {
    module: {
      rules: [
        {
          test: /\.js$|\.jsx$/,
          use: {
            loader: "istanbul-instrumenter-loader",
            options: { esModules: true },
          },
          enforce: "post",
          exclude: /node_modules|\.spec\.js$/,
        },
      ],
    },
  },
  test
);
