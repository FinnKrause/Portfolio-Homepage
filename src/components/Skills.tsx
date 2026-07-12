"use client";

import { skillGroups, languages } from "@/content/skills";
import { useLang } from "@/lib/i18n";
import { Reveal, RevealGroup, RevealItem } from "./motion/Reveal";
import { cn } from "@/lib/utils";

export function Skills() {
  const { t } = useLang();

  return (
    <section id="skills" className="relative py-20 md:py-28">
      <div className="mx-container">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Skill groups */}
          <div>
            <Reveal>
              <p className="eyebrow">{t({ de: "Fähigkeiten", en: "Skills" })}</p>
              <h2 className="headline mt-3 text-3xl font-semibold text-ink-900 sm:text-4xl">
                {t({ de: "Womit ich arbeite", en: "What I work with" })}
              </h2>
            </Reveal>

            <RevealGroup className="mt-8 grid gap-6 sm:grid-cols-2">
              {skillGroups.map((group) => (
                <RevealItem key={group.title.en}>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-700">
                    {t(group.title)}
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-medium text-ink-700 shadow-sm transition-colors hover:border-brand-200 hover:text-brand-700"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          {/* Languages */}
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-line bg-gradient-to-br from-paper-soft to-white p-6 shadow-soft sm:p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-700">
                {t({ de: "Sprachen", en: "Languages" })}
              </h3>
              <ul className="mt-5 space-y-5">
                {languages.map((lang) => (
                  <li key={lang.name.en}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-semibold text-ink-900">{t(lang.name)}</span>
                      <span className="text-sm text-ink-500">{t(lang.level)}</span>
                    </div>
                    <div className="mt-2 flex gap-1.5" aria-hidden>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={cn(
                            "h-1.5 flex-1 rounded-full",
                            i < lang.meter
                              ? "bg-gradient-to-r from-brand-600 to-sky-400"
                              : "bg-line",
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
      </div>
    </section>
  );
}
