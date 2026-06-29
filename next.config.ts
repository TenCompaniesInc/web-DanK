import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.67", "192.168.1.65", "localhost"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "tailus.io" },
      { protocol: "https", hostname: "assets.rapidui.dev" },
    ],
  },
};

export default nextConfig;
