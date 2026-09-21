import "server-only";

import type { NotificationPayload } from "@/lib/notifications/types";

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function cleanText(value: string, max: number) {
  return value.replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
}

function shell(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#f7f7f5;color:#181816;font-family:Arial,Helvetica,sans-serif;"><div style="max-width:620px;margin:0 auto;padding:40px 24px;"><div style="border-top:3px solid #181816;padding-top:20px;"><p style="margin:0 0 24px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;">Bittumama</p><h1 style="margin:0 0 20px;font-size:28px;line-height:1.15;">${escapeHtml(title)}</h1>${body}<p style="margin:32px 0 0;padding-top:18px;border-top:1px solid #ddd;font-size:12px;color:#666;">This is a transactional message from Bittumama.</p></div></div></body></html>`;
}

function eventDetails(data: { eventTitle: string; eventDate: string | null; status: string }) {
  return `<p><strong>${escapeHtml(data.eventTitle)}</strong></p>${data.eventDate ? `<p>Date: ${escapeHtml(data.eventDate)}</p>` : ""}<p>Status: ${escapeHtml(data.status)}</p>`;
}

export function buildNotificationTemplate(payload: NotificationPayload) {
  switch (payload.type) {
    case "INQUIRY_RECEIVED": {
      const subject = `New enquiry received`;
      const text = `A new enquiry was received from ${cleanText(payload.name, 160)} (${cleanText(payload.email, 320)}). Service: ${cleanText(payload.serviceTitle ?? "Other", 160)}. Message: ${cleanText(payload.messagePreview, 600)}`;
      const html = shell(subject, `<p>A new enquiry was received.</p><p><strong>Name:</strong> ${escapeHtml(cleanText(payload.name, 160))}<br><strong>Email:</strong> ${escapeHtml(cleanText(payload.email, 320))}<br><strong>Service:</strong> ${escapeHtml(cleanText(payload.serviceTitle ?? "Other", 160))}</p><p><strong>Message</strong></p><p>${escapeHtml(cleanText(payload.messagePreview, 1000))}</p>`);
      return { subject, text, html };
    }
    case "REGISTRATION_RECEIVED":
    case "REGISTRATION_CONFIRMED":
    case "REGISTRATION_CANCELLED": {
      const titles = {
        REGISTRATION_RECEIVED: "Registration received",
        REGISTRATION_CONFIRMED: "Registration confirmed",
        REGISTRATION_CANCELLED: "Registration cancelled",
      };
      const subject = titles[payload.type];
      const text = `${subject}: ${cleanText(payload.eventTitle, 200)}. Status: ${cleanText(payload.status, 40)}.${payload.eventDate ? ` Date: ${cleanText(payload.eventDate, 100)}.` : ""}`;
      const html = shell(subject, `<p>Hello ${escapeHtml(cleanText(payload.name, 160))},</p>${eventDetails(payload)}`);
      return { subject, text, html };
    }
    case "PAYMENT_SUCCESS":
    case "PAYMENT_FAILED":
    case "PAYMENT_PENDING": {
      const title = payload.type === "PAYMENT_SUCCESS" ? "Payment successful" : payload.type === "PAYMENT_FAILED" ? "Payment failed" : "Payment requires confirmation";
      const subject = `${title} — ${cleanText(payload.reference, 80)}`;
      const failureMessage = payload.type === "PAYMENT_FAILED" ? payload.failureMessage : null;
      const failure = failureMessage ? `\nReason: ${cleanText(failureMessage, 300)}` : "";
      const text = `${title}. Reference: ${cleanText(payload.reference, 80)}. Amount: ${cleanText(payload.currency, 3)} ${cleanText(payload.amount, 30)}. Purpose: ${cleanText(payload.purpose, 80)}. Status: ${cleanText(payload.status, 40)}.${failure}`;
      const html = shell(title, `<p><strong>Reference:</strong> ${escapeHtml(cleanText(payload.reference, 80))}</p><p><strong>Amount:</strong> ${escapeHtml(cleanText(payload.currency, 3))} ${escapeHtml(cleanText(payload.amount, 30))}<br><strong>Purpose:</strong> ${escapeHtml(cleanText(payload.purpose, 80))}<br><strong>Status:</strong> ${escapeHtml(cleanText(payload.status, 40))}</p>${failure ? `<p><strong>Reason:</strong> ${escapeHtml(cleanText(failureMessage ?? "", 300))}</p>` : ""}`);
      return { subject, text, html };
    }
  }
}