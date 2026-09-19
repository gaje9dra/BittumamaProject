import { getAllServices } from "@/data/services";

export type ContactMethod = {
  label?: string;
  action?: string;
  href?: string;
  external?: boolean;
};

export const contactData = {
  seo: {
    title: "Contact Bittumama | Research Enquiry",
    description: "Tell Bittumama what you are working on and identify the relevant research or academic support.",
  },
  introduction: {
    eyebrow: "Contact / Enquiry",
    title: "Tell us what you are working on.",
    description:
      "Share your research or academic requirement and select the service context that best matches it.",
  },
  enquiryGuidance: [
    "What are you working on?",
    "Which stage are you at?",
    "What support do you need?",
    "Any relevant deadline or specific research/data requirement?",
  ],
  contactMethods: [] as ContactMethod[],
};

export const contactServiceOptions = getAllServices();

export const getContactService = (slug: string | null | undefined) =>
  contactServiceOptions.find((service) => service.slug === slug);
