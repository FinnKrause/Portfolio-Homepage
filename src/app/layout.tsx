import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { VERIFICATION_ENABLED } from "@/config/access";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
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
    images: [{ url: "/images/finn-portrait.jpg", width: 768, height: 1024, alt: "Finn Krause" }],
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
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${jetbrains.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-paper antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
