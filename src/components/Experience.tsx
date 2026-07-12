"use client";

import { ArrowUpRight, Briefcase, GraduationCap, HeartHandshake, Youtube } from "lucide-react";
import { workExperience, voluntaryExperience } from "@/content/experience";
import { education } from "@/content/education";
import type { ExperienceItem } from "@/content/types";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";
import { Reveal, RevealGroup, RevealItem } from "./motion/Reveal";
import { MediaView } from "./media/MediaView";
import { cn } from "@/lib/utils";

function ExpEntry({ item }: { item: ExperienceItem }) {
  const { t } = useLang();
  const isYoutube = item.link?.href.includes("youtu");

  return (
    <li className="relative">
      <span
        className={cn(
          "absolute -left-[2.1rem] top-1.5 grid h-3.5 w-3.5 place-items-center rounded-full ring-4 ring-paper-soft",
          item.kind === "work" ? "bg-brand-600" : "bg-sky-500",
        )}
      >
        {item.current && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
        )}
      </span>

      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <span className="font-mono text-xs uppercase tracking-wider text-brand-700">
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
        <div className="mt-3 grid grid-cols-2 gap-2 sm:max-w-sm">
          {item.gallery.map((slide, i) => (
            <MediaView key={i} slide={slide} />
          ))}
        </div>
      )}

      {item.link && (
        <a
          href={item.link.href}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-900"
        >
          {isYoutube ? <Youtube className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
          {t(item.link.label)}
        </a>
      )}
    </li>
  );
}

function ColumnHeader({ icon: Icon, label }: { icon: typeof Briefcase; label: string }) {
  return (
    <div className="mb-6 flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-700">
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
        eyebrow={t({ de: "Werdegang", en: "Experience" })}
        title={t({ de: "Beruf & Ehrenamt", en: "Work & involvement" })}
        intro={t({
          de: "Berufliche Stationen und ehrenamtliches Engagement — oft an der Schnittstelle von Technik und Menschen.",
          en: "Professional roles and voluntary involvement — often at the intersection of technology and people.",
        })}
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Professional */}
        <Reveal>
          <ColumnHeader icon={Briefcase} label={t({ de: "Berufserfahrung", en: "Professional work" })} />
          <ol className="relative ml-1.5 space-y-8 border-l border-line pl-7">
            {workExperience.map((item, i) => (
              <ExpEntry key={i} item={item} />
            ))}
          </ol>
        </Reveal>

        {/* Voluntary */}
        <Reveal delay={0.08}>
          <ColumnHeader icon={HeartHandshake} label={t({ de: "Ehrenamt & Engagement", en: "Voluntary work" })} />
          <ol className="relative ml-1.5 space-y-8 border-l border-line pl-7">
            {voluntaryExperience.map((item, i) => (
              <ExpEntry key={i} item={item} />
            ))}
          </ol>
        </Reveal>
      </div>

      {/* Study & outlook */}
      <Reveal className="mt-14">
        <ColumnHeader icon={GraduationCap} label={t({ de: "Studium & Ausblick", en: "Study & what's next" })} />
        <RevealGroup className="grid gap-3 sm:grid-cols-3" stagger={0.07}>
          {education.map((edu, i) => (
            <RevealItem key={i}>
              <div
                className={cn(
                  "flex h-full flex-col rounded-2xl border p-5",
                  edu.upcoming
                    ? "border-dashed border-brand-200 bg-brand-50/40"
                    : "border-line bg-white shadow-sm",
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-brand-700">
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
    </Section>
  );
}
