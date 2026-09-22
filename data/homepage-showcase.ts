export type HomepageShowcaseSlide = {
  id: string;
  label: string;
  image: string;
  alt: string;
};

export const homepageShowcaseSlides: HomepageShowcaseSlide[] = [
  {
    id: "research-writing",
    label: "Research / Writing",
    image: "/images/home/showcase/research-writing.svg",
    alt: "Editorial research workspace with papers, annotations, a research chart, and structured methodology notes.",
  },
  {
    id: "expert-guidance",
    label: "Expert Guidance",
    image: "/images/home/showcase/expert-research.svg",
    alt: "Editorial research consultation composition with an expert figure, academic material, and a structured research framework.",
  },
  {
    id: "data-analysis",
    label: "Data / Analysis",
    image: "/images/home/showcase/data-analysis.svg",
    alt: "Research data analysis composition with an evidence map, table, chart, and methodology notes.",
  },
];
