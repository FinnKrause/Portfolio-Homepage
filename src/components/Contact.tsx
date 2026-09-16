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
 * The closing ink slab — the prelude to the footer.
 *
 * Every way to reach Finn is one chip, all of them the same size, because none
 * of them is more correct than the others. The site is not here to solicit
 * contact; it just has to be obvious where the door is once you've read to
 * the end.
 */
export function Contact() {
  const { t } = useLang();

  return (
    <section id="contact" className="band band-ink">
      <div className="mx-container">
        <div className="max-w-3xl">
          <h2 className="display-xl">{t(profile.contact.title)}</h2>
          <p className="lead mt-5">{t(profile.contact.body)}</p>
        </div>

        <ul className="mt-10 flex flex-wrap gap-3">
          {socials.map((s) => {
            const Icon = ICONS[s.key] ?? Mail;
            const external = s.key !== "email";
            return (
              <li key={s.key}>
                <a
                  href={s.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className="tab"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  <span>{s.label}</span>
                  <span className="text-steel">{s.handle}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
