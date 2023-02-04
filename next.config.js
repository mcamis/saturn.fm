/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            name: '[name]-[hash].[ext]',
          },
        },
      ],
    });

    return config
  },
  reactStrictMode: false,

}

