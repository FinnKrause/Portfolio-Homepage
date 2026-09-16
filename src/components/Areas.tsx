"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { profile } from "@/content/profile";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";

/**
 * Roughly what Finn does — one photograph per area, each opening the band that
 * covers it.
 *
 * These sit directly under the hero and do the job the hero used to try to do
 * itself. Keeping them here rather than inside the landing card is what lets
 * the card stay an introduction: a visitor meets the person first, then sees
 * the work, in that order, instead of both at once.
 *
 * There is no body copy on a tile. A photograph and one word carry it, and
 * anything more would compete with the picture for the same space.
 */
export function Areas() {
  const { t } = useLang();

  return (
    <Section id="areas" surface="canvas">
      <SectionHeading title={t({ de: "Woran ich arbeite", en: "What I work on" })} />

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {profile.areas.map((area) => (
          <li key={area.href}>
            <a href={area.href} className="tile group block aspect-[4/5]">
              <Image
                src={area.image}
                alt={t(area.alt)}
                fill
                quality={90}
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
              <span className="tile-veil" aria-hidden />
              <span className="tile-label">
                {t(area.title)}
                <ArrowRight
                  className="h-4 w-4 shrink-0 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
