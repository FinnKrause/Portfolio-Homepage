"use client";

import { skillGroups, languages } from "@/content/skills";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";
import { Reveal, RevealGroup, RevealItem } from "./motion/Reveal";
import { cn } from "@/lib/utils";

export function Skills() {
  const { t } = useLang();

  return (
    <Section id="skills">
      <SectionHeading
        index="07"
        eyebrow={t({ de: "Fähigkeiten", en: "Skills" })}
        title={t({ de: "Womit ich arbeite", en: "What I work with" })}
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        {/* Skill groups */}
        <RevealGroup className="grid gap-8 sm:grid-cols-2">
          {skillGroups.map((group, i) => (
            <RevealItem key={group.title.en}>
              <h3 className="flex items-baseline gap-2.5 border-t border-line pt-4 text-sm font-semibold uppercase tracking-wide text-ink-900">
                <span className="font-mono text-[0.62rem] font-medium text-brand-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t(group.title)}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border border-line bg-white px-3 py-1.5 font-mono text-xs font-medium text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Languages */}
        <Reveal delay={0.1}>
          <div className="border border-line bg-paper-soft p-6 sm:p-8">
            <h3 className="index-label">{t({ de: "Sprachen", en: "Languages" })}</h3>
            <ul className="mt-5 space-y-5">
              {languages.map((lang) => (
                <li key={lang.name.en}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-semibold text-ink-900">{t(lang.name)}</span>
                    <span className="font-mono text-xs text-ink-500">{t(lang.level)}</span>
                  </div>
                  <div className="mt-2 flex gap-1.5" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-1 flex-1",
                          i < lang.meter ? "bg-brand-600" : "bg-line",
                        )}
                      />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
