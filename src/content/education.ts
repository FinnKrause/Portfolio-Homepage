import type { EducationItem } from "./types";

/** Study + what's next. `upcoming: true` gets a subtle "planned" treatment. */
export const education: EducationItem[] = [
  {
    title: {
      de: "B.Sc. Wirtschaftsinformatik",
      en: "B.Sc. Information Systems",
    },
    org: "FAU Erlangen-Nürnberg",
    period: { de: "seit 2024", en: "since 2024" },
  },
  {
    title: { de: "Auslandssemester", en: "Exchange semester" },
    org: "Kyonggi University (KGU), Suwon · Südkorea",
    period: { de: "Aug. 2026 – Jan. 2027", en: "Aug 2026 – Jan 2027" },
    current: true,
    // description: {
    //   de: "Ein Semester an der Kyonggi University in Suwon.",
    //   en: "A semester at Kyonggi University in Suwon.",
    // },
    gallery: [{ src: "/images/General-Impressions/exchange-semester-image1.jpeg", alt: { de: "Gruppenbild KGU", en: "Group Picture at KGU" } }],
    funding: ["FAU-Reisestipendium", "DAAD-PROMOS-Stipendium"],
  },
  {
    title: { de: "Bachelorarbeit", en: "Bachelor's thesis" },
    org: "FAU Erlangen-Nürnberg",
    period: { de: "geplant Sommer 2027", en: "planned for summer 2027" },
    upcoming: true,
  },
];
