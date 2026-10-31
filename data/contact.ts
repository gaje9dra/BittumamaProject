export type ContactMethod = {
  label?: string;
  action?: string;
  href?: string;
  external?: boolean;
};

// WhatsApp number in international format: country code + phone number,
// using digits only (no +, spaces, or dashes).
export const contactData = {
  whatsappNumber: "918114490400",
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
