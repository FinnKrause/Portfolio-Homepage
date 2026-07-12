# Finn Krause — Portfolio

A personal portfolio website for **Finn Krause** — Wirtschaftsinformatik student at FAU
Erlangen-Nürnberg, developer, event engineer and **F1 in Schools World Champion 2023**.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion**.
Light mode only, blue-forward, fully **bilingual (DE / EN)** and mobile-first.

---

## The concept

A single-page, story-driven portfolio that positions Finn as someone at the intersection of
**software, live-event technology, security and leadership**. The narrative arc:

1. **Hero** — who he is, at a glance, with the World Champion badge.
2. **About** — the four pillars (software, events, security, leadership) + a real festival-stage photo.
3. **World Champion** — the F1 in Schools 2023 win as the emotional centrepiece (deep-navy focal band,
   official podium photo, [official Formula 1 article](https://www.formula1.com/en/latest/article/german-team-crowned-champions-in-2023-aramco-f1-in-schools-world-finals.6AjY9ZlXQGicww2A7ZODN6)).
4. **Projects** — two flagship builds where *software meets stage* (APCmini Middleware + Festival
   Community Stage Portal), each with a custom, self-animating visual — plus a grid of more repos.
5. **Experience** — a timeline of work + volunteer involvement.
6. **Awards** — F1 World Champion, Umbruchszeiten, FAUST CTF.
7. **Skills & Languages**, then **Contact**.

Use case: a professional home base to share with recruiters, working-student employers, scholarship
committees and collaborators — in German for a local audience and English for an international one.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

Node 20+ recommended (developed on Node 24).

---

## Project structure

```
src/
  app/
    layout.tsx        # fonts, metadata, <html lang>, providers, Nav + Footer
    page.tsx          # section composition (change section order here)
    globals.css       # design tokens + reusable primitives (single source of truth for the theme)
    icon.svg          # favicon
  lib/
    i18n.tsx          # LanguageProvider + useLang() hook (localStorage-persisted DE/EN)
    utils.ts          # cn() classname helper
  content/            # ← ALL copy & data lives here (edit these to update the site)
    types.ts          # shared types (Localized = { de, en }, MediaSlide, …)
    ui.ts             # nav items + generic microcopy
    profile.ts        # hero highlights, about, pillars, championship (+ gallery & videos), contact
    projects.ts       # featured projects (+ galleries) + PINNED_REPOS / EXCLUDED_REPOS
    experience.ts     # split into work (professional) + voluntary
    education.ts      # study + what's next (exchange, thesis)
    awards.ts         # awards (Umbruchszeiten showcased with a gallery)
    skills.ts         # skill groups + languages
  components/         # presentational components (rarely need editing to add content)
    media/            # Carousel, MediaView, YouTubeEmbed (lazy facade), Placeholder
    visuals/          # ApcMiniGrid + StagePortalVisual (the two custom project graphics)
    motion/           # Reveal / RevealGroup scroll animations
    GithubProjects.tsx# "More projects" grid, loaded live from the GitHub API
public/images/        # portrait, F1 podium, festival stage
```

---

## How to extend

Everything is data-driven, so most updates are **content-only** edits.

### Add / edit a project
Edit `src/content/projects.ts` and append a `Project`. Set `featured: true` (max two) to surface it in
the big feature section; otherwise it lands in the "More projects" grid.

```ts
{
  slug: "my-project",
  title: "My Project",
  tagline: { de: "Kurzbeschreibung", en: "Short tagline" },
  description: { de: "…", en: "…" },
  tech: ["TypeScript", "Next.js"],
  repo: "https://github.com/FinnKrause/my-project",
  accent: "brand",       // brand | sky | violet | emerald | amber
  year: "2026",
}
```

### Add images to a project / award / championship (replace placeholders)
Galleries use `MediaSlide`s. Drop a file in `public/images/` and swap a placeholder for an image:

```ts
// before: { kind: "placeholder", label: { de: "Foto folgt", en: "Photo coming soon" } }
// after:
{ kind: "image", src: "/images/my-photo.jpg", alt: { de: "…", en: "…" } }
```

- **Featured project carousel:** add `image` slides to a project's `gallery` in `projects.ts`. The
  carousel auto-advances while scrolled into view but stops the moment you click an arrow/dot.
- **Championship:** `profile.championship.gallery` (photos) and `.videos` (add `{ kind: "video",
  youtube: "<id-or-url>" }`).
- **Awards / experience:** add a `gallery` array to any entry (Umbruchszeiten already has placeholders).

### The "More projects" grid (GitHub)
It loads live from the GitHub API. To pin a repo to the front, add its **exact** name to
`PINNED_REPOS` in `projects.ts`; hide one via `EXCLUDED_REPOS`. If the API is unavailable the grid
falls back to the static list in the same file.

### Add an award / experience / education / skill
Append to `awards.ts`, `experience.ts` (set `kind: "work"` or `"voluntary"`), `education.ts`
(`upcoming: true` for planned items) or `skills.ts`. Every text field is `{ de, en }`. Experience
items can be extended later with `more` (extra paragraphs), `gallery` (images) and `link`.

### Translations
Every string is a `Localized` object `{ de: "…", en: "…" }`. The active language is resolved with the
`t()` helper from `useLang()`. To add a third language, extend the `Locale` type in
`content/types.ts` and add the key to every `Localized` object (TypeScript will point out what's missing).

### Re-theme
All colours, fonts and shadows are CSS variables in `src/app/globals.css` under `@theme`. Change the
`--color-brand-*` scale to recolour the whole site.

---

## Notes & decisions

- **Light mode only** is enforced (`color-scheme: light`, no dark variants) as requested.
- **Privacy:** the public site intentionally omits Finn's home address, phone number and date of birth
  (all present in the CV). It exposes email, GitHub, LinkedIn and Instagram. Adjust in
  `content/profile.ts` if desired.
- **Die Box Club** (lighting) is shown as a *past* role.
- **Assets** were extracted from the provided CV files and an official F1 media photo. To swap in your
  own project screenshots, drop them in `public/images/` and reference them in the project card.
- The provided `IMG_3176.MOV` is HEVC; transcode it to MP4/WebM if you want to embed it as video.
- Accessibility: reduced-motion is respected, there is a skip link, focus-visible rings, and semantic
  landmarks.
