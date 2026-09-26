export const PRICING_ITEMS = [
  {
    number: "01",
    slug: "thesis-dissertation-200-250-pages",
    title: "Thesis / Dissertation",
    scope: "200–250 pages",
    price: "₹42,000",
    description:
      "Research support for a 200–250 page thesis or dissertation, presented with a clear academic structure and defined scope.",
    details: [
      "200–250 page project scope",
      "Research and academic support",
      "Structured project presentation",
      "Formatting and final-document preparation",
    ],
  },
  {
    number: "02",
    slug: "thesis-dissertation-300-pages",
    title: "Thesis / Dissertation",
    scope: "300 pages",
    price: "₹55,000",
    description:
      "Research support for a 300-page thesis or dissertation with a larger project scope and detailed document requirements.",
    details: [
      "300 page project scope",
      "Research and academic support",
      "Structured project presentation",
      "Formatting and final-document preparation",
    ],
  },
  {
    number: "03",
    slug: "research-paper",
    title: "Research Paper",
    scope: "15–20 pages",
    price: "₹8,000",
    description:
      "Focused research-paper support for a 15–20 page academic document, with the work organized around the defined research requirement.",
    details: [
      "15–20 page project scope",
      "Research-focused academic support",
      "Clear document structure",
      "Formatting and final-document preparation",
    ],
  },
  {
    number: "04",
    slug: "review-paper",
    title: "Review Paper",
    scope: "Systematic review",
    price: "₹9,000",
    description:
      "Support for systematic review work, organized around a clearly defined review scope and academic presentation.",
    details: [
      "Systematic review scope",
      "Literature-review organization",
      "Structured academic presentation",
      "Formatting and final-document preparation",
    ],
  },
  {
    number: "05",
    slug: "publication",
    title: "Publication",
    scope: "Publication cost",
    price: "₹18–19k",
    description:
      "Indicative publication pricing for research work that is ready to move through a publication process.",
    details: [
      "Publication-focused support",
      "Indicative publication cost",
      "Submission-ready document preparation",
      "Final requirements reviewed before submission",
    ],
  },
] as const;

export type PricingItem = (typeof PRICING_ITEMS)[number];
