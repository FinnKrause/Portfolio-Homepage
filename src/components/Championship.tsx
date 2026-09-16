"use client";

import { ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { useLang } from "@/lib/i18n";
import { Gallery } from "./media/Gallery";
import { ReactionTest } from "./f1/ReactionTest";
import { JourneyTimeline } from "./f1/JourneyTimeline";
import { RaceFilm } from "./f1/RaceFilm";
import { ACCENT_WARM } from "@/content/theme";

/**
 * The championship chapter — the site's ink slab.
 *
 * This used to be its own world, with a green-and-red gradient backdrop, an
 * asphalt texture and a light sweep. The system has a closed surface
 * vocabulary and one warm accent, so the chapter now earns its weight the way
 * every other dark band in the system does: near-black, white type, one
 * chromatic accent on the numbers, and photography doing the rest.
 *
 * No overflow-hidden on the section — it would turn this into a scroll
 * container and kill the timeline's position:sticky further down.
 */
export function Championship() {
  const { t } = useLang();
  const c = profile.championship;

  return (
    <section id="championship" className="band band-ink relative">
      <div className="mx-container">
        {/* Headline and the reaction test share a row, so the test costs no
            vertical space of its own. */}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <header className="lg:col-span-7">
            <p className="text-body text-steel">{t(c.eyebrow)}</p>
            <h2 className="display-xl mt-4 max-w-[16ch]">{t(c.title)}</h2>
          </header>

          <div className="lg:col-span-5">
            <ReactionTest />
          </div>
        </div>

        {/* The clip, in a 16px frame like every other photograph on the site. */}
        <div className="frame mt-10">
          <RaceFilm posterAlt={t(c.imageAlt)} />
        </div>

        {/* The result, set the way the system sets a price stamp. */}
        <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-white/15 py-8 sm:grid-cols-4">
          {c.stats.map((stat, i) => (
            <div key={i}>
              <dd
                className="display-md tabular-nums"
                style={i === 0 ? { color: ACCENT_WARM } : undefined}
              >
                {stat.value}
              </dd>
              <dt className="mt-2 text-caption text-steel">{t(stat.label)}</dt>
            </div>
          ))}
        </dl>

        {/* The story, with the quote pulled out beside it. */}
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="max-w-[66ch] space-y-5">
              {c.body.map((para, i) => (
                <p key={i} className="text-body text-white/80">
                  {t(para)}
                </p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={c.links[0].href}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                {t(c.links[0].label)}
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={c.links[1].href}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-ink"
              >
                {t(c.links[1].label)}
              </a>
            </div>
          </div>

          <figure className="lg:col-span-5">
            <blockquote className="display-sm text-on-ink">{t(c.quote)}</blockquote>
            <figcaption className="mt-4 text-caption text-steel">{t(c.quoteAuthor)}</figcaption>
            <p className="mt-8 border-t border-white/15 pt-6 text-caption text-white/70">
              {t(c.prize)}
            </p>
          </figure>
        </div>

        {/* Impressions */}
        <div className="mt-14">
          <h3 className="display-sm">{t(c.galleryTitle)}</h3>
          <Gallery slides={c.gallery} className="mt-6" />
        </div>
      </div>

      {/* Where it went next */}
      <JourneyTimeline />
    </section>
  );
}
