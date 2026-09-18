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
  expertise: {
    eyebrow: "05 / Experts",
    title: "Meet Our Experts",
    description:
      "Subject expertise, research experience and academic support.",
    action: { label: "Meet Our Experts", href: "/experts" },
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
