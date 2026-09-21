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

const initialState: ContentActionState = { message: null, fieldErrors: {} };

function value(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function ids(formData: FormData, name: string) {
  return Array.from(new Set(formData.getAll(name).map(String).map((item) => item.trim()).filter(Boolean)));
}

function parseJson(valueToParse: string, field: string, errors: Record<string, string>) {
  if (!valueToParse) return undefined;
  try {
    return JSON.parse(valueToParse) as unknown;
  } catch {
    errors[field] = "Enter valid JSON.";
    return undefined;
  }
}

function parseDate(valueToParse: string) {
  if (!valueToParse) return undefined;
  const date = new Date(valueToParse);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function parseSchedule(valueToParse: string, timeZone: string, errors: Record<string, string>) {
  if (!valueToParse) return undefined;
  const normalizedTimeZone = timeZone.trim() || "UTC";
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: normalizedTimeZone }).format();
  } catch {
    errors.publishAt = "Choose a valid timezone.";
    return undefined;
  }
  // datetime-local is interpreted deliberately in the selected IANA timezone.
  const [datePart, timePart] = valueToParse.split("T");
  if (!datePart || !timePart) {
    errors.publishAt = "Enter a valid scheduled date and time.";
    return undefined;
  }
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  if (![year, month, day, hour, minute].every(Number.isFinite)) {
    errors.publishAt = "Enter a valid scheduled date and time.";
    return undefined;
  }
  let guess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: normalizedTimeZone,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(guess);
    const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
    const rendered = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
    const diff = rendered - guess.getTime();
    if (diff === 0) return guess;
    guess = new Date(guess.getTime() - diff);
  }
  return guess;
}

function validateBase(fields: Record<string, string>) {
  const errors: Record<string, string> = {};
  if (!fields.title || fields.title.length > 200) errors.title = "Title is required and must be 200 characters or fewer.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fields.slug)) errors.slug = "Use lowercase letters, numbers and single hyphens.";
  if (fields.category.length > 120) errors.category = "Category is too long.";
  if (fields.shortDescription.length > 1000) errors.shortDescription = "Keep the short description under 1000 characters.";
  if (fields.order && !Number.isInteger(Number(fields.order))) errors.order = "Order must be a whole number.";
  if (fields.date && !parseDate(fields.date)) errors.date = "Enter a valid date.";
  if (fields.endDate && !parseDate(fields.endDate)) errors.endDate = "Enter a valid end date.";
  if (fields.date && fields.endDate && parseDate(fields.date) && parseDate(fields.endDate) && parseDate(fields.endDate)! < parseDate(fields.date)!) {
    errors.endDate = "End date cannot be earlier than the event date.";
  }
  return errors;
}

function validateJsonShapes(domain: ContentDomain, json: Record<string, unknown>, errors: Record<string, string>) {
  const arrayFields =
    domain === "services" ? ["highlights", "faq"] :
    domain === "research" ? ["tags", "audience", "highlights", "scope", "topics", "sections"] :
    domain === "experts" ? ["audience", "tags", "topics"] :
    domain === "articles" ? ["tags", "sections"] : ["audience"];

  for (const field of arrayFields) {
    if (json[field] !== undefined && !Array.isArray(json[field])) errors[field] = "This field must be a JSON array.";
  }

  if (domain === "research" && json.methodology !== undefined &&
      (typeof json.methodology !== "object" || json.methodology === null || Array.isArray(json.methodology))) {
    errors.methodology = "Methodology must be a JSON object.";
  }
}

function validatePublished(domain: ContentDomain, fields: Record<string, string>) {
  const errors = validateBase(fields);
  if (domain === "workshops" && !fields.date) errors.date = "Date is required for a workshop / event.";
  if (!fields.shortDescription && domain !== "experts") errors.shortDescription = "A published record needs a short description.";
  if (domain === "research" && !fields.summary) errors.summary = "A published research record needs summary content.";
  if (domain === "articles" && !fields.excerpt && !fields.content && !fields.sections) errors.content = "A published article needs editorial content.";
  if (domain === "experts" && !fields.shortDescription && !fields.description) errors.shortDescription = "A published expert needs profile content.";
  if (domain === "workshops" && !parseDate(fields.date)) errors.date = "A published workshop needs a valid date.";
  return errors;
}

type RelationIds = {
  services: string[];
  research: string[];
  experts: string[];
  articles: string[];
  workshops: string[];
};

async function validateRelationsExist(relationIds: RelationIds, errors: Record<string, string>) {
  const counts = await Promise.all([
    relationIds.services.length ? prisma.client.service.count({ where: { id: { in: relationIds.services } } }) : 0,
    relationIds.research.length ? prisma.client.researchItem.count({ where: { id: { in: relationIds.research } } }) : 0,
    relationIds.experts.length ? prisma.client.expert.count({ where: { id: { in: relationIds.experts } } }) : 0,
    relationIds.articles.length ? prisma.client.article.count({ where: { id: { in: relationIds.articles } } }) : 0,
    relationIds.workshops.length ? prisma.client.event.count({ where: { id: { in: relationIds.workshops } } }) : 0,
  ]);
  const names = ["Services", "Research", "Experts", "Articles", "Workshops / Events"];
  counts.forEach((count, index) => {
    const selected = Object.values(relationIds)[index];
    if (count !== selected.length && selected.length) errors.relationships = names[index] + " contains a record that no longer exists.";
  });
}

async function validateMediaReference(domain: ContentDomain, mediaId: string, errors: Record<string, string>) {
  if (!mediaId || domain === "services") return undefined;
  const media = await prisma.client.mediaAsset.findUnique({ where: { id: mediaId }, select: { id: true, publicUrl: true, status: true, mimeType: true } });
  if (!media) { errors.imageMediaId = "Selected media asset no longer exists."; return undefined; }
  if (media.status !== "ACTIVE") { errors.imageMediaId = "Archived media cannot be selected for content."; return undefined; }
  if (!["image/jpeg", "image/png", "image/webp"].includes(media.mimeType)) { errors.imageMediaId = "Selected media type is not supported."; return undefined; }
  return media;
}

async function validatePublishedRelations(relationIds: RelationIds, speakerId: string, errors: Record<string, string>) {
  const counts = await Promise.all([
    relationIds.services.length ? prisma.client.service.count({ where: { id: { in: relationIds.services }, status: { not: "PUBLISHED" } } }) : 0,
    relationIds.research.length ? prisma.client.researchItem.count({ where: { id: { in: relationIds.research }, status: { not: "PUBLISHED" } } }) : 0,
    relationIds.experts.length ? prisma.client.expert.count({ where: { id: { in: relationIds.experts }, status: { not: "PUBLISHED" } } }) : 0,
    relationIds.articles.length ? prisma.client.article.count({ where: { id: { in: relationIds.articles }, status: { not: "PUBLISHED" } } }) : 0,
    relationIds.workshops.length ? prisma.client.event.count({ where: { id: { in: relationIds.workshops }, status: { not: "PUBLISHED" } } }) : 0,
    speakerId ? prisma.client.expert.count({ where: { id: speakerId, status: { not: "PUBLISHED" } } }) : 0,
  ]);
  const names = ["Services", "Research", "Experts", "Articles", "Workshops / Events", "Speaker"];
  const index = counts.findIndex((count) => count > 0);
  if (index >= 0) errors.relationships = names[index] + " must be published before this record can be published.";
}

function readForm(formData: FormData) {
  const fields: Record<string, string> = {
    title: value(formData, "title"),
    slug: value(formData, "slug"),
    category: value(formData, "category"),
    shortDescription: value(formData, "shortDescription"),
    description: value(formData, "description"),
    order: value(formData, "order"),
    date: value(formData, "date"),
    endDate: value(formData, "endDate"),
    time: value(formData, "time"),
    location: value(formData, "location"),
    format: value(formData, "format"),
    availability: value(formData, "availability"),
    type: value(formData, "type"),
    topic: value(formData, "topic"),
    image: value(formData, "image"),
    imageMediaId: value(formData, "imageMediaId"),
    seoTitle: value(formData, "seoTitle"),
    seoDescription: value(formData, "seoDescription"),
    seoImage: value(formData, "seoImage"),
    seoCanonical: value(formData, "seoCanonical"),
    need: value(formData, "need"),
    focus: value(formData, "focus"),
    audience: value(formData, "audience"),
    highlights: value(formData, "highlights"),
    faq: value(formData, "faq"),
    summary: value(formData, "summary"),
    tags: value(formData, "tags"),
    scope: value(formData, "scope"),
    topics: value(formData, "topics"),
    sections: value(formData, "sections"),
    methodology: value(formData, "methodology"),
    content: value(formData, "content"),
    excerpt: value(formData, "excerpt"),
    author: value(formData, "author"),
    authorRole: value(formData, "authorRole"),
    authorSlug: value(formData, "authorSlug"),
    registrationLabel: value(formData, "registrationLabel"),
    registrationHref: value(formData, "registrationHref"),
    registrationStatus: value(formData, "registrationStatus"),
    speakerRole: value(formData, "speakerRole"),
    speakerId: value(formData, "speakerId"),
    speakerSlug: "",
    featured: formData.get("featured") === "on" ? "true" : "false",
    seoNoIndex: formData.get("seoNoIndex") === "on" ? "true" : "false",
  };

  const errors: Record<string, string> = {};
  const json: Record<string, unknown> = {};
  for (const field of ["audience", "highlights", "faq", "tags", "scope", "topics", "sections", "methodology"]) {
    json[field] = parseJson(fields[field], field, errors);
  }

  const relationIds: RelationIds = {
    services: ids(formData, "relationServiceIds"),
    research: ids(formData, "relationResearchIds"),
    experts: ids(formData, "relationExpertIds"),
    articles: ids(formData, "relationArticleIds"),
    workshops: ids(formData, "relationWorkshopIds"),
  };

  return { fields, json, errors, relationIds };
}

function common(fields: Record<string, string>, status: "DRAFT" | "PUBLISHED" | "ARCHIVED", publishAt: Date | null = null) {
  const order = Number.parseInt(fields.order || "0", 10);
  return {
    slug: fields.slug,
    status,
    featured: fields.featured === "true",
    order: Number.isFinite(order) ? order : 0,
  };
}

function buildData(domain: ContentDomain, fields: Record<string, string>, json: Record<string, unknown>, status: "DRAFT" | "PUBLISHED" | "ARCHIVED", publishAt: Date | null = null): unknown {
  const shared = common(fields, status, publishAt);
  switch (domain) {
    case "services":
      return {
        ...shared, title: fields.title, category: fields.category, shortDescription: fields.shortDescription,
        need: fields.need || null, focus: fields.focus || null, audience: fields.audience || null,
        highlights: json.highlights ?? null, faq: json.faq ?? null,
        availability: fields.availability === "COMING_SOON" ? "COMING_SOON" : "AVAILABLE",
        seoTitle: fields.seoTitle || null, seoDescription: fields.seoDescription || null, seoImage: fields.seoImage || null,
        seoCanonical: fields.seoCanonical || null, seoNoIndex: fields.seoNoIndex === "true",
      };
    case "research":
      return {
        ...shared, title: fields.title, category: fields.category, shortDescription: fields.shortDescription,
        summary: fields.summary || null, date: parseDate(fields.date) ?? null,
        availability: fields.availability === "COMING_SOON" ? "COMING_SOON" : "AVAILABLE",
        type: fields.type || null, topic: fields.topic || null, image: fields.image || null, imageMediaId: fields.imageMediaId || null,
        tags: json.tags ?? null, highlights: json.highlights ?? null, audience: json.audience ?? null,
        scope: json.scope ?? null, topics: json.topics ?? null, sections: json.sections ?? null, methodology: json.methodology ?? null,
        seoTitle: fields.seoTitle || null, seoDescription: fields.seoDescription || null, seoImage: fields.seoImage || null,
        seoCanonical: fields.seoCanonical || null, seoNoIndex: fields.seoNoIndex === "true",
      };
    case "experts":
      return {
        name: fields.title, slug: fields.slug, discipline: fields.category || null, shortBio: fields.shortDescription || null,
        bio: fields.description || null, role: fields.type || null, order: shared.order, image: fields.image || null, profileMediaId: fields.imageMediaId || null,
        expertise: json.audience ?? null, qualifications: json.tags ?? null, researchInterests: json.topics ?? null,
        featured: shared.featured, status,
        seoTitle: fields.seoTitle || null, seoDescription: fields.seoDescription || null, seoImage: fields.seoImage || null,
        seoCanonical: fields.seoCanonical || null, seoNoIndex: fields.seoNoIndex === "true",
      };
    case "articles":
      return {
        ...shared, title: fields.title, category: fields.category, date: parseDate(fields.date) ?? null,
        excerpt: fields.excerpt || null, author: fields.author || null, authorRole: fields.authorRole || null,
        authorSlug: fields.authorSlug || null, content: fields.content || null, sections: json.sections ?? null,
        image: fields.image || null, coverMediaId: fields.imageMediaId || null, tags: json.tags ?? null,
        seoTitle: fields.seoTitle || null, seoDescription: fields.seoDescription || null, seoImage: fields.seoImage || null,
      };
    case "workshops":
      return {
        ...shared, title: fields.title, category: fields.category, date: parseDate(fields.date) ?? new Date(0),
        endDate: parseDate(fields.endDate) ?? null, time: fields.time || null, location: fields.location || null,
        format: ["ONLINE", "IN_PERSON", "HYBRID"].includes(fields.format) ? fields.format : null,
        shortDescription: fields.shortDescription, description: fields.description || null, audience: json.audience ?? null,
        speakerId: fields.speakerId || null, speakerSlug: fields.speakerSlug || null, speakerRole: fields.speakerRole || null, image: fields.image || null, coverMediaId: fields.imageMediaId || null,
        registrationLabel: fields.registrationLabel || null, registrationHref: fields.registrationHref || null,
        registrationStatus: ["REGISTRATION_OPEN", "REGISTRATION_CLOSED", "COMING_SOON", "COMPLETED"].includes(fields.registrationStatus) ? fields.registrationStatus : null,
        seoTitle: fields.seoTitle || null, seoDescription: fields.seoDescription || null, seoImage: fields.seoImage || null,
      };
  }
}

async function createRecord(tx: Prisma.TransactionClient, domain: ContentDomain, data: unknown) {
  switch (domain) {
    case "services": return tx.service.create({ data: data as Prisma.ServiceUncheckedCreateInput });
    case "research": return tx.researchItem.create({ data: data as Prisma.ResearchItemUncheckedCreateInput });
    case "experts": return tx.expert.create({ data: data as Prisma.ExpertUncheckedCreateInput });
    case "articles": return tx.article.create({ data: data as Prisma.ArticleUncheckedCreateInput });
    case "workshops": return tx.event.create({ data: data as Prisma.EventUncheckedCreateInput });
  }
}

async function updateRecord(tx: Prisma.TransactionClient, domain: ContentDomain, id: string, data: unknown) {
  switch (domain) {
    case "services": return tx.service.update({ where: { id }, data: data as Prisma.ServiceUncheckedUpdateInput });
    case "research": return tx.researchItem.update({ where: { id }, data: data as Prisma.ResearchItemUncheckedUpdateInput });
    case "experts": return tx.expert.update({ where: { id }, data: data as Prisma.ExpertUncheckedUpdateInput });
    case "articles": return tx.article.update({ where: { id }, data: data as Prisma.ArticleUncheckedUpdateInput });
    case "workshops": return tx.event.update({ where: { id }, data: data as Prisma.EventUncheckedUpdateInput });
  }
}

async function syncRelations(tx: Prisma.TransactionClient, domain: ContentDomain, id: string, relationIds: RelationIds) {
  const clean = (items: string[]) => Array.from(new Set(items)).filter((item) => item !== id);
  switch (domain) {
    case "services":
      await tx.researchService.deleteMany({ where: { serviceId: id } });
      await tx.articleService.deleteMany({ where: { serviceId: id } });
      await tx.workshopService.deleteMany({ where: { serviceId: id } });
      await tx.expertService.deleteMany({ where: { serviceId: id } });
      await tx.researchService.createMany({ data: clean(relationIds.research).map((researchId) => ({ serviceId: id, researchId })) });
      await tx.articleService.createMany({ data: clean(relationIds.articles).map((articleId) => ({ serviceId: id, articleId })) });
      await tx.workshopService.createMany({ data: clean(relationIds.workshops).map((eventId) => ({ serviceId: id, eventId })) });
      await tx.expertService.createMany({ data: clean(relationIds.experts).map((expertId) => ({ serviceId: id, expertId })) });
      break;
    case "research":
      await tx.researchService.deleteMany({ where: { researchId: id } });
      await tx.expertResearch.deleteMany({ where: { researchId: id } });
      await tx.articleResearch.deleteMany({ where: { researchId: id } });
      await tx.workshopResearch.deleteMany({ where: { researchId: id } });
      await tx.researchService.createMany({ data: clean(relationIds.services).map((serviceId) => ({ researchId: id, serviceId })) });
      await tx.expertResearch.createMany({ data: clean(relationIds.experts).map((expertId) => ({ researchId: id, expertId })) });
      await tx.articleResearch.createMany({ data: clean(relationIds.articles).map((articleId) => ({ researchId: id, articleId })) });
      await tx.workshopResearch.createMany({ data: clean(relationIds.workshops).map((eventId) => ({ researchId: id, eventId })) });
      break;
    case "experts":
      await tx.expertResearch.deleteMany({ where: { expertId: id } });
      await tx.expertService.deleteMany({ where: { expertId: id } });
      await tx.articleExpert.deleteMany({ where: { expertId: id } });
      await tx.expertResearch.createMany({ data: clean(relationIds.research).map((researchId) => ({ expertId: id, researchId })) });
      await tx.expertService.createMany({ data: clean(relationIds.services).map((serviceId) => ({ expertId: id, serviceId })) });
      await tx.articleExpert.createMany({ data: clean(relationIds.articles).map((articleId) => ({ articleId, expertId: id })) });
      break;
    case "articles":
      await tx.articleResearch.deleteMany({ where: { articleId: id } });
      await tx.articleService.deleteMany({ where: { articleId: id } });
      await tx.articleExpert.deleteMany({ where: { articleId: id } });
      await tx.articleRelation.deleteMany({ where: { sourceArticleId: id } });
      await tx.articleResearch.createMany({ data: clean(relationIds.research).map((researchId) => ({ articleId: id, researchId })) });
      await tx.articleService.createMany({ data: clean(relationIds.services).map((serviceId) => ({ articleId: id, serviceId })) });
      await tx.articleExpert.createMany({ data: clean(relationIds.experts).map((expertId) => ({ articleId: id, expertId })) });
      await tx.articleRelation.createMany({ data: clean(relationIds.articles).map((targetArticleId) => ({ sourceArticleId: id, targetArticleId })) });
      break;
    case "workshops":
      await tx.workshopResearch.deleteMany({ where: { eventId: id } });
      await tx.workshopService.deleteMany({ where: { eventId: id } });
      await tx.eventRelation.deleteMany({ where: { sourceEventId: id } });
      await tx.workshopResearch.createMany({ data: clean(relationIds.research).map((researchId) => ({ eventId: id, researchId })) });
      await tx.workshopService.createMany({ data: clean(relationIds.services).map((serviceId) => ({ eventId: id, serviceId })) });
      await tx.eventRelation.createMany({ data: clean(relationIds.workshops).map((targetEventId) => ({ sourceEventId: id, targetEventId })) });
      break;
  }
}

async function currentRecord(domain: ContentDomain, id: string) {
  switch (domain) {
    case "services": return prisma.client.service.findUnique({ where: { id }, select: { updatedAt: true, slug: true, status: true, publishAt: true } });
    case "research": return prisma.client.researchItem.findUnique({ where: { id }, select: { updatedAt: true, slug: true, status: true, publishAt: true } });
    case "experts": return prisma.client.expert.findUnique({ where: { id }, select: { updatedAt: true, slug: true, status: true, publishAt: true } });
    case "articles": return prisma.client.article.findUnique({ where: { id }, select: { updatedAt: true, slug: true, status: true, publishAt: true } });
    case "workshops": return prisma.client.event.findUnique({ where: { id }, select: { updatedAt: true, slug: true, status: true, publishAt: true } });
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

function revalidateDomain(domain: ContentDomain, slug: string, previousSlug?: string) {
  const publicBase = domain === "workshops" ? "/workshops" : "/" + domain;
  revalidatePath("/");
  revalidatePath(publicBase);
  revalidatePath(publicBase + "/" + slug);
  if (previousSlug && previousSlug !== slug) revalidatePath(publicBase + "/" + previousSlug);
}

export async function saveContent(
  _previous: ContentActionState = initialState,
  formData: FormData,
): Promise<ContentActionState> {
  void _previous;
  await requireAdmin();

  const domainValue = value(formData, "domain");
  if (!isContentDomain(domainValue)) return { message: "Unknown content domain.", fieldErrors: {} };
  const domain = domainValue;
  const id = value(formData, "id") || undefined;
  const parsed = readForm(formData);
  const intent = value(formData, "intent") || "save";
  const errors = { ...parsed.errors, ...validateBase(parsed.fields) };
  if (domain === "workshops" && !parsed.fields.date) errors.date = "Date is required for a workshop / event.";
  validateJsonShapes(domain, parsed.json, errors);
  await validateRelationsExist(parsed.relationIds, errors);
  const media = await validateMediaReference(domain, parsed.fields.imageMediaId, errors);
  if (media) parsed.fields.image = media.publicUrl;

  if (domain === "workshops" && parsed.fields.speakerId) {
    const speaker = await prisma.client.expert.findUnique({ where: { id: parsed.fields.speakerId }, select: { id: true, slug: true } });
    if (!speaker) errors.speakerId = "Selected speaker no longer exists.";
    else parsed.fields.speakerSlug = speaker.slug;
  }

  if (Object.keys(errors).length) return { message: "Fix the highlighted fields.", fieldErrors: errors };

  const current = id ? await currentRecord(domain, id) : null;
  if (id && !current) return { message: "The content record no longer exists.", fieldErrors: {} };

  const requestedSchedule = intent === "schedule" ? parseSchedule(parsed.fields.publishAt, parsed.fields.publishTimeZone, errors) : undefined;
  if (intent === "schedule" && requestedSchedule && requestedSchedule <= new Date()) {
    errors.publishAt = "Scheduled publication must be in the future.";
  }
  if (intent === "schedule" && !parsed.fields.publishAt) {
    errors.publishAt = "Choose a future publication date and time.";
  }
  const status = intent === "publish" ? "PUBLISHED" : intent === "archive" ? "ARCHIVED" : (intent === "unpublish" || intent === "cancelSchedule" || intent === "schedule") ? "DRAFT" : current?.status ?? "DRAFT";
  const publishAt = intent === "publish" ? new Date() : intent === "schedule" ? (requestedSchedule ?? null) : (intent === "unpublish" || intent === "archive" || intent === "cancelSchedule") ? null : undefined;

  if (status === "PUBLISHED") {
    const publicationErrors = validatePublished(domain, parsed.fields);
    await validatePublishedRelations(parsed.relationIds, parsed.fields.speakerId, publicationErrors);
    if (Object.keys(publicationErrors).length) return { message: "This content is not ready to publish.", fieldErrors: publicationErrors };
  }

  if (await slugConflict(domain, parsed.fields.slug, id)) {
    return { message: "That slug is already in use.", fieldErrors: { slug: "Choose a unique slug." } };
  }
  if (id && current?.status === "PUBLISHED" && current.slug !== parsed.fields.slug) {
    return { message: "Published slugs cannot be changed in Phase 8.11. Unpublish the record first or keep its current slug.", fieldErrors: { slug: "Keep the current slug while published." } };
  }

  const expectedUpdatedAt = value(formData, "updatedAt");
  if (id && current && expectedUpdatedAt && new Date(expectedUpdatedAt).getTime() !== current.updatedAt.getTime()) {
    return { message: "This content changed while you were editing it. Reload the record and review the newer version before saving.", fieldErrors: {} };
  }

  const data = buildData(domain, parsed.fields, parsed.json, status, publishAt === undefined ? current?.publishAt ?? null : publishAt);

  let result: { id: string; previousSlug?: string } | undefined;
  try {
    result = await prisma.client.$transaction(async (tx) => {
      const record = id
        ? await updateRecord(tx, domain, id, data)
        : await createRecord(tx, domain, data);
      await syncRelations(tx, domain, record.id, parsed.relationIds);
      return { id: record.id, previousSlug: current?.slug };
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { message: "That slug is already in use.", fieldErrors: { slug: "Choose a unique slug." } };
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return { message: "The record changed or no longer exists. Reload and try again.", fieldErrors: {} };
    }
    console.error("Admin content mutation failed:", error);
    return { message: "The content could not be saved. Please try again.", fieldErrors: {} };
  }

  if (!result) return { message: "The content could not be saved. Please try again.", fieldErrors: {} };
  revalidateDomain(domain, parsed.fields.slug, result.previousSlug);
  redirect(contentBasePath(domain) + "/" + result.id + "/edit?saved=1");
}


export async function createPreview(formData: FormData) {
  const admin = await requireAdmin();
  void admin;
  const domainValue = value(formData, "domain");
  const id = value(formData, "id");
  if (!isContentDomain(domainValue) || !id) throw new Error("Invalid preview request.");
  const record = await currentRecord(domainValue, id);
  if (!record) throw new Error("Content record not found.");
  const { createPreviewToken } = await import("@/lib/admin/preview");
  const token = createPreviewToken(domainValue, id);
  redirect(`/admin/preview/${domainValue}/${id}?token=${encodeURIComponent(token)}`);
}
