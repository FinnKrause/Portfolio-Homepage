/**
 * The three colours the F1 chapter paints through inline `style={{}}` — SVG
 * strokes, telemetry traces and the start-light glow, none of which Tailwind
 * has a class for. Everything else on the site is a token from globals.css.
 *
 * These are design-system values, not brand values. DESIGN.md closes the
 * palette: the primary family, one warm bloom accent and the storm neutrals
 * are the whole vocabulary, and nothing saturated is allowed outside it. So
 * Recoil Racing's green and Formula 1's own red are represented here by the
 * system's equivalents rather than reproduced literally — the bloom coral
 * carries the racing red, and the bright blue carries the second accent on
 * the ink slab, where the deep blue would muddy.
 */

/** The warm accent — the racing red, in the system's own coral. */
export const ACCENT_WARM = "#ff5050"; /* --color-coral */

/** The cool accent on ink. The lifted blue, readable on the dark slab. */
export const ACCENT_COOL = "#296ef9"; /* --color-primary-bright */

/** The deeper warm tone, for fills that sit behind type. */
export const ACCENT_WARM_DEEP = "#b3262b"; /* --color-bloom-deep */
