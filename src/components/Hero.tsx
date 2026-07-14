"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { profile } from "@/content/profile";
import { nav } from "@/content/ui";
import { useLang } from "@/lib/i18n";

export function Hero() {
  const { t } = useLang();
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section id="top" className="hero-aurora relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="mx-container relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          {/* Copy — the story leads */}
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="flex items-center gap-2.5 text-sm text-ink-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
              </span>
              <span className="font-medium">{t(profile.hero.intro)}</span>
              <span className="text-ink-300">·</span>
              <span>{t(profile.eyebrow)}</span>
            </motion.div>

            <motion.h1
              variants={item}
              className="headline mt-6 max-w-2xl text-4xl font-semibold text-ink-900 sm:text-5xl md:text-6xl"
            >
              {t(profile.hero.headline)}
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg"
            >
              {t(profile.hero.lead)}
            </motion.p>

            {/* Journey chapters — a quiet table of contents */}
            <motion.nav variants={item} className="mt-8" aria-label="Kapitel">
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {nav.slice(0, 5).map((item, i) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="group inline-flex items-center gap-1 text-sm font-medium text-ink-700 transition-colors hover:text-brand-700"
                    >
                      <span className="font-mono text-xs text-brand-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {t(item.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>

            <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(38,69,230,0.7)] transition-colors hover:bg-brand-700"
              >
                {t({ de: "Reise beginnen", en: "Start the journey" })}
                <ChevronDown className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink-900 transition-colors hover:border-brand-300 hover:text-brand-700"
              >
                {t({ de: "Kontakt", en: "Contact" })}
                <ArrowUpRight className="h-4 w-4" />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Portrait — a soft accent, deliberately not dominant */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[18rem] sm:max-w-sm lg:max-w-[24rem]"
          >
            <div
              className="absolute inset-x-2 bottom-2 -z-10 mx-auto h-3/4 rounded-[3rem] bg-gradient-to-tr from-brand-300/35 via-sky-300/35 to-transparent blur-3xl"
              aria-hidden
            />
            <Image
              src="/images/finn-portrait-transparent.png"
              alt="Finn Krause"
              width={1090}
              height={1700}
              priority
              sizes="(max-width: 1024px) 18rem, 20rem"
              className="h-auto w-full object-contain [mask-image:linear-gradient(to_bottom,black_86%,transparent)]"
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        aria-label={t({ de: "Weiter scrollen", en: "Scroll down" })}
        className="mx-auto mt-8 hidden w-fit flex-col items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-ink-500 lg:flex"
      >
        <span>{t({ de: "Scrollen", en: "Scroll" })}</span>
        <ChevronDown className="scroll-cue h-4 w-4 text-brand-600" />
      </motion.a>
    </section>
  );
}
