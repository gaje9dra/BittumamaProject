import { getCurrentUser } from "@/lib/auth/guards";
import { resolvePayableTarget, createServerPayment, initiateCheckout } from "@/lib/payments/service";
import { parsePaymentRequestId, safeInternalReturnUrl } from "@/lib/payments/route-security";
import { apiError, apiSuccess, getRequestId } from "@/lib/api/response";
import { clientRateLimitKey, consumeApiRateLimit } from "@/lib/api/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const limit = consumeApiRateLimit(clientRateLimitKey(request), 10, 60_000);
  if (!limit.allowed) return apiError("RATE_LIMITED", "Too many payment attempts. Please try again later.", 429, requestId, { retryAfterSeconds: limit.retryAfterSeconds });

  let body: unknown;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > 16 * 1024) return apiError("VALIDATION_ERROR", "Request body is too large.", 400, requestId);
    body = JSON.parse(raw) as unknown;
  } catch {
    return apiError("VALIDATION_ERROR", "Invalid request payload.", 400, requestId);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return apiError("VALIDATION_ERROR", "Invalid request payload.", 400, requestId);
  const value = body as Record<string, unknown>;
  const allowed = new Set(["purpose", "targetId", "requestId", "returnUrl"]);
  if (Object.keys(value).some((key) => !allowed.has(key))) return apiError("VALIDATION_ERROR", "Invalid checkout request.", 422, requestId);
  if (typeof value.purpose !== "string" || typeof value.targetId !== "string" || typeof value.requestId !== "string" || typeof value.returnUrl !== "string") {
    return apiError("VALIDATION_ERROR", "Invalid checkout request.", 422, requestId);
  }

  try {
    const user = await getCurrentUser();
    if (!user) return apiError("UNAUTHENTICATED", "Authentication is required.", 401, requestId);
    const idempotencyRequestId = parsePaymentRequestId(value.requestId);
    const returnUrl = safeInternalReturnUrl(value.returnUrl);
    const target = await resolvePayableTarget(value.purpose as never, value.targetId, user.id);
    const created = await createServerPayment(target, idempotencyRequestId);
    const checkout = await initiateCheckout(created.transaction.reference, returnUrl);
    return apiSuccess({ reference: created.transaction.reference, checkoutUrl: checkout.checkoutUrl }, { headers: { "Cache-Control": "no-store", "X-Request-Id": requestId } });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "AUTHENTICATION_REQUIRED") return apiError("UNAUTHENTICATED", "Authentication is required.", 401, requestId);
    if (code === "PAYMENT_TARGET_NOT_CONFIGURED") return apiError("PAYMENT_TARGET_NOT_CONFIGURED", "This payment target is not configured.", 409, requestId);
    if (code === "PAYMENT_PROVIDER_NOT_CONFIGURED") return apiError("RESOURCE_UNAVAILABLE", "Online payments are temporarily unavailable.", 503, requestId);
    return apiError("VALIDATION_ERROR", "Unable to start payment.", 400, requestId);
  }
}
