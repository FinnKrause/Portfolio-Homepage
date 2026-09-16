"use client";

import { SkipLink } from "./SkipLink";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { Areas } from "./Areas";
import { About } from "./About";
import { Projects } from "./Projects";
import { Championship } from "./Championship";
import { Engagement } from "./Engagement";
import { Experience } from "./Experience";
import { Awards } from "./Awards";
import { Skills } from "./Skills";
import { Contact } from "./Contact";
import { useHashScroll } from "@/lib/useHashScroll";
import { VisitBeacon } from "./access/VisitBeacon";

/**
 * The page rhythm.
 *
 * Surfaces alternate cloud → canvas → cloud, break to an ink slab for the
 * championship, come back to the light bands, and close on the ink prelude
 * plus the ink footer. That alternation is the only structural device the
 * page uses: no wrappers, no overlays, no sheet sliding over anything.
 *
 * Inserting or removing a band means re-checking the whole chain — two bands
 * of the same surface next to each other read as one long band and the rhythm
 * disappears. `Areas` going in after `Hero` is why everything below it flipped.
 */
export function SiteContent() {
  // A code can carry a section; /api/access turns it into a fragment on the
  // final redirect, and this is what makes the page actually land there.
  useHashScroll();

  return (
    <>
      <VisitBeacon />
      <SkipLink />
      <Nav />
      <main id="main">
        <Hero />
        <Areas />
        <About />
        <Projects />
        <Championship />
        <Engagement />
        <Experience />
        <Awards />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
