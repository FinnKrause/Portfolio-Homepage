"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { profile } from "@/content/profile";
import { useLang } from "@/lib/i18n";

export function Hero() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const drift = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const rise = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  return (
    <div ref={ref} className="relative z-0 lg:sticky lg:top-0 lg:h-[100svh]">
      <section
        id="top"
        className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#03050c] text-night-ink lg:h-full lg:min-h-0"
      >
        {/* Light */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(60rem_44rem_at_50%_18%,rgba(30,51,207,0.3),transparent_64%),radial-gradient(50rem_38rem_at_50%_100%,rgba(9,60,140,0.18),transparent_66%)]"
        />

        {/* Grain + vignette */}
        <div aria-hidden className="grain absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_45%,transparent_30%,rgba(3,5,12,0.45)_72%,rgba(3,5,12,0.9)_100%)]" />
        </div>

        {/* Centred type */}
        <motion.div
          style={reduce ? undefined : { opacity: fade, y: drift }}
          className="mx-container relative z-10 flex flex-col items-center py-24 text-center"
        >
          <motion.p
            custom={0}
            variants={rise}
            initial="hidden"
            animate="show"
            className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-white/55"
          >
            {profile.name}
          </motion.p>

          <motion.h1
            custom={1}
            variants={rise}
            initial="hidden"
            animate="show"
            className="headline mt-7 max-w-[16ch] text-balance text-[clamp(2.75rem,7vw,6rem)] font-medium leading-[1.02] text-white"
          >
            {t({
              de: "Willkommen auf meiner Homepage",
              en: "Welcome to my homepage",
            })}
          </motion.h1>

          <motion.p
            custom={2}
            variants={rise}
            initial="hidden"
            animate="show"
            className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-night-ink/85 sm:text-lg"
          >
            {t(profile.hero.headline)}
          </motion.p>

          <motion.p
            custom={3}
            variants={rise}
            initial="hidden"
            animate="show"
            className="mt-3 max-w-lg text-pretty text-sm leading-relaxed text-night-mute"
          >
            {t(profile.hero.lead)}
          </motion.p>

          <motion.div custom={4} variants={rise} initial="hidden" animate="show">
            <a
              href="#about"
              className="group mt-10 inline-flex items-center gap-3 text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              <span className="relative">
                {t({ de: "Weiterlesen", en: "Read on" })}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left bg-white/40 transition-transform duration-500 group-hover:scale-x-0" />
              </span>
              <span className="translate-y-px text-white/50 transition-transform duration-500 group-hover:translate-y-1.5">
                ↓
              </span>
            </a>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
