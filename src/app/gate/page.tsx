import type { Metadata } from "next";
import { GateClient } from "./GateClient";

// The gate carries no personal content and should never be indexed.
export const metadata: Metadata = {
  title: "Finn Krause",
  description: "A personal site — its content is available behind a short access check.",
  robots: { index: false, follow: false },
};

export default function GatePage() {
  return <GateClient />;
}
