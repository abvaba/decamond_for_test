import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['randomuser.me'], // Add your external domains here
    // Alternatively, you can use remotePatterns for more control:
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/api/portraits/**',
      },
      // Add more patterns as needed
    ],
  },
};

export default nextConfig;
