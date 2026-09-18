"use client";

import { ArrowRight, ArrowUpRight, Youtube } from "lucide-react";
import { workExperience } from "@/content/experience";
import { education } from "@/content/education";
import type { ExperienceItem } from "@/content/types";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";
import { Gallery } from "./media/Gallery";
import { cn } from "@/lib/utils";

/**
 * Scholarships supporting an entry, as one line of prose.
 *
 * This started as a labelled block on a hairline with the names in outlined
 * pills. Two things were wrong with that: the rule and the label made two facts
 * look like a module bolted onto the card, and the pills are the same treatment
 * the Skills band uses for its chips, so they read as interactive when they are
 * not. A sentence says it in a third of the height, and putting the weight on
 * the names rather than on a border is what makes them findable.
 */
function Funding({ grants }: { grants: string[] }) {
  const { t } = useLang();
  const last = grants.length - 1;

  return (
    <p className="mt-3 text-caption text-graphite">
      {t({ de: "Gefördert durch", en: "Supported by" })}{" "}
      {grants.map((grant, i) => (
        <span key={grant}>
          {i > 0 && (i === last ? t({ de: " und ", en: " and " }) : ", ")}
          <span className="font-medium text-ink">{grant}</span>
        </span>
      ))}
    </p>
  );
}

function ExpEntry({ item }: { item: ExperienceItem }) {
  const { t } = useLang();
  const links = [...(item.links ?? []), ...(item.link ? [item.link] : [])];

  return (
    <li className="card p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-caption text-primary">{t(item.period)}</span>
        {item.current && (
          <span className="badge badge-soft text-fine">{t({ de: "aktuell", en: "current" })}</span>
        )}
      </div>

      <h4 className="display-xs mt-3">{t(item.role)}</h4>
      <p className="mt-1 text-caption text-graphite">
        {item.org}
        {item.location ? ` · ${item.location}` : ""}
      </p>

      <p className="mt-3 text-caption text-charcoal">{t(item.description)}</p>
      {item.more?.map((para, i) => (
        <p key={i} className="mt-2 text-caption text-charcoal">
          {t(para)}
        </p>
      ))}

      {item.gallery && item.gallery.length > 0 && (
        <Gallery slides={item.gallery} className="mt-4 sm:max-w-md" />
      )}

      {links.length > 0 && (
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
      )}
    </li>
  );
}

export function Experience() {
  const { t } = useLang();

  return (
    <Section id="experience" surface="canvas">
      <SectionHeading
        title={t({ de: "Beruf & Studium", en: "Work & studies" })}
        intro={t({
          de: "Berufliche Stationen neben dem Studium — und der Blick nach vorn. Alles Ehrenamtliche steht weiter oben unter „Engagement“.",
          en: "Professional roles alongside my studies, and a look ahead. Everything voluntary lives further up under “Involvement”.",
        })}
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <h3 className="display-sm border-t border-steel pt-6">
            {t({ de: "Berufserfahrung", en: "Professional work" })}
          </h3>
          <ul className="mt-6 space-y-4">
            {workExperience.map((item, i) => (
              <ExpEntry key={i} item={item} />
            ))}
          </ul>
        </div>

        <div>
          <h3 className="display-sm border-t border-steel pt-6">
            {t({ de: "Studium & Ausblick", en: "Study & what's next" })}
          </h3>
          <ul className="mt-6 space-y-4">
            {education.map((edu, i) => (
              <li key={i} className="card p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-caption text-primary">{t(edu.period)}</span>
                  {edu.current && (
                    <span className="badge badge-soft text-fine">
                      {t({ de: "aktuell", en: "current" })}
                    </span>
                  )}
                  {edu.upcoming && (
                    <span className="badge badge-soft text-fine">
                      {t({ de: "geplant", en: "planned" })}
                    </span>
                  )}
                </div>
                <h4 className="display-xs mt-3">{t(edu.title)}</h4>
                <p className="mt-1 text-caption text-graphite">{edu.org}</p>
                {edu.description && (
                  <p className="mt-3 text-caption text-charcoal">{t(edu.description)}</p>
                )}

                {edu.funding?.length ? <Funding grants={edu.funding} /> : null}

                {/* Capped narrower than the card: these are supporting
                    snapshots, not the subject of the entry, and at full column
                    width a single one outweighed everything above it.

                    The cap scales with the count so a thumbnail is ~200px
                    whether there is one or four. Capping at a single width
                    instead made a lone image shrink to 136px on a phone, where
                    the column is narrow and there is no second tile to share
                    the row with. */}
                {edu.gallery && edu.gallery.length > 0 && (
                  <Gallery
                    slides={edu.gallery}
                    columns={edu.gallery.length > 1 ? 2 : undefined}
                    className={cn(
                      "mt-4",
                      edu.gallery.length > 1 ? "max-w-[26rem]" : "max-w-[13rem]",
                    )}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
