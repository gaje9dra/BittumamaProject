import { existsSync } from "node:fs";
import path from "node:path";
import { getAllResearch, validateResearch, type ResearchEntry } from "@/data/research";
import { getAllExperts, validateExperts, type Expert } from "@/data/expertise";
import { getAllArticles, validateArticles, type Article } from "@/data/articles";
import { getAllEvents, validateEvents, type Event } from "@/data/events";
import { siteConfig, validateSiteConfig } from "@/data/site-config";
import { validateContentRelationships } from "@/lib/content/relationships";

export type ContentValidationSeverity = "error" | "warning";

export type ContentValidationIssue = {
  severity: ContentValidationSeverity;
  contentType: string;
  record: string;
  issue: string;
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const publicAssetPattern = /^\/(?!\/)[^?#]+$/;

function addIssue(
  issues: ContentValidationIssue[],
  severity: ContentValidationSeverity,
  contentType: string,
  record: string,
  issue: string,
) {
  issues.push({ severity, contentType, record, issue });
}

function validateUniqueRecords<T extends { id: string; slug: string }>(
  records: readonly T[],
  contentType: string,
  issues: ContentValidationIssue[],
) {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const record of records) {
    if (!record.id.trim()) addIssue(issues, "error", contentType, record.id || "<missing>", "Missing ID.");
    if (!record.slug.trim()) addIssue(issues, "error", contentType, record.id || "<missing>", "Missing slug.");
    if (ids.has(record.id)) addIssue(issues, "error", contentType, record.id, "Duplicate ID.");
    if (slugs.has(record.slug)) addIssue(issues, "error", contentType, record.id, "Duplicate slug: " + record.slug);
    ids.add(record.id);
    slugs.add(record.slug);

    if (record.slug && !slugPattern.test(record.slug)) {
      addIssue(issues, "error", contentType, record.id, "Invalid slug: " + record.slug);
    }
  }
}

function validateBoolean(
  issues: ContentValidationIssue[],
  contentType: string,
  record: string,
  field: string,
  value: unknown,
) {
  if (value !== undefined && typeof value !== "boolean") {
    addIssue(issues, "error", contentType, record, field + " must be a boolean.");
  }
}

function validateDate(
  issues: ContentValidationIssue[],
  contentType: string,
  record: string,
  field: string,
  value: string | undefined,
) {
  if (value !== undefined && Number.isNaN(new Date(value).getTime())) {
    addIssue(issues, "error", contentType, record, "Invalid " + field + ": " + value);
  }
}

function validateOptionalImage(
  issues: ContentValidationIssue[],
  contentType: string,
  record: string,
  field: string,
  value: string | undefined,
) {
  if (!value) return;
  if (/^https?:\/\//.test(value)) return;
  if (!publicAssetPattern.test(value)) {
    addIssue(issues, "error", contentType, record, field + " must be a public asset path or absolute HTTP(S) URL.");
    return;
  }
  const publicPath = path.join(process.cwd(), "public", value.replace(/^\//, ""));
  if (!existsSync(publicPath)) {
    addIssue(issues, "warning", contentType, record, field + " references a missing local asset: " + value);
  }
}

function validateResearchSpecific(records: readonly ResearchEntry[], issues: ContentValidationIssue[]) {
  for (const record of records) {
    if (!record.title.trim()) addIssue(issues, "error", "Research", record.id, "Missing title.");
    if (!record.category.trim()) addIssue(issues, "error", "Research", record.id, "Missing category.");
    if (!record.shortDescription.trim()) addIssue(issues, "error", "Research", record.id, "Missing shortDescription.");
    validateDate(issues, "Research", record.id, "date", record.date);
    validateBoolean(issues, "Research", record.id, "featured", record.featured);
    if (record.status && record.status !== "Published" && record.status !== "Coming Soon") {
      addIssue(issues, "error", "Research", record.id, "Invalid status: " + record.status);
    }
    validateOptionalImage(issues, "Research", record.id, "image", record.image);
    validateSeo(issues, "Research", record.id, record.seo);
  }
}

function validateExpertSpecific(records: readonly Expert[], issues: ContentValidationIssue[]) {
  for (const record of records) {
    if (!record.name.trim()) addIssue(issues, "error", "Expert", record.id, "Missing name.");
    validateOptionalImage(issues, "Expert", record.id, "image", record.image);
    validateBoolean(issues, "Expert", record.id, "featured", record.featured);
    validateSeo(issues, "Expert", record.id, record.seo);
  }
}

function validateArticleSpecific(records: readonly Article[], issues: ContentValidationIssue[]) {
  for (const record of records) {
    if (!record.title.trim()) addIssue(issues, "error", "Article", record.id, "Missing title.");
    if (!record.category.trim()) addIssue(issues, "error", "Article", record.id, "Missing category.");
    validateDate(issues, "Article", record.id, "date", record.date);
    validateBoolean(issues, "Article", record.id, "featured", record.featured);
    validateOptionalImage(issues, "Article", record.id, "image", record.image);
    validateSeo(issues, "Article", record.id, record.seo);
  }
}

function validateSeo(
  issues: ContentValidationIssue[],
  contentType: string,
  record: string,
  seo: { title?: string; description?: string; image?: string; canonical?: string; noIndex?: boolean } | undefined,
) {
  if (!seo) return;
  if (seo.title !== undefined && typeof seo.title !== "string") addIssue(issues, "error", contentType, record, "SEO title must be a string.");
  if (seo.description !== undefined && typeof seo.description !== "string") addIssue(issues, "error", contentType, record, "SEO description must be a string.");
  if (seo.title !== undefined && !seo.title.trim()) addIssue(issues, "warning", contentType, record, "SEO title is empty.");
  if (seo.description !== undefined && !seo.description.trim()) addIssue(issues, "warning", contentType, record, "SEO description is empty.");
  if (seo.canonical) {
    if (!seo.canonical.startsWith("/")) {
      try { new URL(seo.canonical); } catch { addIssue(issues, "error", contentType, record, "SEO canonical URL is malformed."); }
    }
  }
  validateOptionalImage(issues, contentType, record, "seo.image", seo.image);
  validateBoolean(issues, contentType, record, "seo.noIndex", seo.noIndex);
}

function validateEventSpecific(records: readonly Event[], issues: ContentValidationIssue[]) {
  const statuses = new Set(["Registration Open", "Registration Closed", "Coming Soon", "Completed"]);
  const formats = new Set(["Online", "In Person", "Hybrid"]);

  for (const record of records) {
    if (!record.title.trim()) addIssue(issues, "error", "Workshop", record.id, "Missing title.");
    if (!record.category.trim()) addIssue(issues, "error", "Workshop", record.id, "Missing category.");
    validateDate(issues, "Workshop", record.id, "date", record.date);
    validateDate(issues, "Workshop", record.id, "endDate", record.endDate);
    if (record.endDate && new Date(record.endDate) < new Date(record.date)) {
      addIssue(issues, "error", "Workshop", record.id, "endDate is earlier than date.");
    }
    if (record.registrationStatus && !statuses.has(record.registrationStatus)) {
      addIssue(issues, "error", "Workshop", record.id, "Invalid registrationStatus: " + record.registrationStatus);
    }
    if (record.format && !formats.has(record.format)) {
      addIssue(issues, "error", "Workshop", record.id, "Invalid format: " + record.format);
    }
    if (record.registrationHref) {
      try {
        const url = new URL(record.registrationHref);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error();
      } catch {
        addIssue(issues, "error", "Workshop", record.id, "Invalid registrationHref.");
      }
    }
    validateBoolean(issues, "Workshop", record.id, "featured", record.featured);
    validateOptionalImage(issues, "Workshop", record.id, "image", record.image);
    validateSeo(issues, "Workshop", record.id, record.seo);
  }
}

export function validateContentIntegrity(): ContentValidationIssue[] {
  const issues: ContentValidationIssue[] = [];
  const research = getAllResearch();
  const experts = getAllExperts();
  const articles = getAllArticles();
  const events = getAllEvents();

  validateUniqueRecords(research, "Research", issues);
  validateUniqueRecords(experts, "Expert", issues);
  validateUniqueRecords(articles, "Article", issues);
  validateUniqueRecords(events, "Workshop", issues);

  validateResearchSpecific(research, issues);
  validateExpertSpecific(experts, issues);
  validateArticleSpecific(articles, issues);
  validateEventSpecific(events, issues);

  for (const issue of validateContentRelationships()) {
    addIssue(
      issues,
      "error",
      issue.sourceType,
      issue.sourceId,
      issue.relation + " → " + issue.reference + ": " + issue.message,
    );
  }

  if (!siteConfig.siteName.trim()) addIssue(issues, "error", "Site Config", "siteConfig", "siteName is required.");
  if (!siteConfig.siteDescription.trim()) addIssue(issues, "error", "Site Config", "siteConfig", "siteDescription is required.");
  if (!siteConfig.defaultMetadata.title.trim()) addIssue(issues, "error", "Site Config", "defaultMetadata", "Default metadata title is required.");
  if (!siteConfig.defaultMetadata.description.trim()) addIssue(issues, "error", "Site Config", "defaultMetadata", "Default metadata description is required.");

  for (const [routeName, route] of Object.entries(siteConfig.routes)) {
    if (!route.label.trim()) addIssue(issues, "error", "Site Route", routeName, "Route label is required.");
    if (!route.href.trim() || !route.href.startsWith("/")) {
      addIssue(issues, "error", "Site Route", routeName, "Internal route must be a non-empty path.");
    }
  }

  for (const issue of validateSiteConfig(siteConfig)) {
    addIssue(issues, "error", "Site Config", "siteConfig", issue);
  }

  return issues;
}

export function formatContentValidationIssues(issues: readonly ContentValidationIssue[]) {
  return issues
    .map(
      (issue) =>
        "CONTENT TYPE: " + issue.contentType +
        "\nRECORD: " + issue.record +
        "\nSEVERITY: " + issue.severity.toUpperCase() +
        "\nISSUE: " + issue.issue,
    )
    .join("\n\n");
}

export function runContentIntegrityValidation() {
  validateResearch();
  validateExperts();
  validateArticles();
  validateEvents();

  const issues = validateContentIntegrity();
  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");

  if (issues.length && process.env.NODE_ENV !== "production") {
    console.warn("Content integrity validation found issues:\n" + formatContentValidationIssues(issues));
  }

  if (errors.length) {
    throw new Error("Content integrity validation failed:\n" + formatContentValidationIssues(errors));
  }

  return { issues, errors, warnings };
}
