/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
}

module.exports = nextConfig