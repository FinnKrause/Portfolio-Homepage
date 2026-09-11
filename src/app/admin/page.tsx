import type { Metadata } from "next";
import { AdminDashboard } from "./AdminDashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Access codes",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Token administration.
 *
 * Deliberately unauthenticated at the application level: the reverse proxy in
 * front of this app is responsible for deciding who may reach /admin and
 * /api/admin. Nothing here should be exposed directly.
 */
export default function AdminPage() {
  // The origin that printed links and QR codes should point at. The QR route
  // already uses this; handing it to the dashboard means a copied link and the
  // QR for the same code can never disagree — which they did when the link was
  // built from window.location and you happened to open /admin on localhost.
  //
  // Empty when unset, in which case the dashboard falls back to the origin it
  // is being viewed on, which is the right answer for local development.
  return <AdminDashboard publicOrigin={process.env.FK_PUBLIC_ORIGIN ?? ""} />;
}
