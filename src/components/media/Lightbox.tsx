"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface LightboxImage {
  src: string;
  alt: string;
}

/** Full-screen image viewer with keyboard + prev/next navigation. */
export function Lightbox({
  images,
  index,
  onClose,
  onNav,
}: {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onNav: (dir: number) => void;
}) {
  const reduce = useReducedMotion();
  const open = index !== null;

  // Rendered in a portal on <body>: inside the page tree the viewer would be
  // trapped in the site-sheet's stacking context and end up underneath the
  // fixed navbar (covering the close button on mobile).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNav(1);
      else if (e.key === "ArrowLeft") onNav(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, onNav]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && index !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNav(-1);
                }}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-5"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNav(1);
                }}
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-5"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <motion.div
            key={index}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[index].src}
              alt={images[index].alt}
              fill
              sizes="100vw"
              // Full-screen view → always the untouched original file.
              unoptimized
              className="object-contain"
              priority
            />
          </motion.div>

          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/80">
              {index + 1} / {images.length}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
