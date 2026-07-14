import type { ExperienceItem } from "./types";

/**
 * Split into `work` (professional) and `voluntary` by `kind`.
 * Each item can be extended later with `more` (extra paragraphs),
 * `gallery` (images/placeholders) and `link` (a related URL).
 */
export const experience: ExperienceItem[] = [
  // ---------- Professional ----------
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

  // ---------- Voluntary ----------
  {
    role: {
      de: "Arbeitskreisleitung & Hochschulpolitik",
      en: "Working-group lead & student politics",
    },
    org: "FSI WiSo · FAU Erlangen-Nürnberg",
    location: "Erlangen-Nürnberg",
    period: { de: "seit November 2024", en: "since November 2024" },
    kind: "voluntary",
    current: true,
    description: {
      de: "Leitung der Arbeitskreise „Website“ und „WiWi-Meisterschaften“ — inklusive Planung und Durchführung einer Festivalbühne für mehrere hundert Gäste gleichzeitig. Bei den Hochschulwahlen trat ich auf der FSI-WiSo-Liste für die Studierendenvertretung an und erreichte den 4. Platz.",
      en: "Leading the “Website” and “WiWi-Meisterschaften” working groups — including planning and running a festival stage for several hundred guests at once. In the student elections I ran on the FSI WiSo list for the student representation and came 4th.",
    },
  },
  {
    role: {
      de: "Schüler- & Jahrgangsstufensprecher",
      en: "Student & year representative",
    },
    org: "Marie-Therese-Gymnasium",
    location: "Erlangen",
    period: { de: "2022 – 2024", en: "2022 – 2024" },
    kind: "voluntary",
    description: {
      de: "Gewählter Vertreter der Schülerschaft in Gremien von Schule und Stadt. Leitung mehrerer AGs (Theatertechnik, Fotografie & Film) und Arbeitskreise (u. a. „Schule ohne Rassismus“). Zum Abschluss durfte ich die Abiballrede halten.",
      en: "Elected representative of the student body in school and city committees. Led several clubs (stage tech, photography & film) and working groups (incl. “School without Racism”). At graduation I gave the school-leaving ceremony speech.",
    },
    link: {
      label: { de: "Abiballrede ansehen", en: "Watch the graduation speech" },
      href: "https://www.youtube.com/watch?v=6jGw9T6-SdU",
    },
  },
];

export const workExperience = experience.filter((e) => e.kind === "work");
export const voluntaryExperience = experience.filter(
  (e) => e.kind === "voluntary",
);
