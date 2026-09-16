import { cn } from "@/lib/utils";

/**
 * A stylised, self-animating recreation of the APCmini Middleware pad grid.
 * Pure CSS animation (see `.pad-live` in globals.css) — no JS, reduced-motion safe.
 *
 * The pad colours are not a palette choice: they are the LED colours of the
 * actual control surface, which is what the project is about. Everything
 * around them — the panel, the frame, the labels — is on the site's system.
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
      className={cn("relative w-full rounded-xl bg-ink p-4", className)}
      aria-hidden
    >
      {/* Panel header */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-fine text-white/45">Krause Software Solutions</span>
        <span className="inline-flex items-center gap-2 text-fine text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-bright" />
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
                  "aspect-square rounded-sm",
                  lit ? "pad-live" : "bg-white/[0.06]",
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
          <div key={i} className="flex h-10 items-end rounded-sm bg-white/[0.06] p-1">
            <div className="w-full rounded-xs bg-primary-bright" style={{ height: `${v}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}
