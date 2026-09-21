import { NextResponse } from "next/server";
import { getConfiguredPaymentProvider } from "@/lib/payments/provider";
import { reconcileVerifiedPayment } from "@/lib/payments/service";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ provider: string }> };

export async function POST(request: Request, { params }: Params) {
  const { provider } = await params;
  try {
    const adapter = getConfiguredPaymentProvider();
    if (adapter.name !== provider) return NextResponse.json({ error: "Unknown payment provider." }, { status: 404 });
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("application/x-www-form-urlencoded") && !contentType.includes("application/json")) {
      return NextResponse.json({ error: "Unsupported webhook content type." }, { status: 415 });
    }
    const input = contentType.includes("json")
      ? Object.fromEntries(Object.entries(await request.json() as Record<string, unknown>).map(([k, v]) => [k, String(v ?? "")]))
      : Object.fromEntries(Array.from((await request.formData()).entries()).map(([k, v]) => [k, typeof v === "string" ? v : ""]));
    const verified = await adapter.verifyWebhook(input);
    const result = await reconcileVerifiedPayment(verified);
    if (!result.ok) return NextResponse.json({ error: "Payment reconciliation mismatch." }, { status: 409 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("Payment webhook failed:", error);
    return NextResponse.json({ error: "Webhook could not be processed." }, { status: 400 });
  }
}