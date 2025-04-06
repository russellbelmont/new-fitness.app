/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      // Warning: This allows production builds to succeed even if ESLint fails
      ignoreDuringBuilds: true,
    },
    reactStrictMode: true,
  }
  
  module.exports = nextConfig