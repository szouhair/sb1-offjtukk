/** @type {import('next').NextConfig} */
//const nextConfig = {
//  output: 'export',
//  eslint: {
//    ignoreDuringBuilds: true,
//  },
//  images: { unoptimized: true },
//};

//module.exports = nextConfig;

const nodeExternals = require('webpack-node-externals');

const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  ...nextConfig,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = [nodeExternals()];
    }

    return config;
  },
};