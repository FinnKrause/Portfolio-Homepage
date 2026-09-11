# Frontend

Content, language, components, media and motion.

- [Content lives in data, not JSX](#content-lives-in-data-not-jsx)
- [Bilingual text](#bilingual-text)
- [Design tokens](#design-tokens)
- [The page, in order](#the-page-in-order)
- [Media pipeline](#media-pipeline)
- [Motion](#motion)
- [Traps worth remembering](#traps-worth-remembering)

---

## Content lives in data, not JSX

Every piece of copy is in `src/content/`. Components read it; they never hold
strings. Editing the site's text should not mean opening a component.

| File | Holds |
|---|---|
| `profile.ts` | name, roles, bio, about images, hobbies, `socials` |
| `projects.ts` | `featuredProjects`, `gridProjects`, `PINNED_REPOS`, `EXCLUDED_REPOS` |
| `experience.ts` | `workExperience` |
| `education.ts` | `education` |
| `awards.ts` | `emphasisAward`, `sideAwards` |
| `engagement.ts` | volunteering / involvement |
| `journey.ts` | the F1 timeline points |
| `skills.ts` | `skillGroups`, `languages` |
| `ui.ts` | `nav` labels and shared UI strings |
| `legal.ts` | `impressum`, `datenschutz`, `legalConfig` |
| `types.ts` | shared interfaces — imported by all of the above |

`content/` imports nothing except `content/types`. That keeps it free of React
and trivially editable.

---

## Bilingual text

German and English, no routing involved. `src/lib/i18n.tsx`.

Every translatable value has the type `Localized`:

```ts
type Localized = { de: string; en: string };
```

Components resolve it with `t()`:

```tsx
const { t, lang, setLang } = useLang();
<h2>{t(profile.about.title)}</h2>
```

For one-off strings a local helper reads better than inline objects:

```tsx
const tx = (de: string, en: string) => t({ de, en });
```

### Language selection, and why it can't be server-rendered

1. First render is always `de` — the SSR default.
2. After mount, `localStorage["fk-lang"]` wins if set.
3. Otherwise `navigator.language` starting with `en` selects English.
4. Choosing a language writes `localStorage` and updates `<html lang>`.

Server and first client render must agree or React throws a hydration error,
which is why detection runs in an effect rather than during render. The
trade-off is a possible one-frame flash of German for an English visitor on
their first ever load.

The preference is browser-local and never sent to the server — the privacy
policy says exactly that.

---

## Design tokens

Tailwind v4, configured in CSS. There is no `tailwind.config.js`; the `@theme`
block in `src/app/globals.css` *is* the config.

```
brand-50…950   electric blue, the single accent
ink-900/700/500/300   text, slate-tinted
paper / paper-soft / line     light surfaces
night / night-soft / night-line / night-ink / night-mute   dark surfaces
shadow-soft / shadow-lift / shadow-sheet
```

One typeface: **Inter**, loaded via `next/font/google` with `display: "swap"`.
`--font-mono` and `--font-display` deliberately resolve to Inter too —
hierarchy comes from weight, size and tracking, never from switching fonts.

Hand-written classes in the same file, for effects Tailwind utilities express
badly:

| Class | Used for |
|---|---|
| `.mx-container` | the standard page gutter |
| `.headline` | display type sizing + tracking |
| `.site-sheet` / `.sheet-tab` | the light "paper" panel that slides over the dark hero |
| `.grain` | film-grain texture, static (no per-frame cost) |
| `.pad-live`, `.eq-bar` | APC-mini / audio project visuals |
| `.f1-world`, `.f1-asphalt`, `.f1-sweep`, `.f1-trace` | F1 section surfaces |

If you delete a component, grep these names before deleting its CSS — and grep
the CSS before deleting a component. Both directions have bitten this codebase.

---

## The page, in order

`SiteContent` composes the whole thing:

```
VisitBeacon · SkipLink · Nav
Hero                          dark "cover"
┌ site-sheet ─────────────────────────────┐   light panel over the cover
│ About · Projects · Championship         │
│ Engagement · Experience · Awards        │
│ Skills · Contact                        │
└─────────────────────────────────────────┘
Footer
```

### The F1 section

`Championship` is the most involved part of the site and lives in
`src/components/f1/`:

- **`JourneyTimeline`** — a scroll-driven timeline of `journey.ts`. Collapsed by
  default on mobile, with a skip control on desktop.
- **`RaceFilm`** — the championship clip. See [media](#video) below.
- **`ReactionTest`** — a small F1-start reaction game. Low-profile by request.

Brand colours here are the real ones: `#097b41` and `#e10600`.

---

## Media pipeline

### Images

`next/image` throughout, with `quality` deliberately above the default 75 — the
default visibly degraded the photography.

- `quality={90}` everywhere by default
- `quality={95}` for the About carousel, the most scrutinised images on the page
- allowed values are pinned in `next.config.mjs` (`qualities: [75, 90, 95]`)

> **A quality value not in that list is a runtime crash, not a build error.**
> `npm run build` will not catch it; the page renders with an empty body. If you
> introduce a new quality, add it to the allowlist in the same commit.

**`sizes` must describe the *painted* width, not the frame width.** The About
carousel taught this the hard way: the frame is portrait `4/5`, the source
photos are landscape, and `object-cover` paints them roughly twice as wide as
the frame while cropping the sides. Declaring the frame width made the browser
pick an image ~2× too small and everything looked soft. Hence:

```tsx
sizes="(max-width: 1024px) 200vw, 950px"
```

The `200vw` is not a mistake.

`priority` is set on the hero image and the first About slide only. Everything
else is lazy.

### Video

`RaceFilm` is careful about one specific failure:

> **`autoPlay` overrides `preload="metadata"`.** With the attribute present the
> browser starts buffering the file the moment the page parses, and on a large
> clip that starves every image on the page of bandwidth. This produced a page
> where the HTML painted fast and the photos took 20+ seconds.

The fix, which must be preserved:

1. The `<video>` carries **no `src` at all** until a scroll check says the
   section is within about a screen of the viewport.
2. There is **no `autoPlay` attribute**. Playback is started by hand.
3. The poster is a normal optimised `<Image>`, not the raw JPEG.

The scroll check is a plain `getBoundingClientRect` per scroll event rather than
an `IntersectionObserver`, so the behaviour is deterministic and testable.

Served file: `public/videos/f1-web.webm` (~29 MB web transcode). The 68 MB
master it was produced from used to sit next to it in `public/`, unreferenced
and publicly downloadable; it has been removed (see below). Keep masters outside
the repo.

### Dead assets are deleted, not parked

`public/` used to carry ~103 MB of files nothing referenced — the 68 MB
`f1.webm` master, plus seven unused images — recorded in a table here as
"intentionally retained". They were not retained in any useful sense: they were
publicly downloadable, shipped in every Docker image, and the table went stale
the moment anyone added or removed one. They have been removed (they remain in
git history if a master is ever needed again).

The rule now: if nothing in `src/` references it, it does not live in `public/`.
Masters and working files belong outside the repo. To check:

```bash
for f in $(cd public && find . -type f | sed 's|^\./||'); do
  grep -rqF "/$f" src/ || echo "UNREFERENCED  $f"
done
```

One caveat when reading that output: `images/Journey-Thumbnails/*` is referenced
through a template literal built from a video id, so it always shows up as
unreferenced. Everything else that appears really is dead.

### YouTube stills

Video stills in the F1 timeline are served from `public/images/Journey-Thumbnails/`,
named `<video-id>.jpg`. They used to be hot-linked from `i.ytimg.com`, which sent
every visitor's IP to Google on page load — about eleven requests before anyone
had clicked anything — and made the privacy policy's claim that "a connection to
YouTube is only established when you actively start a video" false.

Adding a video to `content/journey.ts` therefore means adding its still:

```bash
curl -o "public/images/Journey-Thumbnails/<id>.jpg" "https://i.ytimg.com/vi/<id>/hqdefault.jpg"
```

They are 480×360 and ~25 KB each; all eleven together are 280 KB, which is less
than one of the photos on the page.

### A known rough edge

`profile.ts` links the RC-cars hobby to `/images/Hobbies/rc-cars-image1.mov` —
a raw 48 MB QuickTime file, served straight from `public/` with no optimisation.
Safari plays it inline; Chrome and Firefox are likely to download it instead.
Left as-is deliberately. If it ever needs fixing, transcode to WebM the way
`f1-web.webm` was produced and repoint the `href`.

### Media components

| Component | Role |
|---|---|
| `Carousel` | windowed slider — renders only ±1 slide, so a long gallery doesn't mount every image |
| `Gallery` | grid of thumbnails |
| `Lightbox` | full-screen view; bypasses the optimizer and shows the original |
| `MediaView` | one image slide inside a project carousel (`object-contain`, for screenshots) |

`Carousel` and `MediaView` each used to carry a `fill` prop selecting between two
layouts. Every call site passed `fill`, so the other branch never ran — and in
`Carousel` that dead branch rendered *every* slide, quietly contradicting the
"only ±1 slide" rule above. Both props are gone; the surviving behaviour is the
one that was always used.

`Lightbox` and the mobile nav sheet both freeze page scrolling, and can be open
at once. They share `lib/useScrollLock.ts`, which counts holders — writing
`document.body.style.overflow` directly means whichever closes first releases the
other's lock.

On mobile the lightbox close button is positioned clear of the nav — it used to
sit directly under it and became untappable.

---

## Motion

`framer-motion`, used with restraint.

- **`components/motion/Reveal.tsx`** is the standard scroll-in wrapper. Prefer it
  over hand-rolled variants.
- `useScroll` / `useTransform` / `useSpring` drive the hero fade and the F1
  timeline.
- **`useReducedMotion()` is honoured everywhere.** The pattern throughout is
  `style={reduce ? undefined : {...}}`.
- `useIsDesktop()` (`matchMedia`, SSR-safe, starts `false`) gates the heavier
  effects. Mobile intentionally gets a reduced version.

### Keep framer-motion off the gate

`/gate` is the only page an unverified visitor loads. It was 143 kB First Load
JS purely because `LanguageToggle` imported `framer-motion` for a sliding pill;
rewriting the pill as a CSS transform brought it to 105 kB — the shared
baseline. Anything the gate imports must stay free of the animation library.

Its visual treatment is held to the same rule. The gradient field, the grain,
the focus ring and the staggered entrance are all CSS in `globals.css` under
`.gate*` — no library, no images, no extra font. The stagger is driven by a
`--i` custom property set per element in `AccessScreen`, and the whole thing is
switched off under `prefers-reduced-motion`. Keep it that way: this is the page
where load time matters more than anywhere else on the site.

**It reads top to bottom, and it fits one screen.** Order: what this is, where
a code comes from, then the field, then the privacy note. The explanation comes
*before* the input because it is what makes the input make sense — someone who
lands here has usually not been told they would need a code.

One narrow column (`max-width: 34rem`). Measured: fits without scrolling at
1440x900, 1280x720, 1024x768 and 390x844; a 375x667 handset scrolls ~77px, and
the only thing below the fold there is the tail of the privacy footnote — the
field itself stays visible.

If you add copy here, re-measure. `document.documentElement.scrollHeight`
against `innerHeight` at **1024x768** is the binding case.

---

## Traps worth remembering

Each of these was a real bug here.

**`position: sticky` dies inside `overflow: hidden`.** An `overflow-hidden` on
the F1 section silently turned it into a scroll container and broke the sticky
timeline — and made two cards invisible. Clip on an inner decoration wrapper
instead of the section that contains sticky children.

**Image `sizes` vs `object-cover`.** See [above](#images).

**`autoPlay` beats `preload`.** See [video](#video).

**Case-sensitive paths.** macOS doesn't care that the file is `.JPG` and the
code says `.jpg`; Linux does, and it 404s only in production. Verify with:

```bash
grep -rIoh '"/\(images\|videos\)/[^"]*"' src/ | tr -d '"' | sort -u | while read -r p; do [ -f "public$p" ] || echo "MISSING $p"; done
```

**Commented-out JSX keeps assets alive.** A disabled hero block kept a 2 MB
portrait "referenced" and invisible to dead-asset scans. Delete, don't comment.
