import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const expected = [
  "app/api/v1/search/route.ts",
  "app/api/v1/content/[type]/[slug]/route.ts",
  "app/api/v1/events/[slug]/route.ts",
  "app/api/v1/inquiries/route.ts",
  "app/api/v1/me/route.ts",
  "app/api/v1/me/registrations/route.ts",
  "app/api/v1/me/payments/route.ts",
  "app/api/v1/me/notifications/route.ts",
  "app/api/v1/payments/checkout/route.ts",
  "app/api/v1/payments/[reference]/route.ts",
  "app/api/v1/admin/analytics/route.ts",
  "app/api/v1/admin/audit-logs/route.ts",
  "lib/api/auth.ts",
  "lib/api/errors.ts",
  "lib/api/rate-limit.ts",
  "lib/api/response.ts",
  "lib/api/types.ts",
  "docs/api-v1.md",
];

const missing = expected.filter((file) => !existsSync(join(root, file)));
if (missing.length) throw new Error(`Missing Phase 8.22 files: ${missing.join(", ")}`);

const routeFiles = expected.filter((file) => file.startsWith("app/api/v1/"));
for (const file of routeFiles) {
  const source = readFileSync(join(root, file), "utf8");
  if (/any/.test(source)) throw new Error(`Unexpected any in ${file}`);
  if (/@ts-ignore|eslint-disable/.test(source)) throw new Error(`Suppression directive in ${file}`);
  if (/prisma\.client|from ["']@\/lib\/db\/prisma/.test(source)) throw new Error(`Direct Prisma access in API route ${file}`);
  if (/Access-Control-Allow-Origin["']\s*:\s*["']\*["']/.test(source)) throw new Error(`Wildcard CORS in ${file}`);
}

const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
};
const versions = {
  next: packageJson.dependencies?.next,
  react: packageJson.dependencies?.react,
  "react-dom": packageJson.dependencies?.["react-dom"],
  typescript: packageJson.devDependencies?.typescript,
  eslint: packageJson.devDependencies?.eslint,
  tailwindcss: packageJson.devDependencies?.tailwindcss,
};
const expectedVersions: Record<string, string> = {
  next: "16.3.5",
  react: "19.3.0",
  "react-dom": "19.3.0",
  typescript: "6.0.3",
  eslint: "9.39.5",
  tailwindcss: "4.3.3",
};
for (const [name, version] of Object.entries(expectedVersions)) {
  if (versions[name as keyof typeof versions] !== version) throw new Error(`Locked version changed: ${name}`);
}

console.log(`Phase 8.22 static verification passed: ${expected.length} expected artifacts present; API routes contain no direct Prisma access, wildcard CORS, suppression directives, or any types; locked frontend/tooling versions unchanged.`);
