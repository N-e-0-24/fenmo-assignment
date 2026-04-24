/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy API requests to the backend. In production, set BACKEND_URL
  // to your deployed API origin (for example, https://your-api.onrender.com).
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
