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

The visual system is specified in **`DESIGN.md`** at the repo root. That file is
the brief; `src/app/globals.css` is its only implementation. If the two ever
disagree, `DESIGN.md` wins — change it first, then the CSS.

Tailwind v4, configured in CSS. There is no `tailwind.config.js`; the `@theme`
block in `src/app/globals.css` *is* the config.

```
primary / primary-bright / primary-deep / primary-soft   Electric Blue, the one signal
canvas / cloud / fog / steel / hairline                  the light surfaces
ink / ink-soft / ink-deep / on-ink                       the dark surface + its text
charcoal / graphite                                      muted body + fine print
coral / rose / bloom-deep / bloom-wine                   the one warm accent
storm-mist / storm-sea / storm-deep                      the neutral status accent
shadow-lift / shadow-float                               the only two elevations
```

Two rules carry most of the look:

- **The surface vocabulary is closed.** Every band on the site is `canvas`,
  `cloud`, `fog` or `ink`. There is no fifth background, no gradient field, no
  texture. Depth comes from surface contrast, not from shadow.
- **Blue is scarce.** `primary` is the CTA fill, the link colour and the hero
  chevrons — at most about twice per viewport. It is never a section background
  and never a data fill; a meter or a chart uses `ink` or the `storm` neutral.

Geometry is two-tier and deliberate: **buttons and inputs at 4px** (`rounded-md`),
**cards and photo frames at 16px** (`rounded-xl`). `rounded-2xl` and `rounded-3xl`
are re-pointed to 16px so a stray utility can't break the split.

One typeface: **Manrope**, loaded via `next/font/google` with `display: "swap"`
at weights 400 / 500 / 600 / 700. `DESIGN.md`'s own face (Forma DJR Micro) is
proprietary and names Manrope as the substitute that needs no metric adjustment.
Display type runs at **weight 500 at every size with line-height 1** — including
the hero. Resist bumping it at large sizes; that flatness is the voice.

Hand-written classes in the same file. **They live in `@layer components`** so a
Tailwind utility written next to one still wins — unlayered CSS beats anything in
a layer, and a bare `.input { padding }` rule silently swallowed `pl-9`:

| Class | Used for |
|---|---|
| `.mx-container` | the 1366px page container + gutter |
| `.band`, `.band-canvas/-cloud/-fog/-ink` | a page band: one surface, the 80px rhythm |
| `.band-screen` | the hero: fills `100svh` minus the header, and sets a tighter rhythm of its own |
| `.display-xxl … .display-xs`, `.lead`, `.fine-print` | the type scale |
| `.btn` + `.btn-primary/-ink/-outline/-outline-ink` | buttons |
| `.link` | the blue inline link |
| `.card`, `.card-hairline`, `.frame` | the three container treatments |
| `.badge*`, `.tab`, `.tab-active`, `.input`, `.faq-row` | chips, pills, fields |
| `.tile`, `.tile-veil`, `.tile-label` | a photo tile: picture, ink veil, one-word label |
| `.chevron`, `.chevron-end` | the blue slash pair — hero and gate only |
| `.rise`, `.chevron-in` | the one page-load sequence |
| `.pad-live`, `.eq-bar` | APC-mini / audio project visuals |

`.band-ink` is also a *context*: several component rules key off it, so a button
or a field inside an ink slab flips to the palette that reads on near-black
without the component needing a prop. Put `band-ink` on the section, not on the
child.

If you delete a component, grep these names before deleting its CSS — and grep
the CSS before deleting a component. Both directions have bitten this codebase.

---

## The page, in order

`SiteContent` composes the whole thing:

```
VisitBeacon · SkipLink · Nav      one 64px cloud bar, sticky
Hero            cloud    the intro card, centred, fills the first screen
Areas           canvas   four photo tiles — roughly what Finn does
About           cloud
Projects        canvas
Championship    ink      the slab — includes JourneyTimeline
Engagement      cloud
Experience      canvas
Awards          cloud
Skills          canvas
Contact         ink      the closing prelude
Footer          ink
```

The alternation *is* the structure. Sections carry no eyebrow label and no index
number: the system tracks letters in exactly one place (button labels), so a
tracked uppercase kicker would contradict it, and numbering implies a sequence
this page does not have. What separates two sections is the surface under them.

### The hero covers the first screen; the card does not

`Hero` carries `.band-screen`. Two separate things, easy to conflate:

- **The band** is `min-height: 100svh`. It is what guarantees nothing else peeks
  in on arrival — measured, the next band's top lands at 965px on a 900px-tall
  viewport.
- **The card** is sized by its own content and centred in that band. 579px at
  1440x900, 540px at 1280x720. The band decides how much room there is, not how
  big the card is.

`100svh`, not `100vh` or `100dvh`. `svh` is the *small* viewport height — with
the mobile browser's chrome showing, which is exactly what a visitor sees on
first load. `100vh` is the large one, so the next band would be pushed below the
fold by however tall the URL bar is; `100dvh` re-layouts mid-scroll as that bar
hides.

The band pads its bottom by an extra `var(--header-height)`. The header is
sticky and in flow, so the band's box starts beneath it and its own midpoint
sits half a bar below the viewport's — enough that the card reads visibly
bottom-heavy without the compensation. With it, the gap above and below the card
matches to within a pixel (128/128 at 1440x900, 57/57 at 1280x720).

### The portrait frame must never be wider than the source

`object-cover` crops whichever axis the frame has slack on. On a 3:4 portrait, a
frame *wider* than 3:4 crops height — which means cutting the subject off at the
waist. So the frame is pinned to a ratio at or taller than the source at every
breakpoint: `4/5` stacked, `3/4` from `md` up. Grid stretch can only make it
taller still, and that direction trims background off the sides, which is
harmless.

This is load-bearing, and it is the component's most easily-broken invariant —
nothing else guarantees it, because the card is content-sized. Two bugs have
already come from getting it wrong:

- `sm:aspect-[16/10]` turned the portrait into a 1.6 landscape strip between
  640px and 1024px, showing less than half its height.
- The two-column split used to start at `lg`, so a 900x700 screen got a
  full-width 4:5 frame — a screenful of forehead with the copy below the fold.
  It starts at `md` now.

Measured after the fix: 100% of the photo's height is shown at 1440x900 and
1280x720, 94% at 375x812.

### The landing card introduces, it does not enumerate

`Hero` carries a portrait, the name, one paragraph and two links, at two type
sizes and two text colours. That is the whole brief. Several earlier versions
put a taxonomy on the first screen — a headline naming three domains, a
three-fact stamp, a row of category cards, a list of pointers at what was below
— and each one committed the site to a shape before a visitor had read anything,
while adding a third and fourth type size to a card that only has to introduce
someone.

What Finn works on is the job of `Areas`, the band directly underneath: four
photographs, one word each, each opening the band that covers it. Keeping the
two separate is the point — a visitor meets the person, then sees the work, in
that order, rather than both at once. New "what I do" material goes there or
lower, never back into the card.

### The nav bar carries no call to action

The bar is the mark, the section links, the social links and the language
switch. There is no "Kontakt" button: `Contact` is already one of the section
links a few pixels to the left of where that button sat, and the closing ink
band exists to do the asking. The mobile drawer lost the same button for the
same reason — the link is in its own list.

### One header bar, not two

There was a 36px ink utility strip above the nav carrying the field of study,
the email address and the language switch. It is gone. None of that is standing
chrome on a personal site: the study line sits in the hero next to the name it
describes, the email is in the closing band and the footer, and the language
switch moved into the nav bar, where it stays visible at every breakpoint.

The header's height is a token, `--header-height` in `globals.css`. Three things
read it: the anchor offset on `[id]`, the mobile drawer's height, and
`.band-screen` — the hero's "fill the first screen" rule. It used to be written
out in all three places, which is the kind of thing that stays consistent right
up until it doesn't. Change the bar's height there and nowhere else.

### The F1 section

`Championship` is the most involved part of the site and lives in
`src/components/f1/`:

- **`JourneyTimeline`** — a scroll-driven timeline of `journey.ts`. Collapsed by
  default on mobile, with a skip control on desktop.
- **`RaceFilm`** — the championship clip. See [media](#video) below.
- **`ReactionTest`** — a small F1-start reaction game. Low-profile by request.

The chapter used to be its own world — a green-and-red gradient field, an
asphalt texture, a moving light sweep. The system has a closed surface
vocabulary and one warm accent, so it is now simply the site's ink slab. Recoil
Racing's green and Formula 1's red are represented by the system's own values
(`content/theme.ts`: the bloom coral carries the racing red, the bright blue
carries the second accent) rather than reproduced literally. If you want the
real brand colours back, that is a change to `DESIGN.md` first.

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

`framer-motion`, used with restraint — and used less than it used to be.

**There is one non-interactive animation on the site: the hero's arrival.** The
blue slashes draw in from the page edges and the copy rises behind them, driven
by the `.rise` / `.chevron-in` CSS classes and a `--i` custom property set per
element. Everything else moves only in answer to something a person did —
opening the menu, advancing a carousel, expanding the AI note, scrubbing the F1
timeline, playing the reaction test.

The old `components/motion/Reveal.tsx` wrapper — a fade-and-slide-up on every
section and most cards — has been removed. A scroll-in on everything is the
generic default; it also meant several sections could not render until
framer-motion had hydrated. Do not reintroduce it. If a single element genuinely
earns a reveal, write it locally and say why in a comment.

- `useScroll` / `useTransform` / `useSpring` drive the F1 timeline, which is the
  one place a scroll-linked effect carries real information.
- **`useReducedMotion()` is honoured everywhere.** The pattern throughout is
  `style={reduce ? undefined : {...}}`, and every CSS keyframe is switched off
  under `prefers-reduced-motion`.
- `useIsDesktop()` (`matchMedia`, SSR-safe, starts `false`) gates the heavier
  effects. Mobile intentionally gets a reduced version.

### Keep framer-motion off the gate

`/gate` is the only page an unverified visitor loads. It was 143 kB First Load
JS purely because `LanguageToggle` imported `framer-motion` for a sliding pill;
rewriting the pill as a CSS transform brought it to 105 kB — the shared
baseline. Anything the gate imports must stay free of the animation library.

Its visual treatment is held to the same rule, and it now costs nothing extra:
the gate is an `.band-ink` slab with the same `.chevron` pair, `.input` and
`.btn` the rest of the site uses, so it shares the site's stylesheet instead of
carrying a `.gate*` block of its own. No library, no images, no extra font. The
stagger is the same `.rise` class driven by a `--i` custom property set per
element in `AccessScreen`, switched off under `prefers-reduced-motion`. Keep it
that way: this is the page where load time matters more than anywhere else.

**It reads top to bottom, and it fits one screen.** Order: what this is, where
a code comes from, then the field, then the privacy note. The explanation comes
*before* the input because it is what makes the input make sense — someone who
lands here has usually not been told they would need a code.

One narrow column (`max-w-xl`). Measured: fits without scrolling at
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

**Unlayered CSS beats Tailwind utilities.** A component class written outside
`@layer components` sits above the whole utilities layer, so `class="input w-64
pl-9"` renders with the component's width and padding and the utilities do
nothing — silently, with no warning anywhere. Every hand-written class in
`globals.css` belongs in a layer.

**Image `sizes` vs `object-cover`.** See [above](#images).

**`autoPlay` beats `preload`.** See [video](#video).

**Case-sensitive paths.** macOS doesn't care that the file is `.JPG` and the
code says `.jpg`; Linux does, and it 404s only in production. Verify with:

```bash
grep -rIoh '"/\(images\|videos\)/[^"]*"' src/ | tr -d '"' | sort -u | while read -r p; do [ -f "public$p" ] || echo "MISSING $p"; done
```

**Commented-out JSX keeps assets alive.** A disabled hero block kept a 2 MB
portrait "referenced" and invisible to dead-asset scans. Delete, don't comment.
