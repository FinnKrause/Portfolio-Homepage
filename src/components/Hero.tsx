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
import { ArrowDown, MapPin } from "lucide-react";
import { profile } from "@/content/profile";
import { useLang } from "@/lib/i18n";
import { useIsDesktop } from "@/lib/useIsDesktop";
import { HeroBackdrop } from "./visuals/HeroBackdrop";

export function Hero() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const desktop = useIsDesktop();
  const ref = useRef<HTMLElement>(null);

  // Scroll-linked exit. The background only FADES (opacity is compositor-cheap);
  // the content lifts. We never translate the big blurred ray layer on scroll —
  // that was the source of the jank.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const stageOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  // Pointer parallax — spring-followed, critically damped. Only the cheap
  // far layer (canvas + thin grid) moves; the blurred rays stay put.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 70, damping: 20, mass: 0.6, restDelta: 0.0005 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const farX = useTransform(sx, (v) => v * -18);
  const farY = useTransform(sy, (v) => v * -12);
  const midX = useTransform(sx, (v) => v * -34);
  const midY = useTransform(sy, (v) => v * -24);
  const figX = useTransform(sx, (v) => v * 12);
  const figY = useTransform(sy, (v) => v * 8);

  const parallaxOn = desktop && !reduce;
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!parallaxOn) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };
  const portraitIn: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 36, scale: reduce ? 1 : 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      ref={ref}
      id="top"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="hero-aurora relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* ---------- Ambient background (full-bleed) ---------- */}
      <motion.div
        style={reduce ? undefined : { opacity: bgOpacity }}
        className="absolute inset-0 z-0"
        aria-hidden
      >
        {/* Far layer — data field + perspective grid floor (cheap to translate) */}
        <motion.div
          style={parallaxOn ? { x: farX, y: farY } : undefined}
          className="absolute inset-[-6%]"
        >
          <HeroBackdrop />
          <div className="hero-horizon" />
          <div className="hero-stage-3d">
            <div className="hero-grid-3d" />
          </div>
        </motion.div>

        {/* Eye-catcher — slow drifting aurora beams (kept clear of the navbar) */}
        <motion.div
          style={parallaxOn ? { x: midX, y: midY } : undefined}
          className="absolute inset-[-4%]"
        >
          <div className="aurora-beam aurora-beam--1" />
          <div className="aurora-beam aurora-beam--2" />
          <div className="aurora-beam aurora-beam--3" />
        </motion.div>
      </motion.div>

      {/* ---------- Content: text left, grounded figure right ---------- */}
      <motion.div
        style={reduce ? undefined : { y: stageY, opacity: stageOpacity }}
        className="mx-container relative z-10 grid flex-1 items-center gap-6 pb-20 pt-28 sm:pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-16"
      >
        {/* Copy */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left"
        >
          <motion.div
            variants={rise}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/60 bg-white/60 px-4 py-1.5 text-sm text-ink-500 shadow-sm backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
            </span>
            <span className="font-medium text-ink-700">{t(profile.eyebrow)}</span>
            <span className="hidden text-ink-300 sm:inline">·</span>
            <span className="hidden items-center gap-1 sm:inline-flex">
              <MapPin className="h-3.5 w-3.5 text-brand-600" />
              Erlangen, DE
            </span>
          </motion.div>

          <motion.h1
            variants={rise}
            className="headline mt-6 text-[clamp(3rem,7.5vw,5.75rem)] font-bold text-ink-900"
          >
            <span className="block">Finn</span>
            <span className="block text-gradient">Krause</span>
          </motion.h1>

          <motion.p
            variants={rise}
            className="mt-5 max-w-xl text-pretty text-lg font-medium text-ink-700 sm:text-xl"
          >
            {t(profile.hero.headline)}
          </motion.p>

          <motion.p
            variants={rise}
            className="mt-3 max-w-lg text-pretty text-base leading-relaxed text-ink-500"
          >
            {t(profile.hero.lead)}
          </motion.p>

          <motion.div
            variants={rise}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start"
          >
            <a
              href="#about"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_-8px_rgba(38,69,230,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-[0_16px_38px_-8px_rgba(38,69,230,0.85)]"
            >
              {t({ de: "Die Reise beginnen", en: "Start the journey" })}
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white/60 px-6 py-3 text-sm font-semibold text-ink-700 backdrop-blur-sm transition-colors duration-300 hover:border-brand-200 hover:text-brand-700"
            >
              {t({ de: "Kontakt", en: "Get in touch" })}
            </a>
          </motion.div>
        </motion.div>

        {/* Grounded figure (no halo) */}
        <motion.div
          variants={portraitIn}
          initial="hidden"
          animate="show"
          className="order-1 flex justify-center lg:order-2 lg:justify-end"
        >
          <motion.div
            style={parallaxOn ? { x: figX, y: figY } : undefined}
            className="relative"
          >
            <div className="hero-floor-pool" aria-hidden />
            <div className={reduce ? "relative z-10" : "relative z-10 float-slow"}>
              <Image
                src="/images/finn-portrait-transparent.png"
                alt={t({
                  de: "Finn Krause im Anzug, freigestellt",
                  en: "Finn Krause in a suit, cut out",
                })}
                width={1090}
                height={1700}
                priority
                sizes="(max-width: 640px) 74vw, (max-width: 1024px) 48vh, 40vw"
                className="mx-auto h-[42vh] w-auto max-w-[80vw] object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_85%,transparent)] sm:h-[48vh] lg:h-[60vh]"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ---------- Scroll cue ---------- */}
      <motion.div
        style={reduce ? undefined : { opacity: stageOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden justify-center md:flex"
      >
        <a
          href="#about"
          aria-label={t({ de: "Weiter scrollen", en: "Scroll down" })}
          className="pointer-events-auto flex flex-col items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-ink-500 transition-colors hover:text-brand-700"
        >
          <span>{t({ de: "Scrollen", en: "Scroll" })}</span>
          <span className="relative flex h-9 w-px justify-center overflow-hidden rounded-full bg-gradient-to-b from-brand-300 to-transparent">
            <span className="scroll-dot absolute top-0 h-2 w-px rounded-full bg-brand-600 shadow-[0_0_6px_1px_rgba(38,69,230,0.7)]" />
          </span>
        </a>
      </motion.div>
    </section>
  );
}
