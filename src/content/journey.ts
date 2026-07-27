import type { Localized, MediaSlide } from "./types";

/**
 * A single station on the F1 timeline.
 *
 * To add a point, append an object here — nothing else needs touching.
 * Array order is timeline order.
 *
 *   marker   short label on the axis ("Regional", "2023 · Singapur", …)
 *   title    headline of the card
 *   blurb    one or two sentences — always visible on the card
 *   body     optional extra paragraph, also always visible
 *   youtube  optional video id; shows the thumbnail, opens YouTube in a new tab
 *            From https://www.youtube.com/watch?v=IW4Tb8JDNNA → "IW4Tb8JDNNA"
 *   gallery  optional photos, shown as thumbnails on the card
 *   tone     "red" for competition moments, "green" for team moments
 *   highlight  marks a milestone: it gets a label in the zoomed-out overview
 *
 * Video ids below are taken from youtube.com/@recoilracing.
 */
export interface JourneyPoint {
  id: string;
  marker: Localized;
  title: Localized;
  blurb: Localized;
  body?: Localized;
  youtube?: string;
  gallery?: MediaSlide[];
  tone?: "green" | "red";
  highlight?: boolean;
}

export const journey: JourneyPoint[] = [
  {
    id: "windtunnel",
    marker: { de: "Entwicklung", en: "Development" },
    tone: "green",
    title: { de: "Im Windkanal", en: "In the wind tunnel" },
    blurb: {
      de: "Die ersten Tests im Windkanal der TH-Nürnberg",
      en: "First rest in the wind tunnel at TH Nürnberg",
    },
    youtube: "KpGVpgABGqI",
  },
  {
    id: "reaction",
    marker: { de: "Team", en: "Team" },
    tone: "green",
    title: {
      de: "Auswahl des Fahrers",
      en: "The choice of who will 'drive' the car",
    },
    blurb: {
      de: "Reaktionszeit-Tests um den Fahrer des Autos zu ermitteln",
      en: "We conducted tests to find out who has the quickest reaction time",
    },
    youtube: "6DoCXlyAYPE",
  },
  {
    id: "reveal-regional",
    marker: { de: "Regional", en: "Regional" },
    tone: "green",
    title: { de: "Car Reveal: Recoil Raptor", en: "Car reveal: Recoil Raptor" },
    blurb: {
      de: "User erstes Auto",
      en: "Our first car",
    },
    youtube: "M_41LTYSV-s",
  },
  {
    id: "regional",
    highlight: true,
    marker: { de: "Regional", en: "Regional" },
    tone: "red",
    title: { de: "Regionalmeisterschaft Süd", en: "Southern regional finals" },
    blurb: {
      de: "Die erste Meisterschaft und der Einzug in die deutsche Meisterschaft",
      en: "The first competition and the ticket to the German championship",
    },
    youtube: "NSxUUK42Yf4",
  },
  {
    id: "reveal-national",
    marker: { de: "National", en: "National" },
    tone: "green",
    title: {
      de: "Car Reveal: Racing Reptile",
      en: "Car reveal: Racing Reptile",
    },
    blurb: {
      de: "Für die nationale Ebene wurde das Auto komplett neu gedacht.",
      en: "For the national stage the car was rethought from scratch.",
    },
    youtube: "8xdQAl8Dqsw",
  },
  {
    id: "german",
    highlight: true,
    marker: { de: "National", en: "National" },
    tone: "red",
    title: { de: "Deutsche Meisterschaft", en: "German championship" },
    blurb: {
      de: "Deutscher Meister und damit die Qualifikation für die World Finals",
      en: "German champions and with it qualification for the World Finals",
    },
    youtube: "BYCRcr6ljUI",
  },
  {
    id: "reveal-worlds",
    marker: { de: "2023", en: "2023" },
    tone: "green",
    title: {
      de: "Car Reveal für die World Finals",
      en: "Car reveal for the World Finals",
    },
    blurb: {
      de: "Unser bestes Werk",
      en: "Our best work",
    },
    youtube: "J-vTb7qopDI",
  },
  {
    id: "worlds",
    highlight: true,
    marker: { de: "2023 · Singapur", en: "2023 · Singapore" },
    tone: "red",
    title: {
      de: "World Finals — Weltmeister",
      en: "World Finals — world champions",
    },
    blurb: {
      de: "68 Nationalteams aus 26 Ländern und wir haben gewonnen?!",
      en: "68 national teams from 26 countries and we won?!",
    },
    youtube: "IW4Tb8JDNNA",
  },
  {
    id: "sponsors",
    marker: { de: "Danach", en: "After" },
    tone: "green",
    title: {
      de: "Feiern mit den Sponsoren",
      en: "Celebrating with the sponsors",
    },
    blurb: {
      de: "Der Titel gehörte auch denen, die das Projekt überhaupt möglich gemacht haben",
      en: "The title belonged just as much to the people who made the project possible",
    },
    youtube: "4uUzeQ4Ts-Y",
  },
  {
    id: "sauber",
    marker: { de: "Danach", en: "After" },
    tone: "red",
    title: {
      de: "Zu Gast bei Sauber Motorsport",
      en: "A guest at Sauber Motorsport",
    },
    blurb: {
      de: "Besuch in der Formel-1-Fabrik von Sauber Motorsport in Zürich.",
      en: "A visit to Sauber Motorsport's Formula 1 factory in Zurich.",
    },
    youtube: "slCk5LKnrCA",
  },
  {
    id: "france",
    highlight: true,
    marker: { de: "2025 · Avignon", en: "2025 · Avignon" },
    tone: "green",
    title: { de: "Als Coach in Frankreich", en: "Coaching in France" },
    blurb: {
      de: "LLP Racing bis zum Vize-Meistertitel am Circuit Paul Ricard begleitet.",
      en: "Mentored LLP Racing to runner-up at Circuit Paul Ricard.",
    },
    body: {
      de: "Mit meinem Teamkollegen Timon reiste ich nach Avignon, um LLP Racing vom Lycée Louis Pasteur zu coachen, das Gelernte weiterzugeben und den Thrill der Competition noch einmal zu erleben, ohne selbst abliefern zu müssen",
      en: "I travelled to Avignon with my teammate Timon to coach LLP Racing from Lycée Louis Pasteur. Passing on what we'd learned and re-living the thrill of the competition without having to deliver myself was especially rewarding.",
    },
    gallery: [
      { kind: "image", src: "/images/f1-france-image1.png" },
      { kind: "image", src: "/images/f1-france-image2.png" },
    ],
  },
  {
    id: "thailand",
    marker: { de: "Thailand", en: "Thailand" },
    tone: "green",
    title: { de: "Besuch im Thai-HQ", en: "Visiting the Thai HQ" },
    blurb: {
      de: "Zu Gast im thailändischen F1-in-Schools-Hauptquartier.",
      en: "A guest at the Thai F1 in Schools headquarters.",
    },
    body: {
      de: "Ich lernte dort die Teilnehmer und den Verantwortlichen von F1 in Schools Thailand kennen. Eine ganz andere Welt, wunderbare Menschen und ein ereignisreicher Tag.",
      en: "I got to know the participants and the director of F1 in Schools Thailand. A totally different world, wonderful people and an eventful day.",
    },
    gallery: [{ kind: "image", src: "/images/f1-thailand-image1.png" }],
  },
  {
    id: "teaching",
    highlight: true,
    marker: { de: "Tutor", en: "Tutor" },
    tone: "green",
    title: {
      de: "Eine Anleitung für die Nächsten",
      en: "A guide for the next teams",
    },
    blurb: {
      de: "Eine Videoreihe darüber, wie man die mündliche Präsentation bei F1 in Schools angeht. Für alle Teams, die nach uns kommen.",
      en: "A video series on how to approach the F1 in Schools verbal presentation for every team that comes after us.",
    },
    youtube: "TvUDUW9OsAQ",
  },
];
