export type AboutFocusArea = { title: string; description: string };
export type AboutRelationship = { title: string; description: string; href: string; action: string };
export type AboutData = {
  name: string; shortDescription: string; description: string; purpose: string;
  focusAreas: AboutFocusArea[]; approach: string[]; relationships: AboutRelationship[];
  seo: { title: string; description: string };
};

export const about: AboutData = {
  name: "SkillVeda",
  shortDescription: "Research, academic support, analysis and research technology.",
  description: "SkillVeda brings together research support, academic work, data analysis, publication support, mentoring and research-oriented technology.",
  purpose: "SkillVeda exists to bring practical research and academic support together with analysis, knowledge work and research-oriented technology.",
  focusAreas: [
    { title: "Research", description: "Research support, methodology and literature-focused work." },
    { title: "Academic Support", description: "Support around thesis, dissertation and research paper work." },
    { title: "Analysis", description: "Data analysis, statistical interpretation and visualization." },
    { title: "Publication", description: "Support for preparing research work for publication." },
    { title: "Research Technology", description: "Technology-oriented tools and workflows for research." },
  ],
  approach: [
    "Start from the specific research or academic requirement.",
    "Keep methodology, analysis and research work clearly structured.",
    "Use research-oriented technology where it is relevant to the work.",
  ],
  relationships: [
    { title: "Services", description: "Practical support for specific research and academic requirements.", href: "/services", action: "Explore Services" },
    { title: "Research", description: "Research and knowledge work published through the research area.", href: "/research", action: "Explore Research" },
    { title: "Experts", description: "The people and subject expertise behind the organization's work.", href: "/experts", action: "Meet the Experts" },
    { title: "Articles", description: "Accessible articles and insights connected to research and knowledge.", href: "/articles", action: "Read Articles" },
  ],
  seo: {
    title: "About SkillVeda | Organization & Focus",
    description: "Learn what SkillVeda focuses on across research, academic support, analysis, publication and research technology.",
  },
};
