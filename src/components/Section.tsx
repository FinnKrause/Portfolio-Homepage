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
    <section id={id} className={cn("relative py-16 md:py-20", className)}>
      <div className={cn("mx-container relative", containerClassName)}>{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
  dark?: boolean;
}

/**
 * One heading treatment for every section: same left edge, same rhythm.
 * Character comes from type scale and colour, not from moving things around.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  dark = false,
}: SectionHeadingProps) {
  return (
    <Reveal>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "text-xs font-semibold tabular-nums",
            dark ? "text-brand-300" : "text-brand-700",
          )}
        >
          {index}
        </span>
        <span
          aria-hidden
          className={cn("h-px w-6", dark ? "bg-white/25" : "bg-ink-300")}
        />
        <p
          className={cn(
            "text-[0.7rem] font-semibold uppercase tracking-[0.16em]",
            dark ? "text-brand-300" : "text-brand-700",
          )}
        >
          {eyebrow}
        </p>
      </div>

      <h2
        className={cn(
          "headline mt-4 max-w-[20ch] text-4xl font-medium sm:text-5xl md:text-[3.4rem]",
          dark ? "text-white" : "text-ink-900",
        )}
      >
        {title}
      </h2>

      {intro ? (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base leading-relaxed sm:text-lg",
            dark ? "text-night-mute" : "text-ink-500",
          )}
        >
          {intro}
        </p>
      ) : null}
    </Reveal>
  );
}
