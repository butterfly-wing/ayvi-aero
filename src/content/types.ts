// Shape of all user-facing text. Every language file must satisfy `Content`,
// so a missing translation is a type error instead of a blank on the page.

export type Lang = "fr" | "en";

export type ProjectId = "motus" | "d3" | "limics";

export type Project = {
  id: ProjectId;
  date: string;
  title: string;
  summary: string;
  tags: string[];
  image: { src: string; alt: string };
  /** Detail page: what the project is. One string per paragraph. */
  about: string[];
  /** Detail page: what I did. One string per paragraph. */
  role: string[];
  stack: string[];
};

export type Content = {
  meta: { title: string; description: string };
  ui: {
    back: string;
    open: string;
    switchLang: string;
    sections: { hero: string; about: string; path: string; projects: string; contact: string };
    scrollHint: string;
  };
  hero: {
    lastName: string;
    firstName: string;
    role: string;
    /** One-line current situation, shown above the buttons. */
    status: string;
    contactCta: string;
    cvCta: string;
  };
  about: {
    heading: string;
    lead: string;
    paragraphs: string[];
    stackHeading: string;
    stack: string[];
    softHeading: string;
    soft: string[];
  };
  /** "Parcours": education and experience, most recent first. */
  path: {
    heading: string;
    items: { period: string; title: string; place: string; text: string }[];
  };
  projects: {
    heading: string;
    detailAbout: string;
    detailRole: string;
    detailStack: string;
    items: Project[];
  };
  contact: {
    heading: string;
    /** What I am looking for, shown above the links. */
    availability: { title: string; lines: string[] };
    links: { label: string; value: string; href: string }[];
    cv: { label: string; href: string };
    legalLink: string;
  };
  legal: {
    heading: string;
    sections: { title: string; lines: string[] }[];
  };
};
