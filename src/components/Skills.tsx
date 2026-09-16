"use client";

import { skillGroups, languages } from "@/content/skills";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";
import { cn } from "@/lib/utils";

export function Skills() {
  const { t } = useLang();

  return (
    <Section id="skills" surface="canvas">
      <SectionHeading title={t({ de: "Womit ich arbeite", en: "What I work with" })} />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        {/* Skill groups — outlined chips, so a long list stays scannable. */}
        <div className="grid gap-8 sm:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.title.en}>
              <h3 className="display-xs border-t border-steel pt-5">{t(group.title)}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="badge badge-outline text-caption">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Languages, with the proficiency meter. */}
        <div>
          <h3 className="display-xs border-t border-steel pt-5">
            {t({ de: "Sprachen", en: "Languages" })}
          </h3>
          <ul className="mt-6 space-y-6">
            {languages.map((lang) => (
              <li key={lang.name.en}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-body font-medium">{t(lang.name)}</span>
                  <span className="text-caption text-graphite">{t(lang.level)}</span>
                </div>
                {/* The meter fills in ink, not blue: four of these in one
                    viewport would spend the whole page's allowance of the
                    signal colour on a bar chart of language levels. */}
                <div className="mt-2.5 flex gap-1.5" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-1.5 flex-1 rounded-sm",
                        i < lang.meter ? "bg-ink" : "bg-fog",
                      )}
                    />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
