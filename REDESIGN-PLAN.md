# Portfolio Redesign — Plan & Progress

Ground-up redesign of finnkrause.com portfolio into **one coherent, scroll-driven story** with
cohesive full-page visuals, a reworked hero, richer content, and an engagement timeline that shows
things happening *in parallel*.

**Status legend:** ⬜ Todo · 🟦 In progress · ✅ Done · ⏸ Blocked (needs input)

**Last updated:** 2026-07-13 — _planning complete, implementation not yet started._

---

## 0. Design vision (the "north star")

- **One story, one flow.** The page should read top-to-bottom like a guided journey we discover
  together: Intro (who) → How I think/work → Deep dives (F1 journey, projects) → Engagement →
  What's next → Contact. Each section hands off to the next.
- **A living "spine".** Blue vertical elements on the left/right margins that span the full page
  height and **animate on scroll** (a scroll-progress fill + subtle motion). They frame the otherwise
  calm content column and tie every section into the same visual system — cohesive, never clumsy.
- **Full-bleed but disciplined.** Large visuals can span edge-to-edge, but always on a strict grid
  with generous whitespace so it stays professional.
- **Motion with meaning.** Scroll-linked reveals, staggered content, section transitions. Respect
  `prefers-reduced-motion` everywhere. Durations 150–500ms, spring/ease-out.
- **Calm → energetic → calm rhythm.** Keep the existing "bold hero → professional deeper down"
  idea, but make the connective tissue (the spine + transitions) carry the energy so lower sections
  can stay clean.

---

## 1. Phases & tasks

### Phase A — Visual system & scroll spine  ⬜
The foundation everything else sits on.
- ⬜ **A1** Build an animated **blue side-spine** component: fixed/absolute vertical rails (left &
  right) spanning the viewport, with a scroll-progress fill and subtle scroll-reactive motion.
- ⬜ **A2** Global **scroll-progress** signal (one hook) reused by the spine, nav, and section reveals.
- ⬜ **A3** Section **transition/flow** system: consistent reveal choreography + connectors so
  sections feel continuous rather than stacked.
- ⬜ **A4** Refine the design tokens for the new look (spine blues, section backgrounds, rhythm) in
  `globals.css`. Keep light-mode-only.
- **Accept:** rails animate smoothly on scroll on desktop; gracefully hidden/simplified on mobile;
  reduced-motion falls back to static.

### Phase B — Hero, completely rebuilt  ⬜
- ⬜ **B1** New hero using the **transparent portrait** (`finn-portrait-transparent.png`) — Finn
  standing in front of the animated background/spine.
- ⬜ **B2** **Remove / heavily reduce** the "World Champion · Umbruchszeiten · Developer" highlight
  strip. Replace with a broad, journey-style overview (a few evocative words, not a résumé line).
- ⬜ **B3** "Incredible from the start": layered background (aurora + spine + subtle grid), big
  display type, a clear scroll invitation into the story.
- ⬜ **B4** Optimize the transparent PNG (currently 7.9 MB → resize/compress) and set correct
  priority/sizes.
- **Accept:** hero reads as an overview/journey opener, not an achievements list; looks striking on
  desktop and mobile; no layout shift.

### Phase C — About Me, broadened  ⬜
- ⬜ **C1** Rework About into a **multi-topic** story: for each area I work in (Software, Event/Light
  tech, Security, Community/Leadership) a **carousel + text** block (same pattern as the featured
  projects) so images can be added later.
- ⬜ **C2** Wire topic carousels to the shared `Carousel`/`Gallery`; start with placeholders where no
  photo exists yet.
- **Accept:** About paints a broad picture, each topic has room for images, reads coherently.

### Phase D — F1 journey, deeper  ⬜
- ⬜ **D1** Extend the championship section into a **journey** (not just the 2023 win):
  - 2022–23 → Bavarian/German champion → **World Champion (Singapore 2023)**.
  - **2025 — coached a French team** (traveled to help them; photos available → gallery).
  - **Visited the F1 in Schools center in Thailand.**
- ⬜ **D2** Present as a mini-timeline / chaptered gallery within the section, with the existing
  videos + impressions.
- **Accept:** the section tells an evolving story (competitor → mentor / global involvement), not a
  single result.

### Phase E — Engagement timeline (parallel tracks)  ⬜
- ⬜ **E1** Turn "Work & involvement" into a **comprehensive extracurricular timeline** — everything
  outside class & paid work: F1 in Schools (2022–23 + 2025 coaching), **Umbruchszeiten jury
  (2022–2024)**, Schüler-/Jahrgangsstufensprecher (2022–24), **MUN delegate (März 2024)**,
  **freiwilliger Frankreich-Austausch (März 2024)**, **FSI WiSo working-group lead + Hochschulwahlen
  4th place (seit 2024)**, …
- ⬜ **E2** Design so **simultaneous** activities are visually apparent (overlapping date ranges /
  parallel lanes) **without collapsing them into one bullet**.
- ⬜ **E3** Keep paid **work** as its own (separate) track/section.
- **Accept:** a viewer can see at a glance that several things ran at the same time; each item stays
  distinct and can hold its own text/images/links later.

### Phase F — Content corrections & data  ⬜
- ⬜ **F1** **FSI WiSo:** remove "2. Vorsitzender Q-Zirkel". Now = **Arbeitskreisleitung**
  (AK "Website" + "WiWi-Meisterschaften") + **4. Platz bei den Hochschulwahlen**. (seit Nov. 2024)
- ⬜ **F2** **Umbruchszeiten:** committee/jury membership **ended 2024** (2nd place 2022 stays).
- ⬜ **F3** **Datenschutz — hosting:** rewrite to **self-hosting at home**; logs are not permanently
  stored, are **not regularly saved manually**, and **auto-delete on server/service restart (at
  least every 6 months)**; remove the "external processor / AV-contract" wording.
- ⬜ **F4** Fix typo: FSI period `en: "Since November 2026"` → **2024**.
- **Accept:** all facts match reality; DE + EN both updated.

### Phase G — Media display refinements  ⬜
- ⬜ **G1** **Umbruchszeiten media:** single image is currently too large. Use a **constrained
  thumbnail grid** that looks right with 1 image and scales cleanly to many; support **multiple
  links** (already an array) shown as a tidy list.
- ⬜ **G2** Audit gallery sizing site-wide for consistency (championship, projects, about, awards).
- **Accept:** no oversized lone images; galleries feel intentional at any count.

### Phase H — QA & polish  ⬜
- ⬜ **H1** `npm run build` green; no console errors.
- ⬜ **H2** Verify desktop + mobile, DE/EN, reduced-motion, lightbox, keyboard nav.
- ⬜ **H3** Performance: image sizes, no CLS, scroll perf (transform/opacity only).
- ⬜ **H4** Update `README.md` for the new architecture.

---

## 2. Assets on hand

- `finn-portrait-transparent.png` — **hero cut-out** (transparent bg, 2150×3344). ← preferred for hero.
- `finn-portrait.jpg`, `finn-portrait2.jpg` — alternative portraits.
- F1: `f1-podium.jpg`, `f1-podium2.JPG`, `f1-image1.jpeg`, `f1-image2.png`.
- Projects: `apc-image1.png`; `fsi-image1/2/3.png`.
- `stage-lighting.jpg`; `umbruchszeiten-image1.png`.
- **Later:** French-team-coaching photos, Thailand center photos, per-topic About photos,
  more Umbruchszeiten photos → drop into `public/images/` and reference (placeholders used until then).

---

## 3. Open questions (won't block — I'll use sensible placeholders)

1. **Hochschulwahlen 4th place** — which body/list (e.g. FSI/Fachschaft, Studierendenparlament) and
   which year (2024/2025)? Are you elected as a result, or is 4th place the standing?
2. **French team (2025)** — team/school name & where, so the F1 journey copy is accurate.
3. **Thailand** — is this the F1 in Schools / STEM Racing center? Any date?
4. **MUN / France exchange** — confirm both were March 2024 at Lycée Jeanne d'Arc, Nancy.
5. Any **paid work** to still show separately (Hempels Burger, Die Box Club, Wohnstift, IT/Security),
   or fold some away?

---

## 4. Progress log

- **2026-07-13** — Requirements captured; new transparent hero portrait reviewed; this plan written.
  Implementation queued to start at **Phase A**.
