"use client";

import { useLang } from "@/lib/i18n";
import { ui } from "@/content/ui";

export function SkipLink() {
  const { t } = useLang();
  return (
    <a
      href="#main"
      className="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100"
    >
      {t(ui.skipToContent)}
    </a>
  );
}
