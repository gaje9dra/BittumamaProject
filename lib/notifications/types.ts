import type { NotificationChannel, NotificationStatus, NotificationType } from "@/generated/prisma/client";

export type NotificationPayload =
  | { type: "INQUIRY_RECEIVED"; name: string; email: string; serviceTitle: string | null; messagePreview: string }
  | { type: "REGISTRATION_RECEIVED"; name: string; eventTitle: string; eventDate: string | null; status: string }
  | { type: "REGISTRATION_CONFIRMED"; name: string; eventTitle: string; eventDate: string | null; status: string }
  | { type: "REGISTRATION_CANCELLED"; name: string; eventTitle: string; eventDate: string | null; status: string }
  | { type: "PAYMENT_SUCCESS"; reference: string; amount: string; currency: string; purpose: string; status: string }
  | { type: "PAYMENT_FAILED"; reference: string; amount: string; currency: string; purpose: string; status: string; failureMessage: string | null }
  | { type: "PAYMENT_PENDING"; reference: string; amount: string; currency: string; purpose: string; status: string };

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
  idempotencyKey: string;
  replyTo?: string;
};

export type EmailProviderResult = {
  provider: string;
  providerMessageId: string;
};

export type EmailProviderErrorKind = "TEMPORARY" | "PERMANENT";

export class EmailDeliveryError extends Error {
  readonly kind: EmailProviderErrorKind;
  readonly code: string;
  constructor(kind: EmailProviderErrorKind, code: string, message: string) {
    super(message);
    this.name = "EmailDeliveryError";
    this.kind = kind;
    this.code = code;
  }
}

export type EmailProvider = {
  name: string;
  send(message: EmailMessage): Promise<EmailProviderResult>;
};

export type NotificationCreateInput = {
  userId?: string | null;
  type: NotificationType;
  channel: NotificationChannel;
  recipient: string;
  relatedEntityType?: string | null;
  relatedEntityId?: string | null;
  payload: NotificationPayload;
  dedupeKey: string;
  subject: string;
};