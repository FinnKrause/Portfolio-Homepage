"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useLang } from "@/lib/i18n";

const RECOIL_BRIGHT = "#19d982";
const F1_RED = "#e10600";
const CLIP = "/videos/f1.webm";

/**
 * The championship clip.
 *
 * Loading discipline matters here: the file is large, and an `autoplay`
 * attribute makes the browser start buffering it the moment the page parses —
 * `preload="metadata"` does NOT stop that, and it starves every image on the
 * page of bandwidth. So the <video> carries no `src` at all until the section
 * is within a screen of the viewport, and playback is started by hand rather
 * than by the autoplay attribute.
 *
 * Until then the poster is a normal optimised <Image>, so the frame is never
 * empty and we never ship the 2.4 MB original.
 */
export function RaceFilm({ posterAlt }: { posterAlt: string }) {
  const { t } = useLang();
  const reduce = useReducedMotion() ?? false;
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [armed, setArmed] = useState(false); // has a src been attached?
  const [ready, setReady] = useState(false); // can it be shown?
  const [muted, setMuted] = useState(true);

  // Attach the source only once the section is genuinely approaching, and
  // drive play/pause from the same measurement. This is a plain scroll check
  // rather than an IntersectionObserver so the behaviour is deterministic and
  // testable; it is one getBoundingClientRect per scroll event.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || reduce) return;

    const check = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // Within a screen and a half → worth attaching the source.
      if (r.top < vh * 1.5 && r.bottom > -vh * 0.5) setArmed(true);

      // Actually on screen → play. Otherwise pause and drop the sound.
      const onScreen = r.top < vh * 0.9 && r.bottom > vh * 0.1;
      const vid = videoRef.current;
      if (!vid) return;
      if (onScreen) {
        void vid.play().catch(() => {});
      } else if (!vid.paused) {
        vid.pause();
        vid.muted = true;
        setMuted(true);
      }
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [reduce, armed]);

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
      {/* Poster — optimised, and the only thing that loads up front */}
      <Image
        src="/images/Competitions/F1/f1-podium2.JPG"
        alt={posterAlt}
        fill
        quality={90}
        sizes="(max-width: 1024px) 100vw, 1200px"
        className="object-cover object-top"
      />

      {armed && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          src={CLIP}
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setReady(true)}
        />
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a2418] via-transparent to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1"
        style={{ background: `linear-gradient(to right, ${RECOIL_BRIGHT}, ${F1_RED})` }}
      />

      {ready && (
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
