import type { Localized, LinkItem, MediaSlide } from "./types";

/**
 * Everything Finn did *alongside* school & paid work — shown on a shared time
 * axis so overlapping activities are visible at a glance. Each item can expand
 * for detail, links and photos.
 * `start`/`end` are decimal years (e.g. 2024.2 ≈ March 2024) used only to size
 * the overlap bar; `periodLabel` is what humans read.
 */

export type EngagementCategory =
  | "competition"
  | "history"
  | "school"
  | "international"
  | "university";

export interface EngagementItem {
  id: string;
  title: Localized;
  org?: string;
  location?: string;
  periodLabel: Localized;
  start: number;
  end: number;
  ongoing?: boolean;
  category: EngagementCategory;
  description: Localized;
  more?: Localized[];
  links?: LinkItem[];
  gallery?: MediaSlide[];
}

export const engagementAxis = { start: 2022, end: 2027 };

export const categoryColor: Record<EngagementCategory, string> = {
  competition: "#f59e0b", // amber
  history: "#8b5cf6", // violet
  school: "#0ea5e9", // sky
  international: "#10b981", // emerald
  university: "#2645e6", // brand
};

export const categoryLabel: Record<EngagementCategory, Localized> = {
  competition: { de: "Wettbewerb", en: "Competition" },
  history: { de: "Geschichte & Jury", en: "History & jury" },
  school: { de: "Schule", en: "School" },
  international: { de: "International", en: "International" },
  university: { de: "Hochschule", en: "University" },
};

export const engagement: EngagementItem[] = [
  {
    id: "f1",
    title: { de: "F1 in Schools", en: "F1 in Schools" },
    org: "Recoil Racing",
    periodLabel: { de: "Sep. 2022 – Sep. 2023", en: "Sep 2022 – Sep 2023" },
    start: 2022.7,
    end: 2023.7,
    category: "competition",
    description: {
      de: "Aufbau eines eigenen Teams samt Unternehmen — bis zum Weltmeistertitel in Singapur. Die ganze Reise (inkl. 2025 als Coach in Frankreich und Besuch des Thai-HQ) gibt es in der eigenen Sektion.",
      en: "Building our own team and company — all the way to the world title in Singapore. The full journey (incl. coaching in France in 2025 and visiting the Thai HQ) has its own section.",
    },
    links: [
      {
        label: { de: "Zur F1-Reise", en: "See the F1 journey" },
        href: "#championship",
      },
    ],
  },
  {
    id: "umbruchszeiten",
    title: {
      de: "„Umbruchszeiten“ — Teilnehmer & Jury",
      en: "“Umbruchszeiten” — participant & juror",
    },
    org: "Bundesstiftung für Aufarbeitung · Berlin",
    periodLabel: { de: "2022 – 2024", en: "2022 – 2024" },
    start: 2022.4,
    end: 2024.5,
    category: "history",
    description: {
      de: "2. Platz im bundesweiten Geschichtswettbewerb (2022), danach bis 2024 Mitglied der Jury — Bewertung eingereichter Projekte und Austausch mit Politikerinnen und Politikern in Berlin.",
      en: "2nd place in the national history competition (2022), then a member of the jury until 2024 — reviewing submitted projects and exchanging with politicians in Berlin.",
    },
    links: [
      {
        label: {
          de: "Preisverleihung ansehen",
          en: "Watch the award ceremony",
        },
        href: "https://www.youtube.com/watch?v=Vp_2SyLA4fY&t=2340s",
      },
    ],
    gallery: [
      { kind: "image", src: "/images/umbruchszeiten-judge-image2.png" },
      { kind: "image", src: "/images/umbruchszeiten-image1.png" },
    ],
  },
  {
    id: "schuelersprecher",
    title: {
      de: "Schüler- & Jahrgangsstufensprecher",
      en: "Student & year representative",
    },
    org: "Marie-Therese-Gymnasium · Erlangen",
    periodLabel: { de: "2022 – 2024", en: "2022 – 2024" },
    start: 2022.6,
    end: 2024.55,
    category: "school",
    description: {
      de: "Gewählter Vertreter der Schülerschaft in Gremien von Schule und Stadt. Leitung mehrerer AGs und AKs (Theatertechnik, Fotografie & Film, etc.)",
      en: "Elected representative of the student body in school and city committees. Led several clubs (stage tech, photography & film, etc.)",
    },
    links: [
      {
        label: { de: "Abiballrede ansehen", en: "Watch the graduation speech" },
        href: "https://www.youtube.com/watch?v=6jGw9T6-SdU",
      },
    ],
  },
  {
    id: "mun",
    title: { de: "Model United Nations", en: "Model United Nations" },
    org: "Lycée Jeanne d'Arc · Nancy, Frankreich",
    periodLabel: { de: "März 2024", en: "March 2024" },
    start: 2024.2,
    end: 2024.28,
    category: "international",
    description: {
      de: "Teilnahme als Delegierter an einer zweitägigen UN-Sitzungssimulation — Debatte, Resolutionen und ein Eindruck wie Diplomatie funktioniert.",
      en: "Took part as a delegate in a two-day UN simulation — debate, resolutions and a first impression of how diplomacy works.",
    },
  },
  {
    id: "austausch",
    title: {
      de: "Deutsch-französischer Austausch",
      en: "German-French exchange",
    },
    org: "Lycée Jeanne d'Arc · Nancy, Frankreich",
    periodLabel: { de: "März 2024", en: "March 2024" },
    start: 2024.2,
    end: 2024.28,
    category: "international",
    description: {
      de: "Freiwilliger einwöchiger Austausch während der Abiturphase, um die Sprachkompetenz zu erweitern und in den Schulalltag einzutauchen.",
      en: "A voluntary one-week exchange during my final school year to grow my language skills and dive into everyday school life.",
    },
  },
  {
    id: "fsi",
    title: {
      de: "FSI WiSo — AK-Leitung & Hochschulpolitik",
      en: "FSI WiSo — working groups & student politics",
    },
    org: "FAU Erlangen-Nürnberg",
    periodLabel: { de: "seit Nov. 2024", en: "since Nov 2024" },
    start: 2024.85,
    end: engagementAxis.end,
    ongoing: true,
    category: "university",
    description: {
      de: "Leitung der Arbeitskreise „Website“ und „WiWi-Meisterschaften“ (inkl. Festivalbühne für mehrere hundert Gäste). Bei den Hochschulwahlen auf der FSI-WiSo-Liste für die Studierendenvertretung angetreten — 4. Platz.",
      en: "Leading the “Website” and “WiWi-Meisterschaften” working groups (incl. a festival stage for several hundred guests). Ran on the FSI WiSo list for the student representation in the elections — 4th place.",
    },
  },
];
