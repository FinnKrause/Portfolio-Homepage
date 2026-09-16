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
 * animation library (see LanguageToggle), no images, no extra font. It gets
 * the same ink slab and the same blue slash pair as the site's own hero, built
 * from the shared token classes — so the door looks like the building without
 * costing a single extra byte of CSS.
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
    <div className="band-ink relative flex min-h-[100svh] items-center overflow-hidden px-5 py-10 sm:py-14">
      {/* The same pair that opens the site itself. */}
      <span
        aria-hidden
        className="chevron chevron-in absolute inset-y-20 -left-6 hidden w-14 md:block lg:w-20"
        style={{ "--from": "-3rem" } as React.CSSProperties}
      />
      <span
        aria-hidden
        className="chevron chevron-end chevron-in absolute inset-y-20 -right-6 hidden w-14 md:block lg:w-20"
        style={{ "--from": "3rem" } as React.CSSProperties}
      />

      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <LanguageToggle onDark />
      </div>

      <main className="relative z-1 mx-auto w-full max-w-xl">
        <p className="rise text-body text-primary-bright" style={rise(0)}>
          {tx("Zugangscode nötig", "Access code required")}
        </p>

        <h1 className="display-lg rise mt-3" style={rise(1)}>
          {tx("Einen Moment, bevor du Zugang bekommst", "One moment before you come in")}
        </h1>

        {/* The introduction — Finn's own wording, kept as written. */}
        <p className="rise mt-4 text-body text-white/75" style={rise(2)}>
          {tx(
            "Da das hier meine persönliche Website mit vielen Informationen über mich ist, ist der Inhalt nur mit einem schnellen Sicherheitscheck abrufbar. Das mache ich damit der Inhalt bei Menschen ankommt und nicht bei AI-Crawlern und Bots.",
            "Since this is my personal website that holds a fair amount of information about me, the content sits behind a quick access check. I do that to make sure my information reaches people rather than AI crawlers and scrapers.",
          )}
        </p>

        <div className="rise mt-6 border-t border-white/15 pt-5" style={rise(3)}>
          <h2 className="text-body font-medium">
            {tx("Woher du einen Code haben könntest", "Where you'd have a code from")}
          </h2>
          <ul className="mt-3 space-y-2">
            {sources.map((line, i) => (
              <li key={i} className="flex gap-3 text-caption text-white/70">
                <span aria-hidden className="mt-2.5 h-0.5 w-3 shrink-0 bg-primary-bright" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={submit} className="rise mt-6" style={rise(4)}>
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
              className={cn("input tracking-[0.22em]", error && "input-error")}
            />
            <button type="submit" disabled={!complete || busy} className="btn btn-primary">
              {busy ? tx("Prüfe …", "Checking…") : tx("Eintreten", "Enter")}
            </button>
          </div>

          {/* Rendered only when there is something to say. An always-present
              empty paragraph left a margin's worth of dead space under the
              field and gave aria-describedby an empty element to point at;
              appearing on demand is also what makes role="alert" announce. */}
          {error && (
            <p id="access-help" role="alert" className="mt-3 text-caption text-coral">
              {error === "rate-limited"
                ? tx(
                    "Zu viele Versuche. Bitte kurz warten.",
                    "Too many attempts. Please wait a moment.",
                  )
                : tx("Dieser Code stimmt nicht.", "That code isn't right.")}
            </p>
          )}
        </form>

        <p className="rise fine-print mt-6 border-t border-white/15 pt-5" style={rise(5)}>
          {tx(
            "Mit Betreten dieser Seite wurden Zeitpunkt, Browser, Betriebssystem, Gerätetyp und Referrer automatisch geloggt (ohne Cookie). Erst bei Eingabe eines gültigen Codes kommen zwei Cookies dazu, damit ich sehen kann, welcher Code wie oft benutzt wird. Die Cookies laufen ein Jahr nach dem letzten Besuch ab, die einzelnen Einträge werden nach sechs Monaten automatisch gelöscht. Nach einem Jahr erkennt das System ehemalige Besucher nicht wieder.",
            "This page being opened is being logged with time, browser, operating system, device type and referrer, with no cookie involved. Enter a valid code and two cookies are added. The cookies expire one year after your last visit. After that time the mechanism cannot recognize old users anymore. All individual server-logs are automatically deleted after six months.",
          )}{" "}
          <a href="/datenschutz" className="link text-fine">
            {tx("Datenschutz", "Privacy Policy")}
          </a>
        </p>
      </main>
    </div>
  );
}
