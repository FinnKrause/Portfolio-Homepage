import type { Localized, LinkItem, MediaSlide } from "./types";

/**
 * Everything Finn did *alongside* school & paid work. Each item can carry
 * extra detail paragraphs, links and photos.
 */

export interface EngagementItem {
  id: string;
  title: Localized;
  org?: string;
  periodLabel: Localized;
  description: Localized;
  more?: Localized[];
  links?: LinkItem[];
  gallery?: MediaSlide[];
}

export const engagement: EngagementItem[] = [
  {
    id: "schuelersprecher",
    title: {
      de: "Schüler- & Jahrgangsstufensprecher",
      en: "Student & year representative",
    },
    org: "Marie-Therese-Gymnasium · Erlangen",
    periodLabel: { de: "2022 – 2024", en: "2022 – 2024" },
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
    gallery: [
      {
        kind: "image",
        src: "/images/General-Impressions/finn-rede-image1.jpeg",
        alt: {
          de: "Finn bei einer Rede vor der Schülerschaft.",
          en: "Finn giving a speech to the student body.",
        },
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
    description: {
      de: "2. Platz im bundesweiten Geschichtswettbewerb (2022), danach bis 2024 Mitglied der Jury — Bewertung eingereichter Projekte und Austausch mit Politikerinnen und Politikern in Berlin.",
      en: "2nd place in the national history competition (2022), then a member of the jury until 2024 — reviewing submitted projects and exchanging with politicians in Berlin.",
    },
    links: [
      {
        label: { de: "Zu den Wettbewerben", en: "To the awards section" },
        href: "#awards",
      },
    ],
    // gallery: [
    //   {
    //     kind: "image",
    //     src: "/images/Competitions/Umbruchszeiten/umbruchszeiten-image1.png",
    //     alt: {
    //       de: "Bei der Preisverleihung in Berlin.",
    //       en: "At the award ceremony in Berlin.",
    //     },
    //   },
    //   {
    //     kind: "image",
    //     src: "/images/Competitions/Umbruchszeiten/umbruchszeiten-image2.jpeg",
    //     alt: {
    //       de: "Bei der Preisverleihung in Berlin.",
    //       en: "At the award ceremony in Berlin.",
    //     },
    //   },
    //   {
    //     kind: "image",
    //     src: "/images/Competitions/Umbruchszeiten/umbruchszeiten-judge-image2.png",
    //     alt: {
    //       de: "Finn als Jurymitglied im Interview.",
    //       en: "Finn being interviewed as a juror.",
    //     },
    //   },
    // ],
  },
  {
    id: "f1",
    title: { de: "F1 in Schools", en: "F1 in Schools" },
    org: "Recoil Racing",
    periodLabel: { de: "Sep. 2022 – Sep. 2023", en: "Sep 2022 – Sep 2023" },
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
    id: "mun",
    title: { de: "Model United Nations", en: "Model United Nations" },
    org: "Lycée Jeanne d'Arc · Nancy, Frankreich",
    periodLabel: { de: "März 2024", en: "March 2024" },
    description: {
      de: "Teilnahme als Delegierter an einer zweitägigen UN-Sitzungssimulation mit Debatten, Resolutionen und einem Eindruck wie Diplomatie funktioniert.",
      en: "Took part as a delegate in a two-day UN simulation with numerous debates, resolutions and a first impression of how diplomacy works.",
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
    description: {
      de: "Leitung der Arbeitskreise „Website“ und „WiWi-Meisterschaften“ (inkl. Festivalbühne für mehrere hundert Gäste). Bei den Hochschulwahlen auf der FSI-WiSo-Liste für die Studierendenvertretung als 4. Platz angetreten.",
      en: "Leading the “Website” and “WiWi-Meisterschaften” working groups (incl. a festival stage for several hundred guests). Ran on the FSI WiSo list for the student representation in the elections as 4th place.",
    },
  },
];
