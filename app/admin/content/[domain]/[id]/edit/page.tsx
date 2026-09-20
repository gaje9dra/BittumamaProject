import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentForm } from "@/components/admin/content-form";
import { CONTENT_LABELS, getContentForEdit, getNamedRelations, isContentDomain } from "@/lib/admin/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit content | Bittumama", robots: { index: false, follow: false, nocache: true } };

export default async function EditContentPage({ params }: { params: Promise<{domain:string;id:string}> }) {
  const {domain:value,id}=await params;
  if(!isContentDomain(value)) notFound();
  const values=await getContentForEdit(value,id);
  if(!values) notFound();
  const relationOptions=await getNamedRelations({
    services: values.relationServiceIds, research: values.relationResearchIds, experts: Array.from(new Set([...values.relationExpertIds, ...(values.speakerId ? [values.speakerId] : [])])),
    articles: values.relationArticleIds, workshops: values.relationWorkshopIds
  });
  return <section><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="type-label text-muted-foreground">Content / {CONTENT_LABELS[value]}</p><h1 className="type-h2 mt-2">Edit {values.title}</h1><p className="type-body-sm mt-2 text-muted-foreground">Current state: {values.status}</p></div></div><div className="mt-8 max-w-5xl"><ContentForm domain={value} values={values} relationOptions={relationOptions}/></div></section>;
}
