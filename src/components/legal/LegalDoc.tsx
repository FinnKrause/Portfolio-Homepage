"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { LegalDocT } from "@/content/legal";
import { legalConfig } from "@/content/legal";
import { useLang } from "@/lib/i18n";

export function LegalDoc({ doc }: { doc: LegalDocT }) {
  const { t } = useLang();

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-8 md:pt-32">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 transition-colors hover:text-brand-900"
      >
        <ArrowLeft className="h-4 w-4" />
        {t({ de: "Zurück zur Startseite", en: "Back to home" })}
      </Link>

      <h1 className="headline mt-6 text-4xl font-bold text-ink-900 sm:text-5xl">{t(doc.title)}</h1>
      <p className="mt-3 text-sm text-ink-500">
        {t({ de: "Stand", en: "Last updated" })}: {t(legalConfig.updated)}
      </p>

      {doc.intro ? (
        <p className="mt-6 text-base leading-relaxed text-ink-500">{t(doc.intro)}</p>
      ) : null}

      <div className="mt-10 space-y-9">
        {doc.sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-lg font-semibold text-ink-900">{t(section.heading)}</h2>
            <div className="mt-2.5 space-y-3">
              {section.body.map((para, j) => (
                <p key={j} className="text-sm leading-relaxed text-ink-700">
                  {t(para)}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
