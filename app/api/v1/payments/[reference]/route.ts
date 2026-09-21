import { apiError, apiSuccess, getRequestId } from "@/lib/api/response";
import { requireApiUser } from "@/lib/api/auth";
import { getPaymentByReference } from "@/lib/payments/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ reference: string }> }) {
  const requestId = getRequestId(request);
  const { reference } = await params;
  if (!/^pay_[A-Za-z0-9]{16,128}$/.test(reference)) return apiError("VALIDATION_ERROR", "Invalid payment reference.", 400, requestId);
  try {
    const user = await requireApiUser();
    const payment = await getPaymentByReference(reference);
    if (!payment) return apiError("NOT_FOUND", "The requested payment was not found.", 404, requestId);
    if (payment.userId !== user.id && user.role !== "ADMIN") return apiError("FORBIDDEN", "You are not authorized to access this payment.", 403, requestId);
    const data = {
      reference: payment.reference,
      amountMinor: payment.amountMinor,
      currency: payment.currency,
      purpose: payment.purpose,
      status: payment.status,
      createdAt: payment.createdAt,
      paidAt: payment.paidAt,
      event: payment.event,
      service: payment.service,
      registration: payment.registration,
    };
    return apiSuccess(data, { headers: { "Cache-Control": "private, no-store", "X-Request-Id": requestId } });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "UNAUTHENTICATED") return apiError("UNAUTHENTICATED", "Authentication is required.", 401, requestId);
    return apiError("INTERNAL_ERROR", "An unexpected error occurred.", 500, requestId);
  }
}
