"use client";

import Image from "next/image";
import { Code2, Lightbulb, ShieldCheck, Users } from "lucide-react";
import { profile } from "@/content/profile";
import { useLang } from "@/lib/i18n";
import { Section } from "./Section";
import { Reveal, RevealGroup, RevealItem } from "./motion/Reveal";

const ICONS: Record<string, typeof Code2> = {
  software: Code2,
  events: Lightbulb,
  security: ShieldCheck,
  leadership: Users,
};

export function About() {
  const { t } = useLang();

  return (
    <Section id="about">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div>
          <Reveal>
            <p className="eyebrow">{t({ de: "Über mich", en: "About" })}</p>
            <h2 className="headline mt-3 text-3xl font-semibold text-ink-900 sm:text-4xl">
              {t({
                de: "Technik, Kreativität und Verantwortung",
                en: "Technology, creativity and responsibility",
              })}
            </h2>
          </Reveal>
          <div className="mt-6 space-y-4">
            {profile.aboutBody.map((para, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p className="text-base leading-relaxed text-ink-500 sm:text-lg">{t(para)}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <RevealGroup className="grid gap-4 sm:grid-cols-2">
          {profile.pillars.map((pillar) => {
            const Icon = ICONS[pillar.key] ?? Code2;
            return (
              <RevealItem key={pillar.key}>
                <div className="group h-full rounded-2xl border border-line bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-ink-900">{t(pillar.title)}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{t(pillar.body)}</p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>

      {/* Event-tech image band */}
      <Reveal className="mt-14">
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-line shadow-lift sm:aspect-[21/9]">
          <Image
            src="/images/stage-lighting.jpg"
            alt={t({
              de: "Von Finn geplante Festivalbühne mit Traversen, Moving Heads und Lichtdesign.",
              en: "Festival stage designed by Finn, with truss, moving heads and lighting design.",
            })}
            fill
            sizes="(max-width: 1024px) 100vw, 72rem"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5 sm:p-7">
            <span className="eyebrow !text-sky-200">
              {t({ de: "Veranstaltungstechnik", en: "Event technology" })}
            </span>
            <p className="mt-2 max-w-lg text-lg font-semibold text-white sm:text-xl">
              {t({
                de: "Festivalbühne der WiWi-Meisterschaften — von der Planung bis zum Lichtdesign.",
                en: "The WiWi-Meisterschaften festival stage — from planning to lighting design.",
              })}
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
