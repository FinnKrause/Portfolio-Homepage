"use client";

import { useState, type ReactNode } from "react";
import { ArrowUpRight, Github, X } from "lucide-react";
import { featuredProjects } from "@/content/projects";
import type { Project } from "@/content/types";
import { ui } from "@/content/ui";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading, SubHeading } from "./Section";
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
    slides.push(<MediaView key={`g-${i}`} slide={slide} />);
  });
  return slides;
}

/**
 * The AI note, disclosed over the project's own image rather than pushed into
 * the layout. Opening it costs no height, so nothing below the card moves.
 */
function AiNote({ note, open, onClose }: { note: string; open: boolean; onClose: () => void }) {
  const { t } = useLang();
  if (!open) return null;
  return (
    <div className="band-ink absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-8">
      <div className="min-h-0 overflow-y-auto">
        <h4 className="display-xs">{t({ de: "KI im Einsatz", en: "How AI was used" })}</h4>
        <p className="mt-3 text-caption text-white/75">{note}</p>
      </div>
      <button type="button" onClick={onClose} className="btn btn-outline-ink mt-4 self-start">
        <X className="h-4 w-4" />
        {t({ de: "Schließen", en: "Close" })}
      </button>
    </div>
  );
}

export function Projects() {
  const { t } = useLang();
  const [openAi, setOpenAi] = useState<string | null>(null);

  return (
    <Section id="projects" surface="canvas">
      <SectionHeading
        title={t({
          de: "Zwei Projekte, in denen Software und Bühne zusammenkommen",
          en: "Two builds where software and stage meet",
        })}
        intro={t({
          de: "Beide sind aus einem konkreten Problem an einer echten Veranstaltung entstanden und laufen dort bis heute.",
          en: "Both started as a concrete problem at a real event, and both still run there.",
        })}
      />

      {/* Feature rows: photo on one half, copy on the other, alternating. */}
      <div className="mt-12 space-y-6">
        {featuredProjects.map((project, index) => {
          const flipped = index % 2 === 1;
          const aiOpen = openAi === project.slug;
          return (
            <article key={project.slug} className="card overflow-hidden lg:grid lg:grid-cols-2">
              <div
                className={cn(
                  "relative aspect-[4/3] w-full bg-cloud sm:aspect-[16/9] lg:aspect-auto lg:min-h-[26rem]",
                  flipped && "lg:order-last",
                )}
              >
                <Carousel subtle className="h-full" ariaLabel={project.title} slides={slidesFor(project)} />
                {project.aiUsage && (
                  <AiNote note={t(project.aiUsage)} open={aiOpen} onClose={() => setOpenAi(null)} />
                )}
              </div>

              <div className="flex flex-col justify-center p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  {project.year && <span className="badge badge-outline">{project.year}</span>}
                  {project.aiUsage && (
                    <button
                      type="button"
                      onClick={() => setOpenAi(aiOpen ? null : project.slug)}
                      aria-expanded={aiOpen}
                      className="badge badge-soft transition-colors hover:bg-primary hover:text-on-ink"
                    >
                      {t({ de: "KI-Einsatz", en: "How AI was used" })}
                    </button>
                  )}
                </div>

                <h3 className="display-lg mt-5">{project.title}</h3>
                <p className="mt-3 text-body-lg text-primary">{t(project.tagline)}</p>
                <p className="mt-5 max-w-[62ch] text-body text-charcoal">{t(project.description)}</p>

                {project.highlights && (
                  <ul className="mt-6 space-y-3 border-t border-hairline pt-6">
                    {project.highlights.map((h, i) => (
                      <li key={i} className="flex gap-3 text-caption text-charcoal">
                        <span className="mt-2.5 h-0.5 w-3 shrink-0 bg-primary" aria-hidden />
                        {t(h)}
                      </li>
                    ))}
                  </ul>
                )}

                <p className="mt-6 text-fine text-graphite">{project.tech.join(" · ")}</p>

                {project.repo && (
                  <div className="mt-7 flex flex-wrap gap-3">
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-ink"
                    >
                      <Github className="h-4 w-4" />
                      {t(ui.sourceCode)}
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                      >
                        {t(ui.liveDemo)}
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* More projects — loaded live from GitHub */}
      <div className="mt-16">
        <SubHeading
          title={t(ui.moreProjects)}
          intro={t({ de: "Live von GitHub geladen.", en: "Loaded live from GitHub." })}
          action={
            <a
              href="https://github.com/FinnKrause"
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              {t(ui.allProjects)}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          }
        />
        <div className="mt-6">
          <GithubProjects />
        </div>
      </div>
    </Section>
  );
}
