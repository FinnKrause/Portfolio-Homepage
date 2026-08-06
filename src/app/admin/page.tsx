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
  return <AdminDashboard />;
}
