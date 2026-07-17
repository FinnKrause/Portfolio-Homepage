import type { ExperienceItem } from "./types";

/**
 * Professional roles. Each item can be extended with `more` (extra paragraphs),
 * `gallery` (images/placeholders) and `link` (a related URL). Voluntary work
 * lives in the Involvement section (`content/engagement.ts`).
 */
export const experience: ExperienceItem[] = [
  {
    role: { de: "Social Media Manager", en: "Social Media Manager" },
    org: "Hempels Burger",
    location: "Erlangen",
    period: { de: "seit Mai 2025", en: "since May 2025" },
    kind: "work",
    current: true,
    description: {
      de: "Verantwortung für alle Marketingmaßnahmen inklusive Videoproduktion, Fotobearbeitung und professioneller Videonachbearbeitung.",
      en: "Responsible for all marketing activities including video production, photo editing and professional video post-production.",
    },
  },
  {
    role: { de: "Lichttechniker", en: "Lighting technician" },
    org: "Die Box Club",
    location: "Nürnberg",
    period: { de: "Okt. 2025 – 2026", en: "Oct 2025 – 2026" },
    kind: "work",
    description: {
      de: "Lichttechnische Betreuung von Club-Veranstaltungen",
      en: "Lighting supervision and control for club events",
    },
  },
  {
    role: { de: "Servicekraft im Altenheim", en: "Care-home service staff" },
    org: "Wohnstift Rathsberg",
    location: "Erlangen",
    period: { de: "Sep. 2022 – Juli 2024", en: "Sep 2022 – Jul 2024" },
    kind: "work",
    description: {
      de: "Unterstützung der Bewohner bei alltäglichen Aufgaben und in der Essensausgabe — eine Herzensangelegenheit, da meine Großeltern dort lebten.",
      en: "Supporting residents with everyday tasks and meal service — a role close to my heart, as my grandparents used to live there.",
    },
  },
  {
    role: { de: "Zeitungsausträger", en: "Newspaper delivery" },
    org: "Direktwerbung Franken",
    location: "Erlangen",
    period: { de: "Jun. 2019 – Nov. 2022", en: "Jun 2019 – Nov 2022" },
    kind: "work",
    description: {
      de: "Wöchentliche Austragung von Zeitungen in der Nachbarschaft und Umgebung.",
      en: "Weekly delivery of newspapers to the local neighbourhood.",
    },
  },
];

export const workExperience = experience.filter((e) => e.kind === "work");
