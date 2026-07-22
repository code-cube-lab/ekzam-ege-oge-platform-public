import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const demoSessions = sqliteTable("demo_sessions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  entitlement: text("entitlement").notNull(),
  diagnosticScore: integer("diagnostic_score").notNull().default(0),
  weakTopics: text("weak_topics").notNull().default("[]"),
  updatedAt: text("updated_at").notNull(),
});

export const telegramStudents = sqliteTable("telegram_students", {
  telegramId: text("telegram_id").primaryKey(),
  chatId: text("chat_id").notNull(),
  firstName: text("first_name").notNull(),
  username: text("username"),
  weakTopics: text("weak_topics").notNull().default("[]"),
  lastScore: integer("last_score").notNull().default(0),
  remindersEnabled: integer("reminders_enabled", { mode: "boolean" }).notNull().default(true),
  reminderHour: integer("reminder_hour").notNull().default(10),
  lastDailySent: text("last_daily_sent"),
  updatedAt: text("updated_at").notNull(),
});

export const telegramAnswers = sqliteTable("telegram_answers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  telegramId: text("telegram_id").notNull(),
  taskKey: text("task_key").notNull(),
  answerIndex: integer("answer_index").notNull(),
  isCorrect: integer("is_correct", { mode: "boolean" }).notNull(),
  answeredAt: text("answered_at").notNull(),
});
