"use client";

import { ArrowRight, ArrowUpRight, Youtube } from "lucide-react";
import {
  engagement,
  categoryColor,
  categoryLabel,
  type EngagementCategory,
} from "@/content/engagement";
import type { LinkItem } from "@/content/types";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./motion/Reveal";
import { Gallery } from "./media/Gallery";

function EngLinks({ links }: { links: LinkItem[] }) {
  const { t } = useLang();
  return (
    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
      {links.map((link, i) => {
        const yt = /youtu\.?be/.test(link.href);
        const internal = link.href.startsWith("#");
        const Icon = yt ? Youtube : internal ? ArrowRight : ArrowUpRight;
        return (
          <a
            key={i}
            href={link.href}
            target={internal ? undefined : "_blank"}
            rel={internal ? undefined : "noreferrer"}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 transition-colors hover:text-brand-900"
          >
            <Icon className="h-4 w-4" />
            {t(link.label)}
          </a>
        );
      })}
    </div>
  );
}

export function Engagement() {
  const { t } = useLang();

  return (
    <Section id="engagement" className="bg-paper-soft">
      <SectionHeading
        eyebrow={t({ de: "Engagement", en: "Involvement" })}
        title={t({ de: "Was nebenbei alles lief", en: "Everything running alongside" })}
        intro={t({
          de: "Neben Schule, Studium und Job war fast immer mehreres gleichzeitig los — vom Wettbewerb über die Jury bis zur Hochschulpolitik. Ein ehrlicher Überblick.",
          en: "Alongside school, studies and work there was almost always more than one thing going on — from competitions and jury work to student politics. An honest overview.",
        })}
      />

      {/* Legend */}
      <Reveal className="mt-6">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {(Object.keys(categoryLabel) as EngagementCategory[]).map((c) => (
            <span key={c} className="inline-flex items-center gap-1.5 text-xs text-ink-500">
              <span className="h-2 w-2 rounded-full" style={{ background: categoryColor[c] }} />
              {t(categoryLabel[c])}
            </span>
          ))}
        </div>
      </Reveal>

      {/* Thorough cards — links & images visible, no expanding */}
      <Reveal className="mt-8">
        <div className="gap-5 md:columns-2 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {engagement.map((item) => {
            const color = categoryColor[item.category];
            return (
              <article
                key={item.id}
                className="rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                  <span
                    className="text-[0.65rem] font-semibold uppercase tracking-wider"
                    style={{ color }}
                  >
                    {t(categoryLabel[item.category])}
                  </span>
                  <span className="ml-auto font-mono text-xs text-ink-500">{t(item.periodLabel)}</span>
                </div>

                <h3 className="mt-3 text-lg font-semibold text-ink-900">{t(item.title)}</h3>
                {item.org ? <p className="text-sm text-ink-500">{item.org}</p> : null}
                <p className="mt-2.5 text-sm leading-relaxed text-ink-600">{t(item.description)}</p>

                {item.more?.map((para, i) => (
                  <p key={i} className="mt-2 text-sm leading-relaxed text-ink-600">
                    {t(para)}
                  </p>
                ))}

                {item.links && item.links.length > 0 ? <EngLinks links={item.links} /> : null}

                {item.gallery && item.gallery.length > 0 ? (
                  <Gallery slides={item.gallery} columns={3} className="mt-4" />
                ) : null}
              </article>
            );
          })}
        </div>
      </Reveal>
    </Section>
  );
}
