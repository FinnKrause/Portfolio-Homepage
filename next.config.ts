import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ESLint is optional for this project; don't block builds on it.
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Serve the original files untouched. The optimizer's re-encoding visibly
    // degraded the photography, and the site sits behind the access gate, so
    // bandwidth-optimised variants matter less than fidelity here. next/image
    // still lazy-loads below-the-fold images.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "media.formula1.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
