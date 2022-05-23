const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const withLinariaRules = (config) => {
  // Override storybook's default tsx loader to work with linaria
  const tsxRule = config.module.rules.findIndex((rule) => {
    console.log(typeof rule, rule);

    return rule.test && rule.test == "/.(mjs|tsx?|jsx?)$/";
  });

  config.module.rules[tsxRule] = {
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
  };

  config.module.rules.push({
    test: /\.(sa|sc|c)ss$/,
    use: [
      MiniCssExtractPlugin.loader,
      "css-loader",
      "postcss-loader",
      "sass-loader",
    ],
  });

  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: "linaria.css",
    })
  );

  return config;
};
module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: ["../src/**/*.stories.mdx", "../src/**/*.story.tsx"],
  addons: [
    "@storybook/preset-scss",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
  ],

  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Fix jsmedia tags react-native-fs issue
    config.externals = {
      "react-native-fs": "reactNativeFs",
      fs: "reactNativeFs",
    };

    // Return the altered config
    return withLinariaRules(config);
  },
};
