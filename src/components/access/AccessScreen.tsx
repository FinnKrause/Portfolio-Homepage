"use client";

import { useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { formatAccessCode } from "@/config/access";
import { LanguageToggle } from "../LanguageToggle";
import { cn } from "@/lib/utils";

type SubmitResult = "ok" | "invalid" | "rate-limited";

/**
 * The door.
 *
 * Plain on purpose — no decorative grid, no motion, no low-contrast greys.
 * This screen exists to be read once and typed into, so legibility beats
 * atmosphere. The site's own look starts on the other side of it.
 */
export function AccessScreen({
  onSubmit,
}: {
  onSubmit: (code: string) => Promise<SubmitResult>;
}) {
  const { t } = useLang();
  const tx = (de: string, en: string) => t({ de, en });

  const [value, setValue] = useState("");
  const [error, setError] = useState<null | "invalid" | "rate-limited">(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const complete = value.length === 6; // "XXXX-X"

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || !complete) return;
    setBusy(true);
    const result = await onSubmit(value);
    if (result === "ok") return; // navigating away
    setError(result);
    setBusy(false);
    inputRef.current?.select();
  };

  const sources = [
    tx(
      "Im Link selbst: home.finnkrause.com/?code=1234-5",
      "In the link itself: home.finnkrause.com/?code=1234-5",
    ),
    tx(
      "Auf einer Karte, im Lebenslauf oder neben der Adresse abgedruckt",
      "On a card, a CV, or printed next to the address",
    ),
    tx("Direkt von mir, in z.B. einer Nachricht", "Straight from me, for example in a message"),
  ];

  return (
    <div className="min-h-[100svh] bg-[#10141d] px-5 py-14 text-white">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <LanguageToggle onDark />
      </div>

      <main className="mx-auto max-w-lg">
        <p className="text-sm font-semibold text-brand-300">
          {tx("Zugangscode nötig", "Access code required")}
        </p>

        <h1 className="mt-3 text-2xl font-semibold leading-snug sm:text-3xl">
          {tx("Einen Moment, bevor du Zugang bekommst.", "One moment before you come in.")}
        </h1>

        <p className="mt-4 text-base leading-relaxed text-white/80">
          {tx(
            "Da das hier meine persönliche Website mit vielen Informationen über mich ist, ist der Inhalt nur mit einem anonymen Zugangscode sichtbar. Das mache ich damit der Inhalt bei Menschen ankommt und nicht bei AI-Crawlern und Bots. Von hier könntest du einen Code haben:",
            "Since this is my personal website that holds a fair amount of information about me the content sits behind an anonymous verification code to make sure my information reaches people rather than AI-crawlers and scrapers. Where you could have gotten a code from:",
          )}
        </p>

        <ul className="mt-5 space-y-3">
          {sources.map((line, i) => (
            <li key={i} className="flex gap-3 text-base leading-relaxed text-white/80">
              <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-brand-300" />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <form onSubmit={submit} className="mt-9">
          <label htmlFor="access-code" className="block text-sm font-medium text-white">
            {tx("Zugangscode", "Access code")}
          </label>

          <div className="mt-2 flex gap-2">
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
              aria-invalid={!!error}
              onChange={(e) => {
                setValue(formatAccessCode(e.target.value));
                if (error) setError(null);
              }}
              className={cn(
                "w-full border-2 bg-[#0a0d14] px-4 py-3 text-lg tracking-[0.2em] text-white outline-none transition-colors placeholder:tracking-[0.2em] placeholder:text-white/25 focus:border-brand-400",
                error ? "border-red-400" : "border-white/25",
              )}
            />
            <button
              type="submit"
              disabled={!complete || busy}
              className="shrink-0 bg-brand-500 px-6 text-base font-semibold text-white transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? tx("Prüfe …", "Checking…") : tx("Eintreten", "Enter")}
            </button>
          </div>

          <p
            id="access-help"
            role={error ? "alert" : undefined}
            className={cn("mt-2.5 text-sm", error ? "text-red-300" : "text-white/60")}
          >
            {error === "rate-limited"
              ? tx(
                  "Zu viele Versuche. Bitte kurz warten.",
                  "Too many attempts. Please wait a moment.",
                )
              : error
                ? tx("Dieser Code stimmt nicht.", "That code isn't right.")
                : tx(
                    "Fünf Ziffern, z. B. 1234-5. Du wirst auf diesem Gerät nur einmal gefragt.",
                    "Five digits, e.g. 1234-5. You'll only be asked once on this device.",
                  )}
          </p>
        </form>

        <p className="mt-10 border-t border-white/15 pt-5 text-sm leading-relaxed text-white/60">
          {tx(
            "Mit dem Absenden setzt diese Seite zwei Cookies und speichert den Zugriff.",
            "Submitting sets two cookies and records the visit.",
          )}{" "}
          <a
            href="/datenschutz"
            className="text-white underline underline-offset-4 hover:text-brand-300"
          >
            {tx("Datenschutz", "Privacy")}
          </a>
        </p>
      </main>
    </div>
  );
}
