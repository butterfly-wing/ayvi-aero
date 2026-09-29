import type { Content } from "./types";

const fr: Content = {
  meta: {
    title: "Viacheslav Zhenikhov, développeur full-stack en recherche d’apprentissage",
    description:
      "Étudiant en 3e année de BUT MMI, parcours développement web, à la recherche d’un contrat d’apprentissage. Du shader WebGL au serveur PHP.",
  },
  ui: {
    back: "Retour",
    open: "Voir le projet",
    switchLang: "Switch to English",
    sections: { hero: "Accueil", about: "À propos", path: "Parcours", projects: "Projets", contact: "Contact" },
    scrollHint: "Défiler",
  },
  hero: {
    lastName: "ZHENIKHOV",
    firstName: "Viacheslav",
    role: "Développeur full-stack",
    status: "BUT3 MMI · en recherche d’apprentissage",
    contactCta: "Me contacter",
    cvCta: "Mon CV",
  },
  about: {
    heading: "À propos",
    lead: "Du shader au serveur.",
    paragraphs: [
      "Je m’appelle Viacheslav. Je suis en 3e année de BUT MMI à l’IUT de Bobigny, parcours Développement web et dispositifs interactifs.",
      "Ce qui m’intéresse, c’est comprendre une application jusqu’au bout, du serveur jusqu’à ce que dessine la carte graphique. Le fond de ce site, par exemple, est rendu en WebGL2 écrit à la main, sans bibliothèque 3D.",
      "Je conçois une application comme on taille un cristal, avec peu de facettes et chacune nette. Un code qu’on relit sans effort vaut mieux qu’un code impressionnant.",
      "Au LIMICS, j’ai construit seul une application complète, du premier script à la mise en service. C’est ce niveau de responsabilité que je cherche en apprentissage.",
    ],
    stackHeading: "Langages & outils",
    stack: ["JavaScript", "TypeScript", "React", "Tailwind", "PHP", "Bash", "D3.js"],
    softHeading: "Ma façon de travailler",
    soft: [
      "Je cherche la cause, pas le contournement",
      "Autonome, du premier commit à la mise en production",
      "J’explique le technique sans jargon",
      "Du code lisible plutôt que malin",
      "Livrer sans laisser de dette derrière moi",
    ],
  },
  path: {
    heading: "Parcours",
    items: [
      {
        period: "2026 – 2027",
        title: "BUT MMI · 3e année, en alternance",
        place: "IUT de Bobigny, Université Sorbonne Paris Nord",
        text: "Parcours Développement web et dispositifs interactifs. Une semaine à l’IUT, une semaine en entreprise, et à temps plein en entreprise pendant les vacances scolaires.",
      },
      {
        period: "Mai – juillet 2026",
        title: "Stage · développeur web",
        place: "LIMICS, UMR 1142 Inserm, Bobigny",
        text: "J’ai conçu et développé seul, à partir de zéro, une application qui compare des raisonneurs OWL. Elle repose sur des scripts de mesure en Bash, un serveur PHP sans framework, un cœur Java et des graphiques interactifs, et tourne aujourd’hui au laboratoire.",
      },
      {
        period: "2024 – 2026",
        title: "BUT MMI · 1re et 2e année",
        place: "IUT de Bobigny, Université Sorbonne Paris Nord",
        text: "Développement web front et back, intégration, conception d’interfaces et gestion de projet.",
      },
    ],
  },
  projects: {
    heading: "Mes projets",
    detailAbout: "Le projet",
    detailRole: "Ce que j’ai fait",
    detailStack: "Stack",
    items: [
      {
        id: "limics",
        date: "2026 · Mai – Juillet",
        title: "Benchmark de raisonneurs OWL, stage au LIMICS",
        summary:
          "Six raisonneurs OWL, une centaine d’ontologies biomédicales, et une question simple. Lequel est le plus rapide, et à quel prix en mémoire ? J’ai construit seul l’application qui y répond, des scripts de mesure jusqu’aux graphiques.",
        tags: ["PHP", "Serveur", "Shell", "Mesure"],
        image: { src: "/projects/limics-hero.png", alt: "Interface de l’application OWL Reasoner Benchmark" },
        about: [
          "Stage de deuxième année au LIMICS (UMR 1142 Inserm), le laboratoire d’informatique médicale du campus de Bobigny.",
          "Les chercheurs voulaient savoir quel raisonneur OWL choisir pour leurs ontologies biomédicales. Il en existe plusieurs (Konclude, HermiT, ELK, Openllet, JFact, Sequoia) et aucun n’est le meilleur partout.",
          "L’application les fait tourner sur une centaine d’ontologies, mesure le temps et le pic de mémoire de chacun, garde les résultats en cache et les affiche en graphiques. Elle tourne aujourd’hui sur un serveur du laboratoire.",
        ],
        role: [
          "Je suis parti d’une page blanche et j’ai tout écrit seul. Des scripts Bash lancent et mesurent les raisonneurs, un cœur Java s’appuie sur l’OWL API, un serveur PHP sans framework fait le lien, et l’interface affiche les courbes.",
          "Le plus délicat était d’obtenir des mesures honnêtes. Une seule exécution à la fois grâce à un verrou, une mémoire plafonnée, et chaque mesure prise depuis l’extérieur du processus. J’ai aussi géré les rôles, les requêtes préparées, la limitation de débit et la documentation pour la personne qui reprendra le projet.",
          "J’en retiens qu’on conçoit pour la panne et pas pour la démo, et qu’on peut mener un projet seul de la première ligne à la mise en service.",
        ],
        stack: ["PHP", "JavaScript", "Bash", "Java"],
      },
      {
        id: "d3",
        date: "2026 · Janvier",
        title: "Carte de France interactive en D3.js",
        summary:
          "Une carte et un graphique qui se répondent. On survole un département et le graphique suit. Un exercice sur les données, les échelles et les transitions.",
        tags: ["D3", "Carte", "SVG", "Graphique"],
        image: { src: "/projects/map-d3.png", alt: "Carte interactive de la France réalisée avec D3.js" },
        about: [
          "Un projet de cours en D3.js. Une carte de France et un graphique, reliés entre eux.",
          "Quand on survole ou sélectionne un département, le graphique se met à jour avec ses données. La carte et le graphique restent synchronisés en permanence.",
        ],
        role: [
          "J’ai écrit les interactions entre la carte et le graphique et la façon dont les données passent de l’un à l’autre.",
          "J’ai surtout travaillé les transitions et les échelles, pour que chaque changement reste lisible au lieu de sauter d’un état à l’autre.",
          "C’est avec ce projet que j’ai vraiment compris comment D3 lie les données au DOM.",
        ],
        stack: ["D3.js", "JavaScript", "SVG"],
      },
      {
        id: "motus",
        date: "2025 · Décembre",
        title: "Jeu Motus en PHP",
        summary:
          "Le jeu télévisé réécrit en PHP, avec ses règles, ses états de partie et la validation des saisies. Un petit projet, mais l’occasion de bien séparer la logique, les données et l’affichage.",
        tags: ["PHP", "Motus", "MVC", "Structure"],
        image: { src: "/projects/motus.png", alt: "Jeu Motus en PHP" },
        about: [
          "Le jeu télévisé Motus, réécrit en PHP. On devine un mot en quelques essais, et chaque essai révèle les lettres bien ou mal placées.",
          "Le projet est petit, mais il a toutes les briques d’une vraie application avec des règles, un état de partie qui évolue et des saisies à contrôler.",
        ],
        role: [
          "J’ai séparé les règles du jeu, le traitement des données et l’affichage, pour qu’on puisse modifier l’un sans casser les autres.",
          "J’ai passé du temps sur les cas limites comme les mots trop courts, les caractères inattendus ou les parties déjà terminées.",
          "Un bon exercice pour garder le contrôle de chaque étape d’une application backend sans framework.",
        ],
        stack: ["PHP"],
      },
    ],
  },
  contact: {
    heading: "Contact",
    availability: {
      title: "Disponible pour un contrat d’apprentissage",
      lines: [
        "Signature du contrat avant le 18 décembre 2026",
        "Démarrage possible d’octobre 2026 à janvier 2027",
        "1 semaine à l’IUT / 1 semaine en entreprise",
        "À temps plein en entreprise pendant les vacances scolaires",
      ],
    },
    links: [
      { label: "Email", value: "ayviaero@gmail.com", href: "mailto:ayviaero@gmail.com" },
      { label: "GitHub", value: "github.com/butterfly-wing", href: "https://github.com/butterfly-wing" },
      { label: "LinkedIn", value: "linkedin.com/in/ayvi-aero", href: "https://www.linkedin.com/in/ayvi-aero" },
    ],
    cv: { label: "Télécharger mon CV", href: "/cv/Viacheslav_Zhenikhov_CV.pdf" },
    legalLink: "Mentions légales",
  },
  legal: {
    heading: "Mentions légales",
    sections: [
      {
        title: "Éditeur du site",
        lines: ["Viacheslav Zhenikhov", "ayviaero@gmail.com"],
      },
      {
        title: "Hébergement",
        lines: ["OVH SAS", "2 rue Kellermann, 59100 Roubaix, France", "ovhcloud.com"],
      },
      {
        title: "Propriété intellectuelle",
        lines: [
          "L’ensemble des contenus présents sur ce site (textes, code, visuels, animations et éléments graphiques) est protégé par le droit d’auteur.",
          "Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation préalable est interdite.",
        ],
      },
      {
        title: "Responsabilité",
        lines: [
          "Les informations fournies sur ce site sont données à titre indicatif. Malgré le soin apporté à leur exactitude, l’éditeur ne saurait être tenu responsable des erreurs ou omissions.",
        ],
      },
      {
        title: "Données personnelles",
        lines: [
          "Ce site ne dépose aucun cookie et ne collecte aucune donnée personnelle. Seule la langue choisie est enregistrée dans votre navigateur.",
          "Les données éventuellement transmises via les moyens de contact sont utilisées uniquement dans le cadre d’un échange professionnel et ne sont jamais cédées à des tiers.",
        ],
      },
    ],
  },
};

export default fr;
