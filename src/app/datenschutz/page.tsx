import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal/LegalDoc";
import { datenschutz } from "@/content/legal";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  robots: { index: false, follow: true },
};

export default function DatenschutzPage() {
  return <LegalDoc doc={datenschutz} />;
}
