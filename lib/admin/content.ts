import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

export const CONTENT_DOMAINS = [
  "services",
  "research",
  "experts",
  "articles",
  "workshops",
] as const;

export type ContentDomain = (typeof CONTENT_DOMAINS)[number];

export const CONTENT_LABELS: Record<ContentDomain, string> = {
  services: "Services",
  research: "Research",
  experts: "Experts",
  articles: "Articles",
  workshops: "Workshops / Events",
};

export type ContentFormValues = {
  id?: string;
  updatedAt?: string;
  publishAt?: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  order: string;
  date: string;
  endDate: string;
  time: string;
  location: string;
  format: string;
  eventType: string;
  availability: string;
  type: string;
  topic: string;
  image: string;
  imageMediaId: string;
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
  seoCanonical: string;
  seoNoIndex: boolean;
  need: string;
  focus: string;
  audience: string;
  highlights: string;
  faq: string;
  summary: string;
  tags: string;
  scope: string;
  topics: string;
  sections: string;
  methodology: string;
  content: string;
  excerpt: string;
  author: string;
  authorRole: string;
  authorSlug: string;
  registrationLabel: string;
  registrationHref: string;
  registrationStatus: string;
  speakerRole: string;
  speakerId: string;
  relationServiceIds: string[];
  relationResearchIds: string[];
  relationExpertIds: string[];
  relationArticleIds: string[];
  relationWorkshopIds: string[];
};

export function isContentDomain(value: string): value is ContentDomain {
  return (CONTENT_DOMAINS as readonly string[]).includes(value);
}

export function contentBasePath(domain: ContentDomain) {
  return `/admin/content/${domain}`;
}

function statusWhere(status?: string) {
  return status === "DRAFT" || status === "PUBLISHED" || status === "ARCHIVED"
    ? { status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" }
    : undefined;
}

function searchWhere(domain: ContentDomain, q?: string) {
  if (!q?.trim()) return undefined;
  const value = q.trim();
  const mode = "insensitive" as const;
  switch (domain) {
    case "services":
      return { OR: [{ title: { contains: value, mode } }, { slug: { contains: value, mode } }] };
    case "research":
      return { OR: [{ title: { contains: value, mode } }, { slug: { contains: value, mode } }] };
    case "experts":
      return { OR: [{ name: { contains: value, mode } }, { slug: { contains: value, mode } }] };
    case "articles":
      return { OR: [{ title: { contains: value, mode } }, { slug: { contains: value, mode } }] };
    case "workshops":
      return { OR: [{ title: { contains: value, mode } }, { slug: { contains: value, mode } }] };
  }
}

export async function getContentOverview() {
  const [services, research, experts, articles, workshops] = await Promise.all([
    prisma.client.service.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.client.researchItem.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.client.expert.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.client.article.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.client.event.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const normalize = (rows: Array<{ status: string; _count: { _all: number } }>) => ({
    total: rows.reduce((sum, row) => sum + row._count._all, 0),
    published: rows.find((row) => row.status === "PUBLISHED")?._count._all ?? 0,
    draft: rows.find((row) => row.status === "DRAFT")?._count._all ?? 0,
    archived: rows.find((row) => row.status === "ARCHIVED")?._count._all ?? 0,
  });

  return {
    services: normalize(services),
    research: normalize(research),
    experts: normalize(experts),
    articles: normalize(articles),
    workshops: normalize(workshops),
  };
}

export async function listContent(
  domain: ContentDomain,
  options: { q?: string; status?: string; page?: number; pageSize?: number; sort?: string },
) {
  const pageSize = Math.min(Math.max(options.pageSize ?? 20, 5), 50);
  const page = Math.max(options.page ?? 1, 1);
  const where = {
    ...(statusWhere(options.status) ?? {}),
    ...(searchWhere(domain, options.q) ?? {}),
  };
  const skip = (page - 1) * pageSize;

  switch (domain) {
    case "services": {
      const [items, total] = await Promise.all([
        prisma.client.service.findMany({
          where: where as Prisma.ServiceWhereInput,
          select: { id: true, title: true, slug: true, category: true, status: true, updatedAt: true, order: true },
          orderBy: options.sort === "title" ? { title: "asc" } : options.sort === "date" ? { createdAt: "desc" } : { updatedAt: "desc" },
          skip, take: pageSize,
        }),
        prisma.client.service.count({ where: where as Prisma.ServiceWhereInput }),
      ]);
      return { items, total, page, pageSize };
    }
    case "research": {
      const [items, total] = await Promise.all([
        prisma.client.researchItem.findMany({
          where: where as Prisma.ResearchItemWhereInput,
          select: { id: true, title: true, slug: true, category: true, status: true, updatedAt: true, date: true },
          orderBy: options.sort === "title" ? { title: "asc" } : options.sort === "date" ? { date: "desc" } : { updatedAt: "desc" },
          skip, take: pageSize,
        }),
        prisma.client.researchItem.count({ where: where as Prisma.ResearchItemWhereInput }),
      ]);
      return { items, total, page, pageSize };
    }
    case "experts": {
      const [items, total] = await Promise.all([
        prisma.client.expert.findMany({
          where: where as Prisma.ExpertWhereInput,
          select: { id: true, name: true, slug: true, discipline: true, status: true, updatedAt: true, order: true },
          orderBy: options.sort === "title" ? { name: "asc" } : options.sort === "date" ? { createdAt: "desc" } : { updatedAt: "desc" },
          skip, take: pageSize,
        }),
        prisma.client.expert.count({ where: where as Prisma.ExpertWhereInput }),
      ]);
      return { items, total, page, pageSize };
    }
    case "articles": {
      const [items, total] = await Promise.all([
        prisma.client.article.findMany({
          where: where as Prisma.ArticleWhereInput,
          select: { id: true, title: true, slug: true, category: true, status: true, updatedAt: true, date: true },
          orderBy: options.sort === "title" ? { title: "asc" } : options.sort === "date" ? { date: "desc" } : { updatedAt: "desc" },
          skip, take: pageSize,
        }),
        prisma.client.article.count({ where: where as Prisma.ArticleWhereInput }),
      ]);
      return { items, total, page, pageSize };
    }
    case "workshops": {
      const [items, total] = await Promise.all([
        prisma.client.event.findMany({
          where: where as Prisma.EventWhereInput,
          select: { id: true, title: true, slug: true, category: true, status: true, updatedAt: true, date: true },
          orderBy: options.sort === "title" ? { title: "asc" } : options.sort === "date" ? { date: "desc" } : { updatedAt: "desc" },
          skip, take: pageSize,
        }),
        prisma.client.event.count({ where: where as Prisma.EventWhereInput }),
      ]);
      return { items, total, page, pageSize };
    }
  }
}

function isoDate(value: Date | null | undefined) {
  return value ? value.toISOString().slice(0, 10) : "";
}

function isoDateTime(value: Date | null | undefined) {
  return value ? value.toISOString() : "";
}

function jsonText(value: unknown) {
  return value == null ? "" : JSON.stringify(value, null, 2);
}

function common(values: Partial<ContentFormValues>): ContentFormValues {
  return {
    title: "", slug: "", category: "", shortDescription: "", description: "", status: "DRAFT", publishAt: "",
    featured: false, order: "0", date: "", endDate: "", time: "", location: "", format: "",
    eventType: "", availability: "", type: "", topic: "", image: "", imageMediaId: "", seoTitle: "",
    seoDescription: "", seoImage: "", seoCanonical: "", seoNoIndex: false, need: "", focus: "",
    audience: "", highlights: "", faq: "", summary: "", tags: "", scope: "", topics: "",
    sections: "", methodology: "", content: "", excerpt: "", author: "", authorRole: "",
    authorSlug: "", registrationLabel: "", registrationHref: "", registrationStatus: "",
    speakerRole: "", speakerId: "", relationServiceIds: [], relationResearchIds: [],
    relationExpertIds: [], relationArticleIds: [], relationWorkshopIds: [], ...values,
  };
}

export async function getContentForEdit(domain: ContentDomain, id: string): Promise<ContentFormValues | null> {
  switch (domain) {
    case "services": {
      const record = await prisma.client.service.findUnique({
        where: { id },
        include: {
          researchLinks: { select: { researchId: true } },
          articleLinks: { select: { articleId: true } },
          workshopLinks: { select: { eventId: true } },
          expertLinks: { select: { expertId: true } },
        },
      });
      return record ? common({
        id: record.id, title: record.title, slug: record.slug, category: record.category,
        shortDescription: record.shortDescription, status: record.status, featured: record.featured,
        publishAt: isoDateTime(record.publishAt),
        order: String(record.order), need: record.need ?? "", focus: record.focus ?? "", audience: record.audience ?? "",
        highlights: jsonText(record.highlights), faq: jsonText(record.faq), seoTitle: record.seoTitle ?? "",
        seoDescription: record.seoDescription ?? "", seoImage: record.seoImage ?? "", seoCanonical: record.seoCanonical ?? "",
        seoNoIndex: record.seoNoIndex, updatedAt: record.updatedAt.toISOString(), relationResearchIds: record.researchLinks.map((x) => x.researchId),
        relationArticleIds: record.articleLinks.map((x) => x.articleId), relationWorkshopIds: record.workshopLinks.map((x) => x.eventId),
        relationExpertIds: record.expertLinks.map((x) => x.expertId),
      }) : null;
    }
    case "research": {
      const record = await prisma.client.researchItem.findUnique({
        where: { id },
        include: {
          serviceLinks: { select: { serviceId: true } },
          expertLinks: { select: { expertId: true } },
          articleLinks: { select: { articleId: true } },
          workshopLinks: { select: { eventId: true } },
          imageMedia: { select: { id: true, publicUrl: true } },
        },
      });
      return record ? common({
        id: record.id, title: record.title, slug: record.slug, category: record.category,
        shortDescription: record.shortDescription, summary: record.summary ?? "", status: record.status, publishAt: isoDateTime(record.publishAt),
        order: String(record.order), date: isoDate(record.date), availability: record.availability, type: record.type ?? "",
        topic: record.topic ?? "", image: record.imageMedia?.publicUrl ?? record.image ?? "", imageMediaId: record.imageMediaId ?? "", featured: record.featured, tags: jsonText(record.tags),
        audience: jsonText(record.audience), highlights: jsonText(record.highlights), scope: jsonText(record.scope),
        topics: jsonText(record.topics), sections: jsonText(record.sections), methodology: jsonText(record.methodology),
        seoTitle: record.seoTitle ?? "", seoDescription: record.seoDescription ?? "", seoImage: record.seoImage ?? "",
        seoCanonical: record.seoCanonical ?? "", seoNoIndex: record.seoNoIndex, updatedAt: record.updatedAt.toISOString(),
        relationServiceIds: record.serviceLinks.map((x) => x.serviceId), relationExpertIds: record.expertLinks.map((x) => x.expertId),
        relationArticleIds: record.articleLinks.map((x) => x.articleId), relationWorkshopIds: record.workshopLinks.map((x) => x.eventId),
      }) : null;
    }
    case "experts": {
      const record = await prisma.client.expert.findUnique({
        where: { id },
        include: {
          researchLinks: { select: { researchId: true } },
          serviceLinks: { select: { serviceId: true } },
          articleLinks: { select: { articleId: true } },
          profileMedia: { select: { id: true, publicUrl: true } },
        },
      });
      return record ? common({
        id: record.id, title: record.name, slug: record.slug, category: record.discipline ?? "",
        shortDescription: record.shortBio ?? "", description: record.bio ?? "", status: record.status, publishAt: isoDateTime(record.publishAt),
        order: String(record.order), featured: record.featured, image: record.profileMedia?.publicUrl ?? record.image ?? "", imageMediaId: record.profileMediaId ?? "",
        type: record.role ?? "", audience: jsonText(record.expertise), tags: jsonText(record.qualifications),
        topics: jsonText(record.researchInterests), seoTitle: record.seoTitle ?? "",
        seoDescription: record.seoDescription ?? "", seoImage: record.seoImage ?? "", seoCanonical: record.seoCanonical ?? "",
        seoNoIndex: record.seoNoIndex, updatedAt: record.updatedAt.toISOString(), relationResearchIds: record.researchLinks.map((x) => x.researchId),
        relationServiceIds: record.serviceLinks.map((x) => x.serviceId), relationArticleIds: record.articleLinks.map((x) => x.articleId),
      }) : null;
    }
    case "articles": {
      const record = await prisma.client.article.findUnique({
        where: { id },
        include: {
          researchLinks: { select: { researchId: true } },
          serviceLinks: { select: { serviceId: true } },
          expertLinks: { select: { expertId: true } },
          relatedFrom: { select: { targetArticleId: true } },
          coverMedia: { select: { id: true, publicUrl: true } },
        },
      });
      return record ? common({
        id: record.id, title: record.title, slug: record.slug, category: record.category,
        shortDescription: record.excerpt ?? "", excerpt: record.excerpt ?? "", status: record.status, publishAt: isoDateTime(record.publishAt),
        order: String(record.order), date: isoDate(record.date), author: record.author ?? "", authorRole: record.authorRole ?? "",
        authorSlug: record.authorSlug ?? "", content: record.content ?? "", sections: jsonText(record.sections),
        image: record.coverMedia?.publicUrl ?? record.image ?? "", imageMediaId: record.coverMediaId ?? "", featured: record.featured, tags: jsonText(record.tags),
        seoTitle: record.seoTitle ?? "", seoDescription: record.seoDescription ?? "", seoImage: record.seoImage ?? "",
        updatedAt: record.updatedAt.toISOString(), relationResearchIds: record.researchLinks.map((x) => x.researchId), relationServiceIds: record.serviceLinks.map((x) => x.serviceId),
        relationExpertIds: record.expertLinks.map((x) => x.expertId), relationArticleIds: record.relatedFrom.map((x) => x.targetArticleId),
      }) : null;
    }
    case "workshops": {
      const record = await prisma.client.event.findUnique({
        where: { id },
        include: {
          researchLinks: { select: { researchId: true } },
          serviceLinks: { select: { serviceId: true } },
          relatedFrom: { select: { targetEventId: true } },
          coverMedia: { select: { id: true, publicUrl: true } },
        },
      });
      return record ? common({
        id: record.id, title: record.title, slug: record.slug, category: record.category,
        shortDescription: record.shortDescription, description: record.description ?? "", status: record.status, publishAt: isoDateTime(record.publishAt),
        order: String(record.order), date: isoDate(record.date), endDate: isoDate(record.endDate), time: record.time ?? "",
        location: record.location ?? "", format: record.format ?? "", image: record.coverMedia?.publicUrl ?? record.image ?? "", imageMediaId: record.coverMediaId ?? "", featured: record.featured,
        audience: jsonText(record.audience), registrationLabel: record.registrationLabel ?? "",
        registrationHref: record.registrationHref ?? "", registrationStatus: record.registrationStatus ?? "",
        speakerId: record.speakerId ?? "", speakerRole: record.speakerRole ?? "",
        seoTitle: record.seoTitle ?? "", seoDescription: record.seoDescription ?? "", seoImage: record.seoImage ?? "",
        updatedAt: record.updatedAt.toISOString(), relationResearchIds: record.researchLinks.map((x) => x.researchId), relationServiceIds: record.serviceLinks.map((x) => x.serviceId),
        relationWorkshopIds: record.relatedFrom.map((x) => x.targetEventId),
      }) : null;
    }
  }
}

export async function getRelationOptions(domain: ContentDomain, q: string) {
  const value = q.trim();
  if (value.length < 2) return [];
  const mode = "insensitive" as const;
  switch (domain) {
    case "services": {
      const rows = await prisma.client.service.findMany({ where: { OR: [{ title: { contains: value, mode } }, { slug: { contains: value, mode } }] }, select: { id: true, title: true, slug: true }, take: 20 });
      return rows.map((row) => ({ id: row.id, label: row.title, slug: row.slug }));
    }
    case "research": {
      const rows = await prisma.client.researchItem.findMany({ where: { OR: [{ title: { contains: value, mode } }, { slug: { contains: value, mode } }] }, select: { id: true, title: true, slug: true }, take: 20 });
      return rows.map((row) => ({ id: row.id, label: row.title, slug: row.slug }));
    }
    case "experts": {
      const rows = await prisma.client.expert.findMany({ where: { OR: [{ name: { contains: value, mode } }, { slug: { contains: value, mode } }] }, select: { id: true, name: true, slug: true }, take: 20 });
      return rows.map((row) => ({ id: row.id, label: row.name, slug: row.slug }));
    }
    case "articles": {
      const rows = await prisma.client.article.findMany({ where: { OR: [{ title: { contains: value, mode } }, { slug: { contains: value, mode } }] }, select: { id: true, title: true, slug: true }, take: 20 });
      return rows.map((row) => ({ id: row.id, label: row.title, slug: row.slug }));
    }
    case "workshops": {
      const rows = await prisma.client.event.findMany({ where: { OR: [{ title: { contains: value, mode } }, { slug: { contains: value, mode } }] }, select: { id: true, title: true, slug: true }, take: 20 });
      return rows.map((row) => ({ id: row.id, label: row.title, slug: row.slug }));
    }
  }
}

export async function getNamedRelations(ids: Record<ContentDomain, string[]>) {
  const [services, research, experts, articles, workshops] = await Promise.all([
    ids.services.length ? prisma.client.service.findMany({ where: { id: { in: ids.services } }, select: { id: true, title: true, slug: true } }) : [],
    ids.research.length ? prisma.client.researchItem.findMany({ where: { id: { in: ids.research } }, select: { id: true, title: true, slug: true } }) : [],
    ids.experts.length ? prisma.client.expert.findMany({ where: { id: { in: ids.experts } }, select: { id: true, name: true, slug: true } }) : [],
    ids.articles.length ? prisma.client.article.findMany({ where: { id: { in: ids.articles } }, select: { id: true, title: true, slug: true } }) : [],
    ids.workshops.length ? prisma.client.event.findMany({ where: { id: { in: ids.workshops } }, select: { id: true, title: true, slug: true } }) : [],
  ]);
  return {
    services: services.map((item) => ({ id: item.id, label: item.title, slug: item.slug })),
    research: research.map((item) => ({ id: item.id, label: item.title, slug: item.slug })),
    experts: experts.map((item) => ({ id: item.id, label: item.name, slug: item.slug })),
    articles: articles.map((item) => ({ id: item.id, label: item.title, slug: item.slug })),
    workshops: workshops.map((item) => ({ id: item.id, label: item.title, slug: item.slug })),
  };
}
