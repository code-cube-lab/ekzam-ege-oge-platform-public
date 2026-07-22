import {
  getSession,
  setDemoState,
  setSessionCookie,
  type SessionState,
} from "../../lib/demo-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getSession(request);
  return Response.json({
    session: session ?? {
      name: "Гость",
      role: "student",
      state: "anonymous",
      diagnosticScore: 0,
      weakTopics: [],
      hasConsent: false,
      consentActor: null,
    },
    verification: "server-session",
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { state?: SessionState };
  const allowed: SessionState[] = [
    "free",
    "invoice_pending",
    "paid",
    "expired_or_refunded",
    "admin",
    "director",
  ];
  if (!body.state || !allowed.includes(body.state)) {
    return Response.json({ error: "Unknown demo state" }, { status: 400 });
  }
  const session = await setDemoState(request, body.state as Exclude<SessionState, "anonymous">);
  return Response.json(
    { session, verification: "mock-local" },
    { headers: { "set-cookie": setSessionCookie(session.id) } },
  );
}
