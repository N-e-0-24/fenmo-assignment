/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy API requests to the backend to avoid CORS in development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

export default nextConfig;
