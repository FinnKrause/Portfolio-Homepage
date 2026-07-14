import type { Localized } from "./types";

/**
 * ⚠️ BEFORE GOING LIVE — fill in the two placeholders below.
 * A German Impressum (§ 5 DDG) legally requires a real, reachable postal
 * address (no P.O. box). It is intentionally NOT pre-filled with a home
 * address. Add yours here (this is the only place you need to edit it).
 */
export const legalConfig = {
  name: "Finn Krause",
  addressLines: ["Bernhard-Plettner-Ring 29", "91052 Erlangen"],
  email: "mail@finnkrause.com",
  phone: "+49 176 21443001", // optional, e.g. "+49 …"
  // The company that hosts the site (processes server logs). Update to match

  // your actual host, e.g. "Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA".
  hostingProvider: "Self-Hosting",
  updated: { de: "Juli 2026", en: "July 2026" } as Localized,
};

interface LegalSection {
  heading: Localized;
  body: Localized[];
}

export interface LegalDocT {
  slug: "impressum" | "datenschutz";
  title: Localized;
  intro?: Localized;
  sections: LegalSection[];
}

const addr = legalConfig.addressLines.join(", ");

export const impressum: LegalDocT = {
  slug: "impressum",
  title: { de: "Impressum", en: "Legal Notice (Impressum)" },
  sections: [
    {
      heading: {
        de: "Angaben gemäß § 5 DDG",
        en: "Information pursuant to § 5 DDG",
      },
      body: [
        { de: legalConfig.name, en: legalConfig.name },
        { de: addr, en: addr },
      ],
    },
    {
      heading: { de: "Kontakt", en: "Contact" },
      body: [
        {
          de: `E-Mail: ${legalConfig.email}`,
          en: `Email: ${legalConfig.email}`,
        },
      ],
    },
    {
      heading: {
        de: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
        en: "Responsible for content pursuant to § 18 (2) MStV",
      },
      body: [
        {
          de: `${legalConfig.name}, ${addr}`,
          en: `${legalConfig.name}, ${addr}`,
        },
      ],
    },
    {
      heading: { de: "Haftung für Inhalte", en: "Liability for content" },
      body: [
        {
          de: "Als Diensteanbieter bin ich gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG bin ich als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.",
          en: "As a service provider I am responsible for my own content on these pages under the general laws pursuant to § 7 (1) DDG. Under §§ 8 to 10 DDG, however, I am not obliged as a service provider to monitor transmitted or stored third-party information. Obligations to remove or block the use of information under the general laws remain unaffected.",
        },
      ],
    },
    {
      heading: { de: "Haftung für Links", en: "Liability for links" },
      body: [
        {
          de: "Dieses Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen Einfluss habe. Deshalb kann ich für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Bei Bekanntwerden von Rechtsverletzungen werde ich derartige Links umgehend entfernen.",
          en: "This offering contains links to external third-party websites over whose content I have no influence. I therefore cannot accept any liability for this external content. The respective provider or operator of the linked pages is always responsible for their content. Upon becoming aware of any legal violations, I will remove such links immediately.",
        },
      ],
    },
    {
      heading: { de: "Urheberrecht", en: "Copyright" },
      body: [
        {
          de: "Die durch mich erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.",
          en: "The content and works created by me on these pages are subject to German copyright law. Contributions by third parties are marked as such. Downloads and copies of this site are permitted for private, non-commercial use only.",
        },
      ],
    },
  ],
};

export const datenschutz: LegalDocT = {
  slug: "datenschutz",
  title: { de: "Datenschutzerklärung", en: "Privacy Policy" },
  intro: {
    de: "Der Schutz deiner Daten ist mir wichtig. Diese Website ist bewusst datensparsam gebaut: Es werden keine Cookies zu Tracking-Zwecken gesetzt und es kommt keine Analyse-Software zum Einsatz.",
    en: "Protecting your data matters to me. This website is deliberately built to be data-minimal: no tracking cookies are set and no analytics software is used.",
  },
  sections: [
    {
      heading: { de: "Verantwortlicher", en: "Controller" },
      body: [
        {
          de: `Verantwortlich für die Datenverarbeitung auf dieser Website ist ${legalConfig.name}, ${addr}, E-Mail: ${legalConfig.email}.`,
          en: `The controller responsible for data processing on this website is ${legalConfig.name}, ${addr}, email: ${legalConfig.email}.`,
        },
      ],
    },
    {
      heading: {
        de: "Hosting & Server-Logfiles",
        en: "Hosting & server log files",
      },
      body: [
        {
          de: `Diese Website wird bei einem externen Dienstleister gehostet (${legalConfig.hostingProvider}). Beim Aufruf der Seite werden durch den Hoster automatisch Informationen in sogenannten Server-Logfiles erfasst, u. a. IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Datei, übertragene Datenmenge, Referrer und verwendeter Browser. Dies dient dem sicheren und stabilen Betrieb der Website. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse). Mit dem Hoster besteht ein Auftragsverarbeitungsvertrag.`,
          en: `This website is hosted by an external provider (${legalConfig.hostingProvider}). When you access the site, the host automatically records information in so-called server log files, including IP address, date and time of access, the file requested, amount of data transferred, referrer and the browser used. This serves the secure and stable operation of the website. The legal basis is Art. 6 (1) (f) GDPR (legitimate interest). A data-processing agreement is in place with the host.`,
        },
      ],
    },
    {
      heading: {
        de: "Spracheinstellung (Local Storage)",
        en: "Language preference (local storage)",
      },
      body: [
        {
          de: "Deine gewählte Sprache (Deutsch/Englisch) wird ausschließlich lokal in deinem Browser (Local Storage) gespeichert, damit die Seite sie beim nächsten Besuch erinnert. Diese Information wird nicht an mich oder Dritte übertragen und enthält keine personenbezogenen Daten. Du kannst sie jederzeit über die Einstellungen deines Browsers löschen.",
          en: "Your chosen language (German/English) is stored solely locally in your browser (local storage) so the site can remember it on your next visit. This information is not transmitted to me or any third party and contains no personal data. You can delete it at any time via your browser settings.",
        },
      ],
    },
    {
      heading: {
        de: "Eingebundene YouTube-Videos",
        en: "Embedded YouTube videos",
      },
      body: [
        {
          de: "Im Bereich „Weltmeister“ sind Videos von YouTube (Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Irland) im erweiterten Datenschutzmodus eingebunden. Es wird zunächst nur ein Vorschaubild geladen; eine Verbindung zu YouTube wird erst hergestellt, wenn du ein Video aktiv startest. Die Vorschaubilder werden dabei von einem Google-Server (ytimg.com) geladen, wodurch deine IP-Adresse an Google übermittelt wird. Beim Abspielen verarbeitet Google weitere Daten gemäß seiner Datenschutzerklärung (https://policies.google.com/privacy). Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.",
          en: "In the “World Champion” section, videos from YouTube (Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Ireland) are embedded in privacy-enhanced mode. Initially only a preview image is loaded; a connection to YouTube is only established when you actively start a video. The preview images are loaded from a Google server (ytimg.com), which transmits your IP address to Google. When playing, Google processes further data in accordance with its privacy policy (https://policies.google.com/privacy). The legal basis is Art. 6 (1) (f) GDPR.",
        },
      ],
    },
    {
      heading: {
        de: "Projektübersicht via GitHub",
        en: "Project list via GitHub",
      },
      body: [
        {
          de: "Im Bereich „Projekte“ wird die Liste weiterer Repositories live über die öffentliche Programmierschnittstelle von GitHub (GitHub B.V. / GitHub, Inc., ein Unternehmen von Microsoft) geladen. Dabei wird deine IP-Adresse an GitHub übermittelt. Weitere Informationen findest du in der Datenschutzerklärung von GitHub (https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement). Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.",
          en: "In the “Projects” section, the list of further repositories is loaded live via GitHub's public API (GitHub B.V. / GitHub, Inc., a Microsoft company). Your IP address is transmitted to GitHub in the process. For more information, see GitHub's privacy statement (https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement). The legal basis is Art. 6 (1) (f) GDPR.",
        },
      ],
    },
    {
      heading: { de: "Schriftarten", en: "Fonts" },
      body: [
        {
          de: "Die verwendeten Schriftarten werden lokal vom Server dieser Website ausgeliefert (Self-Hosting). Es wird dabei keine Verbindung zu Servern von Google Fonts o. ä. aufgebaut.",
          en: "The fonts used are served locally from this website's own server (self-hosting). No connection to Google Fonts servers or similar is established.",
        },
      ],
    },
    {
      heading: { de: "SSL-/TLS-Verschlüsselung", en: "SSL/TLS encryption" },
      body: [
        {
          de: "Diese Seite nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennst du am „https://“ in der Adresszeile deines Browsers.",
          en: "For security reasons this site uses SSL/TLS encryption. You can recognise an encrypted connection by the “https://” in your browser's address bar.",
        },
      ],
    },
    {
      heading: { de: "Deine Rechte", en: "Your rights" },
      body: [
        {
          de: "Du hast jederzeit das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie Widerspruch gegen die Verarbeitung (Art. 21). Wende dich hierfür an die oben genannte Kontaktadresse.",
          en: "You have the right at any time to access (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20) and to object to processing (Art. 21). To exercise these rights, contact the address given above.",
        },
        {
          de: "Zudem steht dir ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu, insbesondere in dem Mitgliedstaat deines Aufenthaltsorts oder des Orts des mutmaßlichen Verstoßes.",
          en: "You also have the right to lodge a complaint with a data protection supervisory authority, in particular in the Member State of your habitual residence or the place of the alleged infringement.",
        },
      ],
    },
  ],
};

export const legalDocs = { impressum, datenschutz };
