import { SiteContent } from "@/components/SiteContent";

// Access control happens in src/middleware.ts (cookie-based): unverified
// visitors are rewritten to /gate before this page is ever served, so the
// content can be fully server-rendered and appears with the first paint.
export default function Home() {
  return <SiteContent />;
}
