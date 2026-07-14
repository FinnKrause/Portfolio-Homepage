"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight, ChevronDown, Gavel, Lightbulb, MapPin, Trophy } from "lucide-react";
import { profile } from "@/content/profile";
import { useLang } from "@/lib/i18n";

const HIGHLIGHT_ICONS: Record<string, typeof Trophy> = {
  trophy: Trophy,
  gavel: Gavel,
  lightbulb: Lightbulb,
};

export function Hero() {
  const { t } = useLang();
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section id="top" className="hero-aurora relative overflow-hidden pt-28 pb-14 md:pt-36 md:pb-20">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />

      <div className="mx-container relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Copy */}
          <motion.div variants={container} initial="hidden" animate="show">
            {/* Kicker */}
            <motion.div variants={item} className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/70 px-3.5 py-1.5 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
                </span>
                <span className="eyebrow !text-brand-800">{t(profile.eyebrow)}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/70 px-3 py-1.5 text-xs font-medium text-ink-500 backdrop-blur">
                <MapPin className="h-3.5 w-3.5 text-brand-600" />
                Erlangen, DE
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={item}
              className="headline mt-6 text-[3.25rem] font-bold text-ink-900 sm:text-7xl md:text-[5.5rem]"
            >
              {profile.name}
            </motion.h1>

            {/* Role */}
            <motion.p variants={item} className="mt-4 text-xl font-semibold sm:text-2xl">
              <span className="text-gradient">{t(profile.role)}</span>
            </motion.p>

            {/* Lead */}
            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg"
            >
              {t(profile.lead)}
            </motion.p>

            {/* Frosted highlight bar */}
            <motion.ul
              variants={item}
              className="mt-8 inline-flex max-w-full flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-line bg-white/60 px-4 py-3 shadow-sm backdrop-blur sm:gap-x-5"
            >
              {profile.heroHighlights.map((h, i) => {
                const Icon = HIGHLIGHT_ICONS[h.icon] ?? Trophy;
                return (
                  <li key={i} className="inline-flex items-center gap-2 text-sm text-ink-700">
                    <Icon className="h-4 w-4 shrink-0 text-brand-600" />
                    <span className="font-medium">{t(h.label)}</span>
                  </li>
                );
              })}
            </motion.ul>

            {/* CTAs */}
            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(38,69,230,0.7)] transition-colors hover:bg-brand-700"
              >
                {t({ de: "Projekte ansehen", en: "View my work" })}
                <ArrowUpRight className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="#about"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink-900 transition-colors hover:border-brand-300 hover:text-brand-700"
              >
                {t({ de: "Mehr über mich", en: "More about me" })}
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Portrait — gradient-framed, glowing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-sm lg:max-w-md"
          >
            <div
              className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-tr from-brand-300/40 via-sky-300/40 to-transparent blur-3xl"
              aria-hidden
            />
            <div className="rounded-[2.2rem] bg-gradient-to-br from-brand-500/60 via-brand-400/25 to-sky-300/50 p-[3px] shadow-lift">
              <div className="overflow-hidden rounded-[2rem] bg-white">
                <Image
                  src="/images/finn-portrait.jpg"
                  alt="Finn Krause"
                  width={768}
                  height={1024}
                  priority
                  sizes="(max-width: 1024px) 24rem, 28rem"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/40" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          aria-label={t({ de: "Weiter scrollen", en: "Scroll down" })}
          className="mx-auto mt-16 hidden w-fit flex-col items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-ink-500 lg:flex"
        >
          <span>{t({ de: "Scrollen", en: "Scroll" })}</span>
          <ChevronDown className="scroll-cue h-4 w-4 text-brand-600" />
        </motion.a>
      </div>
    </section>
  );
}
