"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Car, Plane } from "lucide-react";
import { profile } from "@/content/profile";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./motion/Reveal";
import { Carousel } from "./media/Carousel";

const HOBBY_ICONS: Record<string, typeof Car> = { rc: Car, travel: Plane };

// A click-through of moments Finn is actually in — competition, coaching,
// jury work, on stage and on the road.
const FINN_IMAGES = [
  { src: "/images/f1-image1.jpeg", alt: { de: "Finn feiert den Weltmeistertitel bei den F1 in Schools World Finals in Singapur.", en: "Finn celebrating the world title at the F1 in Schools World Finals in Singapore." } },
  { src: "/images/f1-podium.jpg", alt: { de: "Recoil Racing als Weltmeister 2023 auf dem Podium in Singapur.", en: "Recoil Racing as 2023 World Champions on the podium in Singapore." } },
  { src: "/images/umbruchszeiten-judge-image2.png", alt: { de: "Finn als Jurymitglied im Interview bei Umbruchszeiten.", en: "Finn as a jury member during an Umbruchszeiten interview." } },
  { src: "/images/f1-france-image1.png", alt: { de: "Finn (rechts) als Coach beim französischen F1-in-Schools-Finale.", en: "Finn (right) coaching at the French F1 in Schools finals." } },
  { src: "/images/f1-france-image2.png", alt: { de: "Mit dem französischen Team LLP Racing in Avignon.", en: "With the French team LLP Racing in Avignon." } },
  { src: "/images/f1-thailand-image1.png", alt: { de: "Finn zu Besuch im F1-in-Schools-Hauptquartier in Thailand.", en: "Finn visiting the F1 in Schools headquarters in Thailand." } },
  { src: "/images/f1-image2.png", alt: { de: "Team-Selfie am Marina Bay Street Circuit in Singapur.", en: "Team selfie at the Marina Bay Street Circuit in Singapore." } },
];

export function About() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // The images start level with the text and drift downwards as you read.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <Section id="about">
      <SectionHeading
        index="01"
        eyebrow={t({ de: "Profil", en: "Profile" })}
        title={t({
          de: "Technik, Bühne und Gemeinschaft",
          en: "Technology, stage and community",
        })}
      />

      <div ref={ref} className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Text */}
        <div className="lg:col-span-6">
          <div className="space-y-4">
            {profile.aboutBody.map((para, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p className="text-base leading-relaxed text-ink-700 sm:text-[1.05rem]">
                  {t(para)}
                </p>
              </Reveal>
            ))}
          </div>

          {/* What I do */}
          <Reveal className="mt-8">
            <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {profile.pillars.map((pillar) => (
                <div key={pillar.key}>
                  <dt className="text-sm font-semibold text-ink-900">{t(pillar.title)}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-ink-500">
                    {t(pillar.body)}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* Hobbies */}
          <Reveal className="mt-8">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink-500">
              {t(profile.hobbies.title)}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
              {profile.hobbies.items.map((h) => {
                const Icon = HOBBY_ICONS[h.key] ?? Car;
                return (
                  <a
                    key={h.key}
                    href={h.link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-ink-700 transition-colors hover:text-brand-700"
                  >
                    <Icon className="h-4 w-4 text-brand-600" />
                    <span className="border-b border-ink-300 pb-0.5 transition-colors group-hover:border-brand-400">
                      {t(h.title)}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-ink-300 transition-colors group-hover:text-brand-600" />
                  </a>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* Images — start level with the text, then drift down past it */}
        <Reveal className="lg:col-span-5 lg:col-start-8">
          <motion.div style={reduce ? undefined : { y: drift }}>
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-soft sm:aspect-[16/10] lg:aspect-[4/5]">
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
                      quality={90}
                      sizes="(max-width: 1024px) 100vw, 40rem"
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  </div>
                ))}
              />
            </div>
            <p className="mt-3 text-[0.68rem] uppercase tracking-[0.16em] text-ink-500">
              {t({ de: "Eindrücke", en: "Impressions" })}
            </p>
          </motion.div>
        </Reveal>
      </div>
    </Section>
  );
}
