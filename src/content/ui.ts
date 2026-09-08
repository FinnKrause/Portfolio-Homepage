import type { Localized } from "./types";

/** Navigation + generic UI microcopy. */
export const nav: { id: string; label: Localized }[] = [
  { id: "about", label: { de: "Über mich", en: "About" } },
  { id: "projects", label: { de: "Projekte", en: "Projects" } },
  { id: "championship", label: { de: "F1-Reise", en: "F1 journey" } },
  { id: "engagement", label: { de: "Engagement", en: "Involvement" } },
  { id: "experience", label: { de: "Werdegang", en: "Experience" } },
  { id: "contact", label: { de: "Kontakt", en: "Contact" } },
];

/**
 * Every section a code can point at, in page order.
 *
 * `top` is the hero, which has no nav entry but is a real anchor — it is the
 * "no particular section" choice, and what a code with no section set behaves
 * like anyway.
 *
 * This is the allowlist for the `to` URL parameter. A QR code is a printed
 * artefact that outlives the page it points at, so the id in it is validated
 * against this list on the way in rather than trusted: rename a section and the
 * old cards degrade to landing on the homepage instead of scrolling nowhere.
 */
export const SECTION_IDS = ["top", ...nav.map((n) => n.id)] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export function isKnownSection(value: unknown): value is SectionId {
  return typeof value === "string" && (SECTION_IDS as readonly string[]).includes(value);
}

/** Section ids paired with their nav label, for the admin picker. */
export const sectionOptions: { id: string; label: Localized }[] = [
  { id: "top", label: { de: "Seitenanfang", en: "Top of the page" } },
  ...nav,
];

export const ui = {
  skipToContent: { de: "Zum Inhalt springen", en: "Skip to content" },
  sourceCode: { de: "Quellcode", en: "Source" },
  liveDemo: { de: "Live-Demo", en: "Live demo" },
  allProjects: { de: "Alle Projekte auf GitHub", en: "All projects on GitHub" },
  featured: { de: "Ausgewählte Arbeit", en: "Featured work" },
  moreProjects: { de: "Weitere Projekte", en: "More projects" },
  backToTop: { de: "Nach oben", en: "Back to top" },
} satisfies Record<string, Localized>;
