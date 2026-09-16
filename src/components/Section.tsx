import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Surface = "canvas" | "cloud" | "fog" | "ink";

const SURFACE: Record<Surface, string> = {
  canvas: "band-canvas",
  cloud: "band-cloud",
  fog: "band-fog",
  ink: "band-ink",
};

interface SectionProps {
  id?: string;
  /** One of the four surface modes. The site has no other backgrounds. */
  surface?: Surface;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

/**
 * A page band: one of four surfaces, the 80px vertical rhythm, and the 1366px
 * container. Alternating canvas and cloud is what gives the page its beat —
 * depth here comes from surface contrast, not from shadow.
 */
export function Section({
  id,
  surface = "canvas",
  children,
  className,
  containerClassName,
}: SectionProps) {
  return (
    <section id={id} className={cn("band", SURFACE[surface], className)}>
      <div className={cn("mx-container", containerClassName)}>{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  title: string;
  intro?: string;
  /** Pulls the headline in so it never runs past a comfortable measure. */
  className?: string;
}

/**
 * One heading treatment site-wide: the title at display weight 500 with a
 * line-height of 1, and an optional lead beneath it.
 *
 * There is no eyebrow and no index number. The system tracks letters in
 * exactly one place — button labels — so a tracked uppercase kicker would
 * contradict it, and numbering sections implies a sequence this page doesn't
 * have. What separates sections here is the surface underneath them.
 */
export function SectionHeading({ title, intro, className }: SectionHeadingProps) {
  return (
    <header className={cn("max-w-4xl", className)}>
      <h2 className="display-xl">{title}</h2>
      {intro ? <p className="lead mt-5">{intro}</p> : null}
    </header>
  );
}

/**
 * The smaller heading used inside a band for a secondary group
 * ("More projects", "Languages"). Sits on a hairline so it reads as a
 * division of the band it's in rather than a band of its own.
 */
export function SubHeading({
  title,
  intro,
  action,
  className,
}: {
  title: string;
  intro?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-t border-hairline pt-6",
        className,
      )}
    >
      <div>
        <h3 className="display-sm">{title}</h3>
        {intro ? <p className="mt-2 text-caption text-graphite">{intro}</p> : null}
      </div>
      {action}
    </div>
  );
}
