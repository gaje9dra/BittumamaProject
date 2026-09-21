import { prisma } from "../db/prisma";
type ContentDomain = "services" | "research" | "experts" | "articles" | "workshops";

const DOMAINS: ContentDomain[] = ["services", "research", "experts", "articles", "workshops"];

function slugIsValid(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

async function validateScheduledRecord(domain: ContentDomain, id: string) {
  const db = prisma.client;
  const errors: string[] = [];

  switch (domain) {
    case "services": {
      const record = await db.service.findUnique({ where: { id }, include: { researchLinks: true, articleLinks: true, workshopLinks: true, expertLinks: true } });
      if (!record) return ["Record no longer exists."];
      if (!record.title || !slugIsValid(record.slug) || !record.shortDescription) errors.push("Required service fields are incomplete.");
      const relationChecks = await Promise.all([
        ...record.researchLinks.map((r) => db.researchItem.findUnique({ where: { id: r.researchId }, select: { status: true, publishAt: true } })),
        ...record.articleLinks.map((r) => db.article.findUnique({ where: { id: r.articleId }, select: { status: true, publishAt: true } })),
        ...record.workshopLinks.map((r) => db.event.findUnique({ where: { id: r.eventId }, select: { status: true, publishAt: true } })),
        ...record.expertLinks.map((r) => db.expert.findUnique({ where: { id: r.expertId }, select: { status: true, publishAt: true } })),
      ]);
      if (relationChecks.some((r) => !r || r.status !== "PUBLISHED" || (r.publishAt && r.publishAt > new Date()))) errors.push("A required related record is not publicly published.");
      break;
    }
    case "research": {
      const record = await db.researchItem.findUnique({ where: { id }, include: { serviceLinks: true, expertLinks: true, articleLinks: true, workshopLinks: true } });
      if (!record) return ["Record no longer exists."];
      if (!record.title || !slugIsValid(record.slug) || !record.shortDescription || !record.summary) errors.push("Required research fields are incomplete.");
      const relationChecks = await Promise.all([
        ...record.serviceLinks.map((r) => db.service.findUnique({ where: { id: r.serviceId }, select: { status: true, publishAt: true } })),
        ...record.expertLinks.map((r) => db.expert.findUnique({ where: { id: r.expertId }, select: { status: true, publishAt: true } })),
        ...record.articleLinks.map((r) => db.article.findUnique({ where: { id: r.articleId }, select: { status: true, publishAt: true } })),
        ...record.workshopLinks.map((r) => db.event.findUnique({ where: { id: r.eventId }, select: { status: true, publishAt: true } })),
      ]);
      if (relationChecks.some((r) => !r || r.status !== "PUBLISHED" || (r.publishAt && r.publishAt > new Date()))) errors.push("A required related record is not publicly published.");
      if (record.imageMediaId) {
        const media = await db.mediaAsset.findUnique({ where: { id: record.imageMediaId }, select: { status: true, mimeType: true } });
        if (!media || media.status !== "ACTIVE" || !["image/jpeg", "image/png", "image/webp"].includes(media.mimeType)) errors.push("The referenced media asset is unavailable.");
      }
      break;
    }
    case "experts": {
      const record = await db.expert.findUnique({ where: { id }, include: { researchLinks: true, serviceLinks: true, articleLinks: true } });
      if (!record) return ["Record no longer exists."];
      if (!record.name || !slugIsValid(record.slug) || (!record.shortBio && !record.bio)) errors.push("Required expert profile fields are incomplete.");
      const relationChecks = await Promise.all([
        ...record.researchLinks.map((r) => db.researchItem.findUnique({ where: { id: r.researchId }, select: { status: true, publishAt: true } })),
        ...record.serviceLinks.map((r) => db.service.findUnique({ where: { id: r.serviceId }, select: { status: true, publishAt: true } })),
        ...record.articleLinks.map((r) => db.article.findUnique({ where: { id: r.articleId }, select: { status: true, publishAt: true } })),
      ]);
      if (relationChecks.some((r) => !r || r.status !== "PUBLISHED" || (r.publishAt && r.publishAt > new Date()))) errors.push("A required related record is not publicly published.");
      if (record.profileMediaId) {
        const media = await db.mediaAsset.findUnique({ where: { id: record.profileMediaId }, select: { status: true, mimeType: true } });
        if (!media || media.status !== "ACTIVE" || !["image/jpeg", "image/png", "image/webp"].includes(media.mimeType)) errors.push("The referenced media asset is unavailable.");
      }
      break;
    }
    case "articles": {
      const record = await db.article.findUnique({ where: { id }, include: { researchLinks: true, serviceLinks: true, expertLinks: true, relatedFrom: true } });
      if (!record) return ["Record no longer exists."];
      if (!record.title || !slugIsValid(record.slug) || (!record.excerpt && !record.content && !record.sections)) errors.push("Required article content is incomplete.");
      const relationChecks = await Promise.all([
        ...record.researchLinks.map((r) => db.researchItem.findUnique({ where: { id: r.researchId }, select: { status: true, publishAt: true } })),
        ...record.serviceLinks.map((r) => db.service.findUnique({ where: { id: r.serviceId }, select: { status: true, publishAt: true } })),
        ...record.expertLinks.map((r) => db.expert.findUnique({ where: { id: r.expertId }, select: { status: true, publishAt: true } })),
        ...record.relatedFrom.map((r) => db.article.findUnique({ where: { id: r.targetArticleId }, select: { status: true, publishAt: true } })),
      ]);
      if (relationChecks.some((r) => !r || r.status !== "PUBLISHED" || (r.publishAt && r.publishAt > new Date()))) errors.push("A required related record is not publicly published.");
      if (record.coverMediaId) {
        const media = await db.mediaAsset.findUnique({ where: { id: record.coverMediaId }, select: { status: true, mimeType: true } });
        if (!media || media.status !== "ACTIVE" || !["image/jpeg", "image/png", "image/webp"].includes(media.mimeType)) errors.push("The referenced media asset is unavailable.");
      }
      break;
    }
    case "workshops": {
      const record = await db.event.findUnique({ where: { id }, include: { researchLinks: true, serviceLinks: true, relatedFrom: true, speaker: { select: { status: true, publishAt: true } } } });
      if (!record) return ["Record no longer exists."];
      if (!record.title || !slugIsValid(record.slug) || !record.shortDescription || !record.date || Number.isNaN(record.date.getTime())) errors.push("Required event fields are incomplete.");
      const relationChecks = await Promise.all([
        ...record.researchLinks.map((r) => db.researchItem.findUnique({ where: { id: r.researchId }, select: { status: true, publishAt: true } })),
        ...record.serviceLinks.map((r) => db.service.findUnique({ where: { id: r.serviceId }, select: { status: true, publishAt: true } })),
        ...record.relatedFrom.map((r) => db.event.findUnique({ where: { id: r.targetEventId }, select: { status: true, publishAt: true } })),
      ]);
      if (record.speaker && (record.speaker.status !== "PUBLISHED" || (record.speaker.publishAt && record.speaker.publishAt > new Date()))) errors.push("The selected speaker is not publicly published.");
      if (relationChecks.some((r) => !r || r.status !== "PUBLISHED" || (r.publishAt && r.publishAt > new Date()))) errors.push("A required related record is not publicly published.");
      if (record.coverMediaId) {
        const media = await db.mediaAsset.findUnique({ where: { id: record.coverMediaId }, select: { status: true, mimeType: true } });
        if (!media || media.status !== "ACTIVE" || !["image/jpeg", "image/png", "image/webp"].includes(media.mimeType)) errors.push("The referenced media asset is unavailable.");
      }
      break;
    }
  }

  return errors;
}

export async function publishScheduledContent(now = new Date()) {
  const published: Array<{ domain: ContentDomain; id: string; slug: string }> = [];
  const failed: Array<{ domain: ContentDomain; id: string; errors: string[] }> = [];

  for (const domain of DOMAINS) {
    const candidates = await (domain === "services"
      ? prisma.client.service.findMany({ where: { status: "DRAFT", publishAt: { lte: now } }, select: { id: true, slug: true }, take: 50, orderBy: { publishAt: "asc" } })
      : domain === "research"
        ? prisma.client.researchItem.findMany({ where: { status: "DRAFT", publishAt: { lte: now } }, select: { id: true, slug: true }, take: 50, orderBy: { publishAt: "asc" } })
        : domain === "experts"
          ? prisma.client.expert.findMany({ where: { status: "DRAFT", publishAt: { lte: now } }, select: { id: true, slug: true }, take: 50, orderBy: { publishAt: "asc" } })
          : domain === "articles"
            ? prisma.client.article.findMany({ where: { status: "DRAFT", publishAt: { lte: now } }, select: { id: true, slug: true }, take: 50, orderBy: { publishAt: "asc" } })
            : prisma.client.event.findMany({ where: { status: "DRAFT", publishAt: { lte: now } }, select: { id: true, slug: true }, take: 50, orderBy: { publishAt: "asc" } }));

    for (const candidate of candidates) {
      const errors = await validateScheduledRecord(domain, candidate.id);
      if (errors.length) {
        failed.push({ domain, id: candidate.id, errors });
        continue;
      }

      const result = await (domain === "services"
        ? prisma.client.service.updateMany({ where: { id: candidate.id, status: "DRAFT", publishAt: { lte: now } }, data: { status: "PUBLISHED", updatedAt: now } })
        : domain === "research"
          ? prisma.client.researchItem.updateMany({ where: { id: candidate.id, status: "DRAFT", publishAt: { lte: now } }, data: { status: "PUBLISHED", updatedAt: now } })
          : domain === "experts"
            ? prisma.client.expert.updateMany({ where: { id: candidate.id, status: "DRAFT", publishAt: { lte: now } }, data: { status: "PUBLISHED", updatedAt: now } })
            : domain === "articles"
              ? prisma.client.article.updateMany({ where: { id: candidate.id, status: "DRAFT", publishAt: { lte: now } }, data: { status: "PUBLISHED", updatedAt: now } })
              : prisma.client.event.updateMany({ where: { id: candidate.id, status: "DRAFT", publishAt: { lte: now } }, data: { status: "PUBLISHED", updatedAt: now } }));

      if (result.count === 1) published.push({ domain, id: candidate.id, slug: candidate.slug });
    }
  }

  return { published, failed };
}
