import type { SkillGroup, LanguageSkill } from "./types";

export const skillGroups: SkillGroup[] = [
  {
    title: { de: "Entwicklung", en: "Development" },
    items: ["Java", "C#", "TypeScript", "JavaScript", "Python", "React / Next.js", "Node.js", "Electron"],
  },
  {
    title: { de: "Cybersicherheit", en: "Cybersecurity" },
    items: ["Netzwerktheorie", "Linux", "CTF / Web Exploitation", "XSS", "SQL-Injection", "Responsible Disclosure"],
  },
  {
    title: { de: "Veranstaltungstechnik", en: "Event technology" },
    items: ["DMX", "grandMA3", "MIDI / Show-Control", "Lichtdesign", "Videoproduktion"],
  },
  {
    title: { de: "Führung & Organisation", en: "Leadership & organisation" },
    items: ["Teammanagement", "Gremienarbeit", "Eventplanung", "Budgetkoordination", "Content-Creation"],
  },
];

export const languages: LanguageSkill[] = [
  { name: { de: "Deutsch", en: "German" }, level: { de: "Muttersprache", en: "Native" }, meter: 5 },
  { name: { de: "Englisch", en: "English" }, level: { de: "Cambridge C2", en: "Cambridge C2" }, meter: 5 },
  { name: { de: "Französisch", en: "French" }, level: { de: "B2", en: "B2" }, meter: 3 },
  { name: { de: "Chinesisch", en: "Chinese" }, level: { de: "HSK1", en: "HSK1" }, meter: 1 },
];
