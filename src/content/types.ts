/**
 * Shared content types.
 *
 * The whole site is data-driven: every piece of copy is a `Localized`
 * string ({ de, en }). To extend the site you only edit the arrays in
 * `src/content/*` — no component changes required.
 */

export type Locale = "de" | "en";

export type Localized = Record<Locale, string>;

export interface LinkItem {
  label: Localized;
  href: string;
}

/**
 * A single visual slide. Used by the project carousel, the championship
 * gallery, and (optionally) experience/award entries.
 * - `image`       → drop a file in /public and reference it here.
 * - `video`       → a YouTube video id or full URL (lazy-loaded facade).
 * - `placeholder` → an empty, labelled frame to fill in later.
 */
export type MediaSlide =
  | { kind: "image"; src: string; alt?: Localized }
  | { kind: "video"; youtube: string; title?: Localized }
  | { kind: "placeholder"; label?: Localized; aspect?: string };

export interface Project {
  slug: string;
  title: string;
  tagline: Localized;
  description: Localized;
  /** Short bullet highlights shown on featured cards. */
  highlights?: Localized[];
  tech: string[];
  repo?: string;
  demo?: string;
  /** Marks the two flagship projects for the featured section. */
  featured?: boolean;
  /** Extra slides shown after the built-in visual in the featured carousel. */
  gallery?: MediaSlide[];
  /** Visual identity for the small grid cards. */
  accent?: "brand" | "sky" | "violet" | "emerald" | "amber";
  year?: string;
}

export type ExperienceKind = "work" | "voluntary";

export interface ExperienceItem {
  role: Localized;
  org: string;
  location?: string;
  period: Localized;
  description: Localized;
  kind: ExperienceKind;
  current?: boolean;
  upcoming?: boolean;
  /** Optional extra paragraphs — extend a position with more text later. */
  more?: Localized[];
  /** Optional images/placeholders — add photos to a position later. */
  gallery?: MediaSlide[];
  /** Optional related link (e.g. a talk or article). */
  link?: LinkItem;
}

export interface EducationItem {
  title: Localized;
  org: string;
  period: Localized;
  description?: Localized;
  upcoming?: boolean;
}

export interface Award {
  title: Localized;
  org: string;
  year: string;
  description: Localized;
  /** The one showcased award (Umbruchszeiten) renders larger with a gallery. */
  emphasis?: boolean;
  link?: LinkItem;
  /** Optional images/placeholders for the award. */
  gallery?: MediaSlide[];
}

export interface SkillGroup {
  title: Localized;
  items: string[];
}

export interface LanguageSkill {
  name: Localized;
  level: Localized;
  /** 1–5 for the little proficiency meter. */
  meter: number;
}
