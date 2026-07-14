import type { Project } from "./types";

/**
 * Add a project by appending an object here.
 * Set `featured: true` (max two) to surface it in the big feature section;
 * everything else renders in the "More projects" grid.
 */
export const projects: Project[] = [
  {
    slug: "apcmini-middleware",
    title: "APCmini Middleware",
    tagline: {
      de: "Ein MIDI-Controller wird zum Lichtpult",
      en: "Turning a MIDI controller into a lighting desk",
    },
    description: {
      de: "Desktop-Software, die einen AKAI APCmini in ein vollwertiges Steuerpult für meine eigentliche Lichtsoftware verwandelt. Die Software fungiert dabei als Vermittler zwischen beiden Systemen und ermöglicht nicht nur deren Kommunikation, sondern auch die Konfiguration, das Speichern von Einstellungen, Pultsperren, den Ausdruck des Layouts und vieles mehr. Damit habe ich ein sehr nischiges Problem gelöst.",
      en: "Desktop software that transforms an AKAI APCmini into a fully featured control surface for my lighting software. Acting as a bridge between both systems, it enables not only communication but also configuration, saving settings, console locking, printing layouts, and much more. It solves a highly niche problem that I was able to address with this software.",
    },
    highlights: [
      {
        de: "8x8-Pad-Mapping mit möglichen Konfigurationen",
        en: "8x8 pad mapping with multiple options",
      },
      {
        de: "Druckbares Layout um den Überblick nicht zu verlieren",
        en: "Printable layout to make live-navigating easier",
      },
      {
        de: "Konfigurationen speichern, laden & live umschalten",
        en: "Save, load & hot-swap configurations live",
      },
    ],
    tech: ["JavaScript", "Node.js", "Electron", "MIDI", "DMX"],
    gallery: [{ kind: "image", src: "/images/apc-image1.png" }],
    repo: "https://github.com/FinnKrause/APCmini-Middleware",
    featured: true,
    accent: "brand",
    year: "2025",
  },
  {
    slug: "festival-community-stage-portal",
    title: "Festival Community Stage Portal",
    tagline: {
      de: "Die Crowd wählt, der DJ entscheidet",
      en: "The crowd votes, the DJ decides",
    },
    description: {
      de: "Ein interaktives Song-Request-System für Live-Events, das das Publikum aktiv in die Musikauswahl einbindet. Über ein Webportal können Gäste Songs vorschlagen und für ihre Favoriten abstimmen, während der DJ jederzeit die volle Kontrolle über die Playlist behält. Eine Echtzeit-Rangliste zeigt die beliebtesten Titel, laufende Musiktitel werden live angezeigt und Songwünsche können direkt übernommen oder entfernt werden. Verschiedene Oberflächen- und Automatikmodi ermöglichen unter anderem das automatische Abspielen des bestbewerteten Songs oder einen speziellen DJ-Modus. Entwickelt wurde das System für die Festivalbühne der WiWi-Meisterschaften.",
      en: "An interactive song request system for live events that actively involves the audience in the music selection. Guests can submit song requests and vote for their favorites through a web portal, while the DJ retains full control over the playlist. A real-time leaderboard displays the most popular tracks, the currently playing song is shown live, and requests can be accepted or removed with a single click. Multiple interface and automation modes support features such as automatically playing the highest-voted song or providing a dedicated DJ view. The system was developed for the FAU festival stage of the WiWi Championships.",
    },
    highlights: [
      {
        de: "Echtzeit-Leaderboard über Server-Sent Events",
        en: "Real-time leaderboard via Server-Sent Events",
      },
      {
        de: "Spotify-Suche & Ein-Klick-Queue für den DJ",
        en: "Spotify search & one-click queue for the DJ",
      },
      {
        de: "SQLite ohne externe Abhängigkeiten, Docker-Deploy",
        en: "Dependency-free SQLite, Docker deployment",
      },
    ],
    tech: [
      "Next.js 16",
      "TypeScript",
      "Tailwind CSS",
      "Spotify API",
      "SQLite",
      "Docker",
    ],
    gallery: [
      { kind: "image", src: "/images/fsi-image1.png" },
      { kind: "image", src: "/images/fsi-image2.png" },
      { kind: "image", src: "/images/fsi-image3.png" },
    ],
    repo: "https://github.com/FinnKrause/Festival-Community-Stage-Portal",
    featured: true,
    accent: "violet",
    year: "2026",
  },
  {
    slug: "pmtool-umbruchszeiten",
    title: "PMTool Umbruchszeiten",
    tagline: {
      de: "Projektmanagement für den Geschichtswettbewerb",
      en: "Project management for the history contest",
    },
    description: {
      de: "Werkzeug (inkl. Mobile App) zur Organisation von Projekten rund um den Wettbewerb „Umbruchszeiten“.",
      en: "A tool (including a mobile app) to organise projects around the “Umbruchszeiten” competition.",
    },
    tech: ["TypeScript", "React Native"],
    repo: "https://github.com/FinnKrause/PMTool_Umbruchszeiten2020",
    accent: "amber",
    year: "2024",
  },
  {
    slug: "wol-dc-mc-integration",
    title: "WoL · Discord · Minecraft",
    tagline: {
      de: "Server per Discord-Befehl aufwecken",
      en: "Wake a server by Discord command",
    },
    description: {
      de: "Wake-on-LAN-Integration, die einen Minecraft-Server über einen Discord-Bot startet und überwacht.",
      en: "A Wake-on-LAN integration that boots and monitors a Minecraft server through a Discord bot.",
    },
    tech: ["Python", "Discord API"],
    repo: "https://github.com/FinnKrause/WoL-Dc-Mc-Integration",
    accent: "brand",
    year: "2025",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const gridProjects = projects.filter((p) => !p.featured);

/**
 * The "More projects" grid loads live from the GitHub API.
 * Repo names listed here are pinned to the front of the grid
 * (only if a repo with that exact name actually exists).
 */
export const PINNED_REPOS = [
  "PMTool_Umbruchszeiten2020",
  "Portfolio-Homepage",
  "PMTool_Umbruchszeiten2020_MobileApp",
];

/** Repos hidden from the grid (already featured above, or not worth showing). */
export const EXCLUDED_REPOS = [
  "APCmini-Middleware",
  "Festival-Community-Stage-Portal",
];
