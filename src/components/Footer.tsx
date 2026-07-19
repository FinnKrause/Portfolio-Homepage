"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { ui } from "@/content/ui";
import { profile } from "@/content/profile";
import { useLang } from "@/lib/i18n";

/** Minimal dark "back cover": © + the legally required links + back to top. */
export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-night text-night-ink">
      <div className="mx-container flex items-center justify-between gap-4 py-8">
        <div className="flex flex-col gap-x-4 gap-y-1 text-xs text-night-mute sm:flex-row sm:items-center">
          <p>
            © {year} {profile.name}
          </p>
          <span className="hidden text-night-mute/40 sm:inline">·</span>
          <div className="flex items-center gap-4">
            <Link href="/impressum" className="font-medium transition-colors hover:text-white">
              Impressum
            </Link>
            <Link href="/datenschutz" className="font-medium transition-colors hover:text-white">
              {t({ de: "Datenschutz", en: "Privacy" })}
            </Link>
          </div>
        </div>

        <a
          href="/#top"
          aria-label={t(ui.backToTop)}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-night-line text-night-ink transition-colors hover:border-brand-300/60 hover:text-white"
        >
          <ArrowUp className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
}
