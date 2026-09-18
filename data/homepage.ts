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
    title: "Four connected ways of working with knowledge.",
    intro:
      "Research, intelligence, education, and applied expertise form the core of the organization’s work. The overview stays deliberately high-level; deeper detail belongs to the dedicated experiences that follow.",
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
    title: "Questions first. Evidence next. Understanding follows.",
    description:
      "Research here is framed as a disciplined way of asking better questions, examining evidence, and translating what emerges into useful understanding. The homepage introduces the approach without inventing findings or credentials.",
    featured: {
      status: "Development foundation",
      title: "Research questions, methods, and signals",
      description:
        "A future featured study can occupy this space with its real question, evidence, authorship, and context once the organization's research program is established.",
      meta: ["Question-led", "Evidence-aware", "Application-focused"],
      href: "/research",
    },
    themes: [
      { index: "01", label: "Questions", description: "Frame the problem before deciding what the answer should be." },
      { index: "02", label: "Methods", description: "Make the path from question to evidence visible and understandable." },
      { index: "03", label: "Signals", description: "Identify patterns, changes, and emerging areas worth examining." },
      { index: "04", label: "Application", description: "Connect what is learned to decisions, practice, and further inquiry." },
    ],
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
