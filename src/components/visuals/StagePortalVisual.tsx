"use client";

import { ChevronUp, Search } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LEADERBOARD = [
  { rank: 1, title: "Shake It Off", from: "#f472b6", to: "#a855f7" },
  { rank: 2, title: "KETA UND KRAWALL", from: "#38bdf8", to: "#2563eb" },
  { rank: 3, title: "Napoleon Bonnerparty", from: "#34d399", to: "#0ea5e9" },
];

export function StagePortalVisual({ className }: { className?: string }) {
  const { t } = useLang();

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-white/10 bg-[#0a0f1f] p-4 text-white shadow-inner",
        className,
      )}
    >
      {/* Now playing */}
      <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3 ring-1 ring-inset ring-white/5">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-rose-400 via-fuchsia-500 to-brand-600">
          <div className="flex items-end gap-[3px]" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="eq-bar block w-[3px] rounded-full bg-white/90"
                style={{ height: 16, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
        <div className="min-w-0">
          <div className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-sky-300">
            Now Playing
          </div>
          <div className="truncate text-sm font-semibold">Die With A Smile</div>
          <div className="truncate text-xs text-white/50">Lady Gaga, Bruno Mars</div>
        </div>
      </div>

      {/* Search */}
      <div className="mt-3 flex items-center gap-2 rounded-full bg-white/[0.04] px-4 py-2.5 text-sm text-white/40 ring-1 ring-inset ring-white/5">
        <Search className="h-4 w-4" />
        <span className="truncate">
          {t({ de: "Schicke deinen Song an den DJ", en: "Send your song to the DJ" })}
        </span>
      </div>

      {/* Leaderboard */}
      <div className="mt-4 mb-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/40">
        {t({ de: "Arena Leaderboard", en: "Arena Leaderboard" })}
      </div>
      <ul className="space-y-1.5">
        {LEADERBOARD.map((row, idx) => (
          <li
            key={row.rank}
            className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-2.5 ring-1 ring-inset ring-white/5"
          >
            <span className="w-4 text-center text-xs font-semibold text-white/40">{row.rank}</span>
            <span
              className="h-9 w-9 shrink-0 rounded-lg"
              style={{ background: `linear-gradient(135deg, ${row.from}, ${row.to})` }}
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{row.title}</div>
              <div className="mt-0.5 inline-flex rounded-full bg-brand-500/20 px-2 py-0.5 text-[0.65rem] font-medium text-sky-300">
                {Math.max(10-idx, 0)} {t({ de: "Stimmen", en: "votes" })}
              </div>
            </div>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-white/60">
              <ChevronUp className="h-4 w-4" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
