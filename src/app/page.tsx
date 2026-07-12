import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Championship } from "@/components/Championship";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Awards } from "@/components/Awards";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Championship />
      <Projects />
      <Experience />
      <Awards />
      <Skills />
      <Contact />
    </>
  );
}
