const PRODUCTION_ORIGIN = "https://bittumamaproject.netlify.app";

function configuredOrigin() {
  const value = process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL;
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const requestOrigin = new URL(request.url).origin;
    const allowedOrigins = new Set([requestOrigin, PRODUCTION_ORIGIN]);
    const configured = configuredOrigin();

    if (configured) allowedOrigins.add(configured);

    return allowedOrigins.has(new URL(origin).origin);
  } catch {
    return false;
  }
}
