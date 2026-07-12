"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight, Gavel, Lightbulb, Trophy } from "lucide-react";
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
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section id="top" className="page-glow relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="mx-container relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Copy */}
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50/60 px-3.5 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
                </span>
                <span className="eyebrow !text-brand-800">{t(profile.eyebrow)}</span>
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="headline mt-6 text-5xl font-semibold text-ink-900 sm:text-6xl md:text-7xl"
            >
              {profile.name}
            </motion.h1>

            <motion.p variants={item} className="mt-4 text-xl font-medium sm:text-2xl">
              <span className="text-gradient">{t(profile.role)}</span>
            </motion.p>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg"
            >
              {t(profile.lead)}
            </motion.p>

            {/* Slim highlight strip — a blend of achievement, engagement & craft */}
            <motion.ul
              variants={item}
              className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm text-ink-700"
            >
              {profile.heroHighlights.map((h, i) => {
                const Icon = HIGHLIGHT_ICONS[h.icon] ?? Trophy;
                return (
                  <li key={i} className="inline-flex items-center gap-2">
                    <Icon className="h-4 w-4 text-brand-600" />
                    <span className="font-medium">{t(h.label)}</span>
                  </li>
                );
              })}
            </motion.ul>

            <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
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

          {/* Portrait — clean, no floating badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-sm lg:max-w-md"
          >
            <div
              className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-brand-200/50 via-sky-200/40 to-transparent blur-2xl"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white shadow-lift ring-brand">
              <Image
                src="/images/finn-portrait.jpg"
                alt="Finn Krause"
                width={768}
                height={1024}
                priority
                sizes="(max-width: 1024px) 24rem, 28rem"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/15 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
