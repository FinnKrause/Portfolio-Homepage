import type { Localized } from "./types";

/**
 * Single source of truth for the legal pages. A German Impressum (§ 5 DDG)
 * requires a real, reachable postal address — it lives here and nowhere else.
 */
export const legalConfig = {
  name: "Finn Krause",
  addressLines: ["Bernhard-Plettner-Ring 29", "91052 Erlangen"],
  email: "mail@finnkrause.com",
  updated: { de: "September 2026", en: "September 2026" } as Localized,
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
    de: "Diese Erklärung beschreibt, welche personenbezogenen Daten beim Besuch dieser Website verarbeitet werden. Analyse-Software von Drittanbietern wird nicht eingesetzt.",
    en: "This policy describes which personal data is processed when you visit this website. No third-party analytics software is used.",
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
          de: `Diese Website wird selbst gehostet (Self-Hosting; es wird kein externer Hosting-Dienstleister eingesetzt). Beim Aufruf der Seite können technisch bedingt Zugriffsdaten – u. a. IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Datei, übertragene Datenmenge, Referrer und verwendeter Browser – in Server-Logfiles verarbeitet werden. Diese Logfiles werden nicht dauerhaft gespeichert und nicht regelmäßig manuell gesichert; sie werden spätestens beim Neustart des Servers bzw. Dienstes automatisch gelöscht – in jedem Fall innerhalb von sechs Monaten. Die Verarbeitung dient ausschließlich dem sicheren und stabilen Betrieb der Website. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).`,
          en: `This website is self-hosted (no external hosting provider is used). For technical reasons, access data – including IP address, date and time of access, the file requested, amount of data transferred, referrer and the browser used – may be processed in server log files. These log files are not permanently stored and are not regularly backed up manually; they are automatically deleted at the latest when the server or service restarts – in any case within six months. Processing serves solely the secure and stable operation of the website. The legal basis is Art. 6 (1) (f) GDPR (legitimate interest).`,
        },
      ],
    },
    {
      heading: {
        de: "Zugangscode, Cookies und Zugriffsprotokoll",
        en: "Access code, cookies and access log",
      },
      body: [
        {
          de: "Die Inhalte dieser Website liegen hinter einem Zugangscode. Bereits das Anzeigen der Code-Abfrage – also bevor du etwas eingibst und bevor irgendein Cookie gesetzt wird – wird protokolliert: Zeitpunkt, Browser, Betriebssystem, Gerätetyp (Desktop, Tablet oder Smartphone) und, sofern vorhanden, der Hostname der verweisenden Website (nur der Hostname, nie die vollständige URL). Daraus lässt sich ablesen, wie viele Personen die Abfrage erreichen und wie viele davon nicht weiterkommen; einer bestimmten Person ist der Eintrag nicht zuzuordnen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am Betrieb und an der Wirksamkeit der Zugangskontrolle).",
          en: "The content of this website sits behind an access code. Simply displaying the code prompt – that is, before you type anything and before any cookie is set – is logged: time, browser, operating system, device type (desktop, tablet or phone) and, where present, the hostname of the referring website (the hostname only, never the full URL). This shows how many people reach the prompt and how many get no further; the entry cannot be traced to a particular person. The legal basis is Art. 6 (1) (f) GDPR (legitimate interest in operating the access check and knowing whether it works).",
        },
        {
          de: "Wird ein Code eingegeben, der nicht gültig ist, wird zusätzlich der eingegebene Code selbst zusammen mit dem Grund der Ablehnung (unbekannt, deaktiviert oder abgelaufen) gespeichert. Das dient dem Schutz der Inhalte vor dem systematischen Durchprobieren von Codes. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.",
          en: "If a code is entered that is not valid, the code you typed is additionally stored together with the reason it was refused (unknown, disabled or expired). This protects the content against codes being worked through systematically. The legal basis is Art. 6 (1) (f) GDPR.",
        },
        {
          de: "Nach Eingabe eines gültigen Codes setzt diese Website zwei eigene Cookies (keine Cookies von Drittanbietern): „fk-access“ (fester Wert „1“) verhindert, dass der Code auf diesem Gerät erneut abgefragt wird; „fk-visitor“ enthält eine zufällig erzeugte Kennung, über die spätere Aufrufe demselben Gerät und dem verwendeten Zugangscode zugeordnet werden.",
          en: "Once a valid code has been entered, this website sets two first-party cookies (no third-party cookies): “fk-access” (fixed value “1”) stops the code being requested again on this device; “fk-visitor” holds a randomly generated identifier used to attribute later visits to the same device and to the access code it came in with.",
        },
        {
          de: "Beide Cookies haben eine Laufzeit von zwölf Monaten und werden bei jedem Besuch erneuert. Die Frist läuft also ab deinem jeweils letzten Besuch: Wer regelmäßig wiederkommt, muss den Code kein zweites Mal eingeben. Bleibt ein Gerät zwölf Monate lang weg, laufen beide Cookies im Browser ab; beim nächsten Besuch wird der Code erneut abgefragt und das Gerät erhält eine neue, nicht mit der alten verknüpfte Kennung.",
          en: "Both cookies have a twelve-month lifetime and are renewed on every visit, so the period runs from your most recent visit rather than your first: if you come back regularly you never need to enter the code a second time. If a device stays away for twelve months, both cookies expire in the browser; the next visit asks for the code again and the device receives a new identifier that is not linked to the old one.",
        },
        {
          de: "Ab diesem Zeitpunkt werden beim Eintritt und bei jedem weiteren Seitenaufruf gespeichert: Zeitpunkt, der verwendete Zugangscode, die Kennung aus „fk-visitor“, ob dies der erste Eintritt auf diesem Gerät war, ob der Eintritt über die Eingabemaske oder über einen QR- bzw. Direktlink erfolgte, Browser, Betriebssystem, Gerätetyp und der Hostname der verweisenden Website. Zweck ist ausschließlich, die Reichweite der von mir ausgegebenen Zugangscodes zu messen – also zu sehen, welcher Code tatsächlich bei Menschen ankommt.",
          en: "From that point on, the following is stored when you enter and on every further page view: time, the access code used, the identifier from “fk-visitor”, whether this was the first entry on this device, whether entry came through the input form or through a QR or direct link, browser, operating system, device type and the hostname of the referring website. The sole purpose is to measure the reach of the access codes I hand out – that is, to see which code actually reaches people.",
        },
        {
          de: "Rechtsgrundlage für diese beiden Cookies und die daran gebundene Auswertung ist deine Einwilligung (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO), die du mit dem Absenden eines gültigen Codes erteilst; auf der Code-Abfrage wird zuvor darauf hingewiesen. Du kannst deine Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen, indem du die Cookies dieser Website in deinem Browser löschst – das Gerät ist danach wieder ein unbekanntes Gerät.",
          en: "The legal basis for these two cookies and the analysis tied to them is your consent (§ 25 (1) TDDDG, Art. 6 (1) (a) GDPR), which you give by submitting a valid code; the code prompt says so before you do. You can withdraw your consent at any time with effect for the future by deleting this site's cookies in your browser – after that the device is an unknown device again.",
        },
        {
          de: "Die einzelnen Einträge werden nach 182 Tagen (rund sechs Monaten) automatisch gelöscht. Erhalten bleiben lediglich zusammengefasste Zahlen ohne Bezug zu einzelnen Aufrufen, damit die Gesamtstatistik über die ausgegebenen Codes nicht schrumpft, sobald ältere Einträge wegfallen. Die Daten werden nicht an Dritte weitergegeben und nicht dazu verwendet, Profile über einzelne Personen zu bilden.",
          en: "The individual entries are deleted automatically after 182 days (about six months). Only aggregate figures are kept, with no reference to individual page views, so that the overall statistics for the codes I hand out do not shrink as older entries fall away. The data is not shared with third parties and is not used to build profiles of individual people.",
        },
        {
          de: "Deine IP-Adresse wird bei der Code-Eingabe kurzzeitig im Arbeitsspeicher verarbeitet, um die Zahl fehlgeschlagener Versuche pro Anschluss zu begrenzen (höchstens 12 in 10 Minuten). Sie wird dabei weder in der Datenbank gespeichert noch mit den oben genannten Einträgen verknüpft. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.",
          en: "Your IP address is held briefly in memory while a code is checked, in order to cap the number of failed attempts per connection (at most 12 in 10 minutes). It is neither written to the database nor linked to any of the entries described above. The legal basis is Art. 6 (1) (f) GDPR.",
        },
      ],
    },
    {
      heading: {
        de: "Lokale Speicherung im Browser (Local Storage)",
        en: "Local storage in your browser",
      },
      body: [
        {
          de: "Zwei Angaben werden ausschließlich lokal in deinem Browser gespeichert: deine gewählte Sprache (Deutsch/Englisch), damit die Seite sie beim nächsten Besuch erinnert, und – nur falls du den Reaktionstest im F1-Bereich ausprobierst – deine bisher beste Reaktionszeit. Beides wird nicht an mich oder an Dritte übertragen, enthält keine personenbezogenen Daten und kann jederzeit über die Einstellungen deines Browsers gelöscht werden.",
          en: "Two things are stored solely locally in your browser: your chosen language (German/English), so the site remembers it on your next visit, and – only if you try the reaction test in the F1 section – your best reaction time so far. Neither is transmitted to me or to any third party, neither contains personal data, and both can be deleted at any time via your browser settings.",
        },
      ],
    },
    {
      heading: {
        de: "Verlinkte YouTube-Videos",
        en: "Linked YouTube videos",
      },
      body: [
        {
          de: "Im F1-Bereich wird auf Videos meines damaligen Teams bei YouTube verlinkt. Es sind keine Videos eingebettet, und es wird auch kein Player geladen. Die dort gezeigten Vorschaubilder liegen auf dem Server dieser Website; beim Laden der Seite wird also keine Verbindung zu Google aufgebaut und keine IP-Adresse an Google übermittelt. Erst wenn du ein Vorschaubild oder einen Videolink anklickst, verlässt du diese Website und rufst YouTube (Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Irland) auf; ab diesem Zeitpunkt gilt die Datenschutzerklärung von Google (https://policies.google.com/privacy).",
          en: "The F1 section links to videos from my former team on YouTube. No videos are embedded and no player is loaded. The preview images shown there are served from this website's own server, so no connection to Google is made when the page loads and no IP address is transmitted to Google. Only when you click a preview image or a video link do you leave this website and open YouTube (Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Ireland); from that point on Google's privacy policy applies (https://policies.google.com/privacy).",
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
