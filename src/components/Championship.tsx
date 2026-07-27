"use client";

import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { profile } from "@/content/profile";
import { useLang } from "@/lib/i18n";
import { Reveal } from "./motion/Reveal";
import { Gallery } from "./media/Gallery";
import { ReactionTest } from "./f1/ReactionTest";
import { JourneyTimeline } from "./f1/JourneyTimeline";
import { RaceFilm } from "./f1/RaceFilm";

const RECOIL = "#097b41";      // the team's green — solid fills
const RECOIL_BRIGHT = "#19d982"; // lifted variant for type and rules
const F1_RED = "#e10600";

export function Championship() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const c = profile.championship;

  return (
    // No overflow-hidden here: it would turn this section into a scroll
    // container and kill the timeline's position:sticky further down. The
    // decoration is clipped by its own wrapper instead.
    <section id="championship" className="f1-world relative py-16 text-white md:py-20">
      <div aria-hidden className="grain pointer-events-none absolute inset-0 overflow-hidden">
        <div className="f1-asphalt" />
        {!reduce && <div className="f1-sweep" />}
      </div>

      {/* Racing edge — green at the top, red at the bottom */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ background: `linear-gradient(to bottom, ${RECOIL_BRIGHT}, ${F1_RED})` }}
      />

      <div className="mx-container relative">
        {/* Headline and the reaction test share one row, so the test costs no
            vertical space of its own. */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
          <Reveal className="lg:col-span-6">
            <p
              className="text-[0.7rem] font-semibold uppercase tracking-[0.2em]"
              style={{ color: RECOIL_BRIGHT }}
            >
              {t(c.eyebrow)}
            </p>
            <h2 className="headline mt-4 max-w-[14ch] text-5xl font-medium sm:text-6xl md:text-[4rem]">
              {t(c.title)}
            </h2>

            {/* A telemetry trace that draws itself under the headline */}
            <svg
              aria-hidden
              viewBox="0 0 1200 40"
              preserveAspectRatio="none"
              className="mt-6 h-6 w-full max-w-lg"
            >
              <path
                className="f1-trace"
                d="M0 30 L180 30 L230 8 L340 8 L392 26 L520 26 L560 6 L700 6 L742 30 L900 30 L950 14 L1200 14"
                fill="none"
                stroke={RECOIL_BRIGHT}
                strokeWidth="1.5"
                opacity="0.85"
              />
            </svg>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-5 lg:col-start-8 lg:pt-2">
            <ReactionTest />
          </Reveal>
        </div>

        {/* ---------- The clip ---------- */}
        <Reveal delay={0.05} className="mt-10">
          <RaceFilm posterAlt={t(c.imageAlt)} />
        </Reveal>

        {/* ---------- Result band — a supporting strip, not a headline ---------- */}
        <Reveal className="mt-8">
          <dl className="flex flex-wrap items-baseline gap-x-9 gap-y-3 border-y border-white/15 py-4">
            {c.stats.map((stat, i) => (
              <div key={i} className="flex items-baseline gap-2">
                <dd
                  className="text-lg font-medium tabular-nums sm:text-xl"
                  style={{ color: i === 0 ? F1_RED : "#fff" }}
                >
                  {stat.value}
                </dd>
                <dt className="text-[0.7rem] uppercase tracking-[0.12em] text-white/55">
                  {t(stat.label)}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* ---------- Story, offset from the grid ---------- */}
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-6">
            <div className="space-y-5">
              {c.body.map((para, i) => (
                <p key={i} className="text-base leading-relaxed text-white/80 sm:text-lg">
                  {t(para)}
                </p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={c.links[0].href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: F1_RED }}
              >
                {t(c.links[0].label)}
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href={c.links[1].href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-white/90 transition-colors hover:text-white"
              >
                <span
                  className="border-b pb-0.5 transition-colors"
                  style={{ borderColor: RECOIL_BRIGHT }}
                >
                  {t(c.links[1].label)}
                </span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>

          {/* Quote pulled out to the right, hanging lower than the text */}
          <Reveal delay={0.08} className="lg:col-span-5 lg:col-start-8 lg:pt-10">
            <figure
              className="border-l-2 pl-6"
              style={{ borderColor: F1_RED }}
            >
              <blockquote className="headline text-xl font-medium leading-snug text-white sm:text-2xl">
                {t(c.quote)}
              </blockquote>
              <figcaption className="mt-4 text-xs uppercase tracking-[0.14em] text-white/60">
                {t(c.quoteAuthor)}
              </figcaption>
            </figure>

            <p className="mt-6 text-sm leading-relaxed text-white/65">{t(c.prize)}</p>
          </Reveal>
        </div>

        {/* ---------- Impressions ---------- */}
        <Reveal className="mt-14">
          <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/60">
            {t(c.galleryTitle)}
          </h3>
          <Gallery slides={c.gallery} className="mt-5" />
        </Reveal>

      </div>

      {/* ---------- Where it went next ---------- */}
      <JourneyTimeline />
    </section>
  );
}
