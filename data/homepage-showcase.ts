export type HomepageShowcaseSlide = {
  id: string;
  image: string;
  alt: string;
};

export const homepageShowcaseSlides: HomepageShowcaseSlide[] = [
  {
    id: "research-writing",
    image: "/images/home/showcase/research-writing.svg",
    alt: "Editorial research composition with layered academic pages, annotations, citation marks, and a methodology diagram.",
  },
  {
    id: "expert-guidance",
    image: "/images/home/showcase/expert-research.svg",
    alt: "Research consultation composition with an expert figure, annotated documents, review marks, and a structured research framework.",
  },
  {
    id: "data-analysis",
    image: "/images/home/showcase/data-analysis.svg",
    alt: "Research analysis composition with statistical plots, structured data tables, evidence mapping, and methodology notes.",
  },
];
