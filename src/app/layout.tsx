import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { VERIFICATION_ENABLED } from "@/config/access";

// One typeface for the whole site. DESIGN.md's own face (Forma DJR Micro) is
// proprietary and names Manrope as the substitute that needs no metric
// adjustment — a geometric grotesque with the same open, slightly mechanical
// voice. Four weights: 400 body, 500 display, 600 buttons, 700 emphasis.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const publicMetadata: Metadata = {
  metadataBase: new URL("https://finnkrause.com"),
  title: {
    default: "Finn Krause — Wirtschaftsinformatik & F1 in Schools World Champion",
    template: "%s · Finn Krause",
  },
  description:
    "Finn Krause — Wirtschaftsinformatik-Student an der FAU Erlangen-Nürnberg, Entwickler, Veranstaltungstechniker und F1-in-Schools-Weltmeister 2023. Software, Lichttechnik und Cybersicherheit.",
  keywords: [
    "Finn Krause",
    "Wirtschaftsinformatik",
    "FAU Erlangen-Nürnberg",
    "F1 in Schools",
    "Recoil Racing",
    "Softwareentwicklung",
    "Veranstaltungstechnik",
    "Portfolio",
  ],
  authors: [{ name: "Finn Krause", url: "https://github.com/FinnKrause" }],
  openGraph: {
    type: "website",
    title: "Finn Krause — Developer, Event Engineer & F1 in Schools World Champion",
    description:
      "Portfolio of Finn Krause: Information Systems student at FAU, developer, event engineer and 2023 F1 in Schools World Champion.",
    images: [{ url: "/images/Portraits/finn-portrait.jpg", width: 768, height: 1024, alt: "Finn Krause" }],
    locale: "de_DE",
    alternateLocale: "en_US",
  },
  robots: { index: true, follow: true },
};

// While the access gate is on, keep the public metadata deliberately sparse so
// crawlers that only read <head> don't get personal details either. Flip
// VERIFICATION_ENABLED to false (in @/config/access) to restore the full,
// indexable metadata along with a fully public site.
const gatedMetadata: Metadata = {
  metadataBase: new URL("https://finnkrause.com"),
  title: "Finn Krause",
  description:
    "A personal site — its content is available behind a short access check.",
  robots: { index: false, follow: false },
};

export const metadata: Metadata = VERIFICATION_ENABLED
  ? gatedMetadata
  : publicMetadata;

export const viewport: Viewport = {
  // The canvas nav bar is the first thing under the browser chrome.
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={manrope.variable}>
      <body className="min-h-screen bg-canvas text-ink antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
