"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight, ChevronDown, MapPin } from "lucide-react";
import { profile } from "@/content/profile";
import { nav } from "@/content/ui";
import { useLang } from "@/lib/i18n";
import { CodeRain } from "./visuals/CodeRain";

const MASK = "linear-gradient(to right, transparent, transparent 28%, black 72%)";

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
      {/* Code-rain background, faded away from the text column */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ maskImage: MASK, WebkitMaskImage: MASK }}
        aria-hidden
      >
        <CodeRain intensity={0.5} />
      </div>

      <div className="mx-container relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          {/* Copy — name, rough details, links */}
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div
              variants={item}
              className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-ink-500"
            >
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
                </span>
                {t(profile.eyebrow)}
              </span>
              <span className="text-ink-300">·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-brand-600" />
                Erlangen, DE
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="headline mt-5 text-6xl font-bold text-ink-900 sm:text-7xl"
            >
              {profile.name}
            </motion.h1>

            <motion.p variants={item} className="mt-4 text-lg font-medium text-ink-700 sm:text-xl">
              {t(profile.role)}
            </motion.p>

            {/* Journey links */}
            <motion.nav variants={item} className="mt-9" aria-label={t({ de: "Die Reise", en: "The journey" })}>
              <p className="eyebrow mb-3">{t({ de: "Die Reise", en: "The journey" })}</p>
              <ul className="flex flex-col gap-1.5">
                {nav
                  .filter((n) => n.id !== "contact")
                  .map((it, i) => (
                    <li key={it.id}>
                      <a
                        href={`#${it.id}`}
                        className="group inline-flex items-baseline gap-3 text-lg font-medium text-ink-700 transition-colors hover:text-brand-700"
                      >
                        <span className="font-mono text-xs text-brand-400">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="border-b border-transparent transition-colors group-hover:border-brand-300">
                          {t(it.label)}
                        </span>
                        <ArrowUpRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
              </ul>
            </motion.nav>
          </motion.div>

          {/* Portrait — a soft accent */}
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
              sizes="(max-width: 1024px) 18rem, 24rem"
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
        className="relative z-10 mx-auto mt-10 hidden w-fit flex-col items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-ink-500 lg:flex"
      >
        <span>{t({ de: "Scrollen", en: "Scroll" })}</span>
        <ChevronDown className="scroll-cue h-4 w-4 text-brand-600" />
      </motion.a>
    </section>
  );
}
