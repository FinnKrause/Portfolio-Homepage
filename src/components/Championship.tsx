"use client";

import Image from "next/image";
import { ArrowUpRight, ExternalLink, Quote, Trophy } from "lucide-react";
import { profile } from "@/content/profile";
import { useLang } from "@/lib/i18n";
import { Reveal } from "./motion/Reveal";
import { MediaView } from "./media/MediaView";

export function Championship() {
  const { t } = useLang();
  const c = profile.championship;

  return (
    <section id="championship" className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 py-20 text-white md:py-28">
      {/* Texture + glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(255,255,255,0.5) 1px, transparent 1.4px)",
          backgroundSize: "26px 26px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl"
        aria-hidden
      />

      <div className="mx-container relative">
        <Reveal className="max-w-3xl">
          <p className="eyebrow !text-sky-300">{t(c.eyebrow)}</p>
          <h2 className="headline mt-3 text-4xl font-semibold sm:text-5xl md:text-[3.25rem]">
            {t(c.title)}
          </h2>
        </Reveal>

        {/* Podium banner */}
        <Reveal delay={0.05} className="mt-10">
          <div className="relative aspect-[2/1] overflow-hidden rounded-3xl border border-white/15 shadow-2xl md:aspect-[21/8]">
            <Image
              src="/images/f1-podium.jpg"
              alt={t(c.imageAlt)}
              fill
              sizes="(max-width: 1024px) 100vw, 72rem"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-brand-950/10" />
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-brand-950/50 px-3 py-1.5 text-xs font-semibold backdrop-blur sm:left-6 sm:top-6">
              <Trophy className="h-4 w-4 text-amber-300" />
              {t({ de: "1. Platz · Weltmeister", en: "1st place · World Champions" })}
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Story + quote */}
          <Reveal>
            <div className="space-y-4">
              {c.body.map((para, i) => (
                <p key={i} className="text-base leading-relaxed text-brand-100/90 sm:text-lg">
                  {t(para)}
                </p>
              ))}
            </div>

            <figure className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <Quote className="h-6 w-6 text-sky-300" />
              <blockquote className="mt-3 text-lg font-medium leading-relaxed text-white sm:text-xl">
                {t(c.quote)}
              </blockquote>
              <figcaption className="mt-3 text-sm text-brand-200">{t(c.quoteAuthor)}</figcaption>
            </figure>
          </Reveal>

          {/* Stats + prize + links */}
          <Reveal delay={0.08}>
            <div className="grid grid-cols-2 gap-3">
              {c.stats.map((stat, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/12 bg-white/5 p-5 backdrop-blur"
                >
                  <div className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-brand-200">{t(stat.label)}</div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-brand-100/80">{t(c.prize)}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={c.links[0].href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-800 transition-transform hover:scale-[1.02]"
              >
                {t(c.links[0].label)}
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href={c.links[1].href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {t(c.links[1].label)}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>

        {/* Photo gallery (replace placeholders with real photos) */}
        <Reveal className="mt-16">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
            {t(c.galleryTitle)}
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {c.gallery.map((slide, i) => (
              <MediaView key={i} slide={slide} />
            ))}
          </div>
        </Reveal>

        {/* Videos */}
        <Reveal className="mt-10">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
            {t(c.videosTitle)}
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.videos.map((slide, i) => (
              <MediaView key={i} slide={slide} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
