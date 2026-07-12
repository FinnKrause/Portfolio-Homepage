"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

/** Extract an 11-char YouTube id from a raw id or any YouTube URL. */
function youTubeId(input: string): string {
  const match = input.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  return match ? match[1] : input;
}

/**
 * Lightweight "facade" embed: shows the thumbnail + play button and only
 * loads the real YouTube iframe on click (fast, privacy-friendly via
 * youtube-nocookie).
 */
export function YouTubeEmbed({
  youtube,
  title,
  aspect = "16 / 9",
  fill = false,
  className,
}: {
  youtube: string;
  title?: string;
  aspect?: string;
  fill?: boolean;
  className?: string;
}) {
  const id = youTubeId(youtube);
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className={cn("relative overflow-hidden rounded-xl bg-black", fill ? "h-full w-full" : "", className)}
      style={fill ? undefined : { aspectRatio: aspect }}
    >
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title ?? "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full"
          aria-label={title ? `${title} – Video abspielen` : "Video abspielen"}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/10" />
          <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-brand-700 shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Play className="h-6 w-6 translate-x-0.5 fill-current" />
          </span>
          {title ? (
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-xs font-medium text-white">
              {title}
            </span>
          ) : null}
        </button>
      )}
    </div>
  );
}
