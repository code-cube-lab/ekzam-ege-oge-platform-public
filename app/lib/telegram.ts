import { env } from "cloudflare:workers";
import { chooseDailyTask, findTask, type DailyTask } from "./task-bank";

type TelegramUser = { id: number; first_name?: string; username?: string };
type TelegramStudent = {
  telegramId: string;
  chatId: string;
  firstName: string;
  username: string | null;
  weakTopics: string[];
  lastScore: number;
  remindersEnabled: boolean;
  lastDailySent: string | null;
};

function bindings() {
  return env as unknown as Record<string, string> & { DB?: D1Database };
}

function database() {
  const value = bindings().DB;
  if (!value) throw new Error("D1 binding DB is unavailable");
  return value;
}

export function botToken() {
  return bindings().TELEGRAM_BOT_TOKEN ?? "";
}

export function webhookSecret() {
  return bindings().TELEGRAM_WEBHOOK_SECRET ?? "";
}

export function cronSecret() {
  return bindings().CRON_SECRET ?? "";
}

async function ensureTelegramSchema() {
  const d1 = database();
  await d1.batch([
    d1.prepare(`CREATE TABLE IF NOT EXISTS telegram_students (
      telegram_id TEXT PRIMARY KEY,
      chat_id TEXT NOT NULL,
      first_name TEXT NOT NULL,
      username TEXT,
      weak_topics TEXT NOT NULL DEFAULT '[]',
      last_score INTEGER NOT NULL DEFAULT 0,
      reminders_enabled INTEGER NOT NULL DEFAULT 1,
      reminder_hour INTEGER NOT NULL DEFAULT 10,
      last_daily_sent TEXT,
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
    d1.prepare("CREATE INDEX IF NOT EXISTS telegram_answers_user_idx ON telegram_answers(telegram_id, answered_at)"),
  ]);
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
    weakTopics: parseTopics(row.weak_topics),
    lastScore: Number(row.last_score ?? 0),
    remindersEnabled: Number(row.reminders_enabled ?? 1) === 1,
    lastDailySent: row.last_daily_sent ? String(row.last_daily_sent) : null,
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

export async function setReminders(telegramId: string, enabled: boolean) {
  await ensureTelegramSchema();
  await database().prepare("UPDATE telegram_students SET reminders_enabled = ?, updated_at = ? WHERE telegram_id = ?")
    .bind(enabled ? 1 : 0, new Date().toISOString(), telegramId).run();
}

export async function listReminderStudents() {
  await ensureTelegramSchema();
  const result = await database().prepare("SELECT * FROM telegram_students WHERE reminders_enabled = 1 ORDER BY updated_at DESC LIMIT 500").all<Record<string, unknown>>();
  return result.results.map(rowToStudent);
}

export async function markDailySent(telegramId: string, day: string) {
  await database().prepare("UPDATE telegram_students SET last_daily_sent = ?, updated_at = ? WHERE telegram_id = ?")
    .bind(day, new Date().toISOString(), telegramId).run();
}

export async function recordTelegramAnswer(student: TelegramStudent, task: DailyTask, answerIndex: number) {
  await ensureTelegramSchema();
  const correct = answerIndex === task.correctIndex;
  const weak = new Set(student.weakTopics);
  if (correct) weak.delete(task.topic); else weak.add(task.topic);
  await database().batch([
    database().prepare("INSERT INTO telegram_answers (telegram_id, task_key, answer_index, is_correct, answered_at) VALUES (?, ?, ?, ?, ?)")
      .bind(student.telegramId, task.key, answerIndex, correct ? 1 : 0, new Date().toISOString()),
    database().prepare("UPDATE telegram_students SET weak_topics = ?, updated_at = ? WHERE telegram_id = ?")
      .bind(JSON.stringify([...weak]), new Date().toISOString(), student.telegramId),
  ]);
  return { correct, weakTopics: [...weak] };
}

export async function verifyTelegramInitData(initData: string, maxAgeSeconds = 86400) {
  const token = botToken();
  if (!token || !initData) return { ok: false as const, error: "Telegram is not configured" };
  const params = new URLSearchParams(initData);
  const receivedHash = params.get("hash") ?? "";
  const authDate = Number(params.get("auth_date") ?? 0);
  params.delete("hash");
  params.delete("signature");
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

export function miniAppUrl(requestUrl: string) {
  const configured = bindings().PUBLIC_APP_URL?.replace(/\/$/, "");
  return `${configured || new URL(requestUrl).origin}/telegram`;
}

export function selectTaskForStudent(student: TelegramStudent) {
  return chooseDailyTask(student.weakTopics, student.telegramId);
}

export async function sendTaskMessage(student: TelegramStudent, task = selectTaskForStudent(student)) {
  const keyboard = task.options.map((option, index) => [{ text: `${String.fromCharCode(65 + index)}. ${option}`, callback_data: `a:${task.key}:${index}` }]);
  await telegramApi("sendMessage", {
    chat_id: student.chatId,
    text: `📚 ${task.title}\n\n${task.question}\n\nОтветьте кнопкой — я учту результат в следующем задании.`,
    reply_markup: { inline_keyboard: keyboard },
  });
  return task;
}

export function findTelegramTask(key: string) { return findTask(key); }
