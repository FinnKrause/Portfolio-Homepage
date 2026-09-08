/**
 * Colours that appear in inline styles.
 *
 * Everything else on the site is a Tailwind token from globals.css. These three
 * are the exception because the F1 chapter paints them through `style={{}}` —
 * SVG strokes, gradients and glows Tailwind has no class for. They were
 * previously copy-pasted as raw hex into four components, where `RECOIL` had
 * come to mean two different greens depending on the file. One definition,
 * matching the `--recoil` / `--recoil-bright` / `--f1-red` custom properties
 * that `.f1-world` already declares.
 */

/** Recoil Racing's own green. Dark — for solid fills, never for type. */
export const RECOIL = "#097b41";

/** The lifted green. Readable on dark, so type, rules and glows use this one. */
export const RECOIL_BRIGHT = "#19d982";

export const F1_RED = "#e10600";
