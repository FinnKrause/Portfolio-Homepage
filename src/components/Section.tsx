import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion/Reveal";
import { SectionGlow } from "./visuals/SectionGlow";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  /** Grow a light inward from the rails as the section enters view (desktop). */
  glow?: boolean;
  glowColor?: string;
  glowSide?: "left" | "right" | "both";
}

export function Section({
  id,
  children,
  className,
  containerClassName,
  glow = false,
  glowColor,
  glowSide = "both",
}: SectionProps) {
  return (
    <section id={id} className={cn("relative py-20 md:py-28", className)}>
      {glow && <SectionGlow side={glowSide} color={glowColor} />}
      <div className={cn("mx-container relative", containerClassName)}>{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
}

export function SectionHeading({ eyebrow, title, intro, align = "left" }: SectionHeadingProps) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="headline mt-3 text-3xl font-semibold text-ink-900 sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {intro ? <p className="mt-4 text-lg leading-relaxed text-ink-500">{intro}</p> : null}
    </Reveal>
  );
}
