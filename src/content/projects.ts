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
      de: "Desktop-Software (Krause Software Solutions), die einen AKAI APCmini in ein vollwertiges Steuerpult für professionelle Lichttechnik verwandelt. Über ein visuelles 8×8-Raster werden Farben, Effekte, Moving Heads und ganze Szenen auf die Pads gelegt, live abgefeuert und als Konfiguration gespeichert.",
      en: "Desktop software (Krause Software Solutions) that turns an AKAI APCmini into a full control surface for professional lighting. A visual 8×8 pad grid maps colours, effects, moving heads and entire scenes onto the pads — fired live and saved as reusable configs.",
    },
    highlights: [
      {
        de: "8×8-Pad-Mapping mit ON/OFF-, Helligkeits- & Label-Editor",
        en: "8×8 pad mapping with ON/OFF, brightness & label editor",
      },
      {
        de: "Effekt-Engine: Fade, Ripple, Strobe, Random, Chase",
        en: "Effect engine: fade, ripple, strobe, random, chase",
      },
      {
        de: "Konfigurationen speichern, laden & live umschalten",
        en: "Save, load & hot-swap configurations live",
      },
    ],
    tech: ["JavaScript", "Node.js", "Electron", "MIDI", "DMX"],
    gallery: [
      { kind: "placeholder", label: { de: "Screenshot folgt", en: "Screenshot coming soon" }, aspect: "16 / 10" },
      { kind: "placeholder", label: { de: "Screenshot folgt", en: "Screenshot coming soon" }, aspect: "16 / 10" },
    ],
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
      de: "Ein interaktives Song-Request-System für Live-Events: Gäste schlagen über ein Web-Portal Songs vor und stimmen ab, während der DJ die volle Kontrolle behält. Ein Echtzeit-Leaderboard zeigt, was die Crowd feiert; Vorschläge außerhalb der Top 3 verfallen nach 30 Minuten. Gebaut für die Festivalbühne der WiWi-Meisterschaften.",
      en: "An interactive song-request system for live events: guests suggest and vote on tracks through a web portal while the DJ keeps full control. A real-time leaderboard shows what the crowd is vibing with; suggestions outside the top 3 expire after 30 minutes. Built for the WiWi-Meisterschaften festival stage.",
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
      { kind: "placeholder", label: { de: "Screenshot folgt", en: "Screenshot coming soon" }, aspect: "16 / 10" },
      { kind: "placeholder", label: { de: "Screenshot folgt", en: "Screenshot coming soon" }, aspect: "16 / 10" },
    ],
    repo: "https://github.com/FinnKrause/Festival-Community-Stage-Portal",
    featured: true,
    accent: "violet",
    year: "2026",
  },
  {
    slug: "longdistance-countdown",
    title: "Longdistance Countdown",
    tagline: {
      de: "Countdown-App für die Distanz",
      en: "A countdown app for the distance",
    },
    description: {
      de: "Eine liebevoll gestaltete Web-App, die die Zeit bis zum nächsten Wiedersehen herunterzählt.",
      en: "A lovingly designed web app that counts down the time until the next reunion.",
    },
    tech: ["TypeScript", "React"],
    repo: "https://github.com/FinnKrause/Longdistance-Countdown",
    accent: "sky",
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
  "Longdistance-Countdown",
  "-FAU-MRKLK-Rettungssystem",
  "PMTool_Umbruchszeiten2020",
  "WoL-Dc-Mc-Integration",
];

/** Repos hidden from the grid (already featured above, or not worth showing). */
export const EXCLUDED_REPOS = [
  "APCmini-Middleware",
  "Festival-Community-Stage-Portal",
];
