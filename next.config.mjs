/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Remove eslint config from here - it's now handled by .eslintrc or eslint.config.js
};

export default nextConfig;
