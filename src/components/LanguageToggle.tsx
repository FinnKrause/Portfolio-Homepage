"use client";

import { useLang } from "@/lib/i18n";
import type { Locale } from "@/content/types";
import { cn } from "@/lib/utils";

const OPTIONS: Locale[] = ["de", "en"];

/**
 * Two-state language switch.
 *
 * The sliding pill is a plain CSS transform rather than a framer-motion
 * `layoutId`: this component renders on the access gate, which is the first
 * thing every visitor loads, and pulling the animation library in for one
 * moving rectangle cost ~40 kB of the gate's JavaScript. Both labels are two
 * characters, so the pill is exactly half the track and moves by its own width.
 */
export function LanguageToggle({
  className,
  onDark = false,
}: {
  className?: string;
  /** Adapts colors when rendered over a dark surface. */
  onDark?: boolean;
}) {
  const { lang, setLang } = useLang();
  const index = Math.max(0, OPTIONS.indexOf(lang));

  return (
    <div
      role="group"
      aria-label="Language / Sprache"
      className={cn(
        "relative inline-flex items-center rounded-full border p-0.5 transition-colors",
        onDark ? "border-night-line bg-night-soft/60" : "border-line bg-white/80 shadow-sm backdrop-blur",
        className,
      )}
    >
      {/* The pill. Sits in the padded track and covers exactly one option. */}
      <span
        aria-hidden
        className="absolute inset-y-0.5 left-0.5 -z-0 w-[calc(50%-0.125rem)] rounded-full bg-brand-600 transition-transform duration-200 ease-out motion-reduce:transition-none"
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
              "relative z-10 flex-1 rounded-full px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider transition-colors duration-200",
              active
                ? "text-white"
                : onDark
                  ? "text-night-mute hover:text-white"
                  : "text-ink-500 hover:text-ink-900",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
