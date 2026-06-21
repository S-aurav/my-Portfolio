import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
