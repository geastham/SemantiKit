/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    '@semantikit/core',
    '@semantikit/react',
    '@semantikit/layouts',
    '@semantikit/validators'
  ],
  experimental: {
    serverActions: true,
  },
  webpack: (config) => {
    // Handle PDF.js worker
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
}

module.exports = nextConfig

