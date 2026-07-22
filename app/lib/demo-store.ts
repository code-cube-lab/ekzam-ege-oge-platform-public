import { env } from "cloudflare:workers";

export type SessionState =
  | "anonymous"
  | "free"
  | "invoice_pending"
  | "paid"
  | "expired_or_refunded"
  | "admin"
  | "director";

export type DemoSession = {
  id: string;
  name: string;
  role: "student" | "admin" | "director";
  state: SessionState;
  diagnosticScore: number;
  weakTopics: string[];
  hasConsent: boolean;
  consentActor: "adult_student" | "parent" | null;
};

export type ConsentActor = "adult_student" | "parent";
export const CONSENT_VERSION = "2026-07-22";

const COOKIE_NAME = "ekzam_demo_session";

function db() {
  if (!env.DB) throw new Error("D1 binding DB is unavailable");
  return env.DB;
}

async function ensureSchema() {
  const d1 = db();
  await d1.batch([
    d1
      .prepare(
        `CREATE TABLE IF NOT EXISTS demo_sessions (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          role TEXT NOT NULL,
          entitlement TEXT NOT NULL,
          diagnostic_score INTEGER NOT NULL DEFAULT 0,
          weak_topics TEXT NOT NULL DEFAULT '[]',
          updated_at TEXT NOT NULL
        )`,
      ),
    d1.prepare(
      "CREATE INDEX IF NOT EXISTS demo_sessions_updated_idx ON demo_sessions(updated_at)",
    ),
    d1.prepare(
      `CREATE TABLE IF NOT EXISTS consent_records (
        session_id TEXT PRIMARY KEY,
        actor_role TEXT NOT NULL,
        personal_data_version TEXT NOT NULL,
        terms_version TEXT NOT NULL,
        consented_at TEXT NOT NULL,
        user_agent TEXT
      )`,
    ),
    d1.prepare(
      `CREATE TABLE IF NOT EXISTS school_plans (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        monthly_price INTEGER NOT NULL,
        promise TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
    ),
    d1.prepare("INSERT OR IGNORE INTO school_plans (id, name, monthly_price, promise, updated_at) VALUES ('trainer', 'Тренажёр', 1490, 'Самостоятельная подготовка и отчёт родителю', datetime('now'))"),
    d1.prepare("INSERT OR IGNORE INTO school_plans (id, name, monthly_price, promise, updated_at) VALUES ('group', 'Группа', 4490, 'Еженедельный урок и проверка работ', datetime('now'))"),
    d1.prepare("INSERT OR IGNORE INTO school_plans (id, name, monthly_price, promise, updated_at) VALUES ('mentor', 'Мини-группа + наставник', 7990, 'Личный маршрут и две проверки в неделю', datetime('now'))"),
    d1.prepare("UPDATE school_plans SET monthly_price = 1490, updated_at = datetime('now') WHERE id = 'trainer' AND monthly_price = 390"),
    d1.prepare("UPDATE school_plans SET monthly_price = 4490, promise = 'Еженедельный урок и проверка работ', updated_at = datetime('now') WHERE id = 'group' AND monthly_price = 1290"),
    d1.prepare("UPDATE school_plans SET monthly_price = 7990, name = 'Мини-группа + наставник', promise = 'Личный маршрут и две проверки в неделю', updated_at = datetime('now') WHERE id = 'mentor' AND monthly_price = 2490"),
  ]);
}

export function sessionCookie(request: Request) {
  const source = request.headers.get("cookie") ?? "";
  for (const part of source.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === COOKIE_NAME) return decodeURIComponent(value.join("="));
  }
  return null;
}

export function setSessionCookie(id: string) {
  return `${COOKIE_NAME}=${encodeURIComponent(id)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=2592000`;
}

function toState(role: string, entitlement: string): SessionState {
  if (role === "director") return "director";
  if (role === "admin") return "admin";
  if (entitlement === "paid") return "paid";
  if (entitlement === "pending") return "invoice_pending";
  if (entitlement === "expired") return "expired_or_refunded";
  return "free";
}

function rowToSession(row: Record<string, unknown>): DemoSession {
  let weakTopics: string[] = [];
  try {
    weakTopics = JSON.parse(String(row.weak_topics ?? "[]"));
  } catch {
    weakTopics = [];
  }
  return {
    id: String(row.id),
    name: String(row.name),
    role: row.role === "director" ? "director" : row.role === "admin" ? "admin" : "student",
    state: toState(String(row.role), String(row.entitlement)),
    diagnosticScore: Number(row.diagnostic_score ?? 0),
    weakTopics,
    hasConsent: false,
    consentActor: null,
  };
}

export async function getSession(request: Request): Promise<DemoSession | null> {
  const id = sessionCookie(request);
  if (!id) return null;
  await ensureSchema();
  const row = await db()
    .prepare("SELECT * FROM demo_sessions WHERE id = ? LIMIT 1")
    .bind(id)
    .first<Record<string, unknown>>();
  if (!row) return null;
  const session = rowToSession(row);
  const consent = await db()
    .prepare("SELECT actor_role, personal_data_version, terms_version FROM consent_records WHERE session_id = ? LIMIT 1")
    .bind(id)
    .first<{ actor_role?: string; personal_data_version?: string; terms_version?: string }>();
  const actor = consent?.actor_role === "parent" ? "parent" : consent?.actor_role === "adult_student" ? "adult_student" : null;
  return {
    ...session,
    consentActor: actor,
    hasConsent: Boolean(actor && consent?.personal_data_version === CONSENT_VERSION && consent?.terms_version === CONSENT_VERSION),
  };
}

export async function setDemoState(
  request: Request,
  state: Exclude<SessionState, "anonymous">,
) {
  await ensureSchema();
  const existing = sessionCookie(request);
  const role = state === "director" ? "director" : state === "admin" ? "admin" : "student";
  let id = existing || crypto.randomUUID();
  if (existing) {
    const current = await db()
      .prepare("SELECT role FROM demo_sessions WHERE id = ? LIMIT 1")
      .bind(existing)
      .first<{ role?: string }>();
    if (current?.role && current.role !== role) id = crypto.randomUUID();
  }
  const entitlement =
    state === "paid" || state === "admin"
      ? "paid"
      : state === "invoice_pending"
        ? "pending"
        : state === "expired_or_refunded"
          ? "expired"
          : "free";
  const name = state === "director" ? "Администратор" : state === "admin" ? "Елена Николаевна" : "Алексей";
  const updatedAt = new Date().toISOString();

  await db()
    .prepare(
      `INSERT INTO demo_sessions (id, name, role, entitlement, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         role = excluded.role,
         entitlement = excluded.entitlement,
         updated_at = excluded.updated_at`,
    )
    .bind(id, name, role, entitlement, updatedAt)
    .run();

  const session = await getSession(
    new Request(request.url, { headers: { cookie: `${COOKIE_NAME}=${id}` } }),
  );
  if (!session) throw new Error("Failed to create demo session");
  return session;
}

export async function saveDiagnostic(
  sessionId: string,
  score: number,
  weakTopics: string[],
) {
  await ensureSchema();
  await db()
    .prepare(
      "UPDATE demo_sessions SET diagnostic_score = ?, weak_topics = ?, updated_at = ? WHERE id = ?",
    )
    .bind(score, JSON.stringify(weakTopics), new Date().toISOString(), sessionId)
    .run();
}

export async function recordConsent(request: Request, actor: ConsentActor) {
  const id = sessionCookie(request);
  if (!id) throw new Error("Session is required before consent");
  await ensureSchema();
  const session = await getSession(request);
  if (!session) throw new Error("Session not found");
  await db().prepare(
    `INSERT INTO consent_records
      (session_id, actor_role, personal_data_version, terms_version, consented_at, user_agent)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(session_id) DO UPDATE SET
      actor_role = excluded.actor_role,
      personal_data_version = excluded.personal_data_version,
      terms_version = excluded.terms_version,
      consented_at = excluded.consented_at,
      user_agent = excluded.user_agent`,
  ).bind(
    id,
    actor,
    CONSENT_VERSION,
    CONSENT_VERSION,
    new Date().toISOString(),
    request.headers.get("user-agent"),
  ).run();
  return getSession(request);
}

export async function listStudents() {
  await ensureSchema();
  const result = await db()
    .prepare(
      "SELECT id, name, entitlement, diagnostic_score, weak_topics, updated_at FROM demo_sessions WHERE role = 'student' ORDER BY updated_at DESC LIMIT 8",
    )
    .all<Record<string, unknown>>();
  return result.results.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    state: toState("student", String(row.entitlement)),
    score: Number(row.diagnostic_score ?? 0),
    weakTopics: JSON.parse(String(row.weak_topics ?? "[]")) as string[],
    updatedAt: String(row.updated_at),
  }));
}

export async function getDirectorReport() {
  await ensureSchema();
  const [students, plansResult] = await Promise.all([
    listStudents(),
    db().prepare("SELECT id, name, monthly_price, promise, updated_at FROM school_plans ORDER BY monthly_price ASC").all<Record<string, unknown>>(),
  ]);
  const paid = students.filter((student) => student.state === "paid").length;
  const active = students.filter((student) => student.state !== "expired_or_refunded").length;
  const average = students.filter((student) => student.score > 0);
  const averageScore = average.length ? Math.round(average.reduce((sum, student) => sum + student.score, 0) / average.length) : 0;
  const groupPlan = plansResult.results.find((row) => String(row.id) === "group");
  const groupPrice = Number(groupPlan?.monthly_price ?? 4490);
  return {
    metrics: {
      activeStudents: active,
      paidStudents: paid,
      trialToPaid: students.length ? Math.round((paid / students.length) * 100) : 0,
      averageScore,
      revenue: paid * groupPrice,
    },
    plans: plansResult.results.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      monthlyPrice: Number(row.monthly_price),
      promise: String(row.promise),
      updatedAt: String(row.updated_at),
    })),
    students,
  };
}

export async function updatePlanPrice(id: string, monthlyPrice: number) {
  await ensureSchema();
  const allowed = ["trainer", "group", "mentor"];
  if (!allowed.includes(id)) throw new Error("Unknown plan");
  if (!Number.isInteger(monthlyPrice) || monthlyPrice < 0 || monthlyPrice > 50000) throw new Error("Invalid price");
  await db().prepare("UPDATE school_plans SET monthly_price = ?, updated_at = ? WHERE id = ?").bind(monthlyPrice, new Date().toISOString(), id).run();
  return getDirectorReport();
}
