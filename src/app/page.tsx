import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Championship } from "@/components/Championship";
import { Engagement } from "@/components/Engagement";
import { Experience } from "@/components/Experience";
import { Awards } from "@/components/Awards";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Championship />
      <Engagement />
      <Experience />
      <Awards />
      <Skills />
      <Contact />
    </>
  );
}
