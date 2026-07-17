"use client";

import { SkipLink } from "./SkipLink";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { About } from "./About";
import { Projects } from "./Projects";
import { Championship } from "./Championship";
import { Engagement } from "./Engagement";
import { Experience } from "./Experience";
import { Awards } from "./Awards";
import { Skills } from "./Skills";
import { Contact } from "./Contact";
import { useLang } from "@/lib/i18n";

export function SiteContent() {
  const { t } = useLang();

  return (
    <>
      <SkipLink />
      <Nav />
      <main id="main">
        <Hero />

        {/* The light "paper sheet" that slides over the dark cover on desktop */}
        <div className="site-sheet">
          <span className="sheet-tab" aria-hidden>
            {t({ de: "Akte — Seite 1", en: "File — page 1" })}
          </span>
          <About />
          <Projects />
          <Championship />
          <Engagement />
          <Experience />
          <Awards />
          <Skills />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
