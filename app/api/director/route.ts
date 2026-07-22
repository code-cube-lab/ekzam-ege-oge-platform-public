import { getDirectorReport, getSession, updatePlanPrice } from "../../lib/demo-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getSession(request);
  if (!session) return Response.json({ error: "Authentication required" }, { status: 401 });
  if (session.role !== "director") return Response.json({ error: "Director role required" }, { status: 403 });
  return Response.json({ ...(await getDirectorReport()), generatedAt: new Date().toISOString() });
}

export async function POST(request: Request) {
  const session = await getSession(request);
  if (!session) return Response.json({ error: "Authentication required" }, { status: 401 });
  if (session.role !== "director") return Response.json({ error: "Director role required" }, { status: 403 });
  const body = (await request.json()) as { id?: string; monthlyPrice?: number };
  try {
    return Response.json({ ...(await updatePlanPrice(body.id ?? "", Number(body.monthlyPrice))), generatedAt: new Date().toISOString() });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Invalid plan update" }, { status: 400 });
  }
}
