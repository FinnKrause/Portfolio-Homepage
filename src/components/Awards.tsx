"use client";

import { ArrowRight, ArrowUpRight, Gavel, ShieldCheck, Trophy, Youtube } from "lucide-react";
import { emphasisAward, sideAwards } from "@/content/awards";
import type { Award, LinkItem } from "@/content/types";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./motion/Reveal";
import { Gallery } from "./media/Gallery";

function sideIcon(award: Award) {
  if (award.title.en.includes("F1")) return Trophy;
  if (award.title.en.includes("FAUST")) return ShieldCheck;
  return Gavel;
}

/** Merge the convenience `link` with the `links` array. */
function mergedLinks(award: Award): LinkItem[] {
  return [...(award.links ?? []), ...(award.link ? [award.link] : [])];
}

function AwardLinks({ links }: { links: LinkItem[] }) {
  const { t } = useLang();
  if (links.length === 0) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
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
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900"
          >
            <Icon className="h-4 w-4" />
            {t(link.label)}
          </a>
        );
      })}
    </div>
  );
}

export function Awards() {
  const { t } = useLang();

  return (
    <Section id="awards">
      <SectionHeading
        eyebrow={t({ de: "Auszeichnungen", en: "Awards" })}
        title={t({ de: "Anerkennung & Wettbewerbe", en: "Recognition & competitions" })}
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        {/* Showcase: Umbruchszeiten */}
        {emphasisAward && (
          <Reveal>
            <article className="flex h-full flex-col rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-sky-50 p-6 shadow-soft sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-white shadow">
                  <Gavel className="h-5 w-5" />
                </span>
                <span className="font-mono text-sm font-semibold text-brand-700">
                  {emphasisAward.year}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-ink-900 sm:text-2xl">
                {t(emphasisAward.title)}
              </h3>
              <p className="mt-1 text-sm font-medium text-ink-700">{emphasisAward.org}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                {t(emphasisAward.description)}
              </p>

              <AwardLinks links={mergedLinks(emphasisAward)} />

              {emphasisAward.gallery && emphasisAward.gallery.length > 0 && (
                <Gallery slides={emphasisAward.gallery} columns={3} className="mt-5" />
              )}
            </article>
          </Reveal>
        )}

        {/* Side awards: F1 (links up) + FAUST */}
        <Reveal delay={0.08}>
          <div className="flex h-full flex-col gap-5">
            {sideAwards.map((award, i) => {
              const Icon = sideIcon(award);
              return (
                <article
                  key={i}
                  className="flex flex-1 flex-col rounded-2xl border border-line bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-mono text-xs font-semibold text-brand-700">{award.year}</span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-ink-900">{t(award.title)}</h3>
                  <p className="mt-0.5 text-sm text-ink-500">{award.org}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{t(award.description)}</p>
                  <AwardLinks links={mergedLinks(award)} />
                </article>
              );
            })}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
