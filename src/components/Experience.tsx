"use client";

import { ArrowRight, ArrowUpRight, Briefcase, GraduationCap, Youtube } from "lucide-react";
import { workExperience } from "@/content/experience";
import { education } from "@/content/education";
import type { ExperienceItem } from "@/content/types";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";
import { Reveal, RevealGroup, RevealItem } from "./motion/Reveal";
import { Gallery } from "./media/Gallery";
import { cn } from "@/lib/utils";

function ExpEntry({ item }: { item: ExperienceItem }) {
  const { t } = useLang();
  const links = [...(item.links ?? []), ...(item.link ? [item.link] : [])];

  return (
    <li className="relative">
      <span
        className={cn(
          "absolute -left-[2.1rem] top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-paper-soft",
          item.kind === "work" ? "bg-brand-600" : "bg-sky-500",
        )}
      />

      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <span className="text-xs font-medium uppercase tracking-wider text-brand-700">
          {t(item.period)}
        </span>
        {item.current && (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-emerald-700">
            {t({ de: "aktuell", en: "current" })}
          </span>
        )}
      </div>

      <h4 className="mt-1.5 text-base font-semibold text-ink-900">{t(item.role)}</h4>
      <p className="text-sm font-medium text-ink-700">
        {item.org}
        {item.location ? ` · ${item.location}` : ""}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{t(item.description)}</p>

      {item.more?.map((para, i) => (
        <p key={i} className="mt-2 text-sm leading-relaxed text-ink-500">
          {t(para)}
        </p>
      ))}

      {item.gallery && item.gallery.length > 0 && (
        <Gallery slides={item.gallery} className="mt-3 sm:max-w-md" />
      )}

      {links.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {links.map((link, i) => {
            const isYoutube = /youtu\.?be/.test(link.href);
            const internal = link.href.startsWith("#");
            const Icon = isYoutube ? Youtube : internal ? ArrowRight : ArrowUpRight;
            return (
              <a
                key={i}
                href={link.href}
                target={internal ? undefined : "_blank"}
                rel={internal ? undefined : "noreferrer"}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 transition-colors hover:text-brand-900"
              >
                <Icon className="h-4 w-4" />
                {t(link.label)}
              </a>
            );
          })}
        </div>
      )}
    </li>
  );
}

function ColumnHeader({ icon: Icon, label }: { icon: typeof Briefcase; label: string }) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center bg-brand-50 text-brand-700">
        <Icon className="h-4 w-4" />
      </span>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-700">{label}</h3>
    </div>
  );
}

export function Experience() {
  const { t } = useLang();

  return (
    <Section id="experience" className="bg-paper-soft">
      <SectionHeading
        index="05"
        eyebrow={t({ de: "Werdegang", en: "Experience" })}
        title={t({ de: "Beruf & Studium", en: "Work & studies" })}
        intro={t({
          de: "Berufliche Stationen neben dem Studium — und der Blick nach vorn. (Alles Ehrenamtliche findest du im Kapitel „Engagement“.)",
          en: "Professional roles alongside my studies — and a look ahead. (Everything voluntary lives in the “Involvement” chapter.)",
        })}
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Professional work */}
        <Reveal>
          <ColumnHeader icon={Briefcase} label={t({ de: "Berufserfahrung", en: "Professional work" })} />
          <ol className="relative ml-1.5 space-y-6 border-l border-line pl-7">
            {workExperience.map((item, i) => (
              <ExpEntry key={i} item={item} />
            ))}
          </ol>
        </Reveal>

        {/* Study & outlook */}
        <Reveal delay={0.08}>
          <ColumnHeader icon={GraduationCap} label={t({ de: "Studium & Ausblick", en: "Study & what's next" })} />
          <RevealGroup className="space-y-3" stagger={0.07}>
            {education.map((edu, i) => (
              <RevealItem key={i}>
                <div
                  className={cn(
                    "flex flex-col border-t pt-5",
                    edu.upcoming
                      ? "border-brand-300"
                      : "border-line",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-brand-700">
                      {t(edu.period)}
                    </span>
                    {edu.upcoming && (
                      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-brand-700">
                        {t({ de: "geplant", en: "planned" })}
                      </span>
                    )}
                  </div>
                  <h4 className="mt-2 text-base font-semibold text-ink-900">{t(edu.title)}</h4>
                  <p className="text-sm font-medium text-ink-700">{edu.org}</p>
                  {edu.description && (
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{t(edu.description)}</p>
                  )}
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Reveal>
      </div>
    </Section>
  );
}
