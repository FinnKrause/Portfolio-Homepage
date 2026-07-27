"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useLang } from "@/lib/i18n";

const RECOIL_BRIGHT = "#19d982";
const F1_RED = "#e10600";

/**
 * The championship clip. Autoplays muted and loops — the only form of autoplay
 * browsers allow — with a discreet control to bring the sound in. It only
 * plays while on screen, and re-mutes itself when it scrolls away.
 */
export function RaceFilm({ posterAlt }: { posterAlt: string }) {
  const { t } = useLang();
  const reduce = useReducedMotion() ?? false;
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    const vid = videoRef.current;
    if (!el || !vid || reduce) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          void vid.play().catch(() => {});
        } else {
          vid.pause();
          vid.muted = true;
          setMuted(true);
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const toggleSound = () => {
    const vid = videoRef.current;
    if (!vid) return;
    const next = !muted;
    vid.muted = next;
    if (!next) void vid.play().catch(() => {});
    setMuted(next);
  };

  return (
    <div ref={wrapRef} className="relative aspect-[2/1] overflow-hidden md:aspect-[21/8]">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/f1.webm"
        poster="/images/f1-podium2.jpg"
        aria-label={posterAlt}
        autoPlay={!reduce}
        muted
        loop
        playsInline
        preload="metadata"
        controls={reduce}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a2418] via-transparent to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1"
        style={{ background: `linear-gradient(to right, ${RECOIL_BRIGHT}, ${F1_RED})` }}
      />

      {!reduce && (
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={!muted}
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/55 px-3.5 py-2 text-xs font-medium text-white/90 backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-black/75"
        >
          {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          {muted ? t({ de: "Ton an", en: "Sound on" }) : t({ de: "Ton aus", en: "Sound off" })}
        </button>
      )}
    </div>
  );
}
