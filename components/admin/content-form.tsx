"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveContent, type ContentActionState } from "@/lib/admin/content-actions";
import type { ContentDomain, ContentFormValues } from "@/lib/admin/content";

const emptyState: ContentActionState = { message: null, fieldErrors: {} };

const fieldsByDomain: Record<ContentDomain, string[]> = {
  services: ["category","shortDescription","need","focus","audience","highlights","faq"],
  research: ["category","shortDescription","summary","date","availability","type","topic","image","tags","audience","highlights","scope","topics","sections","methodology"],
  experts: ["category","shortDescription","description","type","image","audience","tags","topics"],
  articles: ["category","excerpt","date","author","authorRole","authorSlug","content","sections","image","tags"],
  workshops: ["category","shortDescription","description","date","endDate","time","location","format","audience","speakerId","speakerRole","image","registrationLabel","registrationHref","registrationStatus"],
};

const labels: Record<string,string> = {
  category:"Category / discipline", shortDescription:"Short description / bio", description:"Description / full bio",
  need:"Need", focus:"Focus", audience:"Audience (JSON array)", highlights:"Highlights (JSON)", faq:"FAQ (JSON)",
  summary:"Summary", date:"Date", endDate:"End date", availability:"Availability", type:"Type / role", topic:"Topic",
  image:"Image / media reference", tags:"Tags / qualifications (JSON)", scope:"Scope (JSON)", topics:"Topics / interests (JSON)",
  sections:"Structured sections (JSON)", methodology:"Methodology (JSON)", excerpt:"Excerpt", author:"Author",
  authorRole:"Author role", authorSlug:"Author slug", content:"Editorial content", time:"Time", location:"Location",
  format:"Format", speakerId:"Speaker ID", speakerRole:"Speaker role", registrationLabel:"Registration label",
  registrationHref:"Registration URL", registrationStatus:"Registration status",
};

function Input({ name, value, type="text", required=false }: {name:string;value:string;type?:string;required?:boolean}) {
  return <input id={name} name={name} type={type} defaultValue={value} required={required} className="mt-1 block w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground focus:ring-1 focus:ring-foreground" />;
}

function FieldError({ name, errors }: {name:string;errors:Record<string,string>}) {
  return errors[name] ? <p id={`${name}-error`} className="mt-1 text-sm text-destructive" role="alert">{errors[name]}</p> : null;
}

function TextArea({ name, value, rows=5 }: {name:string;value:string;rows?:number}) {
  return <textarea id={name} name={name} defaultValue={value} rows={rows} className="mt-1 block w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground focus:ring-1 focus:ring-foreground" />;
}

function JsonField({ name, value, errors }: {name:string;value:string;errors:Record<string,string>}) {
  return <div><label htmlFor={name} className="text-sm font-medium">{labels[name]}</label><TextArea name={name} value={value} rows={6}/><FieldError name={name} errors={errors}/></div>;
}

export function ContentForm({ domain, values, relationOptions }: {domain:ContentDomain;values:ContentFormValues;relationOptions:{services:any[];research:any[];experts:any[];articles:any[];workshops:any[]}}) {
  const [state, formAction, pending] = useActionState(saveContent, emptyState);
  const fields = fieldsByDomain[domain];
  const relationFields = [
    ["relationServiceIds","Services",relationOptions.services,values.relationServiceIds],
    ["relationResearchIds","Research",relationOptions.research,values.relationResearchIds],
    ["relationExpertIds","Experts",relationOptions.experts,values.relationExpertIds],
    ["relationArticleIds","Articles",relationOptions.articles,values.relationArticleIds],
    ["relationWorkshopIds","Workshops / Events",relationOptions.workshops,values.relationWorkshopIds],
  ] as const;

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="domain" value={domain}/>
      {values.id && <><input type="hidden" name="id" value={values.id}/><input type="hidden" name="updatedAt" value={String((values as any).updatedAt ?? 0)}/></>}
      <input type="hidden" name="featured" value={values.featured ? "true" : "false"}/>
      <div className="grid gap-6 lg:grid-cols-2">
        <div><label htmlFor="title" className="text-sm font-medium">{domain === "experts" ? "Name" : "Title"}</label><Input name="title" value={values.title} required/><FieldError name="title" errors={state.fieldErrors}/></div>
        <div><label htmlFor="slug" className="text-sm font-medium">Slug</label><Input name="slug" value={values.slug} required/><FieldError name="slug" errors={state.fieldErrors}/></div>
        <div><label htmlFor="order" className="text-sm font-medium">Display order</label><Input name="order" value={values.order} type="number"/><FieldError name="order" errors={state.fieldErrors}/></div>
        {fields.includes("category") && <div><label htmlFor="category" className="text-sm font-medium">{labels.category}</label><Input name="category" value={values.category}/><FieldError name="category" errors={state.fieldErrors}/></div>}
        {fields.filter((x)=>["shortDescription","description","need","focus","summary","excerpt","content"].includes(x)).map((name)=><div key={name} className={name==="content"||name==="description"||name==="summary" ? "lg:col-span-2" : ""}><label htmlFor={name} className="text-sm font-medium">{labels[name]}</label><TextArea name={name} value={(values as any)[name]} rows={name==="content"||name==="description"||name==="summary"?8:4}/><FieldError name={name} errors={state.fieldErrors}/></div>)}
        {fields.filter((x)=>!["category","shortDescription","description","need","focus","summary","excerpt","content","sections","methodology","tags","audience","highlights","faq","scope","topics"].includes(x)).map((name)=><div key={name}><label htmlFor={name} className="text-sm font-medium">{labels[name]}</label><Input name={name} value={(values as any)[name]} type={name==="date"||name==="endDate"?"date":"text"}/><FieldError name={name} errors={state.fieldErrors}/></div>)}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {fields.filter((x)=>["audience","tags","highlights","faq","scope","topics","sections","methodology"].includes(x)).map((name)=><JsonField key={name} name={name} value={(values as any)[name]} errors={state.fieldErrors}/>)}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div><label htmlFor="seoTitle" className="text-sm font-medium">SEO title</label><Input name="seoTitle" value={values.seoTitle}/></div>
        <div><label htmlFor="seoDescription" className="text-sm font-medium">SEO description</label><Input name="seoDescription" value={values.seoDescription}/></div>
        <div><label htmlFor="seoImage" className="text-sm font-medium">SEO image reference</label><Input name="seoImage" value={values.seoImage}/></div>
        <div><label htmlFor="seoCanonical" className="text-sm font-medium">SEO canonical</label><Input name="seoCanonical" value={values.seoCanonical}/></div>
      </div>

      <div className="border-y border-border py-5">
        <p className="text-sm font-medium">Publication</p>
        <p className="mt-1 text-sm text-muted-foreground">Current state is controlled by the server. Use an explicit action to publish, unpublish, or archive.</p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <span>Current: <strong>{values.status}</strong></span>
          <label className="inline-flex items-center gap-2"><input type="checkbox" name="seoNoIndex" defaultChecked={values.seoNoIndex}/> Noindex</label>
        </div>
      </div>

      {domain === "workshops" && <div className="grid gap-6 lg:grid-cols-2">
        <div><label htmlFor="format" className="text-sm font-medium">Format</label><select id="format" name="format" defaultValue={values.format} className="mt-1 block w-full border border-border bg-background px-3 py-2.5 text-sm"><option value="">Not specified</option><option value="ONLINE">Online</option><option value="IN_PERSON">In person</option><option value="HYBRID">Hybrid</option></select></div>
        <div><label htmlFor="registrationStatus" className="text-sm font-medium">Registration status</label><select id="registrationStatus" name="registrationStatus" defaultValue={values.registrationStatus} className="mt-1 block w-full border border-border bg-background px-3 py-2.5 text-sm"><option value="">Not specified</option><option value="REGISTRATION_OPEN">Registration open</option><option value="REGISTRATION_CLOSED">Registration closed</option><option value="COMING_SOON">Coming soon</option><option value="COMPLETED">Completed</option></select></div>
      </div>}

      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium">Relationships</p>
          <p className="mt-1 text-sm text-muted-foreground">Selected records are validated server-side and written atomically.</p>
        </div>
        {relationFields.filter(([key]) => {
          if (domain==="services") return ["relationResearchIds","relationArticleIds","relationWorkshopIds","relationExpertIds"].includes(key);
          if (domain==="research") return ["relationServiceIds","relationExpertIds","relationArticleIds","relationWorkshopIds"].includes(key);
          if (domain==="experts") return ["relationResearchIds","relationServiceIds","relationArticleIds"].includes(key);
          if (domain==="articles") return ["relationResearchIds","relationServiceIds","relationExpertIds","relationArticleIds"].includes(key);
          return ["relationResearchIds","relationServiceIds","relationWorkshopIds"].includes(key);
        }).map(([key,label,options,selected])=><div key={key}><label htmlFor={key} className="text-sm font-medium">{label}</label><select id={key} name={key} multiple defaultValue={selected} size={Math.min(6,Math.max(3,options.length))} className="mt-1 block w-full border border-border bg-background px-3 py-2.5 text-sm">{options.map((o:any)=><option key={o.id} value={o.id}>{o.title ?? o.name} · {o.slug}</option>)}</select><p className="mt-1 text-xs text-muted-foreground">Only currently selected records are shown. Search-backed relationship picking can be added without changing the mutation layer.</p><FieldError name={key} errors={state.fieldErrors}/></div>)}
      </div>

      {state.message && <p className="border border-border bg-surface p-3 text-sm" role="status">{state.message}</p>}
      <div className="flex flex-wrap gap-3">
        <button name="intent" value="save" disabled={pending} className="bg-foreground px-4 py-2.5 text-sm font-medium text-background disabled:opacity-50">{pending ? "Saving…" : "Save draft"}</button>
        <button name="intent" value="publish" disabled={pending} className="border border-border px-4 py-2.5 text-sm font-medium disabled:opacity-50">{pending ? "Saving…" : "Publish"}</button>
        {values.id && values.status === "PUBLISHED" && <button name="intent" value="unpublish" disabled={pending} className="border border-border px-4 py-2.5 text-sm disabled:opacity-50">Unpublish</button>}
        {values.id && values.status !== "ARCHIVED" && <button name="intent" value="archive" disabled={pending} className="border border-border px-4 py-2.5 text-sm disabled:opacity-50">Archive</button>}
        <Link href={`/admin/content/${domain}`} className="px-4 py-2.5 text-sm">Cancel</Link>
      </div>
    </form>
  );
}
