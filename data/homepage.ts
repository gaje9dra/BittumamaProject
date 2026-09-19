import { getServiceById, getServiceHref, type Service } from "@/data/services";

export const homepageContent = {
  hero: {
    eyebrow: "Research Support",
    title: "Thesis & Research Services",
    description:
      "Thesis, dissertation, research paper, literature review, methodology and data analysis support.",
    primaryAction: { label: "View Research Services", href: "/services" },
    secondaryAction: { label: "Meet Our Experts", href: "/experts" },
  },

  positioning: {
    eyebrow: "Positioning",
    title: "Research Support for Academic Work",
    description:
      "Thesis, dissertation, research paper, methodology and data analysis support.",
    action: { label: "View Research Services", href: "/services" },
  },

  intelligence: {
    eyebrow: "Research & Analysis",
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
    action: { label: "Explore Research", href: "/research" },
  },

  audience: {
    eyebrow: "Who we support",
    title: "Support for students and researchers.",
    description: "Choose the research requirement that matches your work.",
    items: [
      {
        index: "01",
        title: "Thesis & Dissertation",
        description: "Support for students working on thesis and dissertation requirements.",
        services: ["thesis-support", "dissertation-support"]
          .map((id) => getServiceById(id))
          .filter((service): service is Service => Boolean(service))
          .map((service) => ({ label: service.title, href: getServiceHref(service) })),
      },
      {
        index: "02",
        title: "Research Papers & Analysis",
        description: "Support for researchers and students working on papers and data analysis.",
        services: ["research-paper", "data-analysis"]
          .map((id) => getServiceById(id))
          .filter((service) => Boolean(service))
          .map((service) => ({ label: service!.title, href: getServiceHref(service!) })),
      },
    ],
  },

  process: {
    eyebrow: "How it works",
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
    action: { label: "Start an Enquiry", href: "/contact" },
  },
} as const;
