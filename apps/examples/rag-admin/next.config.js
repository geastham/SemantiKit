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
}

module.exports = nextConfig

