import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin overview | Bittumama",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

async function getOverviewCounts() {
  const [services, research, experts, articles, workshops, inquiries] = await Promise.all([
    prisma.client.service.count(),
    prisma.client.researchItem.count(),
    prisma.client.expert.count(),
    prisma.client.article.count(),
    prisma.client.event.count(),
    prisma.client.contactInquiry.count(),
  ]);

  return { services, research, experts, articles, workshops, inquiries };
}

export default async function AdminOverviewPage() {
  const counts = await getOverviewCounts();

  const items = [
    { label: "Services", value: counts.services },
    { label: "Research", value: counts.research },
    { label: "Experts", value: counts.experts },
    { label: "Articles", value: counts.articles },
    { label: "Workshops / Events", value: counts.workshops },
    { label: "Contact inquiries", value: counts.inquiries },
  ];

  return (
    <section aria-labelledby="admin-overview-title">
      <div className="max-w-3xl">
        <p className="type-label text-muted-foreground">Overview</p>
        <h1 id="admin-overview-title" className="type-h2 mt-2">
          Admin overview
        </h1>
        <p className="type-body-sm mt-3 text-muted-foreground">
          A database-backed snapshot of the current Bittumama content foundation.
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.label} className="border border-border bg-surface p-5">
            <p className="type-caption text-muted-foreground">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{item.value}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 border-y border-border py-6">
        <p className="type-body-sm text-muted-foreground">
          These figures are read directly from PostgreSQL through Prisma. No analytics, activity, revenue,
          conversion, or other synthetic metrics are included.
        </p>
      </div>
    </section>
  );
}
