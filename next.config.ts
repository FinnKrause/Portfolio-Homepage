import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ESLint is optional for this project; don't block builds on it.
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Optimize gently: inline images are served at quality 90 (the default 75
    // visibly degraded the photography). Full-screen views (lightbox) bypass
    // the optimizer per-image and show the original file.
    qualities: [75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "media.formula1.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
