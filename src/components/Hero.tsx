"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowDown, MapPin } from "lucide-react";
import { profile } from "@/content/profile";
import { useLang } from "@/lib/i18n";
import { CodeRain } from "./visuals/CodeRain";
import { LightRays } from "./visuals/LightRays";

export function Hero() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Scroll-linked exit: the whole stage dissolves upward as you leave the fold,
  // the ambient layers drift down + fade — a cinematic hand-off into the story.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const stageOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const bgStyle = reduce ? undefined : { y: bgY, opacity: bgOpacity };
  const stageStyle = reduce ? undefined : { y: stageY, opacity: stageOpacity };

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };
  const portraitIn: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 44, scale: reduce ? 1 : 0.96 },
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
      className="hero-aurora relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* ---------- Ambient background: rays, side code streams, floor ---------- */}
      <motion.div style={bgStyle} className="absolute inset-0 z-0" aria-hidden>
        <LightRays />

        <div className="gutter-code gutter-code--left">
          <CodeRain intensity={0.95} fontSize={18} />
        </div>
        <div className="gutter-code gutter-code--right">
          <CodeRain intensity={0.95} fontSize={18} />
        </div>

        <div className="hero-floor-grid" />
      </motion.div>

      {/* ---------- Centred content ---------- */}
      <motion.div
        style={stageStyle}
        className="mx-container relative z-10 flex flex-1 flex-col items-center justify-center pb-16 pt-24 text-center sm:pt-28"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex w-full flex-col items-center"
        >
          {/* Status pill */}
          <motion.div
            variants={rise}
            className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/70 px-4 py-1.5 text-sm text-ink-500 shadow-sm backdrop-blur-md"
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

          {/* Stage: name behind, Finn spotlit in front */}
          <div className="relative mt-8 flex w-full flex-col items-center">
            <div className="hero-halo" aria-hidden />

            <motion.h1
              variants={rise}
              className="headline relative z-10 text-[clamp(3rem,11vw,6rem)] font-bold text-ink-900"
            >
              <span className="text-balance">{profile.name}</span>
            </motion.h1>

            <motion.div
              variants={portraitIn}
              className="relative z-20 -mt-[4vh] w-full sm:-mt-[5vh] lg:-mt-[7vh]"
            >
              <div className="hero-floor-shadow" aria-hidden />
              <div className={reduce ? "" : "float-slow"}>
                <Image
                  src="/images/finn-portrait-transparent.png"
                  alt={t({
                    de: "Finn Krause im Anzug, freigestellt",
                    en: "Finn Krause in a suit, cut out",
                  })}
                  width={1090}
                  height={1700}
                  priority
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vh, 52vh"
                  className="mx-auto h-[40vh] w-auto max-w-[82vw] object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_88%,transparent)] sm:h-[46vh] lg:h-[52vh]"
                />
              </div>
            </motion.div>

            {/* Evocative tagline sits just below the figure */}
            <motion.p
              variants={rise}
              className="mt-6 max-w-2xl text-pretty text-lg font-medium text-ink-700 sm:text-xl"
            >
              {t(profile.hero.headline)}
            </motion.p>

            {/* Actions */}
            <motion.div
              variants={rise}
              className="mt-7 flex flex-col items-center gap-3 sm:flex-row"
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
          </div>
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
