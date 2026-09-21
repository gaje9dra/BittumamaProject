import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPublishedServiceBySlug } from "@/lib/services/repository";
import { contactInquiryLimits, validateContactInquiryInput } from "@/lib/contact/validation";
import { createContactInquiry } from "@/lib/contact/repository";
import { deliverCreatedNotifications } from "@/lib/notifications/domain";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const allowedKeys = new Set(["name", "email", "phone", "service", "message", "website", "formStartedAt"]);

function getClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "anonymous";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = rateLimitStore.get(key);
  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (current.count >= RATE_LIMIT_MAX_REQUESTS) return true;
  current.count += 1;
  return false;
}

function safeError(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > contactInquiryLimits.maxBodyBytes) {
    return safeError("This submission is too large. Please shorten your message.");
  }

  const key = getClientKey(request);
  if (isRateLimited(key)) {
    return safeError("Too many attempts. Please wait a few minutes and try again.", 429);
  }

  let payload: unknown;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > contactInquiryLimits.maxBodyBytes) {
      return safeError("This submission is too large. Please shorten your message.");
    }
    payload = JSON.parse(body) as unknown;
  } catch {
    return safeError("Invalid request payload.");
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return safeError("Invalid request payload.");
  }

  const unexpectedKey = Object.keys(payload).find((key) => !allowedKeys.has(key));
  if (unexpectedKey) return safeError("Invalid request payload.", 422);

  const raw = payload as Record<string, unknown>;
  if (typeof raw.website === "string" && raw.website.trim()) {
    return safeError("Unable to process this submission.", 422);
  }

  const result = validateContactInquiryInput(payload);
  if (!result.success) {
    return NextResponse.json({ success: false, errors: result.errors }, { status: 422 });
  }

  if (result.data.formStartedAt) {
    const started = Date.parse(result.data.formStartedAt);
    if (!Number.isNaN(started)) {
      const elapsed = Date.now() - started;
      if (elapsed >= 0 && elapsed < 1200) {
        return safeError("Please take a moment to complete the form and try again.", 422);
      }
    }
  }

  let serviceId: string | undefined;
  if (result.data.service !== "other") {
    const service = await getPublishedServiceBySlug(result.data.service);
    if (!service) return safeError("Select a valid service.", 422);
    serviceId = service.id;
  }

  let userId: string | undefined;
  try {
    const session = await auth();
    userId = session?.user?.id;
  } catch {
    // Contact submission remains anonymous-capable if auth is unavailable or unconfigured.
    userId = undefined;
  }

  try {
    const saved = await createContactInquiry({
      name: result.data.name,
      email: result.data.email,
      ...(result.data.phone ? { phone: result.data.phone } : {}),
      ...(userId ? { userId } : {}),
      serviceId,
      message: result.data.message,
    });
    await deliverCreatedNotifications(saved.notificationIds);
  } catch {
    return safeError("We couldn't send your enquiry. Please try again.", 500);
  }

  return NextResponse.json({ success: true, message: "Your enquiry has been sent successfully." });
}
