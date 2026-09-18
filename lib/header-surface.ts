export type HeaderSurface = "search" | "dropdown" | "mega" | "mobile";

const HEADER_SURFACE_EVENT = "bittumama:header-surface";

export function announceHeaderSurface(surface: HeaderSurface) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<HeaderSurface>(HEADER_SURFACE_EVENT, { detail: surface }));
}

export function subscribeToHeaderSurface(handler: (surface: HeaderSurface) => void) {
  if (typeof window === "undefined") return () => undefined;

  const listener = (event: Event) => {
    const surface = (event as CustomEvent<HeaderSurface>).detail;
    handler(surface);
  };

  window.addEventListener(HEADER_SURFACE_EVENT, listener);
  return () => window.removeEventListener(HEADER_SURFACE_EVENT, listener);
}
