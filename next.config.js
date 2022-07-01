/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  webpack: (config) => {
    config.module.rules.push({
      test: [/\.glsl$/, /\.vs$/, /\.fs$/, /\.vert$/, /\.frag$/],
      use: [
        {
          loader: "raw-loader",
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;
