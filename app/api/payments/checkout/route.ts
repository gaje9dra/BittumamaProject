import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/guards";
import { resolvePayableTarget, createServerPayment, initiateCheckout } from "@/lib/payments/service";
import { parsePaymentRequestId, safeInternalReturnUrl } from "@/lib/payments/route-security";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    const body = await request.json() as { purpose?: string; targetId?: string; requestId?: string; returnUrl?: string };
    if (!body.purpose || !body.targetId || !body.requestId || !body.returnUrl) return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 });
    const requestId = parsePaymentRequestId(body.requestId);
    const returnUrl = safeInternalReturnUrl(body.returnUrl);
    const target = await resolvePayableTarget(body.purpose as never, body.targetId, user.id);
    const created = await createServerPayment(target, requestId);
    const checkout = await initiateCheckout(created.transaction.reference, returnUrl);
    return NextResponse.json({ reference: created.transaction.reference, checkoutUrl: checkout.checkoutUrl }, { status: 200 });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    const status = code === "AUTHENTICATION_REQUIRED" ? 401 : code === "PAYMENT_TARGET_NOT_CONFIGURED" ? 409 : code === "PAYMENT_PROVIDER_NOT_CONFIGURED" ? 503 : 400;
    return NextResponse.json({ error: status === 409 ? "This item is not configured for online payment yet." : status === 503 ? "Online payments are not configured yet." : "Unable to start payment." }, { status });
  }
}