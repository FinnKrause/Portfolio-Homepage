"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { profile } from "@/content/profile";
import { useLang } from "@/lib/i18n";

/**
 * The hero band.
 *
 * An introduction, and only that: a portrait, the name, one paragraph and two
 * links. Earlier versions carried a taxonomy here — three headline domains, a
 * three-fact stamp, a row of category cards, a list of pointers at what was
 * further down — and each one committed the site to a shape before a visitor
 * had read a word. What Finn works on is shown by the tiles in `Areas`
 * directly below; this card only has to say who this is.
 *
 * Kept to two type sizes and two text colours on purpose. The name is ink at
 * display scale, everything else is one size of charcoal prose. A landing card
 * that changes size and weight every other line reads as a layout rather than
 * as an introduction.
 *
 * `band-screen` gives the band a full screen of height and centres the card in
 * it. The card itself is sized by its content — the band decides how much room
 * there is, not how big the card is.
 *
 * The photo column is the narrower one, for two reasons: a portrait wants a
 * narrower frame than a landscape photograph would, and this source is only
 * 768px wide, so a wide column would upscale it on any retina display.
 *
 * The arrival sequence is the single orchestrated moment on the site — the
 * slashes draw in from the page edges, the copy rises behind them, and after
 * that nothing moves again unless a visitor asks it to.
 */
export function Hero() {
  const { t } = useLang();

  return (
    <section id="top" className="band band-screen band-cloud relative overflow-hidden">
      <div className="mx-container relative">
        {/* The pair flanks the *card*, matching its height exactly. They used
            to overshoot it, which read as stray fragments once the card grew to
            fill the screen and left them nothing to stand in. */}
        <div className="relative">
          <span
            aria-hidden
            className="chevron chevron-in absolute inset-y-0 -left-10 hidden w-28 md:block lg:-left-6 lg:w-40"
            style={{ "--from": "-3rem" } as React.CSSProperties}
          />
          <span
            aria-hidden
            className="chevron chevron-end chevron-in absolute inset-y-0 -right-10 hidden w-28 md:block lg:-right-6 lg:w-40"
            style={{ "--from": "3rem" } as React.CSSProperties}
          />

          <div className="card relative overflow-hidden md:grid md:grid-cols-[2fr_3fr] lg:grid-cols-[1fr_2fr]">
          {/* Portrait. 4:5 stacked, which is near the source's own 3:4, so the
              crop stays gentle; from `lg` the frame takes the card's full
              height and `object-cover` trims the sides instead.

              There used to be an `sm:aspect-[16/10]` here, and it was the bug:
              it turned a 3:4 portrait into a 1.6 landscape strip, so between
              640px and 1024px the frame showed less than half the image's
              height and cut the subject off at the waist. A portrait source
              never wants a landscape frame — let it crop sideways into
              background instead. */}
          <div className="relative aspect-[4/5] w-full bg-cloud md:aspect-[3/4]">
            <Image
              src="/images/Portraits/finn-portrait.jpg"
              alt={t({ de: "Porträt von Finn Krause.", en: "Portrait of Finn Krause." })}
              fill
              priority
              quality={90}
              sizes="(max-width: 1024px) 100vw, 573px"
              className="object-cover object-top"
            />
          </div>

          {/* Copy */}
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <p
              className="rise text-body-lg text-charcoal"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              {t(profile.eyebrow)}
            </p>

            <h1 className="display-xxl rise mt-4" style={{ "--i": 2 } as React.CSSProperties}>
              {profile.name}
            </h1>

            <p
              className="rise mt-6 max-w-[58ch] text-body-lg text-charcoal"
              style={{ "--i": 3 } as React.CSSProperties}
            >
              {t(profile.hero.headline)}
            </p>

            <div
              className="rise mt-8 flex flex-wrap gap-3"
              style={{ "--i": 4 } as React.CSSProperties}
            >
              <a href="#projects" className="btn btn-primary">
                {t({ de: "Projekte ansehen", en: "See the projects" })}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#about" className="btn btn-outline-ink">
                {t({ de: "Mehr über mich", en: "More about me" })}
              </a>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
