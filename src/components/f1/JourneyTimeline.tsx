"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowDown, ArrowUpRight, ChevronDown, Play } from "lucide-react";
import { journey, type JourneyPoint } from "@/content/journey";
import { useLang } from "@/lib/i18n";
import { useIsDesktop } from "@/lib/useIsDesktop";
import { Lightbox, type LightboxImage } from "../media/Lightbox";
import { cn } from "@/lib/utils";
import { ACCENT_WARM, ACCENT_COOL } from "@/content/theme";


/** Station spacing once zoomed in. Stations alternate above/below the axis,
 *  so neighbours never collide and they can sit closer than a card is wide. */
const STEP = 320;
const CARD_W = 290;
/** Horizontal breathing room for the zoomed-out overview. */
const PAD = 56;

/**
 * Scroll budget.
 *   0.00–0.10  hold the overview — the whole timeline as a diagram
 *   0.10–0.22  zoom in
 *   0.22–1.00  walk the stations, ending on the last one
 *
 * There is deliberately no zoom-out at the end: collapsing back to the
 * left-aligned diagram means the rail has to travel the whole way back, so
 * everything slides the opposite way while you are still scrolling down. That
 * reads as scrolling the wrong direction, so the section simply hands over to
 * the page once the last station is centred.
 */
const HOLD_IN = 0.1;
const ZOOM_IN_END = 0.22;

const toneColor = (tone?: JourneyPoint["tone"]) => (tone === "red" ? ACCENT_WARM : ACCENT_COOL);
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
/** Eases in and out with zero velocity at both ends — no visible kick. */
const ease = (t: number) => {
  const x = clamp01(t);
  return x * x * x * (x * (6 * x - 15) + 10);
};

/**
 * Video stills are served from our own origin, not from i.ytimg.com. Hot-linking
 * Google's copy meant every visitor's IP reached Google on page load, for a
 * still frame — a third-party request the site otherwise doesn't make. The files
 * are named after the video id, so adding a video means dropping one more
 * `<id>.jpg` in here. See docs/frontend.md#youtube-stills.
 */
function videoStill(id: string): string {
  return `/images/Journey-Thumbnails/${id}.jpg`;
}

/** The circular image used in the overview — a photo if there is one, else the video still. */
function overviewImage(point: JourneyPoint): string | null {
  if (point.gallery?.length) return point.gallery[0].src;
  if (point.youtube) return videoStill(point.youtube);
  return null;
}

type OpenImage = (imgs: LightboxImage[], i: number) => void;

/* ------------------------------------------------------------------ card */

function CardContent({ point, onOpenImage }: { point: JourneyPoint; onOpenImage: OpenImage }) {
  const { t } = useLang();
  const images: LightboxImage[] = (point.gallery ?? []).map((s) => ({
    src: s.src,
    alt: s.alt ? t(s.alt) : "",
  }));

  return (
    <>
      <div className="flex items-center gap-2.5">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: toneColor(point.tone) }}
          aria-hidden
        />
        <span className="text-fine font-medium text-steel">{t(point.marker)}</span>
      </div>

      <h4 className="display-xs mt-2 text-on-ink">{t(point.title)}</h4>
      <p className="mt-2 text-caption text-white/75">{t(point.blurb)}</p>

      {point.body && <p className="mt-2 text-caption text-white/55">{t(point.body)}</p>}

      {point.youtube && (
        <a
          href={`https://www.youtube.com/watch?v=${point.youtube}`}
          target="_blank"
          rel="noreferrer"
          className="frame group/vid relative mt-3 block aspect-video w-full"
        >
          <Image
            src={videoStill(point.youtube)}
            alt=""
            fill
            sizes="290px"
            className="object-cover transition-transform duration-500 group-hover/vid:scale-105"
          />
          <span className="absolute inset-0 bg-ink/30 transition-colors group-hover/vid:bg-ink/10" />
          <span
            className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
            style={{ backgroundColor: ACCENT_WARM }}
          >
            <Play className="h-3.5 w-3.5 fill-white text-white" />
          </span>
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-sm bg-ink/75 px-1.5 py-0.5 text-fine text-white/90">
            YouTube <ArrowUpRight className="h-3 w-3" />
          </span>
        </a>
      )}

      {images.length > 0 && (
        <div className={cn("mt-2.5 grid gap-2", images.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => onOpenImage(images, i)}
              aria-label={t({ de: "Bild vergrößern", en: "Enlarge image" })}
              className="frame group/img relative aspect-[16/10] w-full"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                quality={90}
                sizes="180px"
                className="object-cover transition-transform duration-500 group-hover/img:scale-105"
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------- station */

function Station({
  point,
  index,
  station,
  zoom,
  spacing,
  shift,
  onOpenImage,
}: {
  point: JourneyPoint;
  index: number;
  station: MotionValue<number>;
  zoom: MotionValue<number>;
  spacing: MotionValue<number>;
  shift: MotionValue<number>;
  onOpenImage: OpenImage;
}) {
  const { t } = useLang();
  const accent = toneColor(point.tone);
  const above = index % 2 === 0;
  const img = overviewImage(point);

  // Distance from the centred station, in stations. Continuous — a hard
  // cut-off here was what made the cards snap into existence half-way
  // through the zoom.
  const local = useTransform<number, number>([station, zoom], ([s, z]) => index - s * z);

  // One shared horizontal position for the dot, the overview label and the card.
  const x = useTransform<number, number>([local, spacing, shift], ([l, sp, sh]) => l * sp + sh);

  const cardOpacity = useTransform<number, number>([local, zoom], ([l, z]) =>
    clamp01((z - 0.45) / 0.55) * Math.max(0, 1 - Math.abs(l) * 0.34),
  );
  const cardScale = useTransform(local, (l) => 1 - Math.min(Math.abs(l), 3) * 0.04);
  // Every visible card stays clickable; only the ones stacked far behind opt out.
  const cardPointer = useTransform<number, "auto" | "none">([local, zoom], ([l, z]) =>
    z > 0.5 && Math.abs(l) < 2.4 ? "auto" : "none",
  );
  const zIndex = useTransform(local, (l) => Math.round(30 - Math.min(Math.abs(l), 10) * 2));

  const overviewOpacity = useTransform(zoom, (z) => clamp01((0.55 - z) / 0.55));
  const overviewPointer = useTransform<number, "auto" | "none">(zoom, (z) =>
    z < 0.5 ? "auto" : "none",
  );
  const dotScale = useTransform<number, number>([local, zoom], ([l, z]) =>
    1 + 0.6 * z * Math.max(0, 1 - Math.abs(l) * 1.5),
  );

  return (
    <motion.div style={{ x, zIndex }} className="absolute inset-y-0 left-1/2 w-0">
      {/* Dot on the axis */}
      <motion.span
        aria-hidden
        style={{ scale: dotScale, backgroundColor: accent }}
        className="absolute left-1/2 top-1/2 z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
      />
      {/* Connector from the axis out to the content */}
      <span
        aria-hidden
        className={cn(
          "absolute left-1/2 w-px -translate-x-1/2 bg-white/25",
          above ? "bottom-1/2 h-8" : "top-1/2 h-8",
        )}
      />

      {/* ---- Overview: a compact diagram entry ---- */}
      <motion.a
        href={point.youtube ? `https://www.youtube.com/watch?v=${point.youtube}` : undefined}
        target={point.youtube ? "_blank" : undefined}
        rel={point.youtube ? "noreferrer" : undefined}
        style={{ opacity: overviewOpacity, pointerEvents: overviewPointer }}
        className={cn(
          "group absolute left-1/2 flex w-[11rem] -translate-x-1/2 flex-col items-center text-center",
          above ? "bottom-[calc(50%+2.25rem)]" : "top-[calc(50%+2.25rem)]",
        )}
      >
        {img && point.highlight && above && (
          <span className="relative mb-3 block h-24 w-24 overflow-hidden rounded-xl transition-transform duration-500 group-hover:scale-105">
            <Image src={img} alt="" fill sizes="96px" className="object-cover" />
          </span>
        )}

        <span
          className="text-body font-medium"
          style={{ color: point.highlight ? accent : "rgba(255, 255, 255, 0.75)" }}
        >
          {t(point.marker)}
        </span>
        <span className="mt-1 text-fine text-white/55">{t(point.title)}</span>

        {img && point.highlight && !above && (
          <span className="relative mt-3 block h-24 w-24 overflow-hidden rounded-xl transition-transform duration-500 group-hover:scale-105">
            <Image src={img} alt="" fill sizes="96px" className="object-cover" />
          </span>
        )}
      </motion.a>

      {/* ---- Detail: the full card ---- */}
      <motion.article
        style={{
          opacity: cardOpacity,
          scale: cardScale,
          pointerEvents: cardPointer,
          width: CARD_W,
        }}
        className={cn(
          "absolute left-1/2 -translate-x-1/2 rounded-xl border border-white/15 bg-white/[0.07] p-4 backdrop-blur-md",
          above ? "bottom-[calc(50%+2.25rem)] origin-bottom" : "top-[calc(50%+2.25rem)] origin-top",
        )}
      >
        <CardContent point={point} onOpenImage={onOpenImage} />
      </motion.article>
    </motion.div>
  );
}

/* ------------------------------------------------------------ component */

export function JourneyTimeline() {
  const { t } = useLang();
  const desktop = useIsDesktop();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);
  const [lightbox, setLightbox] = useState<{ images: LightboxImage[]; index: number } | null>(
    null,
  );
  // Off the immersive rail (mobile, reduced motion) the timeline starts folded
  // away so it never stands between you and the rest of the page.
  const [listOpen, setListOpen] = useState(false);

  /** Jump straight past the pinned rail to whatever comes next. */
  const skip = () => {
    const el = ref.current;
    if (!el) return;
    const end = el.getBoundingClientRect().bottom + window.scrollY;
    window.scrollTo({ top: end, behavior: "instant" as ScrollBehavior });
  };

  const immersive = desktop && !reduce;
  const count = journey.length;

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, [immersive]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Smooth the raw scroll signal so the rail glides instead of stepping with
  // every wheel tick. Overdamped, so it eases without ever overshooting.
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 34,
    restDelta: 0.0004,
  });

  /** 0 = zoomed-out overview, 1 = walking the stations. Eased, then stays open. */
  const zoom = useTransform(progress, (p) =>
    p <= HOLD_IN ? 0 : ease((p - HOLD_IN) / (ZOOM_IN_END - HOLD_IN)),
  );

  /** Linear station travel — no snapping, since every card is clickable. */
  const station = useTransform(progress, (p) =>
    clamp01((p - ZOOM_IN_END) / (1 - ZOOM_IN_END)) * (count - 1),
  );

  const overviewSpacing = Math.max(1, (width - PAD * 2) / Math.max(1, count - 1));
  const spacing = useTransform(zoom, (z) => overviewSpacing + (STEP - overviewSpacing) * z);
  const shift = useTransform(zoom, (z) => (1 - z) * (PAD - width / 2));
  const progressScale = useTransform(station, [0, Math.max(1, count - 1)], [0, 1]);

  const onOpenImage: OpenImage = (images, index) => setLightbox({ images, index });

  return (
    <>
      <div
        ref={ref}
        style={immersive ? { height: `${count * 46}vh` } : undefined}
        className="relative"
      >
        <div className={cn(immersive && "sticky top-0 flex h-screen flex-col overflow-hidden")}>
          {/* Heading — kept tight so the timeline gets the height */}
          <div className={cn("mx-container shrink-0", immersive ? "pt-24" : "pt-4")}>
            <div className="flex items-start justify-between gap-6">
              <div>
                <h3 className="display-lg max-w-[24ch]">
                  {t({
                    de: "Vom ersten Auto bis zum Mentor",
                    en: "From the first car to being a mentor",
                  })}
                </h3>
                <p className="lead mt-3">
                  {t({
                    de: "Was nach dem Titel kam — Coaching, Jury, Vorträge.",
                    en: "What came after the title — coaching, judging, talks.",
                  })}
                </p>
              </div>

              {immersive && (
                <button
                  type="button"
                  onClick={skip}
                  className="btn btn-outline-ink mt-1 shrink-0"
                >
                  {t({ de: "Überspringen", en: "Skip" })}
                  <ArrowDown className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {immersive ? (
            /* The axis sits in the middle; stations alternate above and below it */
            <div ref={stageRef} className="relative min-h-0 flex-1">
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/20" aria-hidden />
              <motion.div
                aria-hidden
                style={{ scaleX: progressScale }}
                className="absolute inset-x-0 top-1/2 h-px origin-left -translate-y-1/2"
              >
                <div
                  className="h-px w-full"
                  style={{ background: `linear-gradient(to right, ${ACCENT_COOL}, ${ACCENT_WARM})` }}
                />
              </motion.div>

              {journey.map((point, i) => (
                <Station
                  key={point.id}
                  point={point}
                  index={i}
                  station={station}
                  zoom={zoom}
                  spacing={spacing}
                  shift={shift}
                  onOpenImage={onOpenImage}
                />
              ))}
            </div>
          ) : (
            /* Mobile & reduced-motion: folded away, opens into a plain list */
            <div className="mx-container mt-6 pb-2">
              <button
                type="button"
                onClick={() => setListOpen((o) => !o)}
                aria-expanded={listOpen}
                className="flex min-h-[56px] w-full items-center justify-between gap-4 border-y border-white/20 py-4 text-left"
              >
                <span className="text-body font-medium text-on-ink">
                  {listOpen
                    ? t({ de: "Zeitstrahl ausblenden", en: "Hide the timeline" })
                    : t({ de: "Zeitstrahl ansehen", en: "View the timeline" })}
                  <span className="ml-2 text-white/45">{journey.length}</span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-primary-bright transition-transform duration-300",
                    listOpen && "rotate-180",
                  )}
                />
              </button>

              {listOpen && (
                <ol className="relative mt-8 space-y-10 border-l border-white/20 pl-6">
                  {journey.map((point) => (
                    <li key={point.id} className="relative">
                      <span
                        aria-hidden
                        className="absolute -left-[1.6rem] top-2 h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: toneColor(point.tone) }}
                      />
                      <CardContent point={point} onOpenImage={onOpenImage} />
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </div>
      </div>

      <Lightbox
        images={lightbox?.images ?? []}
        index={lightbox ? lightbox.index : null}
        onClose={() => setLightbox(null)}
        onNav={(dir) =>
          setLightbox((cur) =>
            cur
              ? { ...cur, index: (cur.index + dir + cur.images.length) % cur.images.length }
              : cur,
          )
        }
      />
    </>
  );
}
