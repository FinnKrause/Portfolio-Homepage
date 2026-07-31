import type { Metadata } from "next";
import { GateClient } from "./GateClient";

// The gate carries no personal content and should never be indexed.
export const metadata: Metadata = {
  title: "Finn K",
  description: "Content only available with valid access token",
  robots: { index: false, follow: false },
};

export default function GatePage() {
  return <GateClient />;
}
