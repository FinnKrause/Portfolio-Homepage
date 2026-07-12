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
      de: "Alleinige lichttechnische Betreuung von Club-Veranstaltungen — Programmierung, Bedienung und Wartung der Lichtanlage.",
      en: "Sole lighting supervision for club events — programming, operating and maintaining the lighting rig.",
    },
  },
  {
    role: { de: "IT-Manager & IT-Sicherheit", en: "IT Manager & IT Security" },
    org: "Marie-Therese-Gymnasium",
    location: "Erlangen",
    period: { de: "2019 – 2024", en: "2019 – 2024" },
    kind: "work",
    description: {
      de: "Betreuung der schulischen IT-Infrastruktur. Zusätzlich prüfte ich Schulsysteme auf Schwachstellen und meldete diese verantwortungsvoll an den städtischen Dienstleister — für meine Funde wurde ich mehrfach von der Schulleitung ausgezeichnet.",
      en: "Maintaining the school's IT infrastructure. On top of that I probed school systems for vulnerabilities and disclosed them responsibly to the city's IT provider — repeatedly recognised by the school's leadership for my findings.",
    },
  },
  {
    role: { de: "Servicekraft im Altenheim", en: "Care-home service staff" },
    org: "Wohnstift Rathsberg",
    location: "Erlangen",
    period: { de: "Sep. 2022 – Juli 2024", en: "Sep 2022 – Jul 2024" },
    kind: "work",
    description: {
      de: "Unterstützung der Bewohner bei alltäglichen Aufgaben und in der Essensausgabe — eine Herzensangelegenheit, da meine Großeltern dort leben.",
      en: "Supporting residents with everyday tasks and meal service — a role close to my heart, as my grandparents live there.",
    },
  },

  // ---------- Voluntary ----------
  {
    role: {
      de: "2. Vorsitzender „Q-Zirkel“ & Arbeitskreisleitung",
      en: "Vice Chair “Q-Zirkel” & working-group lead",
    },
    org: "FSI WiSo · FAU Erlangen-Nürnberg",
    location: "Erlangen-Nürnberg",
    period: { de: "Nov. 2024 – 2025", en: "Nov 2024 – 2025" },
    kind: "voluntary",
    description: {
      de: "Finanzielle Koordination von Tutorien-Geldern sowie Leitung der Arbeitskreise „Website“ und „WiWi-Meisterschaften“ — inklusive Planung und Durchführung einer Festivalbühne für mehrere hundert Gäste gleichzeitig.",
      en: "Financial coordination of tutoring funds and leadership of the “Website” and “WiWi-Meisterschaften” working groups — including planning and running a festival stage for several hundred guests at once.",
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
export const voluntaryExperience = experience.filter((e) => e.kind === "voluntary");
