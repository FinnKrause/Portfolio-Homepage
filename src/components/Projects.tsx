"use client";

import type { ReactNode } from "react";
import { ArrowUpRight, Check, Github } from "lucide-react";
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

const ACCENT_PANEL: Record<NonNullable<Project["accent"]>, string> = {
  brand: "from-brand-50 to-paper-soft",
  sky: "from-sky-50 to-paper-soft",
  violet: "from-violet-50 to-paper-soft",
  emerald: "from-emerald-50 to-paper-soft",
  amber: "from-amber-50 to-paper-soft",
};

function slidesFor(project: Project): ReactNode[] {
  const slides: ReactNode[] = [
    <div key="visual" className="flex h-full w-full items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm">{VISUALS[project.slug]}</div>
    </div>,
  ];
  (project.gallery ?? []).forEach((slide, i) => {
    slides.push(<MediaView key={`g-${i}`} slide={slide} fill />);
  });
  return slides;
}

export function Projects() {
  const { t } = useLang();

  return (
    <Section id="projects" className="bg-paper-soft">
      <SectionHeading
        index="02"
        eyebrow={t(ui.featured)}
        title={t({ de: "Projekte, die mir wichtig sind", en: "Projects I care about" })}
        intro={t({
          de: "Zwei ausgewählte Arbeiten, in denen Software und Bühne zusammenkommen — mit durchklickbaren Eindrücken.",
          en: "Two featured builds where software and stage meet — with a gallery you can click through.",
        })}
      />

      {/* Featured */}
      <div className="mt-12 space-y-8">
        {featuredProjects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.05}>
            <article className="overflow-hidden border border-line bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift">
              <div className="grid lg:grid-cols-2">
                {/* Visual carousel — media fills the panel edge-to-edge */}
                <div
                  className={cn(
                    "relative overflow-hidden border-line bg-gradient-to-br max-lg:border-b lg:border-r",
                    ACCENT_PANEL[project.accent ?? "brand"],
                    index % 2 === 1 && "lg:order-last lg:border-l lg:border-r-0",
                  )}
                >
                  <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full">
                    <Carousel fill className="h-full" ariaLabel={project.title} slides={slidesFor(project)} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center p-6 sm:p-10">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-medium uppercase tracking-widest text-brand-700">
                      P-{String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px flex-1 bg-line" />
                    {project.year && (
                      <span className="font-mono text-xs text-ink-500">{project.year}</span>
                    )}
                  </div>

                  <h3 className="headline mt-4 text-2xl font-semibold text-ink-900 sm:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-base font-medium text-brand-700">{t(project.tagline)}</p>
                  <p className="mt-4 text-sm leading-relaxed text-ink-500 sm:text-base">
                    {t(project.description)}
                  </p>

                  {project.highlights && (
                    <ul className="mt-5 space-y-2">
                      {project.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-ink-700">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                          {t(h)}
                        </li>
                      ))}
                    </ul>
                  )}

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <li
                        key={tech}
                        className="border border-line bg-paper-soft px-2.5 py-1 font-mono text-xs text-ink-700"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>

                  {project.repo && (
                    <div className="mt-7 flex flex-wrap gap-3">
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                      >
                        <Github className="h-4 w-4" />
                        {t(ui.sourceCode)}
                      </a>
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-ink-900 transition-colors hover:border-brand-300 hover:text-brand-700"
                        >
                          {t(ui.liveDemo)}
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* More projects — smaller, loaded live from GitHub */}
      <div className="mt-14">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-ink-900">{t(ui.moreProjects)}</h3>
            <p className="mt-0.5 text-sm text-ink-500">
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
