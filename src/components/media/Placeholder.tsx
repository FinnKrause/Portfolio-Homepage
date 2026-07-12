import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** A labelled empty frame to be replaced with a real image later. */
export function Placeholder({
  label,
  aspect = "4 / 3",
  fill = false,
  className,
}: {
  label?: string;
  aspect?: string;
  fill?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-xl border border-dashed border-brand-200 bg-brand-50/50 text-brand-400",
        fill ? "h-full w-full" : "",
        className,
      )}
      style={fill ? undefined : { aspectRatio: aspect }}
    >
      <div className="flex flex-col items-center gap-2 p-4 text-center">
        <ImageIcon className="h-6 w-6" />
        {label ? <span className="text-xs font-medium">{label}</span> : null}
      </div>
    </div>
  );
}
