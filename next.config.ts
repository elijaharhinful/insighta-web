import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const nextConfig: NextConfig = {
  async rewrites() {
    if (!apiUrl) {
      console.warn("Warning: NEXT_PUBLIC_API_URL is not defined.");
    }

    return [
      {
        source: "/api/proxy/:path*",
        destination: `${apiUrl || "http://localhost:3000"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
