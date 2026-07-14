"use client";

import type { ReactNode } from "react";
import { ArrowUpRight, Car, Plane } from "lucide-react";
import { profile } from "@/content/profile";
import type { MediaSlide } from "@/content/types";
import { useLang } from "@/lib/i18n";
import { Section } from "./Section";
import { Reveal } from "./motion/Reveal";
import { Carousel } from "./media/Carousel";
import { MediaView } from "./media/MediaView";
import { cn } from "@/lib/utils";

const HOBBY_ICONS: Record<string, typeof Car> = { rc: Car, travel: Plane };

function topicSlides(gallery: MediaSlide[]): ReactNode[] {
  return gallery.map((slide, i) => <MediaView key={i} slide={slide} fill />);
}

export function About() {
  const { t } = useLang();

  return (
    <Section id="about">
      {/* Intro */}
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">{t({ de: "Über mich", en: "About" })}</p>
          <h2 className="headline mt-3 text-3xl font-semibold text-ink-900 sm:text-4xl">
            {t({
              de: "Ein breiter Blick auf das, was mich ausmacht",
              en: "A broad look at what makes me tick",
            })}
          </h2>
        </Reveal>
        <div className="space-y-4">
          {profile.aboutBody.map((para, i) => (
            <Reveal key={i} delay={0.05 * i}>
              <p className="text-base leading-relaxed text-ink-500 sm:text-lg">{t(para)}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Topic blocks — carousel + text, alternating */}
      <div className="mt-16 space-y-6">
        {profile.aboutTopics.map((topic, index) => (
          <Reveal key={topic.key} delay={index * 0.03}>
            <article className="overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
              <div className="grid lg:grid-cols-2">
                <div
                  className={cn(
                    "relative overflow-hidden bg-gradient-to-br from-brand-50 to-sky-50",
                    index % 2 === 1 && "lg:order-last",
                  )}
                >
                  <div className="relative aspect-[16/10] w-full lg:absolute lg:inset-0 lg:aspect-auto lg:h-full">
                    <Carousel fill className="h-full" ariaLabel={t(topic.title)} slides={topicSlides(topic.gallery)} />
                  </div>
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-10">
                  <span className="font-mono text-xs font-medium uppercase tracking-widest text-brand-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-2xl font-semibold text-ink-900">{t(topic.title)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-500 sm:text-base">{t(topic.body)}</p>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Hobbies — light touch */}
      <Reveal className="mt-12">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-700">
          {t(profile.hobbies.title)}
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {profile.hobbies.items.map((h) => {
            const Icon = HOBBY_ICONS[h.key] ?? Car;
            return (
              <div
                key={h.key}
                className="flex items-start gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm transition-colors hover:border-brand-200"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-base font-semibold text-ink-900">{t(h.title)}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-ink-500">{t(h.body)}</p>
                  <a
                    href={h.link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 transition-colors hover:text-brand-900"
                  >
                    {t(h.link.label)}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </Section>
  );
}
