/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://collectflow-api-xgur.onrender.com';
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiUrl}/api/v1/:path*`,
      },
      {
        source: '/api/((?!verification).*)',
        destination: `${apiUrl}/api/v1/:1`,
      },
    ];
  },
};

module.exports = nextConfig;
