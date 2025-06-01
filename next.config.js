/** @type {import('next').NextConfig} */
//const nextConfig = {
//  output: 'export',
//  eslint: {
//    ignoreDuringBuilds: true,
//  },
//  images: { unoptimized: true },
//};

//module.exports = nextConfig;

const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  ...nextConfig,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals.push({ bufferutil: "bufferutil", "utf-8-validate": "utf-8-validate", "supports-color": "supports-color" }); 
    }

    return config;
  },
};