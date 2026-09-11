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
 * Reads top to bottom: what this is, where you'd have a code from, then the
 * field. The explanation comes first because it is what makes the field make
 * sense — someone who lands here has usually not been told they'd need a code.
 *
 * Everything fits one screen down to 1024x768; nothing that matters is below
 * the fold. Only the privacy footnote is allowed to fall off on a small phone.
 * If you add copy, re-measure: `document.documentElement.scrollHeight` against
 * `innerHeight`.
 *
 * This is the one page every stranger loads, so it must stay cheap: no
 * animation library (see LanguageToggle), no images, no extra font. The
 * gradient, the grain and the entrance are CSS in globals.css.
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

  const rise = (i: number) => ({ "--i": i }) as React.CSSProperties;

  return (
    <div className="gate">
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <LanguageToggle onDark />
      </div>

      <main className="gate-col">
        <p className="gate-rise text-sm font-semibold text-brand-300" style={rise(0)}>
          {tx("Zugangscode nötig", "Access code required")}
        </p>

        <h1
          className="gate-rise mt-3 text-[clamp(1.55rem,4vw,2.1rem)] font-semibold leading-tight tracking-tight text-white"
          style={rise(1)}
        >
          {tx("Einen Moment, bevor du Zugang bekommst", "One moment before you come in")}
        </h1>

        {/* The introduction — Finn's own wording, kept as written. */}
        <p className="gate-rise mt-3 text-[0.95rem] leading-relaxed text-white/75" style={rise(2)}>
          {tx(
            "Da das hier meine persönliche Website mit vielen Informationen über mich ist, ist der Inhalt nur mit einem schnellen Sicherheitscheck abrufbar. Das mache ich damit der Inhalt bei Menschen ankommt und nicht bei AI-Crawlern und Bots.",
            "Since this is my personal website that holds a fair amount of information about me, the content sits behind a quick access check. I do that to make sure my information reaches people rather than AI crawlers and scrapers.",
          )}
        </p>

        <div className="gate-rise mt-4" style={rise(3)}>
          <h2 className="gate-note-title">
            {tx("Woher du einen Code haben könntest", "Where you'd have a code from")}
          </h2>
          <ul className="mt-2 space-y-1.5">
            {sources.map((line, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-white/70">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-300" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={submit} className="gate-rise mt-6" style={rise(4)}>
          <label htmlFor="access-code" className="sr-only">
            {tx("Zugangscode", "Access code")}
          </label>

          <div className="flex gap-2">
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
              aria-describedby={error ? "access-help" : undefined}
              aria-invalid={!!error}
              onChange={(e) => {
                setValue(formatAccessCode(e.target.value));
                if (error) setError(null);
              }}
              className={cn("gate-input", error && "gate-input-error")}
            />
            <button type="submit" disabled={!complete || busy} className="gate-submit">
              {busy ? tx("Prüfe …", "Checking…") : tx("Eintreten", "Enter")}
            </button>
          </div>

          {/* Rendered only when there is something to say. An always-present
              empty paragraph left a margin's worth of dead space under the
              field and gave aria-describedby an empty element to point at;
              appearing on demand is also what makes role="alert" announce. */}
          {error && (
            <p id="access-help" role="alert" className="mt-2.5 text-sm text-red-300">
              {error === "rate-limited"
                ? tx(
                    "Zu viele Versuche. Bitte kurz warten.",
                    "Too many attempts. Please wait a moment.",
                  )
                : tx("Dieser Code stimmt nicht.", "That code isn't right.")}
            </p>
          )}
        </form>

        <p
          className="gate-rise mt-6 border-t border-white/12 pt-4 text-[0.8rem] leading-relaxed text-white/50"
          style={rise(5)}
        >
          {tx(
            "Mit Betreten dieser Seite wurden Zeitpunkt, Browser, Betriebssystem, Gerätetyp und Referrer automatisch geloggt (ohne Cookie). Erst bei Eingabe eines gültigen Codes kommen zwei Cookies dazu, damit ich sehen kann, welcher Code wie oft benutzt wird. Die Cookies laufen ein Jahr nach dem letzten Besuch ab, die einzelnen Einträge werden nach sechs Monaten automatisch gelöscht. Nach einem Jahr erkennt das System ehemalige Besucher nicht wieder.",
            "This page being opened is being logged with time, browser, operating system, device type and referrer, with no cookie involved. Enter a valid code and two cookies are added. The cookies expire one year after your last visit. After that time the mechanism cannot recognize old users anymore. All individual server-logs are automatically deleted after six months.",
          )}{" "}
          <a href="/datenschutz" className="gate-link">
            {tx("Datenschutz", "Privacy Policy")}
          </a>
        </p>
      </main>
    </div>
  );
}
