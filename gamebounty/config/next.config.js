module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: `https://${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/:path*`,
        },
      ];
    },
  };
  