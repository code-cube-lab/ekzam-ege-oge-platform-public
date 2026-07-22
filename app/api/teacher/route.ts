import { getSession, listStudents } from "../../lib/demo-store";

export async function GET(request: Request) {
  const session = await getSession(request);
  if (!session) return Response.json({ error: "Authentication required" }, { status: 401 });
  if (session.role !== "admin" && session.role !== "director") {
    return Response.json({ error: "Admin role required" }, { status: 403 });
  }
  const students = await listStudents();
  return Response.json({ students, generatedAt: new Date().toISOString() });
}
