"use client";

import Image from "next/image";
import { ArrowUpRight, Car, Plane } from "lucide-react";
import { profile } from "@/content/profile";
import { useLang } from "@/lib/i18n";
import { Section } from "./Section";
import { Reveal } from "./motion/Reveal";
import { Carousel } from "./media/Carousel";

const HOBBY_ICONS: Record<string, typeof Car> = { rc: Car, travel: Plane };

// A click-through of moments Finn is actually in — competition, coaching,
// jury work, on stage and on the road.
const FINN_IMAGES = [
  { src: "/images/f1-image1.jpeg", alt: { de: "Finn feiert den Weltmeistertitel bei den F1 in Schools World Finals in Singapur.", en: "Finn celebrating the world title at the F1 in Schools World Finals in Singapore." } },
  { src: "/images/f1-podium.jpg", alt: { de: "Recoil Racing als Weltmeister 2023 auf dem Podium in Singapur.", en: "Recoil Racing as 2023 World Champions on the podium in Singapore." } },
  { src: "/images/umbruchszeiten-judge-image2.png", alt: { de: "Finn als Jurymitglied im Interview bei Umbruchszeiten.", en: "Finn as a jury member during an Umbruchszeiten interview." } },
  { src: "/images/fsi-image3.png", alt: { de: "Finn auf der Bühne bei einer Veranstaltung.", en: "Finn on stage at an event." } },
  { src: "/images/f1-france-image1.png", alt: { de: "Finn (rechts) als Coach beim französischen F1-in-Schools-Finale.", en: "Finn (right) coaching at the French F1 in Schools finals." } },
  { src: "/images/f1-france-image2.png", alt: { de: "Mit dem französischen Team LLP Racing in Avignon.", en: "With the French team LLP Racing in Avignon." } },
  { src: "/images/f1-thailand-image1.png", alt: { de: "Finn zu Besuch im F1-in-Schools-Hauptquartier in Thailand.", en: "Finn visiting the F1 in Schools headquarters in Thailand." } },
  { src: "/images/finn-portrait2.jpg", alt: { de: "Finn auf Reisen in Paris.", en: "Finn travelling in Paris." } },
  { src: "/images/f1-image2.png", alt: { de: "Team-Selfie am Marina Bay Street Circuit in Singapur.", en: "Team selfie at the Marina Bay Street Circuit in Singapore." } },
];

export function About() {
  const { t } = useLang();

  return (
    <Section id="about" glow>
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

        {/* Click-through gallery of Finn in action */}
        <Reveal>
          <div className="lg:sticky lg:top-24">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-line shadow-lift sm:aspect-[4/3] lg:aspect-[4/5]">
              <Carousel
                fill
                subtle
                ariaLabel={t({ de: "Eindrücke von Finn", en: "Impressions of Finn" })}
                slides={FINN_IMAGES.map((img) => (
                  <div key={img.src} className="relative h-full w-full">
                    <Image
                      src={img.src}
                      alt={t(img.alt)}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40rem"
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  </div>
                ))}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
