import type { Localized } from "./types";

/** Navigation + generic UI microcopy. */
export const nav: { id: string; label: Localized }[] = [
  { id: "about", label: { de: "Über mich", en: "About" } },
  { id: "championship", label: { de: "Weltmeister", en: "World Champion" } },
  { id: "projects", label: { de: "Projekte", en: "Projects" } },
  { id: "experience", label: { de: "Werdegang", en: "Experience" } },
  { id: "awards", label: { de: "Auszeichnungen", en: "Awards" } },
  { id: "contact", label: { de: "Kontakt", en: "Contact" } },
];

export const ui = {
  skipToContent: { de: "Zum Inhalt springen", en: "Skip to content" },
  langLabel: { de: "Sprache", en: "Language" },
  menu: { de: "Menü", en: "Menu" },
  close: { de: "Schließen", en: "Close" },
  viewProject: { de: "Ansehen", en: "View" },
  sourceCode: { de: "Quellcode", en: "Source" },
  liveDemo: { de: "Live-Demo", en: "Live demo" },
  allProjects: { de: "Alle Projekte auf GitHub", en: "All projects on GitHub" },
  featured: { de: "Ausgewählte Arbeit", en: "Featured work" },
  moreProjects: { de: "Weitere Projekte", en: "More projects" },
  present: { de: "heute", en: "present" },
  readArticle: { de: "Offizieller F1-Artikel", en: "Official F1 article" },
  teamSite: { de: "Team Recoil Racing", en: "Team Recoil Racing" },
  writeEmail: { de: "E-Mail schreiben", en: "Write an email" },
  backToTop: { de: "Nach oben", en: "Back to top" },
} satisfies Record<string, Localized>;
