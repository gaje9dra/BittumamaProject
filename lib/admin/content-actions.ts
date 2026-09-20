async function assertPublishedRelations(
  ids: { services: string[]; research: string[]; experts: string[]; articles: string[]; workshops: string[] },
  speakerId: string,
  errors: Record<string, string>,
) {
  const checks = await Promise.all([
    ids.services.length ? prisma.client.service.count({ where: { id: { in: ids.services }, status: { not: "PUBLISHED" } } }) : 0,
    ids.research.length ? prisma.client.researchItem.count({ where: { id: { in: ids.research }, status: { not: "PUBLISHED" } } }) : 0,
    ids.experts.length ? prisma.client.expert.count({ where: { id: { in: ids.experts }, status: { not: "PUBLISHED" } } }) : 0,
    ids.articles.length ? prisma.client.article.count({ where: { id: { in: ids.articles }, status: { not: "PUBLISHED" } } }) : 0,
    ids.workshops.length ? prisma.client.event.count({ where: { id: { in: ids.workshops }, status: { not: "PUBLISHED" } } }) : 0,
    speakerId ? prisma.client.expert.count({ where: { id: speakerId, status: { not: "PUBLISHED" } } }) : 0,
  ]);
  const names = ["Services", "Research", "Experts", "Articles", "Workshops / Events", "Speaker"];
  if (checks.some((count) => count > 0)) errors.relationships = names[checks.findIndex((count) => count > 0)] + " must be published before this record can be published.";
}

