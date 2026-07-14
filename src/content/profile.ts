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

  role: {
    de: "Student, Entwickler & Veranstaltungstechniker",
    en: "Student, developer & event engineer",
  } as Localized,

  lead: {
    de: "Ich entwickle Software, gestalte Veranstaltungstechnik und denke Sicherheit von Anfang an mit. Am liebsten bringe ich Projekte gemeinsam mit einem starken Team ins Ziel — mit Neugier, Verantwortung und einem Faible fürs Gestalten.",
    en: "I build software, design live-event technology and treat security as a first-class concern. Most of all I love getting projects across the finish line with a strong team — with curiosity, responsibility and a love for making things.",
  } as Localized,

  // Understated, journey-led hero copy — the site leads with the story, not the name/photo.
  hero: {
    intro: { de: "Hallo, ich bin Finn Krause", en: "Hi, I'm Finn Krause" } as Localized,
    headline: {
      de: "Ich baue Software, gestalte Bühnen und bleibe unendlich neugierig.",
      en: "I build software, design stages and stay endlessly curious.",
    } as Localized,
    lead: {
      de: "Diese Seite ist eine kleine Reise durch meine Projekte, mein Engagement und ein paar Wettbewerbe rund um die Welt. Nimm dir einen Moment und scroll dich durch.",
      en: "This site is a small journey through my projects, my involvement and a few competitions around the world. Take a moment and scroll through.",
    } as Localized,
  },

  // Slim, understated highlight strip — a blend of achievement, engagement & craft
  // (deliberately not F1-only).
  heroHighlights: [
    {
      icon: "trophy",
      label: {
        de: "F1 in Schools — Weltmeister ’23",
        en: "F1 in Schools — World Champion ’23",
      },
    },
    {
      icon: "gavel",
      label: {
        de: "Umbruchszeiten — Jurymitglied",
        en: "Umbruchszeiten — jury member",
      },
    },
    {
      icon: "lightbulb",
      label: {
        de: "Entwickler & Veranstaltungstechniker",
        en: "Developer & event engineer",
      },
    },
  ] as { icon: string; label: Localized }[],

  // About section — character-focused, drawn from the long-form CV.
  aboutTitle: { de: "Über mich", en: "About me" } as Localized,
  aboutBody: [
    {
      de: "Schon in der Grundschule habe ich angefangen, mich für die Gemeinschaft einzusetzen — als Klassensprecher, später als Schüler- und Jahrgangsstufensprecher. Ich vertrat die Schülerschaft in Gremien von Schule und Stadt, leitete Arbeitsgruppen von Fotografie & Film bis zur Theatertechnik und lernte, Menschen für gemeinsame Ziele zu begeistern.",
      en: "I started getting involved for my community back in primary school — first as class representative, later as student and year representative. I represented the student body in school and city committees, led groups from photography & film to stage technology, and learned how to get people excited about a shared goal.",
    },
    {
      de: "Parallel dazu treibt mich die Technik: Ich entwickle Software, beschäftige mich mit Cybersicherheit — während meiner Zeit als IT-Manager an der Schule fand ich Sicherheitslücken und meldete sie verantwortungsvoll — und stehe regelmäßig an den Lichtpulten großer Veranstaltungen. Ein freiwilliges Praktikum in der IT-Sicherheit von Siemens Healthineers brachte mir mit 15 mein erstes Jobangebot.",
      en: "In parallel, technology drives me: I build software, work on cybersecurity — during my time as the school's IT manager I found security vulnerabilities and disclosed them responsibly — and I regularly run the lighting desks of large events. A voluntary internship in IT security at Siemens Healthineers earned me my first job offer at 15.",
    },
    {
      de: "Meine Energie ziehe ich vor allem aus einem: anderen zu helfen und Werte wie Gemeinschaft und Verantwortung aktiv zu leben. Ob im deutsch-französischen Austausch, als Delegierter bei Model United Nations oder heute im Studium der Wirtschaftsinformatik — ich möchte etwas bewegen und dabei stetig Neues lernen.",
      en: "Most of my energy comes from one thing: helping others and actively living values like community and responsibility. Whether on a German-French exchange, as a delegate at Model United Nations, or today studying Information Systems — I want to make a difference and keep learning along the way.",
    },
  ] as Localized[],

  // Four pillars
  pillars: [
    {
      key: "software",
      title: { de: "Softwareentwicklung", en: "Software development" },
      body: {
        de: "Anwendungen in Java, C#, TypeScript und Python — vom Web-Portal bis zur Desktop-Middleware.",
        en: "Applications in Java, C#, TypeScript and Python — from web portals to desktop middleware.",
      },
    },
    {
      key: "events",
      title: { de: "Veranstaltungstechnik", en: "Event technology" },
      body: {
        de: "Lichtdesign und Show-Control (DMX, grandMA3, MIDI) für Bühnen mit mehreren hundert Gästen.",
        en: "Lighting design and show control (DMX, grandMA3, MIDI) for stages with several hundred guests.",
      },
    },
    {
      key: "security",
      title: { de: "Cybersicherheit", en: "Cybersecurity" },
      body: {
        de: "Netzwerktheorie, Linux und praktische CTF-Erfahrung — Schwachstellen finden und verantwortungsvoll melden.",
        en: "Network theory, Linux and hands-on CTF experience — finding vulnerabilities and reporting them responsibly.",
      },
    },
    {
      key: "leadership",
      title: { de: "Führung & Engagement", en: "Leadership & involvement" },
      body: {
        de: "Gremienarbeit, Budgetkoordination und Eventplanung — Menschen und Ideen zusammenbringen.",
        en: "Committee work, budget coordination and event planning — bringing people and ideas together.",
      },
    },
  ] as { key: string; title: Localized; body: Localized }[],

  // Broad "who I am" topics — each with its own imagery (carousel + text).
  aboutTopics: [
    {
      key: "software",
      title: { de: "Software", en: "Software" },
      body: {
        de: "Von Web-Portalen über Desktop-Middleware bis zu kleinen Tools — ich baue am liebsten Dinge, die ein echtes Problem lösen. Zuhause bin ich in Java, C#, TypeScript und Python.",
        en: "From web portals to desktop middleware to little tools — I most enjoy building things that solve a real problem. I'm at home in Java, C#, TypeScript and Python.",
      },
      gallery: [
        { kind: "placeholder", label: { de: "Bild folgt", en: "Photo coming soon" }, aspect: "16 / 10" },
      ],
    },
    {
      key: "events",
      title: { de: "Veranstaltungstechnik", en: "Event technology" },
      body: {
        de: "Licht, Show-Control und Bühnenbau (DMX, grandMA3, MIDI) — von Clubabenden bis zu Festivalbühnen für mehrere hundert Gäste. Hier treffen Technik, Timing und Gestaltung aufeinander.",
        en: "Lighting, show control and stage building (DMX, grandMA3, MIDI) — from club nights to festival stages for several hundred guests. Where engineering, timing and design meet.",
      },
      gallery: [
        { kind: "image", src: "/images/stage-lighting3.png" },
        { kind: "image", src: "/images/stage-lighting-image4.png" },
        { kind: "image", src: "/images/stage-lighting2.png" },
        { kind: "image", src: "/images/stage-lighting.jpg" },
      ],
    },
    {
      key: "security",
      title: { de: "Cybersicherheit", en: "Cybersecurity" },
      body: {
        de: "Netzwerktheorie, Linux und CTFs. Schwachstellen finden und verantwortungsvoll melden — begonnen an meiner Schule, vertieft im Praktikum bei Siemens Healthineers und in Uni-Wettbewerben.",
        en: "Network theory, Linux and CTFs. Finding vulnerabilities and disclosing them responsibly — started at my school, deepened in an internship at Siemens Healthineers and in university competitions.",
      },
      gallery: [
        { kind: "placeholder", label: { de: "Bild folgt", en: "Photo coming soon" }, aspect: "16 / 10" },
      ],
    },
    {
      key: "community",
      title: { de: "Gemeinschaft & Führung", en: "Community & leadership" },
      body: {
        de: "Ob als Schülersprecher, in der Fachschaft oder im Wettbewerbsteam — ich bringe gern Menschen und Ideen zusammen, übernehme Verantwortung und ziehe meine Energie daraus, anderen zu helfen.",
        en: "Whether as a student representative, in the student council or in a competition team — I love bringing people and ideas together, taking responsibility, and I draw my energy from helping others.",
      },
      gallery: [
        { kind: "placeholder", label: { de: "Bild folgt", en: "Photo coming soon" }, aspect: "16 / 10" },
      ],
    },
  ] as { key: string; title: Localized; body: Localized; gallery: MediaSlide[] }[],

  // Light-touch hobbies.
  hobbies: {
    title: { de: "Abseits vom Schreibtisch", en: "Away from the desk" } as Localized,
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
      de: "Der Titel brachte ein volles Stipendium für Maschinenbau am University College London (UCL) sowie eine Siegerehrung auf dem Podium des Großen Preises von Singapur.",
      en: "The title came with a full bursary scholarship to Mechanical Engineering at University College London (UCL) and a trophy presentation on the podium of the Singapore Grand Prix.",
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
        src: "/images/f1-podium2.JPG",
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
    journeyTitle: { de: "Wie es weiterging", en: "Where the journey went next" } as Localized,
    chapters: [
      {
        id: "france",
        title: { de: "2025 · Als Coach in Frankreich", en: "2025 · Coaching in France" },
        summary: {
          de: "Ein französisches Team bis zum Vize-Meister begleitet.",
          en: "Mentored a French team all the way to runner-up.",
        },
        body: {
          de: "2025 reiste ich mit meinem Teamkollegen Timon nach Avignon, um LLP Racing vom Lycée Louis Pasteur zu coachen. Bei den französischen National-Finals am Circuit Paul Ricard erreichte das Team den 2. Platz — es war besonders schön, das Gelernte weiterzugeben.",
          en: "In 2025 I travelled to Avignon with my teammate Timon to coach LLP Racing from Lycée Louis Pasteur. At the French National Finals held at Circuit Paul Ricard, the team finished 2nd — passing on what I'd learned was especially rewarding.",
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
          de: "Auf einer Reise besuchte ich das thailändische F1-in-Schools-Hauptquartier — ein Blick hinter die Kulissen des Wettbewerbs, der mich so geprägt hat.",
          en: "On a trip I visited the Thai F1 in Schools headquarters — a look behind the scenes of the competition that shaped me so much.",
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
      de: "Diese Seite soll dich vor allem einen Eindruck von mir gewinnen lassen. Wenn du trotzdem Kontakt aufnehmen möchtest, freue ich mich — ganz unverbindlich.",
      en: "This site is mostly here to give you an impression of who I am. If you'd still like to reach out, I'd be glad to hear from you — no strings attached.",
    } as Localized,
  },
} as const;
