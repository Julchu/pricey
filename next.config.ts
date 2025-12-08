import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: { browserDebugInfoInTerminal: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "en.wikipedia.org",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;