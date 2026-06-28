import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.100", "192.168.0.100:3000"],
  images: {
    remotePatterns: [
      {
        // Cloudinary CDN — used when storage.provider=cloudinary
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        // Local backend uploads — used when storage.provider=local
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        // Proxy all /api/** requests to the Spring Boot backend
        // In dev: http://localhost:8080
        // In prod: Render backend service URL (set via API_BASE_URL env var)
        source: "/api/:path*",
        destination: `${process.env.API_BASE_URL || "http://localhost:8080"}/api/:path*`,
      },
      {
        // Proxy local uploads to the backend server
        source: "/uploads/:path*",
        destination: `${process.env.API_BASE_URL || "http://localhost:8080"}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
