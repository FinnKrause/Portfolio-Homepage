"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { LegalDocT } from "@/content/legal";
import { legalConfig } from "@/content/legal";
import { useLang } from "@/lib/i18n";

/**
 * Impressum and Datenschutz. Dense legal prose, so the measure is held tight
 * and each section opens on a hairline — the rules are the only structure a
 * document like this needs.
 */
export function LegalDoc({ doc }: { doc: LegalDocT }) {
  const { t } = useLang();

  return (
    <div className="min-h-[100svh] bg-canvas">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-12 md:px-8 md:pt-16">
        <Link href="/" className="link">
          <ArrowLeft className="h-4 w-4" />
          {t({ de: "Zurück zur Startseite", en: "Back to home" })}
        </Link>

        <h1 className="display-xl mt-8">{t(doc.title)}</h1>
        <p className="mt-4 text-caption text-graphite">
          {t({ de: "Stand", en: "Last updated" })}: {t(legalConfig.updated)}
        </p>

        {doc.intro ? <p className="lead mt-6">{t(doc.intro)}</p> : null}

        <div className="mt-12 space-y-10">
          {doc.sections.map((section, i) => (
            <section key={i} className="border-t border-hairline pt-6">
              <h2 className="display-xs">{t(section.heading)}</h2>
              <div className="mt-3 space-y-3">
                {section.body.map((para, j) => (
                  <p key={j} className="text-caption text-charcoal">
                    {t(para)}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
