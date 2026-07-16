"use client";

import { ArrowRight, ArrowUpRight, Youtube } from "lucide-react";
import { engagement } from "@/content/engagement";
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
        title={t({ de: "Neben dem Studium", en: "Alongside my studies" })}
        intro={t({
          de: "Wo man mich schon alles sehen und finden konnte.",
          en: "Everything that happend along-side.",
        })}
      />

      <Reveal className="mt-8">
        <div className="gap-5 md:columns-2 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {engagement.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6"
            >
              <span className="font-mono text-xs text-brand-600">{t(item.periodLabel)}</span>

              <h3 className="mt-2 text-lg font-semibold text-ink-900">{t(item.title)}</h3>
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
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
