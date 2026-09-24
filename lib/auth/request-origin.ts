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
    const expectedOrigin =
      configuredOrigin() ??
      (process.env.NODE_ENV === "production"
        ? PRODUCTION_ORIGIN
        : new URL(request.url).origin);

    return new URL(origin).origin === expectedOrigin;
  } catch {
    return false;
  }
}
