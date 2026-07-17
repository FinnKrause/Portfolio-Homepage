import type { Localized, LinkItem, MediaSlide } from "./types";

export const socials: {
  key: string;
  label: string;
  href: string;
  handle: string;
}[] = [
  {
    key: "github",
    label: "GitHub",
    href: "https://github.com/FinnKrause",
    handle: "@FinnKrause",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/finnkrause001",
    handle: "in/finnkrause001",
  },
  {
    key: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/f2nn.krse/",
    handle: "@f2nn.krse",
  },
  {
    key: "email",
    label: "E-Mail",
    href: "mailto:mail@finnkrause.com",
    handle: "mail@finnkrause.com",
  },
];

export const profile = {
  name: "Finn Krause",
  email: "mail@finnkrause.com",

  eyebrow: {
    de: "Wirtschaftsinformatik · FAU Erlangen-Nürnberg",
    en: "Information Systems · FAU Erlangen-Nürnberg",
  } as Localized,

  // Understated, journey-led hero copy — the site leads with the story, not the name/photo.
  hero: {
    headline: {
      de: "Student der Wirtschaftsinformatik, Hobby-Softwareentwickler und Lichttechniker.",
      en: "Student of Information Systems, hobby software engineer and lighting technician.",
    } as Localized,
    lead: {
      de: "Diese Seite ist eine kleine Reise durch meine Projekte, mein Engagement und ein paar Wettbewerbe rund um die Welt.",
      en: "This site is a small journey through my projects, my involvement and a few competitions around the world.",
    } as Localized,
  },

  // About section — character-focused, drawn from the long-form CV.
  aboutBody: [
    {
      de: "Ab der Grundschule habe ich angefangen, mich für die Gemeinschaft einzusetzen — als Klassensprecher, später als Schüler- und Jahrgangsstufensprecher. Ich vertrat die Schülerschaft in Gremien von Schule und Stadt, leitete Arbeitsgruppen von Fotografie & Film bis zur Theatertechnik und lernte, Menschen für gemeinsame Ziele zu begeistern.",
      en: "I started getting involved for my community back in primary school — first as class representative, later as student and year representative. I represented the student body in school and city committees, led groups from photography & film to stage technology, and learned how to get people excited about a shared goal.",
    },
    {
      de: "Parallel dazu treibt mich die Technik: Ich entwickle leidenschaftlich gerne Software, beschäftige mich mit Cybersicherheit und stehe regelmäßig an den Lichtpulten verschiedenster Veranstaltungen.",
      en: "In parallel, technology drives me: I build software, work on cybersecurity and I regularly run the lighting desks of various events. ",
    },
    {
      de: "Meine Energie ziehe ich vor allem darin mein Wissen zu teilen und Werte wie Gemeinschaft und Verantwortung aktiv zu leben. Ob im deutsch-französischen Austausch, als Delegierter bei Model United Nations oder heute als Mitglied der Fachschaft im Studium der Wirtschaftsinformatik — ich möchte etwas bewegen und dabei stetig Neues lernen.",
      en: "Most of my energy comes from sharing my knowledge and actively living values like community and responsibility. Whether on a German-French exchange, as a delegate at Model United Nations, or today as an active member of numerous working groups alongside my studies of Information Systems — I want to make a difference and keep learning along the way.",
    },
  ] as Localized[],

  // Four pillars
  pillars: [
    {
      key: "software",
      title: { de: "Softwareentwicklung", en: "Software development" },
      body: {
        de: "Anwendungen in Java, C#, TypeScript und Python — vom Web-Portal bis zur Desktop-Middleware. Immer das was zu meinem aktuellen Problem am besten passt.",
        en: "Applications in Java, C#, TypeScript and Python — from web portals to desktop middleware. Whatever is best for my current problem.",
      },
    },
    {
      key: "events",
      title: { de: "Veranstaltungstechnik", en: "Event technology" },
      body: {
        de: "Lichtdesign und Veranstaltungsbetreuung (DMX-Joker, grandMA3, MIDI) für kleine Veranstaltungen bis zu Veranstaltungen mit mehreren hundert Gästen.",
        en: "Lighting design and Eventmanagement (DMX-Joker, grandMA3, MIDI) for small events to stages with several hundred guests.",
      },
    },
    {
      key: "security",
      title: { de: "Cybersicherheit", en: "Cybersecurity" },
      body: {
        de: "Netzwerktheorie, Linux, private Serverlandschaften und praktische CTF-Erfahrung.",
        en: "Network theory, Linux, private server architecture and hands-on CTF experience.",
      },
    },
    {
      key: "leadership",
      title: { de: "Führung & Engagement", en: "Leadership & involvement" },
      body: {
        de: "Gremien- und Fachschaftsarbeit, internationale Projekte und Beziehungen, Wettbewerbe - alles wo man Leute zusammenkriegt.",
        en: "Committee work, international projects and relationships, competitions and event planning - anything where people come together.",
      },
    },
  ] as { key: string; title: Localized; body: Localized }[],

  // Light-touch hobbies.
  hobbies: {
    title: {
      de: "Abseits vom Schreibtisch",
      en: "Away from the desk",
    } as Localized,
    items: [
      {
        key: "rc",
        title: { de: "RC-Cars", en: "RC cars" },
        body: {
          de: "Basteln, Tuning und Fahren ferngesteuerter Autos.",
          en: "Building, tuning and driving remote-control cars.",
        },
        link: {
          label: { de: "Clip ansehen", en: "Watch a clip" },
          href: "/images/rc-cars-image1.mov",
        },
      },
      {
        key: "travel",
        title: { de: "Reisen", en: "Travelling" },
        body: {
          de: "Neue Orte und Kulturen entdecken — mehr davon auf Instagram (nur für Follower).",
          en: "Discovering new places and cultures — more of that on Instagram (followers only).",
        },
        link: {
          label: { de: "Auf Instagram", en: "On Instagram" },
          href: "https://www.instagram.com/f2nn.krse/",
        },
      },
    ] as { key: string; title: Localized; body: Localized; link: LinkItem }[],
  },

  // Championship (F1 in Schools) feature
  championship: {
    eyebrow: {
      de: "Aramco F1 in Schools · World Finals 2023 · Singapur",
      en: "Aramco F1 in Schools · World Finals 2023 · Singapore",
    } as Localized,
    title: {
      de: "Weltmeister mit Recoil Racing",
      en: "World Champion with Recoil Racing",
    } as Localized,
    body: [
      {
        de: "Mit dem Team Recoil Racing vom Marie-Therese-Gymnasium Erlangen habe ich 2023 den Weltmeistertitel bei den Aramco F1 in Schools World Finals in Singapur gewonnen — im weltweit größten multidisziplinären Technologiewettbewerb für Schüler mit jährlich über einer Million Teilnehmern.",
        en: "With team Recoil Racing from Marie-Therese-Gymnasium in Erlangen, we won the 2023 world title at the Aramco F1 in Schools World Finals in Singapore — the world's largest multidisciplinary student technology competition, with over a million participants every year.",
      },
      {
        de: "Wir setzten uns gegen 67 weitere National-Teams aus 26 Ländern durch, nachdem wir zuvor die bayerische und die deutsche Meisterschaft gewonnen hatten. Das Projekt war weit mehr als ein Miniatur-Rennwagen: Wir gründeten ein eigenes Unternehmen mit Sponsoring, Management, CAD-/CFD-Konstruktion und Content-Creation.",
        en: "We beat 67 other national teams from 26 countries, having previously won the Bavarian and German championships. The project was far more than a miniature race car: we founded our own company with sponsoring, management, CAD/CFD engineering and content creation.",
      },
    ] as Localized[],
    quote: {
      de: "„Die Mitglieder von Recoil Racing sind würdige Weltmeister.“",
      en: "“The members of Recoil Racing are worthy world champions.”",
    } as Localized,
    quoteAuthor: {
      de: "Gary Anderson, ehem. F1-Technikchef",
      en: "Gary Anderson, former F1 Technical Director",
    } as Localized,
    prize: {
      de: "Der Titel eröffnete den Zugang zum F1 Paddock des Grand Prix 2023 in Singapur und ermöglichte exklusiven GridVIP Access. Dazu gehörten zahlreiche Interviews - unter anderem mit dem bekannten F1-Moderator Martin Brundle -, Begegnungen mit echten Formel-1-Fahrern sowie eine Siegerehrung auf dem originalen Formel-1-Podium. Außerdem wurde ein Stipendium für die UCLA in London vergeben, das von meiner Teamkollegin Caro angenommen wurde.",
      en: "The title opened the doors to the F1 Paddock and included exclusive GridVIP Access. It led to numerous interviews – including one with renowned F1 presenter Martin Brundle – meetings with real Formula 1 drivers, and an unforgettable podium ceremony on the official Formula 1 podium. In addition, a scholarship for UCLA Extension in London was awarded and accepted by my teammate Caro.",
    } as Localized,
    stats: [
      { value: "1.", label: { de: "Platz weltweit", en: "place worldwide" } },
      {
        value: "68",
        label: { de: "Teams im Finale", en: "teams in the final" },
      },
      { value: "26", label: { de: "Nationen", en: "countries" } },
      {
        value: "1 Mio.+",
        label: { de: "Teilnehmer / Jahr", en: "participants / year" },
      },
    ] as { value: string; label: Localized }[],
    links: [
      {
        label: {
          de: "Offizieller F1-Artikel",
          en: "Official Formula 1 article",
        },
        href: "https://www.formula1.com/en/latest/article/german-team-crowned-champions-in-2023-aramco-f1-in-schools-world-finals.6AjY9ZlXQGicww2A7ZODN6",
      },
      {
        label: { de: "Team Recoil Racing", en: "Team Recoil Racing" },
        href: "https://recoilracing.finnkrause.com",
      },
    ] as LinkItem[],
    imageAlt: {
      de: "Recoil Racing auf dem Podium der F1 in Schools World Finals 2023 mit der deutschen Flagge.",
      en: "Recoil Racing on the podium of the F1 in Schools World Finals 2023 with the German flag.",
    } as Localized,
    galleryTitle: { de: "Impressionen", en: "Impressions" } as Localized,
    // Replace these placeholders with real photos (drop files in /public/images).
    gallery: [
      {
        kind: "image",
        src: "/images/f1-image1.jpeg",
      },
      {
        kind: "image",
        src: "/images/f1-image2.png",
      },
      {
        kind: "image",
        src: "/images/f1-podium.jpg",
      },
    ] as MediaSlide[],
    videosTitle: { de: "Videos", en: "Videos" } as Localized,
    videos: [
      { kind: "video", youtube: "IW4Tb8JDNNA" },
      { kind: "video", youtube: "J-vTb7qopDI" },
      { kind: "video", youtube: "slCk5LKnrCA" },
      { kind: "video", youtube: "TvUDUW9OsAQ" },
    ] as MediaSlide[],
    // The story didn't end with the title — kept small & expandable.
    journeyTitle: {
      de: "Wie es weiterging",
      en: "Where the journey went next",
    } as Localized,
    chapters: [
      {
        id: "france",
        title: {
          de: "2025 · Als Coach in Frankreich",
          en: "2025 · Coaching in France",
        },
        summary: {
          de: "Ein französisches Team bis zum Vize-Meister begleitet.",
          en: "Mentored a French team all the way to runner-up.",
        },
        body: {
          de: "2025 reiste ich mit meinem Teamkollegen Timon nach Avignon, um LLP Racing vom Lycée Louis Pasteur zu coachen. Bei den französischen National-Finals am Circuit Paul Ricard erreichte das Team den 2. Platz. Es war besonders schön, das Gelernte weiterzugeben und noch einmal den Thrill der Competition zu erleben, ohne selbst abliefern zu müssen.",
          en: "In 2025 I travelled to Avignon with my teammate Timon to coach LLP Racing from Lycée Louis Pasteur. At the French National Finals held at Circuit Paul Ricard, the team finished 2nd. Passing on what I'd learned was especially rewarding and being able to re-live the thrill of the competition without actually participating was amazing.",
        },
        gallery: [
          { kind: "image", src: "/images/f1-france-image1.png" },
          { kind: "image", src: "/images/f1-france-image2.png" },
        ],
      },
      {
        id: "thailand",
        title: { de: "Besuch im Thai-HQ", en: "Visiting the Thai HQ" },
        summary: {
          de: "Zu Gast im F1-in-Schools-Hauptquartier in Thailand.",
          en: "A guest at the F1 in Schools headquarters in Thailand.",
        },
        body: {
          de: "Auf einer Reise besuchte ich das thailändische F1-in-Schools-Hauptquartier und lernet die dortigen Teilnehmer und Verantwortlichen kennen. Eine ganz andere Welt, wunderbare Menschen und ein toller, ereignisreicher Tag.",
          en: "On a trip I visited the Thai F1 in Schools headquarters and had the chance to get to know some participants and the director of F1-in-Schools Thailand. A totally different world with the most amazing people behind and a very exciting and interesing day spent together.",
        },
        gallery: [{ kind: "image", src: "/images/f1-thailand-image1.png" }],
      },
    ] as {
      id: string;
      title: Localized;
      summary: Localized;
      body: Localized;
      gallery: MediaSlide[];
    }[],
  },

  // Contact — deliberately understated. Reachable, but not the point of the page.
  contact: {
    title: { de: "Neugierig geworden?", en: "Curious?" } as Localized,
    body: {
      de: "Diese Seite soll dich vor allem einen Eindruck von mir gewinnen lassen. Wenn du Kontakt aufnehmen möchtest, freue ich mich :).",
      en: "This site is mostly here to give you an impression of who I am. If you'd  like to reach out, I'd be glad to hear from you :)",
    } as Localized,
  },
} as const;
