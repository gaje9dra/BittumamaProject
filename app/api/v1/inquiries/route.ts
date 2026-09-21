import { auth } from "@/auth";
import { validateContactInquiryInput, contactInquiryLimits } from "@/lib/contact/validation";
import { createContactInquiry } from "@/lib/contact/repository";
import { getPublishedServiceBySlug } from "@/lib/services/repository";
import { deliverCreatedNotifications } from "@/lib/notifications/domain";
import { trackAnalyticsEvent } from "@/lib/analytics/service";
import { AnalyticsEventCategory, AnalyticsEventName } from "@/generated/prisma/client";
import { apiError, apiSuccess, getRequestId } from "@/lib/api/response";
import { clientRateLimitKey, consumeApiRateLimit } from "@/lib/api/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const limit = consumeApiRateLimit(clientRateLimitKey(request), 5, 10 * 60_000);
  if (!limit.allowed) return apiError("RATE_LIMITED", "Too many attempts. Please try again later.", 429, requestId, { retryAfterSeconds: limit.retryAfterSeconds });

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > contactInquiryLimits.maxBodyBytes) return apiError("VALIDATION_ERROR", "This submission is too large.", 400, requestId);

  let payload: unknown;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > contactInquiryLimits.maxBodyBytes) return apiError("VALIDATION_ERROR", "This submission is too large.", 400, requestId);
    payload = JSON.parse(body) as unknown;
  } catch {
    return apiError("VALIDATION_ERROR", "Invalid request payload.", 400, requestId);
  }

  const result = validateContactInquiryInput(payload);
  if (!result.success) return apiError("VALIDATION_ERROR", "Please correct the submitted fields.", 422, requestId, result.errors);

  let serviceId: string | undefined;
  if (result.data.service !== "other") {
    const service = await getPublishedServiceBySlug(result.data.service);
    if (!service) return apiError("VALIDATION_ERROR", "Select a valid service.", 422, requestId);
    serviceId = service.id;
  }

  try {
    const session = await auth();
    const userId = session?.user?.id;
    const saved = await createContactInquiry({ name: result.data.name, email: result.data.email, ...(result.data.phone ? { phone: result.data.phone } : {}), ...(userId ? { userId } : {}), serviceId, message: result.data.message });
    await trackAnalyticsEvent({ eventName: AnalyticsEventName.CONTACT_SUBMISSION, eventCategory: AnalyticsEventCategory.CONVERSION, userId: userId ?? null, metadata: { serviceId: serviceId ?? null } });
    await deliverCreatedNotifications(saved.notificationIds);
    return apiSuccess({ inquiryId: saved.inquiryId, message: "Your enquiry has been sent successfully." }, { status: 201, headers: { "Cache-Control": "no-store", "X-Request-Id": requestId } });
  } catch {
    return apiError("INTERNAL_ERROR", "We couldn't process your enquiry.", 500, requestId);
  }
}

export async function GET(request: Request) {
  return apiError("FORBIDDEN", "Inquiry records are not publicly accessible.", 403, getRequestId(request));
}
