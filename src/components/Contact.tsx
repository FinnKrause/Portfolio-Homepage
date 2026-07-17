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
    <section id="contact" className="border-t border-line py-20 md:py-24">
      <div className="mx-container">
        <Reveal>
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <div>
              <p className="index-label">08 — {t({ de: "Kontakt", en: "Contact" })}</p>
              <h2 className="headline mt-4 text-3xl font-semibold text-ink-900 sm:text-4xl">
                {t(profile.contact.title)}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-500 sm:text-base">
                {t(profile.contact.body)}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
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
                      className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-500 transition-colors hover:border-brand-300 hover:text-brand-700"
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
