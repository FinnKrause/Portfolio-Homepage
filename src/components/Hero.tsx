"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { profile } from "@/content/profile";
import { useLang } from "@/lib/i18n";
import { useIsDesktop } from "@/lib/useIsDesktop";

export function Hero() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const desktop = useIsDesktop();
  const ref = useRef<HTMLDivElement>(null);

  // The sheet slides over the sticky cover; fade the cover's content out as it
  // gets covered so it reads as the file being opened, not just hidden.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const coverOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const coverY = useTransform(scrollYProgress, [0, 1], [0, -46]);

  // Cursor: reading light (CSS vars) + a gentle portrait tilt. Desktop only.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 60, damping: 18, mass: 0.7, restDelta: 0.001 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const tiltX = useTransform(sy, (v) => v * -3.5);
  const tiltY = useTransform(sx, (v) => v * 4.5);
  const cursorOn = desktop && !reduce;

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cursorOn) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    px.set(nx - 0.5);
    py.set(ny - 0.5);
    e.currentTarget.style.setProperty("--mx", `${(nx * 100).toFixed(2)}%`);
    e.currentTarget.style.setProperty("--my", `${(ny * 100).toFixed(2)}%`);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };
  const frameIn: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    // Desktop: the cover is sticky and the light sheet slides over it.
    // Mobile: a normal in-flow hero (no cover effect, content may exceed 100svh).
    <div ref={ref} className="relative z-0 lg:sticky lg:top-0 lg:h-[100svh]">
      <section
        id="top"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative flex min-h-[100svh] flex-col overflow-hidden bg-night text-night-ink lg:h-full lg:min-h-0"
      >
        {/* Cover backdrop */}
        <div aria-hidden className="absolute inset-0">
          <div className="cover-wash" />
          <div className="cover-grid" />
          {cursorOn && <div className="reading-light" />}
        </div>

        <motion.div
          style={reduce ? undefined : { opacity: coverOpacity, y: coverY }}
          className="mx-container relative z-10 flex flex-1 flex-col"
        >
          {/* Cover content */}
          <div className="grid flex-1 items-center gap-10 pb-24 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-16">
            {/* Identity */}
            <motion.div variants={container} initial="hidden" animate="show">
              <motion.p
                variants={rise}
                className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-night-mute sm:text-xs"
              >
                {t(profile.eyebrow)}
              </motion.p>

              <motion.h1
                variants={rise}
                className="headline mt-5 text-[clamp(3.4rem,9.5vw,7.75rem)] font-semibold text-white"
              >
                Finn
                <br />
                Krause
              </motion.h1>

              <motion.p
                variants={rise}
                className="mt-6 max-w-xl text-pretty text-lg font-medium text-night-ink/90 sm:text-xl"
              >
                {t(profile.hero.headline)}
              </motion.p>

              <motion.p
                variants={rise}
                className="mt-3 max-w-lg text-pretty text-base leading-relaxed text-night-mute"
              >
                {t(profile.hero.lead)}
              </motion.p>

              <motion.div variants={rise} className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href="#about"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-400"
                >
                  {t({ de: "Akte durchblättern", en: "Leaf through the file" })}
                  <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-night-line px-6 py-3 text-sm font-semibold text-night-ink/90 transition-colors duration-300 hover:border-brand-300/60 hover:text-white"
                >
                  {t({ de: "Kontakt", en: "Get in touch" })}
                </a>
              </motion.div>
            </motion.div>

            {/* File photo — framed like a document photograph */}
            <motion.div
              variants={frameIn}
              initial="hidden"
              animate="show"
              className="flex justify-center pb-4 lg:justify-end lg:pb-0"
            >
              <motion.div
                style={
                  cursorOn
                    ? { rotateX: tiltX, rotateY: tiltY, transformPerspective: 900 }
                    : undefined
                }
                className="relative"
              >
                <div className="relative w-[min(15rem,62vw)] border border-night-line bg-night-soft/70 lg:w-[clamp(16rem,26vw,22rem)]">
                  {/* Corner ticks */}
                  {(["-top-px -left-px border-t border-l", "-top-px -right-px border-t border-r", "-bottom-px -left-px border-b border-l", "-bottom-px -right-px border-b border-r"] as const).map(
                    (pos) => (
                      <span
                        key={pos}
                        aria-hidden
                        className={`absolute z-20 h-3.5 w-3.5 border-brand-300/80 ${pos}`}
                      />
                    ),
                  )}

                  <div className="relative overflow-hidden">
                    <Image
                      src="/images/finn-portrait-transparent.png"
                      alt={t({
                        de: "Finn Krause, Porträt aus der Akte",
                        en: "Finn Krause, file photograph",
                      })}
                      width={1090}
                      height={1700}
                      priority
                      quality={90}
                      sizes="(max-width: 1024px) 62vw, 22rem"
                      className="h-auto w-full object-contain [mask-image:linear-gradient(to_bottom,black_88%,transparent)]"
                    />
                    {!reduce && <div className="scanline" aria-hidden />}
                  </div>

                  {/* Caption bar */}
                  <div className="flex items-center justify-between border-t border-night-line px-3.5 py-2.5 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-night-mute">
                    <span>{t({ de: "Abb. 01 — F. Krause", en: "Fig. 01 — F. Krause" })}</span>
                    <span>Erlangen, DE</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Metadata row — quiet, factual, humble */}
          {/* <div className="absolute inset-x-0 bottom-0 hidden md:block">
            <div className="h-px w-full bg-night-line" />
            <dl className="flex flex-wrap items-center gap-x-10 gap-y-2 py-5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-night-mute">
              <div className="flex items-center gap-2.5">
                <dt className="text-brand-300/80">{t({ de: "Standort", en: "Location" })}</dt>
                <dd>Erlangen, DE</dd>
              </div>
              <div className="flex items-center gap-2.5">
                <dt className="text-brand-300/80">{t({ de: "Studium", en: "Studies" })}</dt>
                <dd>{t({ de: "Wirtschaftsinformatik, FAU", en: "Information Systems, FAU" })}</dd>
              </div>
              <div className="flex items-center gap-2.5">
                <dt className="text-brand-300/80">{t({ de: "Fokus", en: "Focus" })}</dt>
                <dd>{t({ de: "Software · Licht · Security", en: "Software · Light · Security" })}</dd>
              </div>
              <div className="flex items-center gap-2.5">
                <dt className="text-brand-300/80">{t({ de: "Notiz", en: "Note" })}</dt>
                <dd>{t({ de: "Weltmeister, F1 in Schools 2023", en: "World Champion, F1 in Schools 2023" })}</dd>
              </div>
            </dl>
          </div> */}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          style={reduce ? undefined : { opacity: coverOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="pointer-events-none absolute bottom-20 left-1/2 z-10 hidden -translate-x-1/2 lg:block"
        >
          <span className="relative flex h-9 w-px justify-center overflow-hidden rounded-full bg-gradient-to-b from-brand-300/60 to-transparent">
            <span className="scroll-dot absolute top-0 h-2 w-px rounded-full bg-brand-300" />
          </span>
        </motion.div>
      </section>
    </div>
  );
}
