"use client";

import { ArrowUp } from "lucide-react";
import { nav, ui } from "@/content/ui";
import { profile, socials } from "@/content/profile";
import { useLang } from "@/lib/i18n";

export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-paper-soft">
      <div className="mx-container py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-sm font-bold text-white">
                FK
              </span>
              <span className="text-sm font-semibold text-ink-900">{profile.name}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-500">
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
                href={`#${item.id}`}
                className="text-sm text-ink-500 transition-colors hover:text-brand-700"
              >
                {t(item.label)}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col-reverse items-start gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-500">
            © {year} {profile.name} ·{" "}
            {t({ de: "Mit Next.js gebaut.", en: "Built with Next.js." })}
          </p>
          <div className="flex items-center gap-3">
            <ul className="flex items-center gap-4">
              {socials.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    target={s.key === "email" ? undefined : "_blank"}
                    rel="noreferrer"
                    className="text-xs font-medium text-ink-500 transition-colors hover:text-brand-700"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#top"
              aria-label={t(ui.backToTop)}
              className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              <ArrowUp className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
