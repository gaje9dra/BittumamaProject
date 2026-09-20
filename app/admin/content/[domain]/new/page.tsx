import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentForm } from "@/components/admin/content-form";
import { CONTENT_LABELS, isContentDomain, type ContentDomain, type ContentFormValues, getNamedRelations } from "@/lib/admin/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New content | Bittumama", robots: { index: false, follow: false, nocache: true } };

const empty: ContentFormValues = {
  title:"",slug:"",category:"",shortDescription:"",description:"",status:"DRAFT",featured:false,order:"0",date:"",endDate:"",time:"",
  location:"",format:"",eventType:"",availability:"",type:"",topic:"",image:"",seoTitle:"",seoDescription:"",seoImage:"",seoCanonical:"",
  seoNoIndex:false,need:"",focus:"",audience:"",highlights:"",faq:"",summary:"",tags:"",scope:"",topics:"",sections:"",methodology:"",
  content:"",excerpt:"",author:"",authorRole:"",authorSlug:"",registrationLabel:"",registrationHref:"",registrationStatus:"",speakerRole:"",
  speakerId:"",relationServiceIds:[],relationResearchIds:[],relationExpertIds:[],relationArticleIds:[],relationWorkshopIds:[]
};

export default async function NewContentPage({ params }: { params: Promise<{domain:string}> }) {
  const {domain:value}=await params;
  if(!isContentDomain(value)) notFound();
  const relationOptions=await getNamedRelations({services:[],research:[],experts:[],articles:[],workshops:[]});
  return <section><p className="type-label text-muted-foreground">Content / {CONTENT_LABELS[value]}</p><h1 className="type-h2 mt-2">New {CONTENT_LABELS[value]}</h1><p className="type-body-sm mt-2 text-muted-foreground">Create a draft first, then publish it after required public fields are complete.</p><div className="mt-8 max-w-5xl"><ContentForm domain={value} values={empty} relationOptions={relationOptions}/></div></section>;
}
