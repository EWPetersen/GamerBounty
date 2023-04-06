const withCSS = require('@zeit/next-css');

module.exports = withCSS({
  webpack(config, options) {
    config.module.rules.push({
      test: /\.less$/,
      use: [
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true,
          },
        },
      ],
    });

    return config;
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `https://${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/:path*`,
      },
    ];
  },
});