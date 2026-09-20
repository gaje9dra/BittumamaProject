"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { contentBasePath, isContentDomain, type ContentDomain } from "@/lib/admin/content";

export type ContentActionState = {
  message: string | null;
  fieldErrors: Record<string, string>;
};

const initial: ContentActionState = { message: null, fieldErrors: {} };

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function checkbox(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function parseJson(value: string, field: string, errors: Record<string, string>) {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    errors[field] = "Enter valid JSON.";
    return undefined;
  }
}

function parseIds(formData: FormData, key: string) {
  return Array.from(new Set(formData.getAll(key).map(String).map((value) => value.trim()).filter(Boolean)));
}

function slugIsValid(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function parseDate(value: string) {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function validateBase(fields: Record<string, string>) {
  const errors: Record<string, string> = {};
  if (!fields.title || fields.title.length > 200) errors.title = "Title is required and must be 200 characters or fewer.";
  if (!fields.slug || !slugIsValid(fields.slug)) errors.slug = "Use lowercase letters, numbers and single hyphens.";
  if (fields.category.length > 120) errors.category = "Category is too long.";
  if (fields.shortDescription.length > 1000) errors.shortDescription = "Keep the short description under 1000 characters.";
  return errors;
}

function validatePublished(domain: ContentDomain, fields: Record<string, string>, relationCounts: Record<string, number>) {
  const errors = validateBase(fields);
  if (!fields.title) errors.title = "A published record needs a title.";
  if (!fields.slug) errors.slug = "A published record needs a slug.";
  if (!fields.shortDescription && domain !== "experts") errors.shortDescription = "A published record needs a short description.";
  if (domain === "workshops" && !parseDate(fields.date)) errors.date = "A published workshop needs a valid date.";
  if (domain === "research" && !fields.summary && !fields.shortDescription) errors.summary = "A published research record needs summary content.";
  if (domain === "articles" && !fields.excerpt && !fields.content && !fields.sections) errors.content = "A published article needs editorial content.";
  if (domain === "experts" && !fields.shortDescription && !fields.description) errors.shortDescription = "A published expert needs profile content.";
  if (domain === "workshops" && relationCounts.speaker < 1 && !fields.speakerId) {
    // Speaker is optional in the schema; no error is required here.
  }
  return errors;
}

async function assertIds(domain: ContentDomain, ids: Record<string, string[]>, errors: Record<string, string>) {
  const unique = (values: string[]) => Array.from(new Set(values));
  const [services, research, experts, articles, workshops] = await Promise.all([
    ids.services.length ? prisma.client.service.count({ where: { id: { in: unique(ids.services) } } }) : 0,
    ids.research.length ? prisma.client.researchItem.count({ where: { id: { in: unique(ids.research) } } }) : 0,
    ids.experts.length ? prisma.client.expert.count({ where: { id: { in: unique(ids.experts) } } }) : 0,
    ids.articles.length ? prisma.client.article.count({ where: { id: { in: unique(ids.articles) } } }) : 0,
    ids.workshops.length ? prisma.client.event.count({ where: { id: { in: unique(ids.workshops) } } }) : 0,
  ]);
  const checks: Array<[string, number, string[]]> = [
    ["services", services, unique(ids.services)], ["research", research, unique(ids.research)],
    ["experts", experts, unique(ids.experts)], ["articles", articles, unique(ids.articles)],
    ["workshops", workshops, unique(ids.workshops)],
  ];
  for (const [name, count, values] of checks) {
    if (count !== values.length && values.length) errors[`relation${name}`] = `One or more selected ${name} no longer exists.`;
  }
}

function parseForm(formData: FormData) {
  const fields: Record<string, string> = {
    title: text(formData, "title"), slug: text(formData, "slug"), category: text(formData, "category"),
    shortDescription: text(formData, "shortDescription"), description: text(formData, "description"),
    order: text(formData, "order"), date: text(formData, "date"), endDate: text(formData, "endDate"),
    time: text(formData, "time"), location: text(formData, "location"), format: text(formData, "format"),
    availability: text(formData, "availability"), type: text(formData, "type"), topic: text(formData, "topic"),
    image: text(formData, "image"), seoTitle: text(formData, "seoTitle"), seoDescription: text(formData, "seoDescription"),
    seoImage: text(formData, "seoImage"), seoCanonical: text(formData, "seoCanonical"), need: text(formData, "need"),
    focus: text(formData, "focus"), audience: text(formData, "audience"), highlights: text(formData, "highlights"),
    faq: text(formData, "faq"), summary: text(formData, "summary"), tags: text(formData, "tags"),
    scope: text(formData, "scope"), topics: text(formData, "topics"), sections: text(formData, "sections"),
    methodology: text(formData, "methodology"), content: text(formData, "content"), excerpt: text(formData, "excerpt"),
    author: text(formData, "author"), authorRole: text(formData, "authorRole"), authorSlug: text(formData, "authorSlug"),
    registrationLabel: text(formData, "registrationLabel"), registrationHref: text(formData, "registrationHref"),
    registrationStatus: text(formData, "registrationStatus"), speakerRole: text(formData, "speakerRole"),
    speakerId: text(formData, "speakerId"),
  };
  const jsonErrors: Record<string, string> = {};
  const json: Record<string, unknown> = {};
  for (const key of ["highlights","faq","audience","tags","scope","topics","sections","methodology"]) {
    json[key] = parseJson(fields[key], key, jsonErrors);
  }
  return { fields, json, jsonErrors, ids: {
    services: parseIds(formData, "relationServiceIds"),
    research: parseIds(formData, "relationResearchIds"),
    experts: parseIds(formData, "relationExpertIds"),
    articles: parseIds(formData, "relationArticleIds"),
    workshops: parseIds(formData, "relationWorkshopIds"),
  }};
}

function relationData(domain: ContentDomain, ids: ReturnType<typeof parseForm>["ids"]) {
  return {
    services: ids.services, research: ids.research, experts: ids.experts,
    articles: ids.articles, workshops: ids.workshops,
  };
}

function buildData(domain: ContentDomain, fields: Record<string, string>, json: Record<string, unknown>, status: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
  const order = Number.parseInt(fields.order || "0", 10);
  const common = {
    slug: fields.slug, status, featured: fields.featured === "true",
    order: Number.isFinite(order) ? order : 0,
  };
  switch (domain) {
    case "services":
      return {
        title: fields.title, category: fields.category, shortDescription: fields.shortDescription, ...common,
        need: fields.need || null, focus: fields.focus || null, audience: fields.audience || null,
        highlights: json.highlights ?? null, faq: json.faq ?? null,
        seoTitle: fields.seoTitle || null, seoDescription: fields.seoDescription || null, seoImage: fields.seoImage || null,
        seoCanonical: fields.seoCanonical || null, seoNoIndex: fields.seoNoIndex === "true",
        availability: fields.availability === "COMING_SOON" ? "COMING_SOON" : "AVAILABLE",
      };
    case "research":
      return {
        title: fields.title, category: fields.category, shortDescription: fields.shortDescription, ...common,
        summary: fields.summary || null, date: parseDate(fields.date) ?? null,
        availability: fields.availability === "COMING_SOON" ? "COMING_SOON" : "AVAILABLE",
        type: fields.type || null, topic: fields.topic || null, image: fields.image || null,
        tags: json.tags ?? null, highlights: json.highlights ?? null, audience: json.audience ?? null,
        scope: json.scope ?? null, topics: json.topics ?? null, sections: json.sections ?? null, methodology: json.methodology ?? null,
        seoTitle: fields.seoTitle || null, seoDescription: fields.seoDescription || null, seoImage: fields.seoImage || null,
        seoCanonical: fields.seoCanonical || null, seoNoIndex: fields.seoNoIndex === "true",
      };
    case "experts":
      return {
        name: fields.title, slug: fields.slug, discipline: fields.category || null, shortBio: fields.shortDescription || null,
        bio: fields.description || null, role: fields.type || null, order: Number.isFinite(order) ? order : 0,
        image: fields.image || null, expertise: json.audience ?? null, qualifications: json.tags ?? null,
        researchInterests: json.topics ?? null, featured: fields.featured === "true", status,
        seoTitle: fields.seoTitle || null, seoDescription: fields.seoDescription || null, seoImage: fields.seoImage || null,
        seoCanonical: fields.seoCanonical || null, seoNoIndex: fields.seoNoIndex === "true",
      };
    case "articles":
      return {
        title: fields.title, slug: fields.slug, category: fields.category, order: Number.isFinite(order) ? order : 0,
        date: parseDate(fields.date) ?? null, excerpt: fields.excerpt || null, author: fields.author || null,
        authorRole: fields.authorRole || null, authorSlug: fields.authorSlug || null, content: fields.content || null,
        sections: json.sections ?? null, image: fields.image || null, featured: fields.featured === "true",
        tags: json.tags ?? null, status,
        seoTitle: fields.seoTitle || null, seoDescription: fields.seoDescription || null, seoImage: fields.seoImage || null,
      };
    case "workshops":
      return {
        title: fields.title, slug: fields.slug, category: fields.category, order: Number.isFinite(order) ? order : 0,
        date: parseDate(fields.date) ?? new Date(0), endDate: parseDate(fields.endDate) ?? null, time: fields.time || null,
        location: fields.location || null, format: ["ONLINE","IN_PERSON","HYBRID"].includes(fields.format) ? fields.format : null,
        shortDescription: fields.shortDescription, description: fields.description || null,
        audience: json.audience ?? null, speakerId: fields.speakerId || null, speakerRole: fields.speakerRole || null,
        image: fields.image || null, registrationLabel: fields.registrationLabel || null,
        registrationHref: fields.registrationHref || null,
        registrationStatus: ["REGISTRATION_OPEN","REGISTRATION_CLOSED","COMING_SOON","COMPLETED"].includes(fields.registrationStatus) ? fields.registrationStatus : null,
        featured: fields.featured === "true", status,
        seoTitle: fields.seoTitle || null, seoDescription: fields.seoDescription || null, seoImage: fields.seoImage || null,
      };
  }
}

function cleanRelationIds(ids: string[], selfId?: string) {
  return Array.from(new Set(ids)).filter((id) => id !== selfId);
}

export async function saveContent(
  _previous: ContentActionState = initial,
  formData: FormData,
): Promise<ContentActionState> {
  const admin = await requireAdmin();
  const domainValue = text(formData, "domain");
  const domain = isContentDomain(domainValue) ? domainValue : null;
  if (!domain) return { message: "Unknown content domain.", fieldErrors: {} };

  const id = text(formData, "id") || undefined;
  const intent = text(formData, "intent") || "save";
  const { fields, json, jsonErrors, ids } = parseForm(formData);
  const errors = { ...jsonErrors, ...validateBase(fields) };
  if (fields.order && !Number.isInteger(Number(fields.order))) errors.order = "Order must be a whole number.";
  if (fields.date && !parseDate(fields.date)) errors.date = "Enter a valid date.";
  if (fields.endDate && !parseDate(fields.endDate)) errors.endDate = "Enter a valid end date.";
  if (domain === "workshops" && fields.endDate && fields.date && parseDate(fields.endDate)! < parseDate(fields.date)!) {
    errors.endDate = "End date cannot be earlier than the event date.";
  }
  await assertIds(domain, relationData(domain, ids), errors);
  if (domain === "workshops" && fields.speakerId) {
    const speaker = await prisma.client.expert.findUnique({ where: { id: fields.speakerId }, select: { id: true } });
    if (!speaker) errors.speakerId = "Selected speaker no longer exists.";
  }
  if (Object.keys(errors).length) return { message: "Fix the highlighted fields.", fieldErrors: errors };

  const existing = id ? await getExistingStatus(domain, id) : null;
  const status = intent === "publish" ? "PUBLISHED" : intent === "archive" ? "ARCHIVED" : intent === "unpublish" ? "DRAFT" : (existing?.status ?? "DRAFT");
  if (status === "PUBLISHED") {
    const publicationErrors = validatePublished(domain, fields, { speaker: fields.speakerId ? 1 : 0 });
    if (Object.keys(publicationErrors).length) return { message: "This content is not ready to publish.", fieldErrors: publicationErrors };
  }

  const publishedSlugConflict = await slugConflict(domain, fields.slug, id);
  if (publishedSlugConflict) return { message: "That slug is already in use.", fieldErrors: { slug: "Choose a unique slug." } };

  const data = buildData(domain, { ...fields, featured: fields.featured === "on" ? "true" : fields.featured }, json, status);

  try {
    if (!id) {
      const created = await createDomainRecord(domain, data);
      await syncRelations(domain, created.id, ids, undefined);
      revalidateDomain(domain, fields.slug);
      redirect(`${contentBasePath(domain)}/${created.id}/edit?saved=1`);
    }

    const current = await getExistingForConflict(domain, id);
    if (!current) return { message: "The content record no longer exists.", fieldErrors: {} };
    if (current.updatedAt.getTime() !== Number(text(formData, "updatedAt"))) {
      return { message: "This content changed while you were editing it. Reload the record and review the newer version before saving.", fieldErrors: {} };
    }
    await updateDomainRecord(domain, id, data);
    await syncRelations(domain, id, ids, current);
    revalidateDomain(domain, fields.slug, current.slug);
    redirect(`${contentBasePath(domain)}/${id}/edit?saved=1`);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { message: "That slug is already in use.", fieldErrors: { slug: "Choose a unique slug." } };
    }
    if (error instanceof Error && error.message.startsWith("REDIRECT")) throw error;
    console.error("Admin content mutation failed:", error);
    return { message: "The content could not be saved. Please try again.", fieldErrors: {} };
  }
}

async function getExistingStatus(domain: ContentDomain, id: string) {
  switch (domain) {
    case "services": return prisma.client.service.findUnique({ where: { id }, select: { status: true } });
    case "research": return prisma.client.researchItem.findUnique({ where: { id }, select: { status: true } });
    case "experts": return prisma.client.expert.findUnique({ where: { id }, select: { status: true } });
    case "articles": return prisma.client.article.findUnique({ where: { id }, select: { status: true } });
    case "workshops": return prisma.client.event.findUnique({ where: { id }, select: { status: true } });
  }
}

async function getExistingForConflict(domain: ContentDomain, id: string) {
  switch (domain) {
    case "services": return prisma.client.service.findUnique({ where: { id }, select: { updatedAt: true, slug: true } });
    case "research": return prisma.client.researchItem.findUnique({ where: { id }, select: { updatedAt: true, slug: true } });
    case "experts": return prisma.client.expert.findUnique({ where: { id }, select: { updatedAt: true, slug: true } });
    case "articles": return prisma.client.article.findUnique({ where: { id }, select: { updatedAt: true, slug: true } });
    case "workshops": return prisma.client.event.findUnique({ where: { id }, select: { updatedAt: true, slug: true } });
  }
}

async function slugConflict(domain: ContentDomain, slug: string, id?: string) {
  switch (domain) {
    case "services": return Boolean(await prisma.client.service.findFirst({ where: { slug, ...(id ? { NOT: { id } } : {}) }, select: { id: true } }));
    case "research": return Boolean(await prisma.client.researchItem.findFirst({ where: { slug, ...(id ? { NOT: { id } } : {}) }, select: { id: true } }));
    case "experts": return Boolean(await prisma.client.expert.findFirst({ where: { slug, ...(id ? { NOT: { id } } : {}) }, select: { id: true } }));
    case "articles": return Boolean(await prisma.client.article.findFirst({ where: { slug, ...(id ? { NOT: { id } } : {}) }, select: { id: true } }));
    case "workshops": return Boolean(await prisma.client.event.findFirst({ where: { slug, ...(id ? { NOT: { id } } : {}) }, select: { id: true } }));
  }
}

async function createDomainRecord(domain: ContentDomain, data: any) {
  switch (domain) {
    case "services": return prisma.client.service.create({ data });
    case "research": return prisma.client.researchItem.create({ data });
    case "experts": return prisma.client.expert.create({ data });
    case "articles": return prisma.client.article.create({ data });
    case "workshops": return prisma.client.event.create({ data });
  }
}

async function updateDomainRecord(domain: ContentDomain, id: string, data: any) {
  switch (domain) {
    case "services": return prisma.client.service.update({ where: { id }, data });
    case "research": return prisma.client.researchItem.update({ where: { id }, data });
    case "experts": return prisma.client.expert.update({ where: { id }, data });
    case "articles": return prisma.client.article.update({ where: { id }, data });
    case "workshops": return prisma.client.event.update({ where: { id }, data });
  }
}

async function syncRelations(domain: ContentDomain, id: string, ids: ReturnType<typeof parseForm>["ids"], current: any) {
  const tx = prisma.client;
  await tx.$transaction(async (db) => {
    switch (domain) {
      case "services":
        await db.researchService.deleteMany({ where: { serviceId: id } });
        await db.articleService.deleteMany({ where: { serviceId: id } });
        await db.workshopService.deleteMany({ where: { serviceId: id } });
        await db.expertService.deleteMany({ where: { serviceId: id } });
        await db.researchService.createMany({ data: cleanRelationIds(ids.research, id).map((researchId) => ({ serviceId: id, researchId })) });
        await db.articleService.createMany({ data: cleanRelationIds(ids.articles, id).map((articleId) => ({ serviceId: id, articleId })) });
        await db.workshopService.createMany({ data: cleanRelationIds(ids.workshops, id).map((eventId) => ({ serviceId: id, eventId })) });
        await db.expertService.createMany({ data: cleanRelationIds(ids.experts, id).map((expertId) => ({ serviceId: id, expertId })) });
        break;
      case "research":
        await db.researchService.deleteMany({ where: { researchId: id } });
        await db.expertResearch.deleteMany({ where: { researchId: id } });
        await db.articleResearch.deleteMany({ where: { researchId: id } });
        await db.workshopResearch.deleteMany({ where: { researchId: id } });
        await db.researchService.createMany({ data: cleanRelationIds(ids.services, id).map((serviceId) => ({ researchId: id, serviceId })) });
        await db.expertResearch.createMany({ data: cleanRelationIds(ids.experts, id).map((expertId) => ({ researchId: id, expertId })) });
        await db.articleResearch.createMany({ data: cleanRelationIds(ids.articles, id).map((articleId) => ({ researchId: id, articleId })) });
        await db.workshopResearch.createMany({ data: cleanRelationIds(ids.workshops, id).map((eventId) => ({ researchId: id, eventId })) });
        break;
      case "experts":
        await db.expertResearch.deleteMany({ where: { expertId: id } });
        await db.expertService.deleteMany({ where: { expertId: id } });
        await db.articleExpert.deleteMany({ where: { expertId: id } });
        await db.expertResearch.createMany({ data: cleanRelationIds(ids.research, id).map((researchId) => ({ expertId: id, researchId })) });
        await db.expertService.createMany({ data: cleanRelationIds(ids.services, id).map((serviceId) => ({ expertId: id, serviceId })) });
        await db.articleExpert.createMany({ data: cleanRelationIds(ids.articles, id).map((articleId) => ({ expertId: id, articleId })) });
        break;
      case "articles":
        await db.articleResearch.deleteMany({ where: { articleId: id } });
        await db.articleService.deleteMany({ where: { articleId: id } });
        await db.articleExpert.deleteMany({ where: { articleId: id } });
        await db.articleRelation.deleteMany({ where: { sourceArticleId: id } });
        await db.articleResearch.createMany({ data: cleanRelationIds(ids.research, id).map((researchId) => ({ articleId: id, researchId })) });
        await db.articleService.createMany({ data: cleanRelationIds(ids.services, id).map((serviceId) => ({ articleId: id, serviceId })) });
        await db.articleExpert.createMany({ data: cleanRelationIds(ids.experts, id).map((expertId) => ({ articleId: id, expertId })) });
        await db.articleRelation.createMany({ data: cleanRelationIds(ids.articles, id).map((targetArticleId) => ({ sourceArticleId: id, targetArticleId })) });
        break;
      case "workshops":
        await db.workshopResearch.deleteMany({ where: { eventId: id } });
        await db.workshopService.deleteMany({ where: { eventId: id } });
        await db.eventRelation.deleteMany({ where: { sourceEventId: id } });
        await db.workshopResearch.createMany({ data: cleanRelationIds(ids.research, id).map((researchId) => ({ eventId: id, researchId })) });
        await db.workshopService.createMany({ data: cleanRelationIds(ids.services, id).map((serviceId) => ({ eventId: id, serviceId })) });
        await db.eventRelation.createMany({ data: cleanRelationIds(ids.workshops, id).map((targetEventId) => ({ sourceEventId: id, targetEventId })) });
        break;
    }
  });
}

function revalidateDomain(domain: ContentDomain, slug: string, previousSlug?: string) {
  const publicBase = domain === "workshops" ? "/workshops" : `/${domain}`;
  revalidatePath(publicBase);
  revalidatePath(`${publicBase}/${slug}`);
  if (previousSlug && previousSlug !== slug) revalidatePath(`${publicBase}/${previousSlug}`);
}
