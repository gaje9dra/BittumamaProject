export type ServiceStatus = "Available" | "Coming Soon";

export type ServiceHighlight = {
  title: string;
  description: string;
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  audience?: string;
  highlights?: ServiceHighlight[];
  faq?: ServiceFaq[];
  href: string;
  featured?: boolean;
  status?: ServiceStatus;
};

export const services: Service[] = [
  {
    id: "thesis-support",
    title: "Thesis Support",
    slug: "thesis-support",
    category: "Research & Thesis",
    shortDescription: "Thesis assistance, editing and proofreading.",
    audience: "Students and researchers",
    href: "/services/thesis-support",
  },
  {
    id: "dissertation-support",
    title: "Dissertation Support",
    slug: "dissertation-support",
    category: "Research & Thesis",
    shortDescription: "Dissertation assistance, editing and research support.",
    audience: "Students and researchers",
    href: "/services/dissertation-support",
  },
  {
    id: "research-paper",
    title: "Research Paper",
    slug: "research-paper",
    category: "Research & Thesis",
    shortDescription: "Research paper writing, review and editing support.",
    audience: "Students and researchers",
    href: "/services/research-paper",
  },
  {
    id: "literature-review",
    title: "Literature Review",
    slug: "literature-review",
    category: "Research & Thesis",
    shortDescription: "Support for literature search, review and synthesis.",
    audience: "Students and researchers",
    href: "/services/literature-review",
    status: "Coming Soon",
  },
  {
    id: "research-methodology",
    title: "Research Methodology",
    slug: "research-methodology",
    category: "Research & Thesis",
    shortDescription: "Guidance on research methodology and study design.",
    audience: "Students and researchers",
    href: "/services/research-methodology",
    status: "Coming Soon",
  },
  {
    id: "data-analysis",
    title: "Data Analysis",
    slug: "data-analysis",
    category: "Analysis",
    shortDescription: "Statistical analysis, interpretation and visualization.",
    audience: "Students and researchers",
    href: "/services/data-analysis",
  },
  {
    id: "publication-services",
    title: "Publication Services",
    slug: "publication-services",
    category: "Publication",
    shortDescription: "Support for preparing research for publication.",
    audience: "Researchers",
    href: "/services/publication-services",
    status: "Coming Soon",
  },
  {
    id: "mentoring",
    title: "Mentoring",
    slug: "mentoring",
    category: "Mentoring",
    shortDescription: "Ongoing guidance for research work and decisions.",
    audience: "Students and researchers",
    href: "/services/mentoring",
    status: "Coming Soon",
  },
  {
    id: "ai-research-engine",
    title: "AI Research Engine / ResearchQuest",
    slug: "ai-research-engine",
    category: "Research Technology",
    shortDescription: "Research technology for AI-assisted research workflows.",
    audience: "Researchers",
    href: "/services/ai-research-engine",
    status: "Coming Soon",
  },
];

export const serviceCategories = Array.from(
  new Set(services.map((service) => service.category).filter(Boolean)),
);

export function getServicesByCategory(category: string) {
  return services.filter((service) => service.category === category);
}

export function getServiceCategoryAnchor(category: string) {
  const slug = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `service-category-${slug}`;
}

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}

export function getRelatedServices(service: Service) {
  return services.filter(
    (candidate) =>
      candidate.slug !== service.slug &&
      candidate.category === service.category,
  );
}
