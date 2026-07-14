import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal/LegalDoc";
import { impressum } from "@/content/legal";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return <LegalDoc doc={impressum} />;
}
