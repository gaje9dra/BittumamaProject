"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveContent, type ContentActionState } from "@/lib/admin/content-actions";
import type { ContentDomain, ContentFormValues } from "@/lib/admin/content";
import { RelationshipPicker } from "@/components/admin/relationship-picker";

type Option = { id: string; label: string; slug: string };
type RelationOptions = {
  services: Option[];
  research: Option[];
  experts: Option[];
  articles: Option[];
  workshops: Option[];
};

const initialState: ContentActionState = { message: null, fieldErrors: {} };

const labels: Record<string, string> = {
  category: "Category / discipline", shortDescription: "Short description / bio", description: "Description / full bio",
  need: "Need", focus: "Focus", audience: "Audience (JSON array)", highlights: "Highlights (JSON)", faq: "FAQ (JSON)",
  summary: "Summary", date: "Date", endDate: "End date", availability: "Availability", type: "Type / role", topic: "Topic",
  image: "Image / media reference", tags: "Tags / qualifications (JSON)", scope: "Scope (JSON)", topics: "Topics / interests (JSON)",
  sections: "Structured sections (JSON)", methodology: "Methodology (JSON)", excerpt: "Excerpt", author: "Author",
  authorRole: "Author role", authorSlug: "Author slug", content: "Editorial content", time: "Time", location: "Location",
  registrationLabel: "Registration label", registrationHref: "Registration URL", registrationStatus: "Registration status",
  speakerRole: "Speaker role",
};

const fieldsByDomain: Record<ContentDomain, string[]> = {
  services: ["category","shortDescription","need","focus","audience","highlights","faq"],
  research: ["category","shortDescription","summary","date","availability","type","topic","image","tags","audience","highlights","scope","topics","sections","methodology"],
  experts: ["category","shortDescription","description","type","image","audience","tags","topics"],
  articles: ["category","excerpt","date","author","authorRole","authorSlug","content","sections","image","tags"],
  workshops: ["category","shortDescription","description","date","endDate","time","location","audience","speakerRole","image","registrationLabel","registrationHref"],
};

function Input({ name, value, type = "text", required = false, error }: { name: string; value: string; type?: string; required?: boolean; error?: string }) {
  return (
    <>
      <input id={name} name={name} type={type} defaultValue={value} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? name + "-error" : undefined} className="mt-1 block w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground focus:ring-1 focus:ring-foreground" />
      {error && <p id={name + "-error"} className="mt-1 text-sm text-destructive" role="alert">{error}</p>}
    </>
  );
}

function TextArea({ name, value, rows = 5, error }: { name: string; value: string; rows?: number; error?: string }) {
  return (
    <>
      <textarea id={name} name={name} defaultValue={value} rows={rows} aria-invalid={Boolean(error)} aria-describedby={error ? name + "-error" : undefined} className="mt-1 block w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground focus:ring-1 focus:ring-foreground" />
      {error && <p id={name + "-error"} className="mt-1 text-sm text-destructive" role="alert">{error}</p>}
    </>
  );
}

function jsonOption(domain: ContentDomain, id: string, label: string, selectedIds: string[], options: Option[]) {
  const selected = options.filter((option) => selectedIds.includes(option.id));
  return <RelationshipPicker key={id} name={id} label={label} initial={selected} />;
}

export function ContentForm({ domain, values, relationOptions }: { domain: ContentDomain; values: ContentFormValues; relationOptions: RelationOptions }) {
  const [state, formAction, pending] = useActionState(saveContent, initialState);
  const errors = state.fieldErrors;
  const visibleFields = fieldsByDomain[domain];

  const relationGroups = [
    ["relationServiceIds", "Services", relationOptions.services, values.relationServiceIds],
    ["relationResearchIds", "Research", relationOptions.research, values.relationResearchIds],
    ["relationExpertIds", "Experts", relationOptions.experts, values.relationExpertIds],
    ["relationArticleIds", "Articles", relationOptions.articles, values.relationArticleIds],
    ["relationWorkshopIds", "Workshops / Events", relationOptions.workshops, values.relationWorkshopIds],
  ] as const;

  const allowedRelations =
    domain === "services" ? ["relationResearchIds","relationArticleIds","relationWorkshopIds","relationExpertIds"] :
    domain === "research" ? ["relationServiceIds","relationExpertIds","relationArticleIds","relationWorkshopIds"] :
    domain === "experts" ? ["relationResearchIds","relationServiceIds","relationArticleIds"] :
    domain === "articles" ? ["relationResearchIds","relationServiceIds","relationExpertIds","relationArticleIds"] :
    ["relationResearchIds","relationServiceIds","relationWorkshopIds"];

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="domain" value={domain} />
      {values.id && <input type="hidden" name="id" value={values.id} />}
      {values.updatedAt && <input type="hidden" name="updatedAt" value={values.updatedAt} />}

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label htmlFor="title" className="text-sm font-medium">{domain === "experts" ? "Name" : "Title"}</label>
          <Input name="title" value={values.title} required error={errors.title} />
        </div>
        <div>
          <label htmlFor="slug" className="text-sm font-medium">Slug</label>
          <Input name="slug" value={values.slug} required error={errors.slug} />
        </div>
        <div>
          <label htmlFor="order" className="text-sm font-medium">Display order</label>
          <Input name="order" value={values.order} type="number" error={errors.order} />
        </div>

        {visibleFields.filter((field) => ["category","type","date","endDate","time","location","availability","topic","image","author","authorRole","authorSlug","registrationLabel","registrationHref","speakerRole"].includes(field)).map((field) => (
          <div key={field}>
            <label htmlFor={field} className="text-sm font-medium">{labels[field]}</label>
            {field === "availability" ? (
              <select id={field} name={field} defaultValue={values.availability} className="mt-1 block w-full border border-border bg-background px-3 py-2.5 text-sm">
                <option value="">Available</option><option value="COMING_SOON">Coming soon</option>
              </select>
            ) : (
              <Input name={field} value={(values as Record<string, string>)[field] ?? ""} type={field === "date" || field === "endDate" ? "date" : "text"} error={errors[field]} />
            )}
          </div>
        ))}

        {visibleFields.filter((field) => ["shortDescription","description","need","focus","summary","excerpt","content"].includes(field)).map((field) => (
          <div key={field} className={["description","summary","content"].includes(field) ? "lg:col-span-2" : ""}>
            <label htmlFor={field} className="text-sm font-medium">{labels[field]}</label>
            <TextArea name={field} value={(values as Record<string, string>)[field] ?? ""} rows={field === "content" || field === "description" || field === "summary" ? 9 : 4} error={errors[field]} />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {visibleFields.filter((field) => ["audience","highlights","faq","tags","scope","topics","sections","methodology"].includes(field)).map((field) => (
          <div key={field}>
            <label htmlFor={field} className="text-sm font-medium">{labels[field]}</label>
            <TextArea name={field} value={(values as Record<string, string>)[field] ?? ""} rows={6} error={errors[field]} />
          </div>
        ))}
      </div>

      {domain === "articles" && <p className="text-xs text-muted-foreground">Article sections are edited as the existing structured JSON representation; no new rich-text editor is introduced.</p>}
      {domain === "research" && <p className="text-xs text-muted-foreground">Research scope, topics, sections and methodology remain structured JSON fields matching the canonical model.</p>}

      <section className="border-y border-border py-5" aria-labelledby="publication-title">
        <h2 id="publication-title" className="text-sm font-medium">Publication</h2>
        <p className="mt-1 text-sm text-muted-foreground">Current state: <strong>{values.status}</strong>. Save preserves the current state; Publish, Unpublish and Archive are explicit server actions.</p>
        <div className="mt-4 flex flex-wrap gap-5">
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={values.featured} /> Featured</label>
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="seoNoIndex" defaultChecked={values.seoNoIndex} /> Noindex</label>
        </div>
      </section>

      {domain === "workshops" && (
        <section className="grid gap-6 lg:grid-cols-2">
          <div><label htmlFor="format" className="text-sm font-medium">Format</label><select id="format" name="format" defaultValue={values.format} className="mt-1 block w-full border border-border bg-background px-3 py-2.5 text-sm"><option value="">Not specified</option><option value="ONLINE">Online</option><option value="IN_PERSON">In person</option><option value="HYBRID">Hybrid</option></select></div>
          <div><label htmlFor="registrationStatus" className="text-sm font-medium">Registration status</label><select id="registrationStatus" name="registrationStatus" defaultValue={values.registrationStatus} className="mt-1 block w-full border border-border bg-background px-3 py-2.5 text-sm"><option value="">Not specified</option><option value="REGISTRATION_OPEN">Registration open</option><option value="REGISTRATION_CLOSED">Registration closed</option><option value="COMING_SOON">Coming soon</option><option value="COMPLETED">Completed</option></select></div>
        </section>
      )}

      <section className="space-y-6" aria-labelledby="relationships-title">
        <div><h2 id="relationships-title" className="text-sm font-medium">Relationships</h2><p className="mt-1 text-sm text-muted-foreground">Search and select canonical records. IDs are validated again on the server.</p></div>
        {relationGroups.filter(([name]) => allowedRelations.includes(name)).map(([name, label, options, selected]) => (
          <div key={name}>
            {jsonOption(domain, name, label, selected, options)}
            {errors[name] && <p className="mt-1 text-sm text-destructive" role="alert">{errors[name]}</p>}
          </div>
        ))}
        {domain === "workshops" && <RelationshipPicker name="speakerId" label="Speaker" initial={values.speakerId ? relationOptions.experts.filter((option) => option.id === values.speakerId) : []} multiple={false} />}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <div><label htmlFor="seoTitle" className="text-sm font-medium">SEO title</label><Input name="seoTitle" value={values.seoTitle} /></div>
        <div><label htmlFor="seoDescription" className="text-sm font-medium">SEO description</label><Input name="seoDescription" value={values.seoDescription} /></div>
        <div><label htmlFor="seoImage" className="text-sm font-medium">SEO image reference</label><Input name="seoImage" value={values.seoImage} /></div>
        <div><label htmlFor="seoCanonical" className="text-sm font-medium">SEO canonical</label><Input name="seoCanonical" value={values.seoCanonical} /></div>
      </div>

      {state.message && <p className="border border-border bg-surface p-3 text-sm" role="status" aria-live="polite">{state.message}</p>}

      <div className="flex flex-wrap gap-3">
        <button name="intent" value="save" disabled={pending} className="bg-foreground px-4 py-2.5 text-sm font-medium text-background disabled:opacity-50">{pending ? "Saving…" : "Save"}</button>
        <button name="intent" value="publish" disabled={pending} className="border border-border px-4 py-2.5 text-sm font-medium disabled:opacity-50">Publish</button>
        {values.id && values.status === "PUBLISHED" && <button name="intent" value="unpublish" disabled={pending} className="border border-border px-4 py-2.5 text-sm disabled:opacity-50">Unpublish</button>}
        {values.id && values.status !== "ARCHIVED" && <button name="intent" value="archive" disabled={pending} onClick={(event) => { if (!window.confirm("Archive " + values.title + "? This will remove it from public visibility according to the canonical publication rules.")) event.preventDefault(); }} className="border border-border px-4 py-2.5 text-sm disabled:opacity-50">Archive</button>}
        <Link href={"/admin/content/" + domain} className="px-4 py-2.5 text-sm">Cancel</Link>
      </div>
    </form>
  );
}
