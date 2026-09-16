"use client";

import { useLang } from "@/lib/i18n";
import type { Locale } from "@/content/types";
import { cn } from "@/lib/utils";

const OPTIONS: Locale[] = ["de", "en"];

/**
 * Two-state language switch, sized for the 36px utility strip.
 *
 * The sliding pill is a plain CSS transform rather than a framer-motion
 * `layoutId`: this renders on the access gate, which is the first thing every
 * visitor loads, and pulling the animation library in for one moving rectangle
 * cost ~40 kB of the gate's JavaScript. Both labels are two characters, so the
 * pill is exactly half the track and moves by its own width.
 */
export function LanguageToggle({
  className,
  onDark = false,
}: {
  className?: string;
  /** Adapts colours when rendered on an ink surface. */
  onDark?: boolean;
}) {
  const { lang, setLang } = useLang();
  const index = Math.max(0, OPTIONS.indexOf(lang));

  return (
    <div
      role="group"
      aria-label="Language / Sprache"
      className={cn(
        "relative inline-flex items-center rounded-md border p-px",
        onDark ? "border-white/25" : "border-hairline bg-canvas",
        className,
      )}
    >
      {/* The pill. Sits in the padded track and covers exactly one option. */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-px left-px -z-0 w-[calc(50%-1px)] rounded-sm transition-transform duration-200 ease-out motion-reduce:transition-none",
          onDark ? "bg-primary-bright" : "bg-primary",
        )}
        style={{ transform: `translateX(${index * 100}%)` }}
      />

      {OPTIONS.map((opt) => {
        const active = lang === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => setLang(opt)}
            aria-pressed={active}
            className={cn(
              "relative z-10 flex-1 rounded-sm px-2.5 py-1 text-fine font-semibold uppercase transition-colors duration-200",
              active
                ? "text-on-ink"
                : onDark
                  ? "text-steel hover:text-on-ink"
                  : "text-graphite hover:text-ink",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
