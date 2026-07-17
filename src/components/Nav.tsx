"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Github, Linkedin, Menu, X } from "lucide-react";
import { nav } from "@/content/ui";
import { profile } from "@/content/profile";
import { useLang } from "@/lib/i18n";
import { LanguageToggle } from "./LanguageToggle";
import { cn } from "@/lib/utils";

export function Nav() {
  const { t } = useLang();
  // Over the dark cover the nav is transparent & light; once the paper sheet
  // has slid up (~70% of a viewport), it becomes a solid paper bar.
  const [onPaper, setOnPaper] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setOnPaper(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = nav.map((n) => n.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Lock scroll when the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const dark = !onPaper && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        onPaper || open
          ? "border-b border-line bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-container flex h-16 items-center justify-between gap-4">
        <a href="/" className="group flex items-center gap-3" aria-label="Finn Krause — Start">
          <span
            className={cn(
              "grid h-8 w-8 place-items-center border font-mono text-[0.7rem] font-semibold tracking-wider transition-colors",
              dark
                ? "border-night-line bg-night-soft/60 text-brand-300"
                : "border-line bg-white text-brand-700",
            )}
          >
            FK
          </span>
          <span
            className={cn(
              "hidden font-mono text-[0.65rem] uppercase tracking-[0.22em] transition-colors sm:block",
              dark ? "text-night-ink/90" : "text-ink-900",
            )}
          >
            {profile.name}
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={`/#${item.id}`}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active === item.id
                    ? dark
                      ? "text-white"
                      : "text-brand-700"
                    : dark
                      ? "text-night-mute hover:text-white"
                      : "text-ink-500 hover:text-ink-900",
                )}
              >
                {active === item.id && (
                  <motion.span
                    layoutId="nav-active"
                    className={cn(
                      "absolute inset-0 -z-10 rounded-full",
                      dark ? "bg-white/10" : "bg-brand-50",
                    )}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {t(item.label)}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 md:flex">
            {[
              { href: "https://github.com/FinnKrause", label: "GitHub", Icon: Github },
              { href: "https://www.linkedin.com/in/finnkrause001", label: "LinkedIn", Icon: Linkedin },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full transition-colors",
                  dark
                    ? "text-night-mute hover:bg-white/10 hover:text-white"
                    : "text-ink-500 hover:bg-brand-50 hover:text-brand-700",
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
          <LanguageToggle onDark={dark} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={
              open
                ? t({ de: "Menü schließen", en: "Close menu" })
                : t({ de: "Menü öffnen", en: "Open menu" })
            }
            aria-expanded={open}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full border transition-colors lg:hidden",
              dark
                ? "border-night-line bg-night-soft/60 text-night-ink"
                : "border-line bg-white text-ink-700",
            )}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Reading progress — a hairline filling as you move through the file */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-gradient-to-r from-brand-600 to-brand-400"
      />

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="border-b border-line bg-paper/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="mx-container flex flex-col gap-1 py-4">
              {nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={`/#${item.id}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-xl px-3 py-3 text-base font-medium transition-colors",
                      active === item.id
                        ? "bg-brand-50 text-brand-700"
                        : "text-ink-700 hover:bg-paper-soft",
                    )}
                  >
                    {t(item.label)}
                  </a>
                </li>
              ))}
              <li className="mt-2 flex items-center gap-2 px-3">
                <a
                  href="https://github.com/FinnKrause"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-700"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/finnkrause001"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-700"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
