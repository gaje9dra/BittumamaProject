import "server-only";

export function safeInternalReturnUrl(value: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!base) throw new Error("NEXT_PUBLIC_APP_URL is not configured.");
  const url = new URL(value, base);
  const origin = new URL(base).origin;
  if (url.origin !== origin) throw new Error("Invalid payment return destination.");
  if (!url.pathname.startsWith("/")) throw new Error("Invalid payment return destination.");
  return url.toString();
}

export function parsePaymentRequestId(value: string) {
  const id = value.trim();
  if (!/^[A-Za-z0-9_-]{8,100}$/.test(id)) throw new Error("Invalid payment request identifier.");
  return id;
}