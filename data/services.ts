export type ServiceStatus = "Available" | "Coming Soon";

export type Service = {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  audience?: string;
  href: string;
  featured?: boolean;
  status?: ServiceStatus;
};

export const services: Service[] = [
  {
    id: "thesis-support",
    title: "Thesis Support",
    slug: "thesis-support",
    category: "Research & Academic Support",
    shortDescription: "Thesis assistance, editing and proofreading.",
    audience: "Students and researchers",
    href: "/services/thesis-support",
  },
  {
    id: "dissertation-support",
    title: "Dissertation Support",
    slug: "dissertation-support",
    category: "Research & Academic Support",
    shortDescription: "Dissertation assistance, editing and research support.",
    audience: "Students and researchers",
    href: "/services/dissertation-support",
  },
  {
    id: "research-paper",
    title: "Research Paper",
    slug: "research-paper",
    category: "Research & Academic Support",
    shortDescription: "Research paper writing, review and editing support.",
    audience: "Students and researchers",
    href: "/services/research-paper",
  },
  {
    id: "data-analysis",
    title: "Data Analysis",
    slug: "data-analysis",
    category: "Research & Academic Support",
    shortDescription: "Statistical analysis, interpretation and visualization.",
    audience: "Students and researchers",
    href: "/services/data-analysis",
  },
];
