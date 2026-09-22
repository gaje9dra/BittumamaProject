import { globalPresenceCities, type GlobalPresenceCity } from "@/data/global-presence";
import { canonicalServiceSlugs } from "@/data/services";

export type LocationProcessStep = {
  title: string;
  description: string;
};

export type LocationPage = GlobalPresenceCity & {
  heading: string;
  introduction: string;
  clientContext: string;
  deliveryApproach: string;
  supportAreas: string[];
  serviceSlugs: readonly string[];
  process: readonly LocationProcessStep[];
  seoTitle: string;
  seoDescription: string;
};

type LocationContent = Omit<LocationPage, keyof GlobalPresenceCity>;

const process = (scope: string, support: string, review: string): LocationProcessStep[] => [
  { title: "Requirement", description: "Start with the research, thesis, paper, analysis or editing requirement and the material already available." },
  { title: "Scope", description: scope },
  { title: "Research support", description: support },
  { title: "Review & delivery", description: review },
];

const locationContent: Record<string, LocationContent> = {
  "new-york": {
    heading: "Research Support in New York",
    introduction: "For clients in New York, Bittumama brings research writing, quantitative support and thesis or dissertation assistance into one remote service workflow.",
    clientContext: "The service mix is suited to research papers, literature-led projects, analysis-heavy work and longer thesis or dissertation projects.",
    deliveryApproach: "New York enquiries can begin with the research question, existing draft or dataset. The requested service is then matched to the relevant research, writing, analysis or editing scope.",
    supportAreas: ["Research papers", "Literature reviews", "Data analysis", "Thesis & dissertation support"],
    serviceSlugs: ["research-paper", "literature-review", "statistical-analytical-support", "data-analysis-visualization", "thesis-assistance", "dissertation-assistance", "thesis-editing-proofreading"],
    process: process("Define the paper, analysis or thesis scope before selecting the most relevant service.", "Work is organised around supplied research material, writing requirements, datasets and the agreed service scope.", "The requested output is reviewed against the stated requirement before the service is delivered."),
    seoTitle: "Research Services in New York | Bittumama",
    seoDescription: "Research writing, analysis, thesis, dissertation and academic editing support for clients in New York."
  },
  "london": {
    heading: "Academic & Research Services for Clients in London",
    introduction: "Bittumama supports London-based clients with dissertation, research paper, literature review, editing and analytical work through a remote academic support process.",
    clientContext: "The page focuses on research-led assignments and longer academic projects where structure, evidence, analysis and editorial clarity matter.",
    deliveryApproach: "A London enquiry can be framed around the project stage—topic, literature, draft, analysis or final editing—so the relevant service can be selected without creating a separate local service system.",
    supportAreas: ["Dissertations", "Research papers", "Academic editing", "Statistical analysis"],
    serviceSlugs: ["dissertation-assistance", "research-paper", "literature-review", "thesis-editing-proofreading", "research-guidance", "statistical-analytical-support"],
    process: process("Map the dissertation or paper requirement to the material and academic stage already reached.", "Support can focus on research structure, writing, literature, analysis or refinement according to the selected service.", "The supplied work and requested scope are checked before the final assisted output is delivered."),
    seoTitle: "Research Services in London | Bittumama",
    seoDescription: "Dissertation, research paper, literature review, editing and analytical support for clients in London."
  },
  "dubai": {
    heading: "Research Services for Clients in Dubai",
    introduction: "Clients in Dubai can use Bittumama for thesis assistance, research writing, analysis, editing and international research paper support through a remote workflow.",
    clientContext: "The service selection brings together thesis work, research papers, analytical support and international conference-oriented research services.",
    deliveryApproach: "The request is scoped around the actual academic deliverable rather than a local branch: thesis stage, paper requirement, dataset, editing need or international research objective.",
    supportAreas: ["Thesis assistance", "Research writing", "Data analysis", "International research papers"],
    serviceSlugs: ["thesis-assistance", "research-paper", "international-research-paper", "international-conference-research-paper", "data-analysis-visualization", "research-guidance"],
    process: process("Clarify the thesis, paper, analysis or international research deliverable and the material supplied.", "Select the canonical service that matches the project stage and work through the agreed research or writing scope.", "Review the requested output and revisions, then deliver through the established enquiry process."),
    seoTitle: "Research Services in Dubai | Bittumama",
    seoDescription: "Thesis, research writing, analysis and international research paper support for clients in Dubai."
  },
  "tokyo": {
    heading: "Research & Academic Support in Tokyo",
    introduction: "Bittumama provides clients in Tokyo with research paper, analysis, academic editing and international research support without creating a separate city operation.",
    clientContext: "The curated services cover research-led writing, quantitative or visual analysis, editorial refinement and international research papers.",
    deliveryApproach: "Tokyo enquiries can start from a research topic, draft, dataset or paper requirement. Bittumama then routes the requirement through the existing service catalogue.",
    supportAreas: ["Research papers", "Analysis", "Academic editing", "International research"],
    serviceSlugs: ["research-paper", "data-analysis-visualization", "statistical-analytical-support", "thesis-editing-proofreading", "international-research-paper", "research-guidance"],
    process: process("Identify the research output and separate writing, analysis and editing requirements where useful.", "Apply the selected canonical service to the supplied research material, data or draft.", "Review the agreed deliverable for structure and requested revisions before delivery."),
    seoTitle: "Research Services in Tokyo | Bittumama",
    seoDescription: "Research papers, analysis, academic editing and international research support for clients in Tokyo."
  },
  "singapore": {
    heading: "Research Services for Clients in Singapore",
    introduction: "For Singapore-based clients, Bittumama combines research writing, analytical support, guidance and structured academic assistance in a remote service workflow.",
    clientContext: "The emphasis is on projects that need clear research structure, evidence handling, data interpretation or refinement of academic material.",
    deliveryApproach: "Requirements are assessed from the project brief and supplied material, then connected to the appropriate existing Bittumama service rather than a location-specific package.",
    supportAreas: ["Research writing", "Research guidance", "Analytics", "Academic refinement"],
    serviceSlugs: ["research-paper", "research-guidance", "statistical-analytical-support", "data-analysis-visualization", "literature-review", "thesis-editing-proofreading"],
    process: process("Define the research question, current project stage and the exact form of support required.", "Combine writing, guidance or analysis only where those needs are covered by the selected canonical services.", "Review the requested scope and supplied material before delivering the assisted work."),
    seoTitle: "Research Services in Singapore | Bittumama",
    seoDescription: "Research writing, guidance, analytics and academic refinement support for clients in Singapore."
  },
  "sydney": {
    heading: "Thesis & Research Support in Sydney",
    introduction: "Bittumama supports clients in Sydney with thesis, dissertation, research and editing services through a remote academic support model.",
    clientContext: "The curated mix is intended for longer research projects as well as papers and drafts that need editorial or structural attention.",
    deliveryApproach: "Sydney enquiries can begin at topic selection, research development, chapter drafting or editing. The requirement is connected to the existing canonical service catalogue.",
    supportAreas: ["Thesis projects", "Dissertations", "Research development", "Editing"],
    serviceSlugs: ["thesis-assistance", "dissertation-assistance", "research-wing", "topic-selection", "thesis-editing-proofreading", "research-guidance"],
    process: process("Place the thesis or dissertation request in context with the topic, existing chapters and current research stage.", "Support the defined research, writing or editing task using the relevant Bittumama service.", "Review the work against the supplied brief and incorporate the requested revisions within scope."),
    seoTitle: "Research Services in Sydney | Bittumama",
    seoDescription: "Thesis, dissertation, research development and academic editing support for clients in Sydney."
  },
  "paris": {
    heading: "Research Services for Clients in Paris",
    introduction: "Clients in Paris can access Bittumama support for research papers, literature reviews, international research work and academic refinement.",
    clientContext: "The service curation suits research projects where literature, paper structure, international research requirements or editorial review form the main need.",
    deliveryApproach: "A Paris request stays within the existing Bittumama service architecture: the client shares the requirement and relevant material, then the matching canonical service is selected.",
    supportAreas: ["Research papers", "Literature reviews", "International research", "Paper review"],
    serviceSlugs: ["research-paper", "literature-review", "international-research-paper", "paper-review", "international-conference-research-paper", "thesis-editing-proofreading"],
    process: process("Scope the paper or literature requirement and identify the relevant research stage.", "Work through the selected writing, literature, review or international research service.", "Check the requested output and revisions before delivery through the established workflow."),
    seoTitle: "Research Services in Paris | Bittumama",
    seoDescription: "Research papers, literature reviews, international research and academic review support for clients in Paris."
  },
  "toronto": {
    heading: "Thesis & Research Services in Toronto",
    introduction: "Bittumama supports clients in Toronto with thesis and dissertation work, data analysis and research guidance through a remote service process.",
    clientContext: "The curated services cover longer academic projects alongside analysis and guidance needs that arise during research development.",
    deliveryApproach: "Toronto clients can describe their research stage, existing material and analysis requirement so the enquiry can be connected to the relevant canonical service.",
    supportAreas: ["Thesis & dissertation", "Data analysis", "Research guidance", "Literature"],
    serviceSlugs: ["thesis-assistance", "dissertation-assistance", "data-analysis-visualization", "research-guidance", "statistical-analytical-support", "literature-review"],
    process: process("Define the thesis or dissertation stage and identify any separate data, literature or guidance requirement.", "Use the selected service for the research, analysis or refinement task described in the enquiry.", "Review the agreed deliverable and requested revisions before completing the service."),
    seoTitle: "Research Services in Toronto | Bittumama",
    seoDescription: "Thesis, dissertation, data analysis and research guidance support for clients in Toronto."
  },
  "berlin": {
    heading: "Research & Academic Support in Berlin",
    introduction: "For clients in Berlin, Bittumama provides research, analytical, academic editing and international research support through its existing service catalogue.",
    clientContext: "The location page brings together research development, analysis, editorial refinement and international research work rather than a separate local offering.",
    deliveryApproach: "A Berlin requirement is scoped from the project brief and existing research material, then routed to the canonical service that covers the need.",
    supportAreas: ["Research development", "Analysis", "Academic editing", "International research"],
    serviceSlugs: ["research-wing", "statistical-analytical-support", "thesis-editing-proofreading", "international-research-paper", "research-guidance", "paper-review"],
    process: process("Identify whether the main requirement is research development, analysis, review or international research.", "Apply the relevant service to the supplied research material, draft or dataset.", "Review the requested result for scope and revisions before delivery."),
    seoTitle: "Research Services in Berlin | Bittumama",
    seoDescription: "Research, analysis, academic editing and international research support for clients in Berlin."
  },
  "shanghai": {
    heading: "Research Paper Support in Shanghai",
    introduction: "Bittumama supports clients in Shanghai with research papers, international research, data analysis and academic editing through a remote workflow.",
    clientContext: "The curated services address paper development, international research requirements, evidence-led analysis and editorial refinement.",
    deliveryApproach: "The service relationship begins with the research requirement and supplied material; the city page does not imply a physical Bittumama office in Shanghai.",
    supportAreas: ["Research papers", "International research", "Data analysis", "Editing"],
    serviceSlugs: ["research-paper", "international-research-paper", "data-analysis-visualization", "thesis-editing-proofreading", "international-conference-research-paper", "paper-review"],
    process: process("Clarify the paper or international research objective and the current stage of the project.", "Work on the selected research, analysis or editing scope using the supplied material.", "Review the output and requested revisions before delivery."),
    seoTitle: "Research Services in Shanghai | Bittumama",
    seoDescription: "Research paper, international research, data analysis and academic editing support for clients in Shanghai."
  },
  "sao-paulo": {
    heading: "Research & Thesis Support in São Paulo",
    introduction: "Clients in São Paulo can use Bittumama for research papers, thesis support, data analysis and academic editing within the existing remote service model.",
    clientContext: "The service mix covers research-led writing, thesis development, analysis and refinement of academic material.",
    deliveryApproach: "São Paulo enquiries are scoped from the actual research requirement and connected to the relevant Bittumama service without introducing local pricing or operations.",
    supportAreas: ["Research papers", "Thesis support", "Data analysis", "Editing"],
    serviceSlugs: ["research-paper", "thesis-assistance", "data-analysis-visualization", "thesis-editing-proofreading", "literature-review", "research-guidance"],
    process: process("Set the research paper or thesis scope around the topic, material and project stage.", "Use the appropriate writing, analysis, guidance or editing service for the defined task.", "Review the requested deliverable and revisions before completing the service."),
    seoTitle: "Research Services in São Paulo | Bittumama",
    seoDescription: "Research papers, thesis support, data analysis and academic editing for clients in São Paulo."
  },
  "amsterdam": {
    heading: "Research Services for Clients in Amsterdam",
    introduction: "Bittumama supports clients in Amsterdam with research development, dissertation work, paper review and analysis through a remote academic service workflow.",
    clientContext: "The curated services are suited to projects that need research structure, dissertation support, literature or analytical review.",
    deliveryApproach: "Clients can start with a research brief, draft, literature set or dataset; Bittumama maps that requirement to the existing canonical services.",
    supportAreas: ["Research development", "Dissertations", "Paper review", "Analysis"],
    serviceSlugs: ["research-wing", "dissertation-assistance", "paper-review", "statistical-analytical-support", "literature-review", "data-analysis-visualization"],
    process: process("Identify the research stage and whether the priority is development, dissertation support, review or analysis.", "Work through the selected canonical service using the supplied research materials.", "Check the work against the agreed requirement and requested revisions before delivery."),
    seoTitle: "Research Services in Amsterdam | Bittumama",
    seoDescription: "Research development, dissertation, paper review and analytical support for clients in Amsterdam."
  },
  "melbourne": {
    heading: "Thesis & Research Services in Melbourne",
    introduction: "Bittumama provides clients in Melbourne with thesis, dissertation, research and academic editing support through its existing remote service process.",
    clientContext: "The selected services support longer research projects and the writing or editing stages that surround them.",
    deliveryApproach: "Melbourne clients can identify their topic, research stage, existing chapters or editing need, then use the corresponding Bittumama service.",
    supportAreas: ["Thesis support", "Dissertations", "Research", "Academic editing"],
    serviceSlugs: ["thesis-assistance", "dissertation-assistance", "research-paper", "research-guidance", "thesis-editing-proofreading", "literature-review"],
    process: process("Scope the thesis or dissertation request using the research topic and material already developed.", "Support the selected research, writing, literature or editing task.", "Review the agreed output and requested revisions before delivery."),
    seoTitle: "Research Services in Melbourne | Bittumama",
    seoDescription: "Thesis, dissertation, research and academic editing support for clients in Melbourne."
  },
  "los-angeles": {
    heading: "Research & Analysis Support in Los Angeles",
    introduction: "For clients in Los Angeles, Bittumama brings together research paper, thesis, data analysis and academic editing services in one remote workflow.",
    clientContext: "The page focuses on research projects that combine structured writing with quantitative, visual or editorial support.",
    deliveryApproach: "A Los Angeles enquiry can begin with a research paper, thesis draft, dataset or editing requirement and then be matched to the existing service catalogue.",
    supportAreas: ["Research papers", "Thesis work", "Data analysis", "Academic editing"],
    serviceSlugs: ["research-paper", "thesis-assistance", "data-analysis-visualization", "statistical-analytical-support", "thesis-editing-proofreading", "research-guidance"],
    process: process("Clarify the paper or thesis objective and the role of analysis or editing in the requested work.", "Apply the relevant research, analysis or editing service to the supplied material.", "Review the deliverable against the agreed brief before completing the request."),
    seoTitle: "Research Services in Los Angeles | Bittumama",
    seoDescription: "Research papers, thesis support, data analysis and academic editing for clients in Los Angeles."
  },
  "seoul": {
    heading: "Research Services for Clients in Seoul",
    introduction: "Bittumama supports clients in Seoul with research, international papers, analysis and academic editing through a remote service relationship.",
    clientContext: "The curation brings together research writing, international research, analytical work and editorial refinement for research-led projects.",
    deliveryApproach: "Seoul clients can describe the research question, draft, dataset or international paper requirement and select the relevant existing Bittumama service.",
    supportAreas: ["Research", "International papers", "Analysis", "Academic editing"],
    serviceSlugs: ["research-paper", "international-research-paper", "statistical-analytical-support", "data-analysis-visualization", "thesis-editing-proofreading", "international-conference-research-paper"],
    process: process("Define the research output and distinguish paper, analysis, international research and editing requirements.", "Use the appropriate canonical service for the defined project scope.", "Review the requested output and revisions before delivery."),
    seoTitle: "Research Services in Seoul | Bittumama",
    seoDescription: "Research, international paper, analysis and academic editing support for clients in Seoul."
  },
  "zurich": {
    heading: "Research & Analysis Services in Zurich",
    introduction: "Clients in Zurich can access Bittumama support for research, statistical analysis, data visualization and academic editing through a remote workflow.",
    clientContext: "The selected services emphasise evidence handling, quantitative support, visualisation and clear presentation of research material.",
    deliveryApproach: "Zurich enquiries can start with a research question, dataset, analysis requirement or draft and be connected to the appropriate canonical service.",
    supportAreas: ["Research", "Statistical analysis", "Data visualization", "Editing"],
    serviceSlugs: ["research-paper", "statistical-analytical-support", "data-analysis-visualization", "thesis-editing-proofreading", "research-guidance", "paper-review"],
    process: process("Establish the research objective and the analysis or presentation task that needs support.", "Apply the relevant research, statistical, visualization or editing service to the supplied material.", "Review the analysis or edited output against the requested scope before delivery."),
    seoTitle: "Research Services in Zurich | Bittumama",
    seoDescription: "Research, statistical analysis, data visualization and academic editing support for clients in Zurich."
  },
  "mexico-city": {
    heading: "Research Support for Clients in Mexico City",
    introduction: "Bittumama provides clients in Mexico City with research paper, thesis, analytical and research guidance services through a remote support model.",
    clientContext: "The curated mix supports research development as well as projects that need analysis, writing or guidance at a defined academic stage.",
    deliveryApproach: "The requirement is scoped from the client's topic, research material and project stage before the relevant Bittumama service is selected.",
    supportAreas: ["Research papers", "Thesis", "Analysis", "Research guidance"],
    serviceSlugs: ["research-paper", "thesis-assistance", "statistical-analytical-support", "research-guidance", "literature-review", "data-analysis-visualization"],
    process: process("Define the research paper or thesis stage and identify the analysis or guidance required.", "Use the selected canonical service to address the agreed research or academic task.", "Review the requested output and revisions before delivery."),
    seoTitle: "Research Services in Mexico City | Bittumama",
    seoDescription: "Research paper, thesis, analysis and research guidance support for clients in Mexico City."
  },
  "nairobi": {
    heading: "Research & Thesis Support in Nairobi",
    introduction: "Clients in Nairobi can use Bittumama for research papers, thesis support, research guidance and analysis through the existing remote service model.",
    clientContext: "The service curation is centred on research development, academic writing and analytical work that can be handled within the established service catalogue.",
    deliveryApproach: "Nairobi enquiries can begin with a topic, paper, thesis stage or dataset; the requirement is then connected to the corresponding canonical service.",
    supportAreas: ["Research papers", "Thesis", "Research guidance", "Analysis"],
    serviceSlugs: ["research-paper", "thesis-assistance", "research-guidance", "data-analysis-visualization", "statistical-analytical-support", "literature-review"],
    process: process("Clarify the paper or thesis requirement and the research stage represented by the supplied material.", "Apply the appropriate research, writing, guidance or analysis service.", "Review the output against the agreed requirement before delivery."),
    seoTitle: "Research Services in Nairobi | Bittumama",
    seoDescription: "Research paper, thesis, guidance and analytical support for clients in Nairobi."
  },
  "istanbul": {
    heading: "Research Services for Clients in Istanbul",
    introduction: "Bittumama supports clients in Istanbul with research papers, thesis assistance, international research and academic editing through a remote workflow.",
    clientContext: "The curated services cover research-led writing and refinement, with international research included where it matches the project.",
    deliveryApproach: "Clients can describe the research question, thesis stage, paper requirement or editing need and use the existing Bittumama service architecture.",
    supportAreas: ["Research papers", "Thesis", "International research", "Editing"],
    serviceSlugs: ["research-paper", "thesis-assistance", "international-research-paper", "thesis-editing-proofreading", "literature-review", "international-conference-research-paper"],
    process: process("Define the research output and whether thesis, paper, international research or editing support is required.", "Work through the matching canonical service using the supplied material.", "Review the requested deliverable and revisions before delivery."),
    seoTitle: "Research Services in Istanbul | Bittumama",
    seoDescription: "Research paper, thesis, international research and academic editing support for clients in Istanbul."
  },
  "kuala-lumpur": {
    heading: "Research Services for Clients in Kuala Lumpur",
    introduction: "For clients in Kuala Lumpur, Bittumama combines research, thesis, analysis and international paper support within its established remote service workflow.",
    clientContext: "The page focuses on research-led projects where writing, analytical work and international research requirements may overlap.",
    deliveryApproach: "The request is scoped from the actual project stage and supplied material, then matched to the relevant Bittumama service rather than a city-specific package.",
    supportAreas: ["Research", "Thesis", "Analysis", "International papers"],
    serviceSlugs: ["research-paper", "thesis-assistance", "data-analysis-visualization", "statistical-analytical-support", "international-research-paper", "research-guidance"],
    process: process("Set the research or thesis scope and identify the analytical or international paper component.", "Use the relevant canonical service for the agreed task and supplied research material.", "Review the completed scope and requested revisions before delivery."),
    seoTitle: "Research Services in Kuala Lumpur | Bittumama",
    seoDescription: "Research, thesis, analysis and international paper support for clients in Kuala Lumpur."
  },
  "cairo": {
    heading: "Research & Academic Support in Cairo",
    introduction: "Bittumama supports clients in Cairo with research papers, thesis assistance, analysis and research guidance through a remote academic service process.",
    clientContext: "The selected services address research writing and development alongside analytical and guidance needs.",
    deliveryApproach: "Cairo enquiries begin with the actual research requirement and project stage, then use the existing canonical service pages for the selected scope.",
    supportAreas: ["Research papers", "Thesis", "Analysis", "Guidance"],
    serviceSlugs: ["research-paper", "thesis-assistance", "statistical-analytical-support", "research-guidance", "literature-review", "data-analysis-visualization"],
    process: process("Clarify the research paper or thesis requirement and the stage of work already completed.", "Apply the selected research, writing, guidance or analysis service to the supplied material.", "Review the requested output and revisions before delivery."),
    seoTitle: "Research Services in Cairo | Bittumama",
    seoDescription: "Research paper, thesis, analysis and research guidance support for clients in Cairo."
  },
  "chicago": {
    heading: "Research & Dissertation Support in Chicago",
    introduction: "Clients in Chicago can use Bittumama for research papers, dissertation support, data analysis and academic editing through a remote service workflow.",
    clientContext: "The curation combines research writing with longer dissertation work and evidence-led analysis or editorial refinement.",
    deliveryApproach: "A Chicago request can start from a paper, dissertation stage, dataset or draft; the requirement is matched to the existing canonical service catalogue.",
    supportAreas: ["Research papers", "Dissertations", "Data analysis", "Editing"],
    serviceSlugs: ["research-paper", "dissertation-assistance", "data-analysis-visualization", "statistical-analytical-support", "thesis-editing-proofreading", "research-guidance"],
    process: process("Define the research paper or dissertation stage and identify the analysis or editing task.", "Use the appropriate canonical service for the supplied research material and agreed scope.", "Review the deliverable against the requirement before completing the request."),
    seoTitle: "Research Services in Chicago | Bittumama",
    seoDescription: "Research papers, dissertation support, data analysis and academic editing for clients in Chicago."
  },
  "barcelona": {
    heading: "Research Services for Clients in Barcelona",
    introduction: "Bittumama supports clients in Barcelona with research, paper review, thesis assistance and international research services through a remote workflow.",
    clientContext: "The curated mix combines research development and review with thesis and international paper support where relevant to the project.",
    deliveryApproach: "Clients can begin with a research topic, paper draft, thesis requirement or international research brief and connect it to an existing service.",
    supportAreas: ["Research", "Paper review", "Thesis", "International research"],
    serviceSlugs: ["research-paper", "paper-review", "thesis-assistance", "international-research-paper", "literature-review", "international-conference-research-paper"],
    process: process("Identify the research stage and whether the requirement is writing, review, thesis or international research support.", "Work through the matching service using the supplied research material.", "Review the agreed output and requested revisions before delivery."),
    seoTitle: "Research Services in Barcelona | Bittumama",
    seoDescription: "Research, paper review, thesis and international research support for clients in Barcelona."
  },
  "johannesburg": {
    heading: "Research & Thesis Support in Johannesburg",
    introduction: "For clients in Johannesburg, Bittumama provides research paper, thesis, analysis and research guidance support through the established remote service model.",
    clientContext: "The selected services focus on research development, academic writing and analytical work rather than a location-specific business operation.",
    deliveryApproach: "The enquiry starts with the topic, project stage and existing research material, then maps to the canonical service that addresses the requirement.",
    supportAreas: ["Research papers", "Thesis", "Analysis", "Research guidance"],
    serviceSlugs: ["research-paper", "thesis-assistance", "data-analysis-visualization", "research-guidance", "statistical-analytical-support", "literature-review"],
    process: process("Scope the paper or thesis requirement and identify any analysis or guidance component.", "Apply the relevant research, writing, analysis or guidance service.", "Review the requested output and revisions before delivery."),
    seoTitle: "Research Services in Johannesburg | Bittumama",
    seoDescription: "Research paper, thesis, analysis and research guidance support for clients in Johannesburg."
  },
  "vienna": {
    heading: "Research & Dissertation Services in Vienna",
    introduction: "Bittumama supports clients in Vienna with research, dissertation, academic editing and international research services through a remote workflow.",
    clientContext: "The service selection suits research projects that need structured development, longer-form dissertation support or editorial and international research assistance.",
    deliveryApproach: "Vienna enquiries can begin with the research question, dissertation material or editing requirement and be connected to the appropriate canonical service.",
    supportAreas: ["Research", "Dissertations", "Academic editing", "International research"],
    serviceSlugs: ["research-paper", "dissertation-assistance", "thesis-editing-proofreading", "international-research-paper", "literature-review", "research-guidance"],
    process: process("Define the research or dissertation stage and the specific writing, literature, editing or international research need.", "Use the relevant canonical service for the agreed project scope.", "Review the requested deliverable and revisions before completing the service."),
    seoTitle: "Research Services in Vienna | Bittumama",
    seoDescription: "Research, dissertation, academic editing and international research support for clients in Vienna."
  }
};

const globalCitiesBySlug = new Map(globalPresenceCities.map((city) => [city.id, city]));
const contentSlugs = Object.keys(locationContent);

if (globalPresenceCities.length !== 25 || contentSlugs.length !== 25) {
  throw new Error("The location system must contain exactly the 25 Global Presence cities.");
}

for (const slug of contentSlugs) {
  if (!globalCitiesBySlug.has(slug)) throw new Error("Location content has no Global Presence city: " + slug);
}

for (const slug of canonicalServiceSlugs) {
  if (!slug) throw new Error("Canonical service slugs must be non-empty.");
}

export const locationPages: LocationPage[] = globalPresenceCities.map((city) => ({
  ...city,
  ...locationContent[city.id],
}));

export const locationSlugs = locationPages.map((location) => location.id) as readonly string[];

export function getLocationBySlug(slug: string): LocationPage | undefined {
  return locationPages.find((location) => location.id === slug);
}
