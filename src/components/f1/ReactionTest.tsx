"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const RECOIL = "#19d982";
const F1_RED = "#e10600";
const BEST_KEY = "fk-reaction-best";

/** A real start sequence: five columns light up a second apart, hold for a
 *  random interval, then all go out at once. */
type Phase = "idle" | "arming" | "hold" | "go" | "result" | "jump";

export function ReactionTest() {
  const { t } = useLang();
  const [phase, setPhase] = useState<Phase>("idle");
  const [lit, setLit] = useState(0); // 0–5 columns currently on
  const [time, setTime] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);

  const goAt = useRef(0);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem(BEST_KEY);
      if (stored) setBest(Number(stored));
    } catch {
      /* ignore */
    }
    return clearTimers;
  }, []);

  const start = useCallback(() => {
    clearTimers();
    setTime(null);
    setLit(0);
    setPhase("arming");

    // Five columns, one per second.
    for (let i = 1; i <= 5; i += 1) {
      timers.current.push(
        window.setTimeout(() => {
          setLit(i);
          if (i === 5) setPhase("hold");
        }, i * 1000),
      );
    }

    // Then everything goes out together, after an unpredictable 1–4 s hold.
    const hold = 5000 + 1000 + Math.random() * 3000;
    timers.current.push(
      window.setTimeout(() => {
        setLit(0);
        goAt.current = performance.now();
        setPhase("go");
      }, hold),
    );
  }, []);

  const react = useCallback(() => {
    if (phase === "idle" || phase === "result" || phase === "jump") {
      start();
      return;
    }
    if (phase === "arming" || phase === "hold") {
      clearTimers();
      setLit(0);
      setPhase("jump");
      return;
    }
    if (phase === "go") {
      const ms = Math.round(performance.now() - goAt.current);
      setTime(ms);
      setPhase("result");
      if (best === null || ms < best) {
        setBest(ms);
        try {
          localStorage.setItem(BEST_KEY, String(ms));
        } catch {
          /* ignore */
        }
      }
    }
  }, [phase, start, best]);

  // Space / Enter work like the real thing: you react, you don't aim.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" && e.code !== "Enter") return;
      const el = document.activeElement;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return;
      e.preventDefault();
      react();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [react]);

  const label = () => {
    switch (phase) {
      case "idle":
        return t({ de: "Startsequenz beginnen", en: "Begin the start sequence" });
      case "arming":
      case "hold":
        return t({ de: "Warten …", en: "Wait for it…" });
      case "go":
        return t({ de: "JETZT", en: "NOW" });
      case "jump":
        return t({ de: "Frühstart", en: "Jump start" });
      case "result":
        return t({ de: "Noch einmal", en: "Go again" });
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={react}
        aria-label={t({
          de: "Reaktionstest: Klicken, sobald die Lichter ausgehen",
          en: "Reaction test: click the moment the lights go out",
        })}
        className="group relative block w-full cursor-pointer border border-white/25 bg-black/25 p-4 text-left transition-colors hover:border-white/45"
      >
        {/* Gantry: five columns, two lights each */}
        <div className="flex items-end justify-center gap-2.5 sm:gap-3">
          {[1, 2, 3, 4, 5].map((col) => {
            const on = lit >= col;
            return (
              <div key={col} className="flex flex-col items-center gap-2">
                <span
                  aria-hidden
                  className="h-4 w-1 bg-white/25 sm:h-5"
                  style={{ opacity: 0.6 }}
                />
                <div className="flex flex-col gap-1.5 rounded border border-white/25 bg-black/55 p-1.5 sm:gap-2 sm:p-2">
                  {[0, 1].map((row) => (
                    <span
                      key={row}
                      className={cn(
                        "block h-4 w-4 rounded-full transition-all duration-150 sm:h-5 sm:w-5",
                      )}
                      style={
                        on
                          ? {
                              backgroundColor: F1_RED,
                              boxShadow: `0 0 20px 5px rgba(225,6,0,0.65), inset 0 0 8px rgba(255,190,185,0.55)`,
                            }
                          : { backgroundColor: "rgba(255,255,255,0.12)" }
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Readout — deliberately terse; anyone who tries it works it out */}
        <div className="mt-4 flex items-center justify-between gap-4">
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
              className="text-[0.68rem] font-semibold uppercase tracking-[0.16em]"
              style={{
                color:
                  phase === "go" ? RECOIL : phase === "jump" ? F1_RED : "rgba(255,255,255,0.6)",
              }}
            >
              {label()}
            </motion.span>
          </AnimatePresence>

          <span className="flex items-baseline gap-4 tabular-nums">
            {time !== null && (
              <span
                className="text-xl font-medium"
                style={{ color: time < 200 ? RECOIL : "#fff" }}
              >
                {(time / 1000).toFixed(3)}
                <span className="ml-0.5 text-xs text-white/50">s</span>
              </span>
            )}
            {best !== null && (
              <span className="text-[0.68rem] uppercase tracking-[0.14em] text-white/45">
                {t({ de: "Best", en: "Best" })} {(best / 1000).toFixed(3)}
              </span>
            )}
          </span>
        </div>
      </button>
    </div>
  );
}
