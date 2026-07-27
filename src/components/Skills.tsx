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

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        {/* Skill groups */}
        <RevealGroup className="grid gap-8 sm:grid-cols-2">
          {skillGroups.map((group, i) => (
            <RevealItem key={group.title.en}>
              <h3 className="flex items-baseline gap-2.5 border-t border-line pt-4 text-sm font-semibold uppercase tracking-wide text-ink-900">
                <span className="text-[0.62rem] font-medium text-brand-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t(group.title)}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-ink-700"
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
          <div className="border-t border-line pt-6">
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink-500">{t({ de: "Sprachen", en: "Languages" })}</h3>
            <ul className="mt-5 space-y-5">
              {languages.map((lang) => (
                <li key={lang.name.en}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-semibold text-ink-900">{t(lang.name)}</span>
                    <span className="text-xs text-ink-500">{t(lang.level)}</span>
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
