import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ESLint is optional for this project; don't block builds on it.
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.formula1.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
