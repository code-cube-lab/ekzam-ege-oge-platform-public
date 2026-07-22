import { env } from "cloudflare:workers";
import {
  chooseDailyTask,
  findTask,
  trackLabel,
  type DailyTask,
  type ExamTrack,
  type SubjectTrack,
  type TopicStat,
} from "./task-bank";

type TelegramUser = { id: number; first_name?: string; username?: string };
export type TelegramStudent = {
  telegramId: string;
  chatId: string;
  firstName: string;
  username: string | null;
  exam: ExamTrack;
  subject: SubjectTrack;
  weakTopics: string[];
  lastScore: number;
  remindersEnabled: boolean;
  lastDailySent: string | null;
  consentActor: "adult_student" | "parent" | null;
  consentedAt: string | null;
};

const TELEGRAM_CONSENT_VERSION = "2026-07-22";
export const TELEGRAM_PRODUCT = {
  code: "practice_30d",
  title: "ЭКЗАМ · практика 30 дней",
  description: "Персональные ежедневные задания, разбор ошибок и план повторения на 30 дней.",
  currency: "XTR" as const,
  amount: 199,
  accessDays: 30,
};

export type TelegramAccess = {
  status: "free" | "invoice_pending" | "paid" | "expired";
  expiresAt: string | null;
};

function bindings() {
  return env as unknown as Record<string, string> & { DB?: D1Database };
}

function database() {
  const value = bindings().DB;
  if (!value) throw new Error("D1 binding DB is unavailable");
  return value;
}

export function botToken() { return bindings().TELEGRAM_BOT_TOKEN ?? ""; }
export function webhookSecret() { return bindings().TELEGRAM_WEBHOOK_SECRET ?? ""; }
export function cronSecret() { return bindings().CRON_SECRET ?? ""; }
export function telegramAdminSecret() { return bindings().TELEGRAM_ADMIN_SECRET ?? ""; }

async function ensureTelegramSchema() {
  const d1 = database();
  await d1.batch([
    d1.prepare(`CREATE TABLE IF NOT EXISTS telegram_students (
      telegram_id TEXT PRIMARY KEY,
      chat_id TEXT NOT NULL,
      first_name TEXT NOT NULL,
      username TEXT,
      exam_track TEXT NOT NULL DEFAULT 'ege',
      subject_track TEXT NOT NULL DEFAULT 'russian',
      weak_topics TEXT NOT NULL DEFAULT '[]',
      last_score INTEGER NOT NULL DEFAULT 0,
      reminders_enabled INTEGER NOT NULL DEFAULT 1,
      reminder_hour INTEGER NOT NULL DEFAULT 10,
      last_daily_sent TEXT,
      consent_actor TEXT,
      consent_version TEXT,
      consented_at TEXT,
      updated_at TEXT NOT NULL
    )`),
    d1.prepare(`CREATE TABLE IF NOT EXISTS telegram_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telegram_id TEXT NOT NULL,
      task_key TEXT NOT NULL,
      answer_index INTEGER NOT NULL,
      is_correct INTEGER NOT NULL,
      answered_at TEXT NOT NULL
    )`),
    d1.prepare(`CREATE TABLE IF NOT EXISTS telegram_mastery (
      telegram_id TEXT NOT NULL,
      topic TEXT NOT NULL,
      mastery REAL NOT NULL DEFAULT 0.5,
      correct_count INTEGER NOT NULL DEFAULT 0,
      error_count INTEGER NOT NULL DEFAULT 0,
      streak INTEGER NOT NULL DEFAULT 0,
      last_seen TEXT NOT NULL,
      next_review_at TEXT,
      PRIMARY KEY (telegram_id, topic)
    )`),
    d1.prepare(`CREATE TABLE IF NOT EXISTS telegram_orders (
      id TEXT PRIMARY KEY,
      telegram_id TEXT NOT NULL,
      product_code TEXT NOT NULL,
      currency TEXT NOT NULL,
      amount INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      invoice_payload TEXT NOT NULL UNIQUE,
      invoice_link TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`),
    d1.prepare(`CREATE TABLE IF NOT EXISTS telegram_payments (
      telegram_payment_charge_id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      telegram_id TEXT NOT NULL,
      currency TEXT NOT NULL,
      amount INTEGER NOT NULL,
      paid_at TEXT NOT NULL
    )`),
    d1.prepare(`CREATE TABLE IF NOT EXISTS telegram_entitlements (
      telegram_id TEXT NOT NULL,
      product_code TEXT NOT NULL,
      status TEXT NOT NULL,
      starts_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      order_id TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (telegram_id, product_code)
    )`),
    d1.prepare("CREATE INDEX IF NOT EXISTS telegram_answers_user_idx ON telegram_answers(telegram_id, answered_at)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS telegram_orders_user_idx ON telegram_orders(telegram_id, created_at)"),
  ]);

  // Safe upgrade for students created by the first prototype revision.
  for (const sql of [
    "ALTER TABLE telegram_students ADD COLUMN exam_track TEXT NOT NULL DEFAULT 'ege'",
    "ALTER TABLE telegram_students ADD COLUMN subject_track TEXT NOT NULL DEFAULT 'russian'",
    "ALTER TABLE telegram_students ADD COLUMN consent_actor TEXT",
    "ALTER TABLE telegram_students ADD COLUMN consent_version TEXT",
    "ALTER TABLE telegram_students ADD COLUMN consented_at TEXT",
  ]) {
    try { await d1.prepare(sql).run(); } catch { /* column already exists */ }
  }
}

function parseTopics(value: unknown) {
  try { return JSON.parse(String(value ?? "[]")) as string[]; } catch { return []; }
}

function rowToStudent(row: Record<string, unknown>): TelegramStudent {
  return {
    telegramId: String(row.telegram_id),
    chatId: String(row.chat_id),
    firstName: String(row.first_name),
    username: row.username ? String(row.username) : null,
    exam: row.exam_track === "oge" ? "oge" : "ege",
    subject: row.subject_track === "literature" ? "literature" : "russian",
    weakTopics: parseTopics(row.weak_topics),
    lastScore: Number(row.last_score ?? 0),
    remindersEnabled: Number(row.reminders_enabled ?? 1) === 1,
    lastDailySent: row.last_daily_sent ? String(row.last_daily_sent) : null,
    consentActor: row.consent_actor === "parent" ? "parent" : row.consent_actor === "adult_student" ? "adult_student" : null,
    consentedAt: row.consent_version === TELEGRAM_CONSENT_VERSION && row.consented_at ? String(row.consented_at) : null,
  };
}

export async function upsertTelegramStudent(user: TelegramUser, chatId?: string) {
  await ensureTelegramSchema();
  const id = String(user.id);
  const effectiveChat = chatId ?? id;
  await database().prepare(`INSERT INTO telegram_students
    (telegram_id, chat_id, first_name, username, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(telegram_id) DO UPDATE SET
      chat_id = excluded.chat_id,
      first_name = excluded.first_name,
      username = excluded.username,
      updated_at = excluded.updated_at`)
    .bind(id, effectiveChat, user.first_name || "Ученик", user.username || null, new Date().toISOString())
    .run();
  return getTelegramStudent(id);
}

export async function getTelegramStudent(telegramId: string) {
  await ensureTelegramSchema();
  const row = await database().prepare("SELECT * FROM telegram_students WHERE telegram_id = ? LIMIT 1").bind(telegramId).first<Record<string, unknown>>();
  return row ? rowToStudent(row) : null;
}

export async function setStudentTrack(telegramId: string, exam: ExamTrack, subject: SubjectTrack) {
  await ensureTelegramSchema();
  await database().batch([
    database().prepare("UPDATE telegram_students SET exam_track = ?, subject_track = ?, weak_topics = '[]', updated_at = ? WHERE telegram_id = ?")
      .bind(exam, subject, new Date().toISOString(), telegramId),
    database().prepare("DELETE FROM telegram_mastery WHERE telegram_id = ?").bind(telegramId),
  ]);
  return getTelegramStudent(telegramId);
}

export async function setReminders(telegramId: string, enabled: boolean) {
  await ensureTelegramSchema();
  await database().prepare("UPDATE telegram_students SET reminders_enabled = ?, updated_at = ? WHERE telegram_id = ?")
    .bind(enabled ? 1 : 0, new Date().toISOString(), telegramId).run();
}

export async function recordTelegramConsent(telegramId: string, actor: "adult_student" | "parent") {
  await ensureTelegramSchema();
  await database().prepare("UPDATE telegram_students SET consent_actor = ?, consent_version = ?, consented_at = ?, updated_at = ? WHERE telegram_id = ?")
    .bind(actor, TELEGRAM_CONSENT_VERSION, new Date().toISOString(), new Date().toISOString(), telegramId).run();
  return getTelegramStudent(telegramId);
}

export async function deleteTelegramStudent(telegramId: string) {
  await ensureTelegramSchema();
  await database().batch([
    database().prepare("DELETE FROM telegram_answers WHERE telegram_id = ?").bind(telegramId),
    database().prepare("DELETE FROM telegram_mastery WHERE telegram_id = ?").bind(telegramId),
    database().prepare("DELETE FROM telegram_students WHERE telegram_id = ?").bind(telegramId),
  ]);
}

export async function listReminderStudents() {
  await ensureTelegramSchema();
  const result = await database().prepare("SELECT * FROM telegram_students WHERE reminders_enabled = 1 AND consented_at IS NOT NULL ORDER BY updated_at DESC LIMIT 500").all<Record<string, unknown>>();
  return result.results.map(rowToStudent);
}

export async function markDailySent(telegramId: string, day: string) {
  await database().prepare("UPDATE telegram_students SET last_daily_sent = ?, updated_at = ? WHERE telegram_id = ?")
    .bind(day, new Date().toISOString(), telegramId).run();
}

async function topicStats(telegramId: string) {
  await ensureTelegramSchema();
  const result = await database().prepare("SELECT topic, mastery, error_count, streak, next_review_at FROM telegram_mastery WHERE telegram_id = ?")
    .bind(telegramId).all<Record<string, unknown>>();
  return Object.fromEntries(result.results.map((row) => [String(row.topic), {
    mastery: Number(row.mastery ?? 0.5),
    errorCount: Number(row.error_count ?? 0),
    streak: Number(row.streak ?? 0),
    nextReviewAt: row.next_review_at ? String(row.next_review_at) : null,
  } satisfies TopicStat]));
}

function isoAfter(days: number) {
  const value = new Date();
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export async function recordTelegramAnswer(student: TelegramStudent, task: DailyTask, answerIndex: number) {
  await ensureTelegramSchema();
  const correct = answerIndex === task.correctIndex;
  const current = (await topicStats(student.telegramId))[task.topic] ?? { mastery: 0.5, errorCount: 0, streak: 0, nextReviewAt: null };
  const streak = correct ? (current.streak >= 0 ? current.streak + 1 : 1) : (current.streak <= 0 ? current.streak - 1 : -1);
  const mastery = Math.max(0, Math.min(1, current.mastery + (correct ? 0.1 : -0.08)));
  const correctCountDelta = correct ? 1 : 0;
  const errorCountDelta = correct ? 0 : 1;
  const nextReviewAt = isoAfter(correct ? (streak >= 2 ? 7 : 3) : 1);
  const weak = new Set(student.weakTopics);
  if (correct && mastery >= 0.65) weak.delete(task.topic);
  if (!correct) weak.add(task.topic);
  const now = new Date().toISOString();

  await database().batch([
    database().prepare("INSERT INTO telegram_answers (telegram_id, task_key, answer_index, is_correct, answered_at) VALUES (?, ?, ?, ?, ?)")
      .bind(student.telegramId, task.key, answerIndex, correct ? 1 : 0, now),
    database().prepare("UPDATE telegram_students SET weak_topics = ?, updated_at = ? WHERE telegram_id = ?")
      .bind(JSON.stringify([...weak]), now, student.telegramId),
    database().prepare(`INSERT INTO telegram_mastery
      (telegram_id, topic, mastery, correct_count, error_count, streak, last_seen, next_review_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(telegram_id, topic) DO UPDATE SET
        mastery = excluded.mastery,
        correct_count = telegram_mastery.correct_count + excluded.correct_count,
        error_count = telegram_mastery.error_count + excluded.error_count,
        streak = excluded.streak,
        last_seen = excluded.last_seen,
        next_review_at = excluded.next_review_at`)
      .bind(student.telegramId, task.topic, mastery, correctCountDelta, errorCountDelta, streak, now, nextReviewAt),
  ]);
  return { correct, weakTopics: [...weak], mastery, nextReviewAt };
}

export async function verifyTelegramInitData(initData: string, maxAgeSeconds = 86400) {
  const token = botToken();
  if (!token || !initData) return { ok: false as const, error: "Telegram is not configured" };
  const params = new URLSearchParams(initData);
  const receivedHash = params.get("hash") ?? "";
  const authDate = Number(params.get("auth_date") ?? 0);
  params.delete("hash");
  // Telegram's bot-token HMAC covers every received field except `hash`.
  // The newer `signature` field is excluded only by the separate Ed25519
  // third-party verification flow, so it must remain in this check string.
  const dataCheckString = [...params.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join("\n");
  const encoder = new TextEncoder();
  const webAppKey = await crypto.subtle.importKey("raw", encoder.encode("WebAppData"), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const secret = await crypto.subtle.sign("HMAC", webAppKey, encoder.encode(token));
  const secretKey = await crypto.subtle.importKey("raw", secret, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = await crypto.subtle.sign("HMAC", secretKey, encoder.encode(dataCheckString));
  const computed = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  if (!receivedHash || computed.length !== receivedHash.length || !timingSafeEqual(computed, receivedHash)) return { ok: false as const, error: "Invalid Telegram signature" };
  if (!authDate || Math.abs(Date.now() / 1000 - authDate) > maxAgeSeconds) return { ok: false as const, error: "Telegram session expired" };
  try {
    const user = JSON.parse(params.get("user") ?? "null") as TelegramUser | null;
    if (!user?.id) return { ok: false as const, error: "Telegram user missing" };
    return { ok: true as const, user };
  } catch {
    return { ok: false as const, error: "Telegram user is invalid" };
  }
}

function timingSafeEqual(a: string, b: string) {
  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return mismatch === 0;
}

export async function telegramApi(method: string, payload: Record<string, unknown>) {
  const token = botToken();
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is missing");
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json() as { ok?: boolean; description?: string; result?: unknown };
  if (!response.ok || !data.ok) throw new Error(data.description || `Telegram API ${method} failed`);
  return data.result;
}

export async function getTelegramAccess(telegramId: string): Promise<TelegramAccess> {
  await ensureTelegramSchema();
  const entitlement = await database().prepare("SELECT status, expires_at FROM telegram_entitlements WHERE telegram_id = ? AND product_code = ? LIMIT 1")
    .bind(telegramId, TELEGRAM_PRODUCT.code).first<Record<string, unknown>>();
  if (entitlement?.status === "active") {
    const expiresAt = String(entitlement.expires_at);
    if (Date.parse(expiresAt) > Date.now()) return { status: "paid", expiresAt };
    await database().prepare("UPDATE telegram_entitlements SET status = 'expired', updated_at = ? WHERE telegram_id = ? AND product_code = ?")
      .bind(new Date().toISOString(), telegramId, TELEGRAM_PRODUCT.code).run();
    return { status: "expired", expiresAt };
  }
  const pending = await database().prepare("SELECT id FROM telegram_orders WHERE telegram_id = ? AND product_code = ? AND status = 'pending' ORDER BY created_at DESC LIMIT 1")
    .bind(telegramId, TELEGRAM_PRODUCT.code).first();
  return { status: pending ? "invoice_pending" : "free", expiresAt: null };
}

export async function hasPaidTelegramAccess(telegramId: string) {
  return (await getTelegramAccess(telegramId)).status === "paid";
}

export async function createTelegramStarsInvoice(student: TelegramStudent) {
  await ensureTelegramSchema();
  const access = await getTelegramAccess(student.telegramId);
  if (access.status === "paid") return { status: "paid" as const, invoiceLink: null, access };
  const pending = await database().prepare("SELECT id, invoice_link FROM telegram_orders WHERE telegram_id = ? AND product_code = ? AND status = 'pending' ORDER BY created_at DESC LIMIT 1")
    .bind(student.telegramId, TELEGRAM_PRODUCT.code).first<Record<string, unknown>>();
  if (pending?.invoice_link) return { status: "invoice_pending" as const, invoiceLink: String(pending.invoice_link), access };

  const orderId = crypto.randomUUID();
  const payload = `ekzam:${orderId}`;
  const now = new Date().toISOString();
  await database().prepare(`INSERT INTO telegram_orders
    (id, telegram_id, product_code, currency, amount, status, invoice_payload, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)`)
    .bind(orderId, student.telegramId, TELEGRAM_PRODUCT.code, TELEGRAM_PRODUCT.currency, TELEGRAM_PRODUCT.amount, payload, now, now).run();
  try {
    const invoiceLink = String(await telegramApi("createInvoiceLink", {
      title: TELEGRAM_PRODUCT.title,
      description: TELEGRAM_PRODUCT.description,
      payload,
      currency: TELEGRAM_PRODUCT.currency,
      prices: [{ label: "Доступ на 30 дней", amount: TELEGRAM_PRODUCT.amount }],
    }));
    await database().prepare("UPDATE telegram_orders SET invoice_link = ?, updated_at = ? WHERE id = ?")
      .bind(invoiceLink, new Date().toISOString(), orderId).run();
    return { status: "invoice_pending" as const, invoiceLink, access: { status: "invoice_pending" as const, expiresAt: null } };
  } catch (error) {
    await database().prepare("UPDATE telegram_orders SET status = 'failed', updated_at = ? WHERE id = ?")
      .bind(new Date().toISOString(), orderId).run();
    throw error;
  }
}

export async function answerTelegramPreCheckout(query: { id: string; from: { id: number }; currency: string; total_amount: number; invoice_payload: string }) {
  await ensureTelegramSchema();
  const order = await database().prepare("SELECT * FROM telegram_orders WHERE invoice_payload = ? LIMIT 1")
    .bind(query.invoice_payload).first<Record<string, unknown>>();
  const valid = Boolean(order
    && String(order.telegram_id) === String(query.from.id)
    && String(order.currency) === query.currency
    && Number(order.amount) === query.total_amount
    && String(order.product_code) === TELEGRAM_PRODUCT.code
    && String(order.status) === "pending");
  await telegramApi("answerPreCheckoutQuery", valid
    ? { pre_checkout_query_id: query.id, ok: true }
    : { pre_checkout_query_id: query.id, ok: false, error_message: "Счёт устарел или сумма не совпала. Вернитесь в Mini App и создайте новый счёт." });
  return valid;
}

export async function recordSuccessfulTelegramPayment(telegramId: string, payment: {
  currency: string;
  total_amount: number;
  invoice_payload: string;
  telegram_payment_charge_id: string;
}) {
  await ensureTelegramSchema();
  const order = await database().prepare("SELECT * FROM telegram_orders WHERE invoice_payload = ? LIMIT 1")
    .bind(payment.invoice_payload).first<Record<string, unknown>>();
  if (!order
    || String(order.telegram_id) !== telegramId
    || String(order.currency) !== payment.currency
    || Number(order.amount) !== payment.total_amount
    || String(order.product_code) !== TELEGRAM_PRODUCT.code) throw new Error("Successful payment does not match a server order");

  const duplicate = await database().prepare("SELECT telegram_payment_charge_id FROM telegram_payments WHERE telegram_payment_charge_id = ? LIMIT 1")
    .bind(payment.telegram_payment_charge_id).first();
  if (duplicate) return getTelegramAccess(telegramId);

  const now = new Date();
  const current = await database().prepare("SELECT expires_at FROM telegram_entitlements WHERE telegram_id = ? AND product_code = ? LIMIT 1")
    .bind(telegramId, TELEGRAM_PRODUCT.code).first<Record<string, unknown>>();
  const currentExpiry = current?.expires_at ? Date.parse(String(current.expires_at)) : 0;
  const startMs = Math.max(now.getTime(), Number.isFinite(currentExpiry) ? currentExpiry : 0);
  const expiresAt = new Date(startMs + TELEGRAM_PRODUCT.accessDays * 86400000).toISOString();
  const nowIso = now.toISOString();
  await database().batch([
    database().prepare("INSERT INTO telegram_payments (telegram_payment_charge_id, order_id, telegram_id, currency, amount, paid_at) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(payment.telegram_payment_charge_id, String(order.id), telegramId, payment.currency, payment.total_amount, nowIso),
    database().prepare("UPDATE telegram_orders SET status = 'paid', updated_at = ? WHERE id = ?")
      .bind(nowIso, String(order.id)),
    database().prepare(`INSERT INTO telegram_entitlements
      (telegram_id, product_code, status, starts_at, expires_at, order_id, updated_at)
      VALUES (?, ?, 'active', ?, ?, ?, ?)
      ON CONFLICT(telegram_id, product_code) DO UPDATE SET
        status = 'active', expires_at = excluded.expires_at, order_id = excluded.order_id, updated_at = excluded.updated_at`)
      .bind(telegramId, TELEGRAM_PRODUCT.code, nowIso, expiresAt, String(order.id), nowIso),
  ]);
  return { status: "paid" as const, expiresAt };
}

export async function refundTelegramStars(telegramId: string, chargeId: string) {
  await ensureTelegramSchema();
  const payment = await database().prepare("SELECT * FROM telegram_payments WHERE telegram_payment_charge_id = ? AND telegram_id = ? LIMIT 1")
    .bind(chargeId, telegramId).first<Record<string, unknown>>();
  if (!payment) throw new Error("Payment not found");
  await telegramApi("refundStarPayment", { user_id: Number(telegramId), telegram_payment_charge_id: chargeId });
  const now = new Date().toISOString();
  await database().batch([
    database().prepare("UPDATE telegram_orders SET status = 'refunded', updated_at = ? WHERE id = ?").bind(now, String(payment.order_id)),
    database().prepare("UPDATE telegram_entitlements SET status = 'refunded', updated_at = ? WHERE telegram_id = ? AND product_code = ?")
      .bind(now, telegramId, TELEGRAM_PRODUCT.code),
  ]);
  return { status: "refunded" as const };
}

export function miniAppUrl(requestUrl: string) {
  const configured = bindings().PUBLIC_APP_URL?.replace(/\/$/, "");
  return `${configured || new URL(requestUrl).origin}/telegram`;
}

export async function selectTaskForStudent(student: TelegramStudent, excludeKey?: string) {
  return chooseDailyTask(student.weakTopics, student.telegramId, student.exam, student.subject, await topicStats(student.telegramId), excludeKey);
}

export async function sendTaskMessage(student: TelegramStudent, task?: DailyTask, excludeKey?: string) {
  const selected = task ?? await selectTaskForStudent(student, excludeKey);
  const keyboard = selected.options.map((option, index) => [{ text: `${String.fromCharCode(65 + index)}. ${option}`, callback_data: `a:${selected.key}:${index}` }]);
  await telegramApi("sendMessage", {
    chat_id: student.chatId,
    text: `📚 ${trackLabel(selected.exam, selected.subject)} · ${selected.estimatedMinutes} мин\n${selected.title}\n\n${selected.question}\n\nОтветьте кнопкой — следующий шаг изменится по вашему ответу.`,
    reply_markup: { inline_keyboard: keyboard },
  });
  return selected;
}

export function findTelegramTask(key: string) { return findTask(key); }
export function studentTrackLabel(student: TelegramStudent) { return trackLabel(student.exam, student.subject); }
