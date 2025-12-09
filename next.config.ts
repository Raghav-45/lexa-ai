import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'agents-storage.nyc3.digitaloceanspaces.com',
      },
    ],
  },
};

export default nextConfig;
