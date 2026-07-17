"use client";

import { SkipLink } from "./SkipLink";
import { ScrollRails } from "./ScrollRails";
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

export function SiteContent() {
  return (
    <>
      <SkipLink />
      <ScrollRails />
      <Nav />
      <main id="main">
        <Hero />
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
