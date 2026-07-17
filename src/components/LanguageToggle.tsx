"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import type { Locale } from "@/content/types";
import { cn } from "@/lib/utils";

const OPTIONS: Locale[] = ["de", "en"];

export function LanguageToggle({
  className,
  onDark = false,
}: {
  className?: string;
  /** Adapts colors when rendered over a dark surface. */
  onDark?: boolean;
}) {
  const { lang, setLang } = useLang();

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
      {OPTIONS.map((opt) => {
        const active = lang === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => setLang(opt)}
            aria-pressed={active}
            className={cn(
              "relative z-10 rounded-full px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider transition-colors duration-200",
              active
                ? "text-white"
                : onDark
                  ? "text-night-mute hover:text-white"
                  : "text-ink-500 hover:text-ink-900",
            )}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-full bg-brand-600"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            {opt}
          </button>
        );
      })}
    </div>
  );
}
