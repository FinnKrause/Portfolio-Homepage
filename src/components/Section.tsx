import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion/Reveal";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export function Section({ id, children, className, containerClassName }: SectionProps) {
  return (
    <section id={id} className={cn("relative py-20 md:py-28", className)}>
      <div className={cn("mx-container relative", containerClassName)}>{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  /** Dossier index, e.g. "01" — rendered as a mono label above the title. */
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
  /** On dark sections, flips label & text colors. */
  dark?: boolean;
}

export function SectionHeading({ index, eyebrow, title, intro, dark = false }: SectionHeadingProps) {
  return (
    <Reveal>
      <div className="flex items-baseline gap-4">
        <span className={cn("index-label", dark && "index-label--dark")}>
          {index} — {eyebrow}
        </span>
        <span className={cn("h-px flex-1", dark ? "bg-night-line" : "bg-line")} aria-hidden />
      </div>
      <h2
        className={cn(
          "headline mt-5 max-w-3xl text-4xl font-semibold sm:text-5xl md:text-[3.4rem]",
          dark ? "text-white" : "text-ink-900",
        )}
      >
        {title}
      </h2>
      {intro ? (
        <p
          className={cn(
            "mt-4 max-w-2xl text-lg leading-relaxed",
            dark ? "text-night-mute" : "text-ink-500",
          )}
        >
          {intro}
        </p>
      ) : null}
    </Reveal>
  );
}
