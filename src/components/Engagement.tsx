"use client";

import { ArrowRight, ArrowUpRight, Youtube } from "lucide-react";
import { engagement } from "@/content/engagement";
import type { LinkItem } from "@/content/types";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";
import { Gallery } from "./media/Gallery";

function EngLinks({ links }: { links: LinkItem[] }) {
  const { t } = useLang();
  return (
    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
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
 * A flat canvas band: every entry opens on a hairline, nothing is boxed. The
 * list is long and the entries vary in length, so cards would fight each other
 * for height — the rules give the same reading order at a fraction of the
 * visual noise.
 */
export function Engagement() {
  const { t } = useLang();

  return (
    <Section id="engagement" surface="cloud">
      <SectionHeading
        title={t({ de: "Neben dem Alltag", en: "Alongside the every-day" })}
        intro={t({
          de: "Gremien, Ehrenämter und Projekte, bei denen ich über die Jahre mitgearbeitet habe.",
          en: "Committees, voluntary roles and projects I have worked on over the years.",
        })}
      />

      <div className="mt-12 gap-x-12 md:columns-2 [&>*]:mb-10 [&>*]:break-inside-avoid">
        {engagement.map((item) => (
          <article key={item.id} className="border-t border-hairline pt-6">
            <p className="text-caption text-primary">{t(item.periodLabel)}</p>

            <h3 className="display-xs mt-2">{t(item.title)}</h3>
            {item.org ? <p className="mt-1 text-caption text-graphite">{item.org}</p> : null}

            <p className="mt-3 text-caption text-charcoal">{t(item.description)}</p>
            {item.more?.map((para, i) => (
              <p key={i} className="mt-2 text-caption text-charcoal">
                {t(para)}
              </p>
            ))}

            {item.links && item.links.length > 0 ? <EngLinks links={item.links} /> : null}

            {item.gallery && item.gallery.length > 0 ? (
              <Gallery
                slides={item.gallery}
                columns={item.gallery.length > 2 ? 3 : 2}
                className="mt-5 max-w-md"
              />
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  );
}
