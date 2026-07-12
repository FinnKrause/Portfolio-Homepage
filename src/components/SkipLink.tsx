"use client";

import { useLang } from "@/lib/i18n";
import { ui } from "@/content/ui";

export function SkipLink() {
  const { t } = useLang();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
    >
      {t(ui.skipToContent)}
    </a>
  );
}
