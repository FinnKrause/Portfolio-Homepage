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

  // No `X-Powered-By: Next.js` on every response. It tells an attacker which
  // framework and therefore which CVEs to try, and buys nothing.
  poweredByHeader: false,

  images: {
    // Optimize gently: inline images are served at quality 90 (the default 75
    // visibly degraded the photography). Full-screen views (lightbox) bypass
    // the optimizer per-image and show the original file.
    //
    // A quality value used by a component but missing from this list is a
    // *runtime* crash the build does not catch — the page renders empty.
    qualities: [75, 90, 95],
  },

  /**
   * Response hardening. Applied to everything, including /admin — which has no
   * authentication of its own and carries a read/write SQL console, so framing
   * it is the one attack that turns a stray click into arbitrary SQL.
   *
   * Deliberately no Content-Security-Policy here: Next's hydration relies on
   * inline scripts, so a useful CSP needs per-request nonces threaded through
   * the middleware. That is worth doing, but it is a change that fails at
   * runtime rather than at build time, and it should not be bolted on without
   * being exercised against every page first.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // No framing at all; nothing here is meant to be embedded.
          { key: "X-Frame-Options", value: "DENY" },
          // Don't let a browser second-guess a declared Content-Type.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Never leak the path — which includes ?code= — to another origin.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // This site needs none of these; deny them rather than rely on
          // defaults that vary between browsers.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
