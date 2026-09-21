import "server-only";

function cleanHeaderValue(value: string) {
  const cleaned = value.replace(/[\r\n]/g, "").trim();
  if (!cleaned || cleaned.length > 254) throw new Error("Invalid email header configuration.");
  return cleaned;
}

export function getNotificationConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim() || null;
  const fromEmail = process.env.NOTIFICATION_FROM_EMAIL?.trim() || null;
  const fromName = process.env.NOTIFICATION_FROM_NAME?.trim() || null;
  const replyTo = process.env.NOTIFICATION_REPLY_TO?.trim() || null;
  const internalRecipients = (process.env.NOTIFICATION_INTERNAL_EMAILS ?? "")
    .split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);

  if (!apiKey || !fromEmail || !fromName) return null;
  const normalizedFrom = cleanHeaderValue(fromEmail).toLowerCase();
  if (!isEmail(normalizedFrom)) throw new Error("Invalid notification sender email configuration.");
  cleanHeaderValue(fromName);
  if (replyTo) {
    const normalizedReplyTo = cleanHeaderValue(replyTo).toLowerCase();
    if (!isEmail(normalizedReplyTo)) throw new Error("Invalid notification reply-to configuration.");
  }
  for (const recipient of internalRecipients) {
    if (!isEmail(recipient)) throw new Error("Invalid internal notification recipient configuration.");
  }
  return { apiKey, fromEmail: normalizedFrom, fromName: cleanHeaderValue(fromName), replyTo: replyTo ? cleanHeaderValue(replyTo).toLowerCase() : undefined, internalRecipients };
}

export function isEmail(value: string) {
  return value.trim().length <= 320 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function normalizeRecipient(value: string) {
  const normalized = value.trim().toLowerCase();
  if (!isEmail(normalized)) throw new Error("Invalid notification recipient.");
  return normalized;
}