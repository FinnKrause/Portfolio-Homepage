"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { nav, ui } from "@/content/ui";
import { profile, socials } from "@/content/profile";
import { useLang } from "@/lib/i18n";

/** The dark "back cover" of the file — bookends the hero. */
export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-night text-night-ink">
      <div className="mx-container py-14">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-night-mute">
          {t({ de: "Ende der Akte", en: "End of file" })}
        </p>
        <div className="mt-4 h-px w-full bg-night-line" />

        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center border border-night-line bg-night-soft/60 font-mono text-[0.7rem] font-semibold tracking-wider text-brand-300">
                FK
              </span>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-white">
                {profile.name}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-night-mute">
              {t({
                de: "Wirtschaftsinformatik-Student, Entwickler und Veranstaltungstechniker aus Erlangen.",
                en: "Information Systems student, developer and event engineer based in Erlangen, Germany.",
              })}
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-3">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`/#${item.id}`}
                className="text-sm text-night-mute transition-colors hover:text-white"
              >
                {t(item.label)}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-night-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-x-4 gap-y-2 text-xs text-night-mute sm:flex-row sm:items-center">
            <p>
              © {year} {profile.name}
            </p>
            <span className="hidden text-night-mute/50 sm:inline">·</span>
            <div className="flex items-center gap-4">
              <Link href="/impressum" className="font-medium transition-colors hover:text-white">
                Impressum
              </Link>
              <Link href="/datenschutz" className="font-medium transition-colors hover:text-white">
                {t({ de: "Datenschutz", en: "Privacy" })}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ul className="flex items-center gap-4">
              {socials.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    target={s.key === "email" ? undefined : "_blank"}
                    rel="noreferrer"
                    className="text-xs font-medium text-night-mute transition-colors hover:text-white"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="/#top"
              aria-label={t(ui.backToTop)}
              className="grid h-9 w-9 place-items-center rounded-full border border-night-line text-night-ink transition-colors hover:border-brand-300/60 hover:text-white"
            >
              <ArrowUp className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
