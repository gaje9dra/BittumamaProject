import { NextResponse } from "next/server";
import { getConfiguredPaymentProvider } from "@/lib/payments/provider";
import { reconcileVerifiedPayment } from "@/lib/payments/service";
import { safeInternalReturnUrl } from "@/lib/payments/route-security";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ provider: string }> };

async function handle(request: Request, providerName: string) {
  const adapter = getConfiguredPaymentProvider();
  if (adapter.name !== providerName) return NextResponse.json({ error: "Unknown payment provider." }, { status: 404 });
  const contentType = request.headers.get("content-type") ?? "";
  const input = request.method === "GET"
    ? Object.fromEntries(new URL(request.url).searchParams.entries())
    : contentType.includes("json")
      ? Object.fromEntries(Object.entries(await request.json() as Record<string, unknown>).map(([k, v]) => [k, String(v ?? "")]))
      : Object.fromEntries(Array.from((await request.formData()).entries()).map(([k, v]) => [k, typeof v === "string" ? v : ""]));
  const verified = await adapter.verifyReturn(input);
  const result = await reconcileVerifiedPayment(verified);
  if (!result.ok) return NextResponse.json({ error: "Payment verification mismatch." }, { status: 409 });
  const base = process.env.NEXT_PUBLIC_APP_URL;
  if (!base) return NextResponse.json({ error: "Application URL is not configured." }, { status: 500 });
  const destination = safeInternalReturnUrl(new URL("/payment/result?reference=" + encodeURIComponent(verified.reference), base).toString());
  return NextResponse.redirect(destination);
}

export async function GET(request: Request, { params }: Params) {
  try { return await handle(request, (await params).provider); }
  catch { return NextResponse.json({ error: "Payment return could not be verified." }, { status: 400 }); }
}

export async function POST(request: Request, { params }: Params) {
  try { return await handle(request, (await params).provider); }
  catch { return NextResponse.json({ error: "Payment return could not be verified." }, { status: 400 }); }
}