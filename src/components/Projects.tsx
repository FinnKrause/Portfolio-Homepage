"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Github, X } from "lucide-react";
import { featuredProjects } from "@/content/projects";
import type { Project } from "@/content/types";
import { ui } from "@/content/ui";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./motion/Reveal";
import { Carousel } from "./media/Carousel";
import { MediaView } from "./media/MediaView";
import { GithubProjects } from "./GithubProjects";
import { ApcMiniGrid } from "./visuals/ApcMiniGrid";
import { StagePortalVisual } from "./visuals/StagePortalVisual";
import { cn } from "@/lib/utils";

const VISUALS: Record<string, ReactNode> = {
  "apcmini-middleware": <ApcMiniGrid />,
  "festival-community-stage-portal": <StagePortalVisual />,
};

function slidesFor(project: Project): ReactNode[] {
  const slides: ReactNode[] = [
    <div key="visual" className="flex h-full w-full items-center justify-center p-6 sm:p-10">
      <div className="w-full max-w-sm">{VISUALS[project.slug]}</div>
    </div>,
  ];
  (project.gallery ?? []).forEach((slide, i) => {
    slides.push(<MediaView key={`g-${i}`} slide={slide} fill />);
  });
  return slides;
}

/**
 * Zero-height disclosure: the marker sits on the meta line, and the note
 * itself fades in over the project's own image. Nothing below it moves.
 */
function AiOverlay({
  note,
  open,
  onClose,
}: {
  note: string;
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useLang();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 z-10 flex flex-col justify-between bg-ink-900/95 p-6 backdrop-blur-sm sm:p-8"
        >
          <div className="min-h-0 overflow-y-auto">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-brand-300">
              {t({ de: "KI im Einsatz", en: "AI involvement" })}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/80">{note}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/60 transition-colors hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
            {t({ de: "Schließen", en: "Close" })}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Projects() {
  const { t } = useLang();
  const [openAi, setOpenAi] = useState<string | null>(null);

  return (
    <Section id="projects">
      <SectionHeading
        index="02"
        eyebrow={t(ui.featured)}
        title={t({
          de: "Hier ein paar ausgewählte Projekte",
          en: "Projects I care about",
        })}
        intro={t({
          de: "Zwei ausgewählte Projekte, in denen Software und Bühne zusammenkommen",
          en: "Two featured builds where software and stage meet",
        })}
      />

      {/* Featured — each project is one self-contained band. */}
      <div className="mt-10 space-y-6">
        {featuredProjects.map((project, index) => {
          const flipped = index % 2 === 1;
          const aiOpen = openAi === project.slug;
          return (
            <Reveal key={project.slug}>
              <article className="overflow-hidden border border-line bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift">
                <div className="grid lg:grid-cols-2">
                  {/* Media fills its half edge to edge */}
                  <div
                    className={cn(
                      "relative overflow-hidden border-line bg-paper-soft max-lg:border-b lg:border-r",
                      flipped && "lg:order-last lg:border-l lg:border-r-0",
                    )}
                  >
                    <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full">
                      <Carousel
                        fill
                        subtle
                        className="h-full"
                        ariaLabel={project.title}
                        slides={slidesFor(project)}
                      />
                      {project.aiUsage && (
                        <AiOverlay
                          note={t(project.aiUsage)}
                          open={aiOpen}
                          onClose={() => setOpenAi(null)}
                        />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center p-6 sm:p-8">
                    <div className="flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.16em] text-ink-500">
                      <span>P-{String(index + 1).padStart(2, "0")}</span>
                      <span className="h-px flex-1 bg-line" aria-hidden />
                      {project.year && <span>{project.year}</span>}
                      {project.aiUsage && (
                        <>
                          <span className="h-px w-4 bg-line" aria-hidden />
                          <button
                            type="button"
                            onClick={() => setOpenAi(aiOpen ? null : project.slug)}
                            aria-expanded={aiOpen}
                            className="uppercase tracking-[0.16em] text-ink-500 underline decoration-ink-300 underline-offset-4 transition-colors hover:text-brand-700 hover:decoration-brand-400"
                          >
                            {t({ de: "KI-Einsatz", en: "AI use" })}
                          </button>
                        </>
                      )}
                    </div>

                  <h3 className="headline mt-4 text-2xl font-medium text-ink-900 sm:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-base font-medium text-brand-700">
                    {t(project.tagline)}
                  </p>
                  <p className="mt-5 text-[0.95rem] leading-relaxed text-ink-700">
                    {t(project.description)}
                  </p>

                  {project.highlights && (
                    <ul className="mt-6 space-y-2.5">
                      {project.highlights.map((h, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-sm leading-relaxed text-ink-500"
                        >
                          <span className="mt-2 h-px w-4 shrink-0 bg-brand-400" aria-hidden />
                          {t(h)}
                        </li>
                      ))}
                    </ul>
                  )}

                  <p className="mt-6 text-xs leading-relaxed text-ink-500">
                    {project.tech.join(" · ")}
                  </p>

                  {project.repo && (
                    <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-ink-900 transition-colors hover:text-brand-700"
                      >
                        <Github className="h-4 w-4" />
                        <span className="border-b border-ink-300 pb-0.5 transition-colors group-hover:border-brand-400">
                          {t(ui.sourceCode)}
                        </span>
                      </a>
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noreferrer"
                          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 transition-colors hover:text-brand-700"
                        >
                          <span className="border-b border-ink-300 pb-0.5 transition-colors group-hover:border-brand-400">
                            {t(ui.liveDemo)}
                          </span>
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* More projects — loaded live from GitHub */}
      <div className="mt-14">
        <div className="mb-5 flex items-end justify-between gap-4 border-t border-line pt-5">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-900">
              {t(ui.moreProjects)}
            </h3>
            <p className="mt-1 text-sm text-ink-500">
              {t({ de: "Live von GitHub geladen.", en: "Loaded live from GitHub." })}
            </p>
          </div>
          <a
            href="https://github.com/FinnKrause"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-900"
          >
            {t(ui.allProjects)}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <GithubProjects />
      </div>
    </Section>
  );
}
