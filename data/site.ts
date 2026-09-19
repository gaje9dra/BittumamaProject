import { about } from "@/data/about";

export const site = {
  name: about.name,
  description: about.description,
  defaultSeo: about.seo,
} as const;
