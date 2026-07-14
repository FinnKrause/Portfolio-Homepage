"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown, Youtube } from "lucide-react";
import {
  engagement,
  engagementAxis,
  categoryColor,
  categoryLabel,
  type EngagementCategory,
  type EngagementItem,
} from "@/content/engagement";
import type { LinkItem } from "@/content/types";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./motion/Reveal";
import { Gallery } from "./media/Gallery";
import { cn } from "@/lib/utils";

const SPAN = engagementAxis.end - engagementAxis.start;
const pct = (year: number) => ((year - engagementAxis.start) / SPAN) * 100;
const TICKS = Array.from({ length: SPAN }, (_, i) => engagementAxis.start + i); // 2022..2026
const GRID = Array.from({ length: SPAN + 1 }, (_, i) => engagementAxis.start + i); // incl. end

const GRID_COLS = "sm:grid-cols-[1fr_1.15fr]";

function EngLinks({ links }: { links: LinkItem[] }) {
  const { t } = useLang();
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
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

function Row({ item }: { item: EngagementItem }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const color = categoryColor[item.category];
  const left = pct(item.start);
  const width = Math.max(pct(item.end) - left, 1.5);

  return (
    <div className="border-b border-line last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn("group relative grid w-full grid-cols-1 gap-4 py-5 pr-9 text-left", GRID_COLS, "sm:gap-6")}
      >
        <div className="flex items-start gap-3">
          <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />
          <div>
            <h3 className="text-base font-semibold text-ink-900">{t(item.title)}</h3>
            {item.org ? <p className="text-sm text-ink-500">{item.org}</p> : null}
            <p className="mt-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-brand-600">
              {t(item.periodLabel)}
            </p>
          </div>
        </div>

        {/* Overlap bar on the shared axis */}
        <div className="self-center">
          <div className="relative h-2.5 rounded-full bg-paper-soft ring-1 ring-inset ring-line">
            {GRID.map((y) => (
              <span
                key={y}
                aria-hidden
                className="absolute inset-y-0 w-px bg-line"
                style={{ left: `${pct(y)}%` }}
              />
            ))}
            <motion.div
              className="absolute inset-y-0 rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                left: `${left}%`,
                width: `${width}%`,
                transformOrigin: "left",
                background: item.ongoing
                  ? `linear-gradient(to right, ${color}, ${color} 76%, ${color}00)`
                  : color,
              }}
            />
          </div>
        </div>

        <ChevronDown
          className={cn(
            "absolute right-0 top-6 h-4 w-4 text-ink-400 transition-transform duration-300 group-hover:text-brand-600",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 sm:pl-6">
              <p className="max-w-2xl text-sm leading-relaxed text-ink-600">{t(item.description)}</p>
              {item.more?.map((para, i) => (
                <p key={i} className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">
                  {t(para)}
                </p>
              ))}
              {item.links && item.links.length > 0 ? <EngLinks links={item.links} /> : null}
              {item.gallery && item.gallery.length > 0 ? (
                <Gallery slides={item.gallery} className="mt-4 max-w-xl" />
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Engagement() {
  const { t } = useLang();

  return (
    <Section id="engagement">
      <SectionHeading
        eyebrow={t({ de: "Engagement", en: "Involvement" })}
        title={t({ de: "Was nebenbei alles lief", en: "Everything running alongside" })}
        intro={t({
          de: "Neben Schule, Studium und Job war fast immer mehreres gleichzeitig los. Die Balken auf der gemeinsamen Zeitachse zeigen, was sich überschnitt — tippe auf einen Eintrag für Details.",
          en: "Alongside school, studies and work there was almost always more than one thing going on. The bars on the shared timeline show what overlapped — tap an entry for details.",
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

      <Reveal className="mt-8">
        <div className="rounded-3xl border border-line bg-white p-4 shadow-soft sm:p-6">
          {/* Year axis (desktop) */}
          <div className={cn("mb-1 hidden gap-6 sm:grid", GRID_COLS)}>
            <div />
            <div className="relative h-4">
              {TICKS.map((y) => (
                <span
                  key={y}
                  className="absolute -translate-x-1/2 font-mono text-[0.6rem] text-ink-400"
                  style={{ left: `${pct(y)}%` }}
                >
                  &apos;{String(y).slice(2)}
                </span>
              ))}
            </div>
          </div>

          <div className="divide-y divide-line">
            {engagement.map((item) => (
              <Row key={item.id} item={item} />
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
