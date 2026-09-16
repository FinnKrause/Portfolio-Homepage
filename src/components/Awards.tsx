"use client";

import { ArrowRight, ArrowUpRight, Youtube } from "lucide-react";
import { emphasisAward, sideAwards } from "@/content/awards";
import type { Award, LinkItem } from "@/content/types";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";
import { Gallery } from "./media/Gallery";

/** Merge the convenience `link` with the `links` array. */
function mergedLinks(award: Award): LinkItem[] {
  return [...(award.links ?? []), ...(award.link ? [award.link] : [])];
}

function AwardLinks({ links }: { links: LinkItem[] }) {
  const { t } = useLang();
  if (links.length === 0) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
      {links.map((link, i) => {
        const isYoutube = /youtu\.?be/.test(link.href);
        const internal = link.href.startsWith("#");
        const Icon = isYoutube ? Youtube : internal ? ArrowRight : ArrowUpRight;
        return (
          <a
            key={i}
            href={link.href}
            target={internal ? undefined : "_blank"}
            rel={internal ? undefined : "noreferrer"}
            className="link text-caption"
          >
            <Icon className="h-4 w-4" />
            {t(link.label)}
          </a>
        );
      })}
    </div>
  );
}

/**
 * One award is showcased in a cloud feature card; the rest sit beside it on
 * hairlines. The difference in surface is what says which one matters —
 * nothing here needs an icon or a colour to carry that.
 */
export function Awards() {
  const { t } = useLang();

  return (
    <Section id="awards" surface="cloud">
      <SectionHeading title={t({ de: "Anerkennung & Wettbewerbe", en: "Recognition & competitions" })} />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        {emphasisAward && (
          <article className="card p-6 sm:p-8">
            <p className="text-caption text-primary">{emphasisAward.year}</p>
            <h3 className="display-md mt-3">{t(emphasisAward.title)}</h3>
            <p className="mt-2 text-body text-graphite">{emphasisAward.org}</p>
            <p className="mt-4 max-w-[62ch] text-body text-charcoal">
              {t(emphasisAward.description)}
            </p>

            <AwardLinks links={mergedLinks(emphasisAward)} />

            {emphasisAward.gallery && emphasisAward.gallery.length > 0 && (
              <Gallery
                slides={emphasisAward.gallery}
                columns={emphasisAward.gallery.length > 2 ? 3 : 2}
                className="mt-6"
              />
            )}
          </article>
        )}

        <div className="flex flex-col gap-8">
          {sideAwards.map((award, i) => (
            <article key={i} className="border-t border-hairline pt-6">
              <p className="text-caption text-primary">{award.year}</p>
              <h3 className="display-xs mt-2">{t(award.title)}</h3>
              <p className="mt-1 text-caption text-graphite">{award.org}</p>
              <p className="mt-3 text-caption text-charcoal">{t(award.description)}</p>
              <AwardLinks links={mergedLinks(award)} />
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
