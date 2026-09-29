import type { Content } from "./types";

const en: Content = {
  meta: {
    title: "Viacheslav Zhenikhov, full-stack developer looking for a work-study contract",
    description:
      "Third-year BUT MMI student in web development, looking for a French apprenticeship (work-study) contract. From WebGL shaders to PHP servers.",
  },
  ui: {
    back: "Back",
    open: "View project",
    switchLang: "Passer en français",
    sections: { hero: "Home", about: "About", path: "Background", projects: "Projects", contact: "Contact" },
    scrollHint: "Scroll",
  },
  hero: {
    lastName: "ZHENIKHOV",
    firstName: "Viacheslav",
    role: "Full-stack developer",
    status: "BUT3 MMI · looking for a work-study contract",
    contactCta: "Get in touch",
    cvCta: "My CV",
  },
  about: {
    heading: "About",
    lead: "From shader to server.",
    paragraphs: [
      "My name is Viacheslav. I am in the third year of a BUT MMI (a French three-year technology degree) at IUT de Bobigny, specialising in web development and interactive systems.",
      "What I enjoy is understanding an application all the way down, from the server to what the graphics card draws. The background of this site, for instance, is rendered with hand-written WebGL2 and no 3D library.",
      "I build applications the way a crystal is cut, with few facets and each one clean. Code you can reread without effort beats code that impresses.",
      "At LIMICS I built a complete application on my own, from the first script to production. That is the level of responsibility I am looking for in a work-study position.",
    ],
    stackHeading: "Languages & tools",
    stack: ["JavaScript", "TypeScript", "React", "Tailwind", "PHP", "Bash", "D3.js"],
    softHeading: "How I work",
    soft: [
      "I look for the cause, not the workaround",
      "Autonomous, from first commit to production",
      "I explain technical things without jargon",
      "Readable code over clever code",
      "Ship without leaving debt behind",
    ],
  },
  path: {
    heading: "Background",
    items: [
      {
        period: "2026 – 2027",
        title: "BUT MMI · 3rd year, work-study",
        place: "IUT de Bobigny, Université Sorbonne Paris Nord",
        text: "Web development and interactive systems track. One week at university, one week at the company, and full time at the company during school holidays.",
      },
      {
        period: "May – July 2026",
        title: "Internship · web developer",
        place: "LIMICS, UMR 1142 Inserm, Bobigny",
        text: "I designed and built, alone and from scratch, an application that compares OWL reasoners. It relies on measurement scripts in Bash, a framework-free PHP server, a Java core and interactive charts, and it now runs at the lab.",
      },
      {
        period: "2024 – 2026",
        title: "BUT MMI · 1st and 2nd year",
        place: "IUT de Bobigny, Université Sorbonne Paris Nord",
        text: "Front- and back-end web development, integration, interface design and project management.",
      },
    ],
  },
  projects: {
    heading: "Projects",
    detailAbout: "The project",
    detailRole: "What I did",
    detailStack: "Stack",
    items: [
      {
        id: "limics",
        date: "2026 · May – July",
        title: "OWL reasoner benchmark, internship at LIMICS",
        summary:
          "Six OWL reasoners, about a hundred biomedical ontologies, and one simple question. Which is fastest, and at what memory cost? I built the application that answers it on my own, from the measurement scripts to the charts.",
        tags: ["PHP", "Server", "Shell", "Measurement"],
        image: { src: "/projects/limics-hero.png", alt: "OWL Reasoner Benchmark application interface" },
        about: [
          "Second-year internship at LIMICS (UMR 1142 Inserm), the medical informatics lab on the Bobigny campus.",
          "The researchers wanted to know which OWL reasoner to use for their biomedical ontologies. There are several (Konclude, HermiT, ELK, Openllet, JFact, Sequoia) and none of them wins everywhere.",
          "The application runs them on about a hundred ontologies, measures each one’s time and peak memory, caches the results and shows them as charts. It now runs on a lab server.",
        ],
        role: [
          "I started from a blank page and wrote everything myself. Bash scripts launch and measure the reasoners, a Java core builds on the OWL API, a framework-free PHP server ties it together, and the front end draws the curves.",
          "The hard part was getting honest measurements. One run at a time thanks to a lock, capped memory, and every measurement taken from outside the process. I also handled roles, prepared statements, rate limiting and documentation for whoever takes the project over.",
          "What I took away is that you design for failure, not for the demo, and that one person can carry a project from the first line to production.",
        ],
        stack: ["PHP", "JavaScript", "Bash", "Java"],
      },
      {
        id: "d3",
        date: "2026 · January",
        title: "Interactive map of France in D3.js",
        summary:
          "A map and a chart that talk to each other. Hover a département and the chart follows. An exercise in data, scales and transitions.",
        tags: ["D3", "Map", "SVG", "Chart"],
        image: { src: "/projects/map-d3.png", alt: "Interactive map of France built with D3.js" },
        about: [
          "A course project in D3.js. A map of France and a chart, linked together.",
          "Hovering or selecting a département updates the chart with its data. The map and the chart stay in sync at all times.",
        ],
        role: [
          "I wrote the interactions between the map and the chart and the way data flows from one to the other.",
          "I worked mostly on transitions and scales, so every change stays readable instead of jumping from one state to the next.",
          "This is the project where I really understood how D3 binds data to the DOM.",
        ],
        stack: ["D3.js", "JavaScript", "SVG"],
      },
      {
        id: "motus",
        date: "2025 · December",
        title: "Motus word game in PHP",
        summary:
          "The TV word game rewritten in PHP, with its rules, game states and input validation. A small project, but a chance to cleanly separate logic, data and rendering.",
        tags: ["PHP", "Motus", "MVC", "Structure"],
        image: { src: "/projects/motus.png", alt: "Motus game in PHP" },
        about: [
          "The Motus TV word game, rewritten in PHP. You guess a word in a few tries, and each try shows which letters are right or misplaced.",
          "The project is small, but it has every building block of a real application, with rules, a game state that changes and input to validate.",
        ],
        role: [
          "I kept the game rules, the data handling and the rendering apart, so one can change without breaking the others.",
          "I spent time on edge cases such as words that are too short, unexpected characters or games that are already over.",
          "A good exercise in keeping control of every step of a backend application without a framework.",
        ],
        stack: ["PHP"],
      },
    ],
  },
  contact: {
    heading: "Contact",
    availability: {
      title: "Available for a work-study contract",
      lines: [
        "Contract to be signed before 18 December 2026",
        "Can start from October 2026 to January 2027",
        "1 week at university / 1 week at the company",
        "Full time at the company during school holidays",
      ],
    },
    links: [
      { label: "Email", value: "ayviaero@gmail.com", href: "mailto:ayviaero@gmail.com" },
      { label: "GitHub", value: "github.com/butterfly-wing", href: "https://github.com/butterfly-wing" },
      { label: "LinkedIn", value: "linkedin.com/in/ayvi-aero", href: "https://www.linkedin.com/in/ayvi-aero" },
    ],
    cv: { label: "Download my CV", href: "/cv/Viacheslav_Zhenikhov_CV.pdf" },
    legalLink: "Legal notice",
  },
  legal: {
    heading: "Legal notice",
    sections: [
      {
        title: "Publisher",
        lines: ["Viacheslav Zhenikhov", "ayviaero@gmail.com"],
      },
      {
        title: "Hosting",
        lines: ["OVH SAS", "2 rue Kellermann, 59100 Roubaix, France", "ovhcloud.com"],
      },
      {
        title: "Intellectual property",
        lines: [
          "All content on this site (text, code, visuals, animations and graphics) is protected by copyright.",
          "Any reproduction, representation or distribution, in whole or in part, without prior permission is prohibited.",
        ],
      },
      {
        title: "Liability",
        lines: [
          "Information on this site is provided for guidance only. Despite the care taken, the publisher cannot be held responsible for errors or omissions.",
        ],
      },
      {
        title: "Personal data",
        lines: [
          "This site sets no cookies and collects no personal data. Only your language choice is stored in your browser.",
          "Any data sent through the contact channels is used solely for professional exchange and is never shared with third parties.",
        ],
      },
    ],
  },
};

export default en;
