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
  need?: string;
  focus?: string;
  audience?: string;
  highlights?: ServiceHighlight[];
  faq?: ServiceFaq[];
  featured?: boolean;
  status?: ServiceStatus;
};

export const services: Service[] = [
  {
    id: "research-support",
    title: "Research Support",
    slug: "research-support",
    category: "Research",
    shortDescription: "Research guidance for topic selection, planning and related research work.",
    need: "Broader research support",
    focus: "Research planning and guidance",
    audience: "Students and researchers",
    status: "Coming Soon",
  },
  {
    id: "research-methodology",
    title: "Research Methodology",
    slug: "research-methodology",
    category: "Research",
    shortDescription: "Guidance on research methodology and study design.",
    need: "Methodology support",
    focus: "Methodology and study design",
    audience: "Students and researchers",
    status: "Coming Soon",
  },
  {
    id: "literature-review",
    title: "Literature Review",
    slug: "literature-review",
    category: "Research",
    shortDescription: "Support for literature search, review and synthesis.",
    need: "Literature review support",
    focus: "Literature search and synthesis",
    audience: "Students and researchers",
    status: "Coming Soon",
  },
  {
    id: "thesis-support",
    title: "Thesis Support",
    slug: "thesis-support",
    category: "Thesis & Academic Work",
    shortDescription: "Thesis assistance, editing and proofreading.",
    need: "Thesis support",
    focus: "Thesis research and academic work",
    audience: "Students and researchers",
  },
  {
    id: "dissertation-support",
    title: "Dissertation Support",
    slug: "dissertation-support",
    category: "Thesis & Academic Work",
    shortDescription: "Dissertation assistance, editing and research support.",
    need: "Dissertation support",
    focus: "Dissertation research and academic work",
    audience: "Students and researchers",
  },
  {
    id: "research-paper",
    title: "Research Paper",
    slug: "research-paper",
    category: "Thesis & Academic Work",
    shortDescription: "Research paper writing, review and editing support.",
    need: "Research paper support",
    focus: "Research paper preparation and review",
    audience: "Students and researchers",
  },
  {
    id: "mentoring",
    title: "Mentoring",
    slug: "mentoring",
    category: "Mentoring",
    shortDescription: "Ongoing guidance for research work and academic decisions.",
    need: "Ongoing research guidance",
    focus: "Research guidance",
    audience: "Students and researchers",
    status: "Coming Soon",
  },
  {
    id: "data-analysis",
    title: "Data Analysis",
    slug: "data-analysis",
    category: "Analysis",
    shortDescription: "Statistical analysis, interpretation and visualization.",
    need: "Statistical or data analysis",
    focus: "Statistical analysis and visualization",
    audience: "Students and researchers",
  },
  {
    id: "analytical-services",
    title: "Analytical Services",
    slug: "analytical-services",
    category: "Analysis",
    shortDescription: "Analytical support for research data, interpretation and related analysis.",
    need: "Analytical support",
    focus: "Research data and interpretation",
    audience: "Students and researchers",
    status: "Coming Soon",
  },
  {
    id: "publication-services",
    title: "Publication Services",
    slug: "publication-services",
    category: "Publication",
    shortDescription: "Support for preparing research work for publication.",
    need: "Publication support",
    focus: "Research publication preparation",
    audience: "Researchers",
    status: "Coming Soon",
  },
  {
    id: "ai-research-engine",
    title: "AI Research Engine / ResearchQuest",
    slug: "ai-research-engine",
    category: "Research Technology",
    shortDescription: "Research technology for AI-assisted research workflows.",
    need: "AI-assisted research capabilities",
    focus: "AI-assisted research workflows",
    audience: "Researchers",
    status: "Coming Soon",
  },
];

export function getAllServices() {
  return services;
}

export function getServiceHref(service: Pick<Service, "slug">) {
  return "/services/" + service.slug;
}

export function getServiceById(id: string) {
  return services.find((service) => service.id === id);
}

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}

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

export function getRelatedServices(service: Service) {
  return services.filter(
    (candidate) =>
      candidate.slug !== service.slug &&
      candidate.category === service.category,
  );
}


export function validateServices(records: readonly Service[] = services) {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const service of records) {
    if (!service.id || !service.title || !service.slug) {
      throw new Error("Every service must have an id, title and slug.");
    }

    if (ids.has(service.id)) {
      throw new Error(`Duplicate service id: ${service.id}`);
    }
    ids.add(service.id);

    if (slugs.has(service.slug)) {
      throw new Error(`Duplicate service slug: ${service.slug}`);
    }
    slugs.add(service.slug);

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(service.slug)) {
      throw new Error(`Invalid service slug: ${service.slug}`);
    }
  }

  return true;
}

validateServices();
