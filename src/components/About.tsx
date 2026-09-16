"use client";

import Image from "next/image";
import { ArrowUpRight, Car, Plane } from "lucide-react";
import { profile } from "@/content/profile";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";
import { Carousel } from "./media/Carousel";

const HOBBY_ICONS: Record<string, typeof Car> = { rc: Car, travel: Plane };

// A click-through of moments Finn is actually in — competition, coaching,
// jury work, on stage and on the road.
const FINN_IMAGES = [
  { src: "/images/Stagelighting/stage-lighting3.png", alt: { de: "Finn am Lichtpult einer Veranstaltung.", en: "Finn at the lighting desk of an event." } },
  { src: "/images/Competitions/F1/f1-image1.jpeg", alt: { de: "Finn feiert den Weltmeistertitel bei den F1 in Schools World Finals in Singapur.", en: "Finn celebrating the world title at the F1 in Schools World Finals in Singapore." } },
  { src: "/images/Competitions/Umbruchszeiten/umbruchszeiten-judge-image2.png", alt: { de: "Finn als Jurymitglied im Interview bei Umbruchszeiten.", en: "Finn as a jury member during an Umbruchszeiten interview." } },
  { src: "/images/General-Impressions/finn-rede-image1.jpeg", alt: { de: "Finn bei einer Rede vor Publikum.", en: "Finn giving a speech in front of an audience." } },
  { src: "/images/Competitions/F1/f1-podium.jpg", alt: { de: "Recoil Racing als Weltmeister 2023 auf dem Podium in Singapur.", en: "Recoil Racing as 2023 World Champions on the podium in Singapore." } },
  { src: "/images/Competitions/F1/f1-france-image1.png", alt: { de: "Finn (rechts) als Coach beim französischen F1-in-Schools-Finale.", en: "Finn (right) coaching at the French F1 in Schools finals." } },
  { src: "/images/Competitions/F1/f1-france-image2.png", alt: { de: "Mit dem französischen Team LLP Racing in Avignon.", en: "With the French team LLP Racing in Avignon." } },
  { src: "/images/Competitions/F1/f1-thailand-image1.png", alt: { de: "Finn zu Besuch im F1-in-Schools-Hauptquartier in Thailand.", en: "Finn visiting the F1 in Schools headquarters in Thailand." } },
  { src: "/images/Competitions/F1/f1-image2.png", alt: { de: "Team-Selfie am Marina Bay Street Circuit in Singapur.", en: "Team selfie at the Marina Bay Street Circuit in Singapore." } },
  { src: "/images/General-Impressions/finn-onfilmset-image1.JPG", alt: { de: "Finn bei einer Filmproduktion am Set.", en: "Finn on set during a film production." } },
  { src: "/images/Portraits/finn-portrait2.jpg", alt: { de: "Finn auf Reisen.", en: "Finn travelling." } },
];

export function About() {
  const { t } = useLang();

  return (
    <Section id="about" surface="cloud">
      <SectionHeading
        title={t({
          de: "Technik, Bühne und Gemeinschaft",
          en: "Technology, stage and community",
        })}
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Text — held to a readable measure rather than the full column. */}
        <div className="lg:col-span-6">
          <div className="max-w-[66ch] space-y-5">
            {profile.aboutBody.map((para, i) => (
              <p key={i} className="text-body text-charcoal">
                {t(para)}
              </p>
            ))}
          </div>

          {/* Four pillars, as a definition list — the structure is the content. */}
          <dl className="mt-10 grid gap-x-10 gap-y-6 border-t border-hairline pt-8 sm:grid-cols-2">
            {profile.pillars.map((pillar) => (
              <div key={pillar.key}>
                <dt className="text-body font-medium">{t(pillar.title)}</dt>
                <dd className="mt-2 text-caption text-graphite">{t(pillar.body)}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 border-t border-hairline pt-8">
            <h3 className="display-xs">{t(profile.hobbies.title)}</h3>
            <ul className="mt-4 space-y-3">
              {profile.hobbies.items.map((h) => {
                const Icon = HOBBY_ICONS[h.key] ?? Car;
                return (
                  <li key={h.key} className="flex gap-3">
                    <Icon className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <div>
                      <p className="text-body font-medium">{t(h.title)}</p>
                      <p className="mt-0.5 text-caption text-graphite">{t(h.body)}</p>
                      <a
                        href={h.link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="link mt-1 text-caption"
                      >
                        {t(h.link.label)}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Photography in a 16px frame, sticky so it stays with the reading. */}
        <div className="lg:col-span-5 lg:col-start-8">
          <div className="lg:sticky lg:top-36">
            <div className="frame relative aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-[4/5]">
              <Carousel
                subtle
                ariaLabel={t({ de: "Eindrücke von Finn", en: "Impressions of Finn" })}
                slides={FINN_IMAGES.map((img, i) => (
                  <div key={img.src} className="relative h-full w-full">
                    <Image
                      src={img.src}
                      alt={t(img.alt)}
                      fill
                      quality={95}
                      /* The first slide is the one you actually arrive at, so
                         it gets to load ahead of everything below the fold. */
                      priority={i === 0}
                      /* The frame is portrait but most of these photos are
                         landscape: object-cover paints them ~2x wider than the
                         frame and crops the sides, so the browser needs a far
                         larger intrinsic image than the frame width suggests. */
                      sizes="(max-width: 1024px) 200vw, 950px"
                      className="object-cover"
                    />
                  </div>
                ))}
              />
            </div>
            <p className="mt-3 text-caption text-graphite">
              {t({ de: "Eindrücke aus den letzten Jahren", en: "Impressions from the last few years" })}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
