import { locationPages } from "../data/locations";
import { canonicalServiceSlugs } from "../data/services";

const baseUrl = process.env.LOCATION_TEST_BASE_URL ?? "http://127.0.0.1:3000";

async function fetchPage(path: string) {
  const response = await fetch(baseUrl + path, { redirect: "manual" });
  const body = await response.text();
  return { response, body };
}

function normalizeHtml(body: string) {
  return body
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

for (const location of locationPages) {
  const { response, body } = await fetchPage("/locations/" + location.id);

  if (response.status !== 200) {
    throw new Error(location.id + " returned HTTP " + response.status);
  }

  const normalizedBody = normalizeHtml(body);

  for (const required of [location.city, location.country, location.region, location.heading]) {
    if (!normalizedBody.includes(required)) {
      throw new Error(location.id + " is missing expected content: " + required);
    }
  }

  for (const serviceSlug of location.serviceSlugs) {
    if (!canonicalServiceSlugs.includes(serviceSlug)) {
      throw new Error(location.id + " references a non-canonical service: " + serviceSlug);
    }
    if (!normalizedBody.includes("/services/" + serviceSlug)) {
      throw new Error(location.id + " is missing service link: " + serviceSlug);
    }
  }

  if (!normalizedBody.includes("/contact?location=" + encodeURIComponent(location.id))) {
    throw new Error(location.id + " is missing the location-aware Contact CTA.");
  }
}

const unknown = await fetchPage("/locations/not-a-real-city");
if (unknown.response.status !== 404) {
  throw new Error("Unknown location must return HTTP 404, received " + unknown.response.status);
}

console.log("Verified all " + locationPages.length + " location pages, their service links, Contact CTAs, and the unknown-location 404.");
