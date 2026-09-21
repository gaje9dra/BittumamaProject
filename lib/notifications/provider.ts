import "server-only";

import { getNotificationConfig } from "@/lib/notifications/config";
import type { EmailMessage, EmailProvider, EmailProviderResult } from "@/lib/notifications/types";
import { EmailDeliveryError } from "@/lib/notifications/types";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

class ResendEmailProvider implements EmailProvider {
  readonly name = "resend";

  async send(message: EmailMessage): Promise<EmailProviderResult> {
    const config = getNotificationConfig();
    if (!config) throw new EmailDeliveryError("PERMANENT", "EMAIL_NOT_CONFIGURED", "Transactional email is not configured.");

    const payload = {
      from: `${config.fromName} <${config.fromEmail}>`,
      to: [message.to],
      subject: message.subject,
      text: message.text,
      html: message.html,
      ...(message.replyTo ? { reply_to: message.replyTo } : {}),
    };

    let response: Response;
    try {
      response = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
          "Idempotency-Key": message.idempotencyKey,
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
    } catch {
      throw new EmailDeliveryError("TEMPORARY", "PROVIDER_UNAVAILABLE", "Email provider is temporarily unavailable.");
    }

    const body = await response.json().catch(() => null) as unknown;
    if (response.ok && body && typeof body === "object" && "id" in body && typeof body.id === "string") {
      return { provider: this.name, providerMessageId: body.id };
    }

    const providerCode = body && typeof body === "object" && "name" in body && typeof body.name === "string" ? body.name : "PROVIDER_ERROR";
    if (response.status === 408 || response.status === 425 || response.status === 429 || response.status >= 500) {
      throw new EmailDeliveryError("TEMPORARY", providerCode, "Email provider returned a temporary error.");
    }
    throw new EmailDeliveryError("PERMANENT", providerCode, "Email provider rejected the notification.");
  }
}

const provider = new ResendEmailProvider();

export function getEmailProvider(): EmailProvider {
  const config = getNotificationConfig();
  if (!config) throw new EmailDeliveryError("PERMANENT", "EMAIL_NOT_CONFIGURED", "Transactional email is not configured.");
  return provider;
}

export function getEmailProviderName() {
  return getNotificationConfig() ? provider.name : null;
}