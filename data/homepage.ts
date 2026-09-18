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
    eyebrow: "Research · Intelligence · Expertise",
    title: "Evidence, expertise, and technology—made useful.",
    description:
      "Bittumama brings research, intelligent technology, education, and applied expertise together to investigate complex questions and turn knowledge into useful understanding.",
    primaryAction: { label: "Explore our work", href: "/research" },
    secondaryAction: { label: "Meet the experts", href: "/experts" },
    meta: "Independent thinking / Applied knowledge",
  },
  positioning: {
    eyebrow: "01 / Positioning",
    title: "Make complex knowledge easier to understand, apply, and act on.",
    description:
      "We connect disciplined research with human expertise and purposeful technology, giving complex questions the context, evidence, and practical direction they need.",
    action: { label: "Learn about our approach", href: "/about" },
    links: [
      {
        label: "Research & AI",
        href: "/research",
        description: "Methods, questions, and emerging intelligence.",
      },
      {
        label: "Services",
        href: "/services",
        description: "Applied capabilities and ways to work together.",
      },
      {
        label: "Experts",
        href: "/experts",
        description: "People, disciplines, and experience behind the work.",
      },
      {
        label: "Insights",
        href: "/insights",
        description: "Articles, perspectives, and knowledge to explore.",
      },
    ] satisfies HomepageLink[],
  },
  capabilities: {
    eyebrow: "02 / Capabilities",
    title: "Different disciplines. One coherent point of view.",
    intro:
      "The capability layer is intentionally presented as a set of editorial signals rather than a grid of interchangeable cards.",
    items: [
      {
        index: "01",
        label: "Research",
        description: "Frame questions, investigate evidence, and surface useful findings.",
        href: "/research",
      },
      {
        index: "02",
        label: "Intelligence",
        description: "Translate complex information into clearer strategic understanding.",
        href: "/research",
      },
      {
        index: "03",
        label: "Education",
        description: "Turn expertise into learning, workshops, and accessible knowledge.",
        href: "/services",
      },
      {
        index: "04",
        label: "Applied expertise",
        description: "Connect specialist knowledge with real-world briefs and outcomes.",
        href: "/services",
      },
    ] satisfies HomepageCapability[],
  },
  intelligence: {
    eyebrow: "03 / Research & intelligence",
    title: "A place for questions worth investigating.",
    description:
      "The future research section can become the homepage's evidence-rich centre: featured work, methods, topics, datasets, and emerging signals can live here without adopting a dashboard aesthetic.",
    labels: ["Research", "Methods", "Topics", "Signals"],
    action: { label: "Explore research", href: "/research" },
  },
  expertise: {
    eyebrow: "04 / Human expertise",
    title: "Technology is useful. Expertise makes it meaningful.",
    description:
      "People should appear as authors, practitioners, educators, and subject-matter experts—not as decorative portraits. This section reserves space for biographies, disciplines, and relevant work.",
    action: { label: "Meet the experts", href: "/experts" },
  },
  insights: {
    eyebrow: "05 / Insights",
    title: "Knowledge with somewhere to go next.",
    description:
      "A restrained editorial index can surface the latest thinking while leaving room for future article metadata, topics, authorship, and search.",
    items: [
      { label: "Featured insight", meta: "Article / Topic", href: "/insights" },
      { label: "Research note", meta: "Research / Method", href: "/insights" },
      { label: "Field perspective", meta: "Perspective / Practice", href: "/insights" },
    ],
  },
  cta: {
    eyebrow: "06 / Continue the conversation",
    title: "Have a question, a brief, or a subject worth exploring?",
    description:
      "The final call to action should feel like the natural continuation of the homepage narrative—not a sales interruption.",
    action: { label: "Get in touch", href: "/contact" },
  },
} as const;
