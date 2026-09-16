"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { nav, ui } from "@/content/ui";
import { profile, socials } from "@/content/profile";
import { useLang } from "@/lib/i18n";

/**
 * The back cover. An ink slab carrying the full section list, the outbound
 * links and the two pages German law requires — so nothing on the site is
 * more than one click away from the bottom of the page.
 */
export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="band-ink border-t border-white/15">
      <div className="mx-container py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="display-sm">{profile.name}</p>
            <p className="mt-3 max-w-[36ch] text-caption text-steel">{t(profile.eyebrow)}</p>
            <a href={`mailto:${profile.email}`} className="link mt-4 text-caption">
              {profile.email}
            </a>
          </div>

          <nav aria-label={t({ de: "Seitenbereiche", en: "Page sections" })}>
            <h2 className="text-body font-medium">{t({ de: "Diese Seite", en: "This page" })}</h2>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={`/#${item.id}`}
                    className="text-caption text-steel transition-colors hover:text-on-ink"
                  >
                    {t(item.label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t({ de: "Externe Profile", en: "Elsewhere" })}>
            <h2 className="text-body font-medium">{t({ de: "Anderswo", en: "Elsewhere" })}</h2>
            <ul className="mt-4 space-y-2.5">
              {socials
                .filter((s) => s.key !== "email")
                .map((s) => (
                  <li key={s.key}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-caption text-steel transition-colors hover:text-on-ink"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
            </ul>
          </nav>
        </div>

        {/* Bottom strip */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-white/15 pt-6">
          <div className="fine-print flex flex-wrap items-center gap-x-5 gap-y-2">
            <p>
              © {year} {profile.name}
            </p>
            <Link href="/impressum" className="transition-colors hover:text-on-ink">
              Impressum
            </Link>
            <Link href="/datenschutz" className="transition-colors hover:text-on-ink">
              {t({ de: "Datenschutz", en: "Privacy" })}
            </Link>
          </div>

          <a
            href="/#top"
            className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/25 px-4 text-caption transition-colors hover:border-white/60"
          >
            <ArrowUp className="h-4 w-4" />
            {t(ui.backToTop)}
          </a>
        </div>
      </div>
    </footer>
  );
}
