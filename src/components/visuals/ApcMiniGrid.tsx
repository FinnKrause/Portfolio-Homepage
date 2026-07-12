import { cn } from "@/lib/utils";

/**
 * A stylised, self-animating recreation of the APCmini Middleware pad grid.
 * Pure CSS animation (see `.pad-live` in globals.css) — no JS, reduced-motion safe.
 */

// Column colour themes, inspired by the real control surface.
const COLS: (string | null)[][] = [
  ["#f8fafc", "#ef4444", "#22c55e", "#3b82f6", "#06b6d4", "#d946ef", "#eab308", "#f97316"],
  ["#f8fafc", "#ef4444", "#22c55e", "#3b82f6", "#06b6d4", "#d946ef", "#eab308", "#f97316"],
  ["#fb923c", "#f97316", "#fb923c", "#f59e0b", "#f97316", "#ea580c", "#ef4444", "#f97316"],
  ["#ec4899", "#f472b6", "#f9a8d4", "#fb7185", "#ec4899", "#f472b6", "#22c55e", "#84cc16"],
  ["#d946ef", "#a855f7", "#22c55e", "#d946ef", "#a855f7", "#f43f5e", "#14b8a6", "#10b981"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, "#ef4444", null, "#22c55e", null],
  ["#3b82f6", "#2563eb", "#0ea5e9", "#ef4444", "#1d4ed8", "#ef4444", "#22c55e", "#ffffff"],
];

export function ApcMiniGrid({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative w-full rounded-2xl border border-white/10 bg-[#0a0f1f] p-4 shadow-inner",
        className,
      )}
      aria-hidden
    >
      {/* Panel header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/40">
          Krause Software Solutions
        </span>
        <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px] shadow-emerald-400" />
          MIDI
        </span>
      </div>

      {/* Pad grid (row-major) */}
      <div className="grid grid-cols-8 gap-1.5">
        {Array.from({ length: 8 }).map((_, row) =>
          COLS.map((col, c) => {
            const color = col[row];
            const lit = Boolean(color);
            return (
              <div
                key={`${row}-${c}`}
                className={cn(
                  "aspect-square rounded-[5px] transition-transform",
                  lit ? "pad-live" : "bg-white/[0.04] ring-1 ring-inset ring-white/5",
                )}
                style={
                  lit
                    ? {
                        backgroundColor: color as string,
                        color: color as string,
                        animationDelay: `${((row + c) % 8) * 0.22}s`,
                      }
                    : undefined
                }
              />
            );
          }),
        )}
      </div>

      {/* Faders */}
      <div className="mt-3 grid grid-cols-8 gap-1.5">
        {[62, 40, 78, 33, 88, 55, 47, 70].map((v, i) => (
          <div key={i} className="flex h-10 items-end rounded-[5px] bg-white/[0.04] p-1 ring-1 ring-inset ring-white/5">
            <div
              className="w-full rounded-[3px] bg-gradient-to-t from-brand-500 to-sky-400"
              style={{ height: `${v}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
