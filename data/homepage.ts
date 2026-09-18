export type HomepageLink = {
  label: string;
  href: string;
  description: string;
};

export type HomepageCapability = {
  index: string;
  label: string;
  description: string;
  href: string;
};

export type HomepageEvent = {
  id: string;
  title: string;
  slug: string;
  date: string;
  endDate?: string;
  time?: string;
  category: string;
  location?: string;
  format?: string;
  shortDescription: string;
  registrationLabel?: string;
  href?: string;
  status?: "Upcoming" | "Registration Open" | "Coming Soon" | "Completed";
  featured?: boolean;
};

export type HomepageArticle = {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  author?: string;
  authorRole?: string;
  excerpt?: string;
  image?: string;
  readingTime?: string;
  href?: string;
  featured?: boolean;
  tags?: string[];
};

export const homepageEvents: HomepageEvent[] = [];
export const homepageArticles: HomepageArticle[] = [];

export const homepageContent = {
  hero: {
    eyebrow: "Research Support",
    title: "Thesis & Research Services",
    description:
      "Thesis, dissertation, research paper, literature review, methodology and data analysis support.",
    primaryAction: { label: "View Research Services", href: "/services" },
    secondaryAction: { label: "Meet Our Experts", href: "/experts" },
    meta: "Academic research support",
  },
  positioning: {
    eyebrow: "01 / Positioning",
    title: "Research Support for Academic Work",
    description:
      "Thesis, dissertation, research paper, methodology and data analysis support.",
    action: { label: "View Research Services", href: "/services" },
    links: [
      {
        label: "Research Support",
        href: "/research",
        description: "Research papers, literature review and methodology.",
      },
      {
        label: "Services",
        href: "/services",
        description: "Academic research and analysis services.",
      },
      {
        label: "Experts",
        href: "/experts",
        description: "Subject specialists and research support.",
      },
      {
        label: "Articles",
        href: "/insights",
        description: "Research methods and academic resources.",
      },
    ] satisfies HomepageLink[],
  },
  capabilities: {
    eyebrow: "02 / Capabilities",
    title: "Research & Academic Support",
    intro:
      "Support across research writing, methodology, analysis and academic editing.",
    items: [
      {
        index: "01",
        label: "Research Support",
        description: "Research papers, thesis and dissertation assistance.",
        href: "/research",
      },
      {
        index: "02",
        label: "Literature Review",
        description: "Literature search, review and academic synthesis.",
        href: "/services",
      },
      {
        index: "03",
        label: "Research Methodology",
        description: "Methodology planning and research design support.",
        href: "/services",
      },
      {
        index: "04",
        label: "Data Analysis",
        description: "Statistical analysis, interpretation and visualization.",
        href: "/services",
      },
    ] satisfies HomepageCapability[],
  },
  intelligence: {
    eyebrow: "03 / Research & Analysis",
    title: "Research & Analysis",
    description:
      "Focused support for research questions, methodology, literature and analysis.",
    featured: {
      status: "Research Support",
      title: "Thesis, Dissertation & Research Paper Support",
      description:
        "Support across topic selection, literature review, methodology and data analysis.",
      meta: ["Thesis", "Dissertation", "Research Paper"],
      href: "/research",
    },
    themes: [
      { index: "01", label: "Topic Selection", description: "Research topic and question development." },
      { index: "02", label: "Literature Review", description: "Literature search, review and organization." },
      { index: "03", label: "Methodology", description: "Research design and methodology support." },
      { index: "04", label: "Data Analysis", description: "Analysis, interpretation and visualization." },
    ],
    action: { label: "View Research Services", href: "/research" },
  },
  services: {
    eyebrow: "04 / Services",
    title: "Research Services",
    description:
      "Academic support for writing, editing, methodology and research analysis.",
    items: [
      { index: "01", title: "Thesis Support", description: "Thesis assistance, editing and proofreading.", category: "Thesis", audience: "Students and researchers", format: "Research support", href: "/services/thesis-support" },
      { index: "02", title: "Dissertation Support", description: "Dissertation assistance, editing and research support.", category: "Dissertation", audience: "Students and researchers", format: "Research support", href: "/services/dissertation-support" },
      { index: "03", title: "Research Paper", description: "Research paper writing, review and editing support.", category: "Research Paper", audience: "Students and researchers", format: "Research support", href: "/services/research-paper" },
      { index: "04", title: "Data Analysis", description: "Statistical analysis, interpretation and visualization.", category: "Analysis", audience: "Students and researchers", format: "Analysis support", href: "/services/data-analysis" },
    ],
    action: { label: "View All Services", href: "/services" },
  },
  audience: {
    eyebrow: "06 / Who we support",
    title: "Support for students and researchers.",
    description: "Choose the research requirement that matches your work.",
    items: [
      {
        index: "01",
        title: "Thesis & Dissertation",
        description: "Support for students working on thesis and dissertation requirements.",
        services: [
          { label: "Thesis Support", href: "/services/thesis-support" },
          { label: "Dissertation Support", href: "/services/dissertation-support" },
        ],
      },
      {
        index: "02",
        title: "Research Papers & Analysis",
        description: "Support for researchers and students working on papers and data analysis.",
        services: [
          { label: "Research Paper", href: "/services/research-paper" },
          { label: "Data Analysis", href: "/services/data-analysis" },
        ],
      },
    ],
  },
  process: {
    eyebrow: "07 / How it works",
    title: "Start with your research requirement.",
    description: "A clear path from service selection to research support.",
    steps: [
      {
        number: "01",
        title: "Choose a Service",
        description: "Select the research support you need.",
      },
      {
        number: "02",
        title: "Share Requirements",
        description: "Send your topic and project details.",
      },
      {
        number: "03",
        title: "Confirm Details",
        description: "Discuss the scope and requirements.",
      },
      {
        number: "04",
        title: "Receive Support",
        description: "Proceed with the agreed research service.",
      },
    ],
    action: { label: "Request Support", href: "/contact" },
  },
  trust: {
    eyebrow: "08 / Research scope",
    title: "Specific support for defined academic requirements.",
    description: "The current service scope covers thesis, dissertation, research paper and data analysis support.",
    proof: [
      {
        label: "Thesis & Dissertation",
        description: "Academic support for thesis and dissertation requirements.",
      },
      {
        label: "Research Papers",
        description: "Research paper writing, review and editing support.",
      },
      {
        label: "Research Methodology",
        description: "Research design and methodology support.",
      },
      {
        label: "Data Analysis",
        description: "Statistical analysis, interpretation and visualization.",
      },
    ],
    action: { label: "View Research Services", href: "/services" },
  },
  expertise: {
    eyebrow: "09 / Experts",
    title: "Meet Our Experts",
    description:
      "Subject expertise, research experience and academic support.",
    experts: [],
    action: { label: "Meet Our Experts", href: "/experts" },
  },
  events: {
    eyebrow: "10 / Workshops & Events",
    title: "Research Workshops & Events",
    description: "Upcoming sessions for research, methodology and academic support.",
  },
  insights: {
    eyebrow: "06 / Articles",
    title: "Research Articles & Resources",
    description:
      "Research methodology, academic writing and analysis resources.",
    items: [
      { label: "Research Article", meta: "Research Methodology", href: "/insights" },
      { label: "Academic Resource", meta: "Thesis & Dissertation", href: "/insights" },
      { label: "Research Guide", meta: "Data Analysis", href: "/insights" },
    ],
  },
  cta: {
    eyebrow: "07 / Contact",
    title: "Need Research Support?",
    description:
      "Tell us about your thesis, dissertation, research paper or analysis requirement.",
    action: { label: "Request Support", href: "/contact" },
  },
} as const;
