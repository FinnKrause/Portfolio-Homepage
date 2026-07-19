"use client";

import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import { profile, socials } from "@/content/profile";
import { useLang } from "@/lib/i18n";

const ICONS: Record<string, typeof Mail> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  email: Mail,
};

/**
 * Deliberately small: the site isn't here to solicit contact — this is just a
 * quiet, findable way to reach out at the end of the file.
 */
export function Contact() {
  const { t } = useLang();

  return (
    <section id="contact" className="border-t border-line">
      <div className="mx-container flex flex-col items-center gap-4 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="max-w-md text-sm leading-relaxed text-ink-500">
          <span className="font-semibold text-ink-900">{t(profile.contact.title)}</span>{" "}
          {t({
            de: "Wenn du magst, erreichst du mich hier:",
            en: "If you'd like, you can reach me here:",
          })}
        </p>

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            <Mail className="h-4 w-4 text-brand-600" />
            {profile.email}
          </a>
          {socials
            .filter((s) => s.key !== "email")
            .map((s) => {
              const Icon = ICONS[s.key] ?? Mail;
              return (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-500 transition-colors hover:border-brand-300 hover:text-brand-700"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
        </div>
      </div>
    </section>
  );
}
