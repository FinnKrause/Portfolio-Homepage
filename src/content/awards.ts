import type { Award } from "./types";

/**
 * The `emphasis` award (Umbruchszeiten) is showcased large with a gallery.
 * F1 is deliberately kept brief here — it links back to its own section —
 * so this section doesn't repeat the world-championship story.
 */
export const awards: Award[] = [
  {
    title: { de: "„Umbruchszeiten“ — 2. Platz & Jurymitglied", en: "“Umbruchszeiten” — 2nd place & juror" },
    org: "Bundesstiftung für Aufarbeitung · Berlin",
    year: "2022",
    emphasis: true,
    description: {
      de: "2. Platz im bundesweiten Geschichtswettbewerb und anschließende Berufung in die Jury. Seitdem bewerte ich eingereichte Projekte und arbeite mit Politikerinnen und Politikern aus Berlin zusammen — die Preisverleihung fand gemeinsam mit „MrWissen2Go“ statt.",
      en: "2nd place in the national history competition and a subsequent appointment to the jury. Since then I evaluate submitted projects and collaborate with politicians in Berlin — the award ceremony was hosted together with “MrWissen2Go”.",
    },
    // Add real photos later (drop files in /public/images).
    gallery: [
      { kind: "placeholder", label: { de: "Foto folgt", en: "Photo coming soon" }, aspect: "4 / 3" },
      { kind: "placeholder", label: { de: "Foto folgt", en: "Photo coming soon" }, aspect: "4 / 3" },
    ],
  },
  {
    title: { de: "F1 in Schools — Weltmeister", en: "F1 in Schools — World Champion" },
    org: "Aramco F1 in Schools World Finals · Singapur · 2023",
    year: "2023",
    description: {
      de: "Weltmeistertitel mit Team Recoil Racing — ausführlich in der eigenen Sektion.",
      en: "World title with team Recoil Racing — covered in detail in its own section.",
    },
    link: {
      label: { de: "Zur Weltmeister-Sektion", en: "See the World Champion section" },
      href: "#championship",
    },
  },
  {
    title: { de: "„FAUST“ Security Workshop — 2. Platz", en: "“FAUST” Security Workshop — 2nd place" },
    org: "FAU Erlangen-Nürnberg · 2024",
    year: "2024",
    description: {
      de: "2. Platz im uniweiten Capture-the-Flag-Wettbewerb (XSS, SQL-Injection, Command-Injection).",
      en: "2nd place in the university-wide Capture-the-Flag competition (XSS, SQL injection, command injection).",
    },
  },
];

export const emphasisAward = awards.find((a) => a.emphasis);
export const sideAwards = awards.filter((a) => !a.emphasis);
