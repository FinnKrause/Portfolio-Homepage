/**
 * Plain JavaScript on purpose — do not rename this back to `next.config.ts`.
 *
 * `next start` loads this file at runtime, and when it is TypeScript it needs
 * the `typescript` package to read it. In a production image that package has
 * been pruned away, so Next tries to *npm install it at boot*: the container
 * hangs on a network fetch instead of serving, and the failure looks like the
 * app being broken rather than a config problem. JSDoc gives the same editor
 * completion without putting a compiler on the runtime path.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // ESLint is optional for this project; don't block builds on it.
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Optimize gently: inline images are served at quality 90 (the default 75
    // visibly degraded the photography). Full-screen views (lightbox) bypass
    // the optimizer per-image and show the original file.
    //
    // A quality value used by a component but missing from this list is a
    // *runtime* crash the build does not catch — the page renders empty.
    qualities: [75, 90, 95],
  },
};

export default nextConfig;
