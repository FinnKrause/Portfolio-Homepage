"use client";

import { ArrowUpRight, Car, Plane } from "lucide-react";
import { profile } from "@/content/profile";
import { useLang } from "@/lib/i18n";
import { Section } from "./Section";
import { Reveal } from "./motion/Reveal";
import { ImageRotator } from "./media/ImageRotator";

const HOBBY_ICONS: Record<string, typeof Car> = { rc: Car, travel: Plane };

const ABOUT_IMAGES = [
  { src: "/images/stage-lighting.jpg", alt: { de: "Von Finn gebaute Festivalbühne mit Lichttechnik.", en: "Festival stage built by Finn with lighting." } },
  { src: "/images/apc-image1.png", alt: { de: "APCmini-Middleware — selbst entwickelte Lichtsteuerung.", en: "APCmini middleware — self-built lighting control." } },
  { src: "/images/stage-lighting3.png", alt: { de: "Lichtdesign auf einer Veranstaltung.", en: "Lighting design at an event." } },
  { src: "/images/f1-podium2.JPG", alt: { de: "F1 in Schools — Weltfinale in Singapur.", en: "F1 in Schools — World Finals in Singapore." } },
];

export function About() {
  const { t } = useLang();

  return (
    <Section id="about">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Text */}
        <div>
          <Reveal>
            <p className="eyebrow">{t({ de: "Über mich", en: "About" })}</p>
            <h2 className="headline mt-3 text-3xl font-semibold text-ink-900 sm:text-4xl">
              {t({
                de: "Technik, Bühne und Gemeinschaft",
                en: "Technology, stage and community",
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

          {/* What I do — compact, text only */}
          <Reveal className="mt-8">
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {profile.pillars.map((pillar) => (
                <div key={pillar.key} className="border-l-2 border-brand-100 pl-4">
                  <dt className="text-sm font-semibold text-ink-900">{t(pillar.title)}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink-500">{t(pillar.body)}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* Hobbies */}
          <Reveal className="mt-8">
            <p className="eyebrow">{t(profile.hobbies.title)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.hobbies.items.map((h) => {
                const Icon = HOBBY_ICONS[h.key] ?? Car;
                return (
                  <a
                    key={h.key}
                    href={h.link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-medium text-ink-700 shadow-sm transition-colors hover:border-brand-200 hover:text-brand-700"
                  >
                    <Icon className="h-4 w-4 text-brand-600" />
                    {t(h.title)}
                    <ArrowUpRight className="h-3.5 w-3.5 text-ink-300 transition-colors group-hover:text-brand-600" />
                  </a>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* Rotating image panel */}
        <Reveal>
          <div className="lg:sticky lg:top-24">
            <ImageRotator
              images={ABOUT_IMAGES.map((img) => ({ src: img.src, alt: t(img.alt) }))}
              className="aspect-[4/5] w-full rounded-3xl border border-line shadow-lift sm:aspect-[4/3] lg:aspect-[4/5]"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
