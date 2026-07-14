"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Linkedin, Menu, X } from "lucide-react";
import { nav } from "@/content/ui";
import { profile } from "@/content/profile";
import { useLang } from "@/lib/i18n";
import { LanguageToggle } from "./LanguageToggle";
import { cn } from "@/lib/utils";

export function Nav() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-line bg-white/80 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <nav className="mx-container flex h-16 items-center justify-between gap-4">
        <a href="/" className="group flex items-center gap-2.5" aria-label="Finn Krause — Start">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-sm font-bold text-white shadow-[0_6px_16px_-4px_rgba(38,69,230,0.6)]">
            FK
          </span>
          <span className="hidden text-sm font-semibold tracking-tight text-ink-900 sm:block">
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
                  active === item.id ? "text-brand-700" : "text-ink-500 hover:text-ink-900",
                )}
              >
                {active === item.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-brand-50"
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
            <a
              href="https://github.com/FinnKrause"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="grid h-9 w-9 place-items-center rounded-full text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              <Github className="h-[18px] w-[18px]" />
            </a>
            <a
              href="https://www.linkedin.com/in/finnkrause001"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="grid h-9 w-9 place-items-center rounded-full text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              <Linkedin className="h-[18px] w-[18px]" />
            </a>
          </div>
          <LanguageToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t({ de: "Menü schließen", en: "Close menu" }) : t({ de: "Menü öffnen", en: "Open menu" })}
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-ink-700 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="border-b border-line bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="mx-container flex flex-col gap-1 py-4">
              {nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={`/#${item.id}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-xl px-3 py-3 text-base font-medium transition-colors",
                      active === item.id ? "bg-brand-50 text-brand-700" : "text-ink-700 hover:bg-paper-soft",
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
