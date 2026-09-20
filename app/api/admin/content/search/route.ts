import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { getRelationOptions, isContentDomain } from "@/lib/admin/content";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await requireAdmin();
  const url = new URL(request.url);
  const domain = url.searchParams.get("domain") ?? "";
  const q = url.searchParams.get("q") ?? "";
  if (!isContentDomain(domain) || q.trim().length < 2) return NextResponse.json({ results: [] });
  const results = await getRelationOptions(domain, q);
  return NextResponse.json({ results });
}
