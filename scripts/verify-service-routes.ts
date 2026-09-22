import { canonicalServices } from "../data/services";
import { getPrimaryNavigationWithServices } from "../data/navigation";

const baseUrl = process.env.SERVICE_VERIFY_BASE_URL ?? "http://127.0.0.1:3000";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

function htmlText(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"');
}

async function main() {
  const navigation = getPrimaryNavigationWithServices(canonicalServices);
  const servicesItem = navigation.find((item) => item.href === "/services");
  assert(servicesItem?.type === "grouped", "Services navigation must be grouped.");
  const groups = servicesItem?.groups ?? [];
  assert(groups.length === 3, `Expected 3 service groups, found ${groups.length}.`);

  const links = groups.flatMap((group) => group.items);
  assert(links.length === 28, `Expected 28 service links, found ${links.length}.`);
  assert(new Set(links.map((link) => link.href)).size === 28, "Service navigation contains duplicate destinations.");

  for (const service of canonicalServices) {
    const expectedHref = `/services/${service.slug}`;
    assert(links.some((link) => link.label === service.title && link.href === expectedHref), `Missing dropdown link: ${service.title}`);

    const response = await fetch(baseUrl + expectedHref, { redirect: "manual" });
    const html = htmlText(await response.text());
    assert(response.status === 200, `${expectedHref} returned HTTP ${response.status}.`);
    assert(html.includes(service.title), `${expectedHref} does not render the correct service title.`);
    assert(html.includes(service.category), `${expectedHref} does not render the correct service category.`);
    assert(html.includes("Request Support"), `${expectedHref} is missing the Request Support CTA.`);
    assert(html.includes(`/services/${service.slug}`), `${expectedHref} is missing its canonical service route.`);
  }

  const unknown = await fetch(baseUrl + "/services/not-a-real-service", { redirect: "manual" });
  assert(unknown.status === 404, `Unknown service route returned HTTP ${unknown.status} instead of 404.`);

  console.log("SERVICE ROUTES PASSED — all 28 dropdown destinations and dedicated pages verified.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
