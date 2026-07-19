"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Link2, Lock, QrCode, Send, ShieldCheck } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { formatAccessCode, isValidAccessCode } from "@/config/access";
import { LanguageToggle } from "../LanguageToggle";
import { cn } from "@/lib/utils";

/** The sealed cover of the file — the same dark world the hero opens into. */
export function AccessScreen({ onGranted }: { onGranted: () => void }) {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const tx = (de: string, en: string) => t({ de, en });

  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const complete = value.length === 6; // "XXXX-X"

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidAccessCode(value)) {
      onGranted();
    } else {
      setError(true);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-night text-night-ink">
      {/* Same calm cover backdrop as the hero */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="cover-wash" />
        <div className="cover-grid" />
      </div>

      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <LanguageToggle onDark />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-[700px] flex-col justify-center px-5 py-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="border border-night-line bg-night-soft/70 p-6 backdrop-blur-sm sm:p-8"
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center border border-night-line bg-night font-mono text-xs font-semibold tracking-wider text-brand-300">
              FK
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-brand-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              {tx("Kurzer Zugangs-Check", "Quick access check")}
            </span>
          </div>

          <h1 className="headline mt-6 text-3xl font-semibold text-white sm:text-[2.5rem]">
            {tx("Einen Moment bevor du reindarfst.", "One moment before you come in.")}
          </h1>

          <p className="mt-4 text-pretty text-base leading-relaxed text-night-mute">
            {tx(
              "Das hier ist meine persönliche Website mit vielen Daten über mich. Damit KI-Crawler und Scraper meine Daten nicht einfach abgrasen, liegt der Inhalt hinter einem Prüfcode. Kein Login, keine Datensammlung, etc. sondern nur eine Vorkehrung dass meine Informationen bei Menschen ankommen und nicht bei Bots.",
              "This is my personal website containing a lot of information about me. To prevent AI crawlers and scrapers from simply harvesting my data, the content is protected behind a verification code. There's no login, no data collection, or anything like that—it's simply a measure to ensure that my information reaches people rather than bots.",
            )}
          </p>

          {/* Code form */}
          <form onSubmit={submit} className="mt-7">
            <label
              htmlFor="access-code"
              className="block font-mono text-xs font-semibold uppercase tracking-[0.18em] text-night-ink"
            >
              {tx("Zugangscode", "Access code")}
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                ref={inputRef}
                id="access-code"
                name="access-code"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                autoFocus
                maxLength={6}
                placeholder="1234-5"
                value={value}
                aria-describedby="access-help"
                aria-invalid={error}
                onChange={(e) => {
                  setValue(formatAccessCode(e.target.value));
                  if (error) setError(false);
                }}
                className={cn(
                  "w-full border bg-night px-4 py-3 text-center font-mono text-xl tracking-[0.35em] text-white outline-none transition-colors placeholder:tracking-[0.35em] placeholder:text-night-mute/50 focus:ring-2",
                  error
                    ? "border-red-400 focus:border-red-400 focus:ring-red-500/30"
                    : "border-night-line focus:border-brand-400 focus:ring-brand-500/30",
                )}
              />
              <button
                type="submit"
                disabled={!complete}
                className="inline-flex min-h-[3rem] items-center justify-center gap-2 bg-brand-500 px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {tx("Eintreten", "Enter")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <p
              id="access-help"
              role={error ? "alert" : undefined}
              className={cn(
                "mt-2 text-sm",
                error ? "font-medium text-red-400" : "text-night-mute",
              )}
            >
              {error
                ? tx(
                    "Der Zugangscode ist nicht gültig",
                    "The code is not valid.",
                  )
                : tx(
                    "Fünf Ziffern im Format XXXX-X. Du wirst auf diesem Gerät nur einmal gefragt.",
                    "Five digits, as XXXX-X. You'll only be asked once on this device.",
                  )}
            </p>
          </form>

          <hr className="my-7 border-night-line" />

          {/* Where a code might have come from */}
          <section>
            <h2 className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-brand-300">
              {tx("Woher du einen Code haben könntest", "Where a code might have reached you")}
            </h2>
            <ul className="mt-3 space-y-2.5 text-sm text-night-mute">
              <li className="flex gap-2.5">
                <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                <span>
                  {tx("Im Link selbst — z. B. ", "In the link itself — e.g. ")}
                  <code className="border border-night-line bg-night px-1.5 py-0.5 font-mono text-xs text-brand-200">
                    finnkrause.com/?code=1234-5
                  </code>
                  {tx(
                    ". Beim Scannen eines QR-Codes oder Kopieren einer Adresse war der Code vielleicht Teil einer URL, die du nicht ganz erwischt hast.",
                    ". If you scanned a QR code or copied a link, the code may have been part of a URL you didn't fully catch.",
                  )}
                </span>
              </li>
              <li className="flex gap-2.5">
                <QrCode className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                <span>
                  {tx(
                    "Auf einer Karte, im Lebenslauf oder neben dem Link als Notiz.",
                    "On a card, a CV, or as a note next to the URL.",
                  )}
                </span>
              </li>
              <li className="flex gap-2.5">
                <Send className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                <span>{tx("Direkt von mir, in einer Nachricht.", "Straight from me, in a message.")}</span>
              </li>
            </ul>
          </section>

          {/* Privacy note */}
          <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-night-mute/80">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {tx(
              "Kein Tracking, keine Analyse, nichts wird über dich gespeichert. Bei korrektem Code setzt dein Browser ein einzelnes Cookie („fk-access“), das bei jedem Aufruf mitgeschickt wird, damit dich der Server direkt durchlässt. Es ist für alle Besucher identisch, enthält keinerlei Daten über dich und lässt sich jederzeit in den Browser-Einstellungen löschen — dann wirst du einfach erneut gefragt.",
              "No tracking, no analytics, nothing is logged about you. On a correct code your browser sets a single cookie (“fk-access”) that is sent along with each visit so the server lets you straight through. It is identical for every visitor, contains no data about you, and can be deleted in your browser settings at any time — you'll simply be asked again.",
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
