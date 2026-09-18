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
    title: "Research, analysis, and practical support for complex questions.",
    description:
      "Research support for thesis and dissertation work, research papers, literature reviews, methodology, data analysis, and related academic requirements. Replace this provisional description with the organization’s verified offering before launch.",
    primaryAction: { label: "View Research Services", href: "/services" },
    secondaryAction: { label: "Meet Our Experts", href: "/experts" },
    meta: "Research support / Academic services",
  },
  positioning: {
    eyebrow: "01 / Positioning",
    title: "Research support for academic work that needs structure and specialist input.",
    description:
      "Provisional homepage positioning: support may include thesis and dissertation preparation, literature review, research methodology, data analysis, and academic editing where these are part of the verified offering.",
    action: { label: "View Research Services", href: "/services" },
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
    title: "Research and academic support, organized around real tasks.",
    intro:
      "Provisional capability overview. Replace each item with the organization’s verified capabilities and terminology before launch; do not treat this development content as a claim about the final service catalog.",
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
    title: "Research support built around the question, method, and evidence.",
    description:
      "This provisional section can explain the organization’s actual research-support process, including topic selection, literature review, methodology, analysis, and research-paper preparation where offered. No findings or credentials are implied.",
    featured: {
      status: "Provisional content",
      title: "Research support: topics, methods, literature, and analysis",
      description:
        "Replace this placeholder with a verified research service, research paper, or other real knowledge resource once the organization’s content is available.",
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
  services: {
    eyebrow: "04 / Services & solutions",
    title: "Ways to apply expertise to a real brief.",
    description:
      "The services layer turns research, intelligence, education, and technical capabilities into practical engagements. This is a replaceable homepage overview, not a fixed catalog.",
    items: [
      { index: "01", title: "Research & advisory", description: "Focused research and advisory engagements for questions that need structured inquiry, evidence review, and informed direction.", category: "Research & advisory", audience: "Organizations with a defined question or brief", format: "Focused engagement", href: "/services/research-advisory" },
      { index: "02", title: "Strategy & intelligence", description: "Structured analysis and strategic thinking for teams working through complex information, choices, or changing conditions.", category: "Strategy", audience: "Teams navigating complex decisions", format: "Advisory engagement", href: "/services/strategy-intelligence" },
      { index: "03", title: "Education & training", description: "Learning programs that translate specialist knowledge into clear teaching, practical training, and accessible understanding.", category: "Education & training", audience: "Learners, teams, and professional groups", format: "Program or training", href: "/services/education-training" },
      { index: "04", title: "Technology solutions", description: "Purposeful technology work that helps turn research, knowledge, or operational requirements into usable digital solutions.", category: "Technology", audience: "Teams with a defined technology need", format: "Applied technology engagement", href: "/services/technology-solutions" },
    ],
    action: { label: "View all services", href: "/services" },
  },
  expertise: {
    eyebrow: "04 / Human expertise",
    title: "Verified subject expertise belongs here.",
    description:
      "Expert profiles are not yet available in the project content. Replace this placeholder with verified names, disciplines, qualifications, and relevant work before presenting the section as factual.",
    action: { label: "Meet the experts", href: "/experts" },
  },
  insights: {
    eyebrow: "05 / Insights",
    title: "Research articles and academic resources.",
    description:
      "Article and resource content is not yet available. Replace these placeholders with verified titles, topics, authorship, and publication information before launch.",
    items: [
      { label: "Article title placeholder", meta: "Replace with verified article topic", href: "/insights" },
      { label: "Research resource placeholder", meta: "Replace with verified research topic", href: "/insights" },
      { label: "Academic resource placeholder", meta: "Replace with verified resource type", href: "/insights" },
    ],
  },
  cta: {
    eyebrow: "06 / Continue the conversation",
    title: "Need help with a research or academic requirement?",
    description:
      "Use this contact route for verified services offered by the organization. Replace the provisional wording with the actual contact process and supported requirements before launch.",
    action: { label: "Contact Research Support", href: "/contact" },
  },
} as const;
