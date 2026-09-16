"use client";

import { useEffect, useState } from "react";
import { Github, Instagram, Linkedin, Menu, X } from "lucide-react";
import { nav } from "@/content/ui";
import { profile, socials } from "@/content/profile";
import { useLang } from "@/lib/i18n";
import { LanguageToggle } from "./LanguageToggle";
import { cn } from "@/lib/utils";
import { useScrollLock } from "@/lib/useScrollLock";

const SOCIAL_ICONS: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
};

const socialLinks = socials.filter((s) => s.key !== "email");

/**
 * One bar: the mark on the left, sections in the middle, the social links and
 * the language switch on the right.
 *
 * There used to be a 36px ink utility strip above this carrying Finn's field of
 * study, his email and the language switch. It is gone: on a personal site none
 * of that is standing chrome. The study line moved into the hero next to the
 * name it describes, the email is in the closing band and the footer, and the
 * language switch moved down here where it is still reachable at every
 * breakpoint.
 *
 * The bar is cloud, not canvas — the same surface as the hero band below it.
 * That is what lets the first screen read as one continuous field instead of a
 * white strip sitting on top of a grey one, and it costs nothing elsewhere:
 * cloud is one of the four surfaces, so a sticky cloud bar over any other band
 * is still inside the system's vocabulary.
 *
 * Sticky rather than fixed-and-transparent. There is no dark-over-light state
 * to manage at any scroll position, which is the point of a closed surface
 * vocabulary — and it is why this needs no scroll listener.
 */
export function Nav() {
  const { t } = useLang();
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    nav.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useScrollLock(open);

  // Close the drawer if the viewport grows into the desktop nav.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      <nav
        aria-label={t({ de: "Hauptnavigation", en: "Main navigation" })}
        className="border-b border-hairline bg-cloud"
      >
        <div className="mx-container flex h-16 items-center justify-between gap-6">
          <a
            href="/#top"
            className="flex shrink-0 items-center gap-3"
            aria-label={t({ de: "Zum Seitenanfang", en: "Back to the top" })}
          >
            {/* The mark carries the same slash geometry as the hero chevrons. */}
            <span
              aria-hidden
              className="grid h-8 w-8 place-items-center rounded-md bg-primary text-[0.7rem] font-bold tracking-wide text-on-ink"
              style={{ clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)" }}
            >
              FK
            </span>
            <span className="hidden text-body font-medium sm:block">{profile.name}</span>
          </a>

          <ul className="hidden items-center lg:flex">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`/#${item.id}`}
                  aria-current={active === item.id ? "true" : undefined}
                  className={cn(
                    "relative flex h-16 items-center px-4 text-body transition-colors",
                    active === item.id ? "text-ink" : "text-charcoal hover:text-ink",
                  )}
                >
                  {t(item.label)}
                  {/* Active page draws a 2px rule under the text baseline. */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-3 bottom-0 h-0.5 bg-primary transition-opacity",
                      active === item.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-1">
            <div className="hidden items-center md:flex">
              {socialLinks.map((s) => {
                const Icon = SOCIAL_ICONS[s.key] ?? Github;
                return (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="grid h-11 w-11 place-items-center rounded-md text-charcoal transition-colors hover:text-primary"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                );
              })}
            </div>

            <LanguageToggle className="ml-1" />

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="nav-drawer"
              aria-label={
                open
                  ? t({ de: "Menü schließen", en: "Close menu" })
                  : t({ de: "Menü öffnen", en: "Open menu" })
              }
              className="grid h-11 w-11 place-items-center rounded-md text-ink lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ---- Mobile drawer ------------------------------------------------
          A full-canvas sheet with a body-lg link list and the primary action
          pinned at the bottom, per the system's mobile-nav spec. */}
      {open && (
        <div
          id="nav-drawer"
          className="flex h-[calc(100svh-var(--header-height))] flex-col border-b border-hairline bg-canvas lg:hidden"
        >
          <ul className="mx-container flex-1 overflow-y-auto py-2">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`/#${item.id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex min-h-[56px] items-center border-b border-hairline text-body-lg transition-colors",
                    active === item.id ? "text-primary" : "text-ink",
                  )}
                >
                  {t(item.label)}
                </a>
              </li>
            ))}
          </ul>

          <div className="mx-container flex items-center gap-3 border-t border-hairline py-4">
            {socialLinks.map((s) => {
              const Icon = SOCIAL_ICONS[s.key] ?? Github;
              return (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-hairline text-charcoal"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
