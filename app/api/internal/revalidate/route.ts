import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const configured = process.env.SCHEDULER_SECRET;
  const supplied = request.headers.get("x-scheduler-secret");
  return Boolean(configured && supplied && supplied === configured);
}

export async function POST(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let payload: { paths?: unknown };
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const paths = Array.isArray(payload.paths)
    ? payload.paths.filter((path): path is string => typeof path === "string" && path.startsWith("/") && path.length <= 300).slice(0, 20)
    : [];

  for (const path of paths) revalidatePath(path);

  return Response.json({ ok: true, count: paths.length });
}
