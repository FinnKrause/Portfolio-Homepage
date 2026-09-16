"use client";

import { ChevronUp, Search } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * A stylised recreation of the festival song-request portal: what's playing,
 * the request field, and the crowd's leaderboard.
 *
 * The album tiles keep their own colours because that is what album art looks
 * like on the real screen; everything else — the panel, the rows, the chip —
 * is on the site's ink surface and its blue accent.
 */
const LEADERBOARD = [
  { rank: 1, title: "Shake It Off", from: "#f472b6", to: "#a855f7", votes: 10 },
  { rank: 2, title: "In Shape", from: "#38bdf8", to: "#2563eb", votes: 9 },
  { rank: 3, title: "Napoleon Bonnerparty", from: "#34d399", to: "#0ea5e9", votes: 8 },
];

export function StagePortalVisual({ className }: { className?: string }) {
  const { t } = useLang();

  return (
    <div className={cn("w-full rounded-xl bg-ink p-4 text-on-ink", className)}>
      {/* Now playing */}
      <div className="flex items-center gap-3 rounded-lg bg-white/[0.06] p-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-primary">
          <div className="flex items-end gap-[3px]" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="eq-bar block w-[3px] rounded-xs bg-white/90"
                style={{ height: 16, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-fine text-white/50">
            {t({ de: "Läuft gerade", en: "Now playing" })}
          </p>
          <p className="truncate text-body font-medium">Die With A Smile</p>
          <p className="truncate text-fine text-white/50">Lady Gaga, Bruno Mars</p>
        </div>
      </div>

      {/* Request field */}
      <div className="mt-3 flex items-center gap-2 rounded-md border border-white/20 px-4 py-3 text-caption text-white/45">
        <Search className="h-4 w-4 shrink-0" aria-hidden />
        <span className="truncate">
          {t({ de: "Schicke deinen Song an den DJ", en: "Send your song to the DJ" })}
        </span>
      </div>

      {/* Leaderboard */}
      <p className="mb-3 mt-5 text-fine text-white/50">
        {t({ de: "Beliebteste Wünsche", en: "Most requested" })}
      </p>
      <ul className="space-y-2">
        {LEADERBOARD.map((row) => (
          <li key={row.rank} className="flex items-center gap-3 rounded-lg bg-white/[0.05] p-2.5">
            <span className="w-4 text-center text-fine tabular-nums text-white/45">{row.rank}</span>
            <span
              aria-hidden
              className="h-9 w-9 shrink-0 rounded-md"
              style={{ background: `linear-gradient(135deg, ${row.from}, ${row.to})` }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-caption font-medium">{row.title}</p>
              <p className="mt-0.5 text-fine text-white/50">
                {row.votes} {t({ de: "Stimmen", en: "votes" })}
              </p>
            </div>
            <span className="grid h-8 w-8 place-items-center rounded-md bg-white/[0.08] text-white/70">
              <ChevronUp className="h-4 w-4" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
