"use client";

import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import { profile, socials } from "@/content/profile";
import { useLang } from "@/lib/i18n";
import { Reveal } from "./motion/Reveal";

const ICONS: Record<string, typeof Mail> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  email: Mail,
};

export function Contact() {
  const { t } = useLang();

  return (
    <section id="contact" className="border-t border-line py-16 md:py-20">
      <div className="mx-container">
        <Reveal>
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
            <div>
              <p className="eyebrow">{t({ de: "Kontakt", en: "Contact" })}</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink-900 sm:text-3xl">
                {t(profile.contact.title)}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-500 sm:text-base">
                {t(profile.contact.body)}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-100"
              >
                <Mail className="h-4 w-4" />
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
        </Reveal>
      </div>
    </section>
  );
}
