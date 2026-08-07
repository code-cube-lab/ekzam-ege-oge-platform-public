import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Telegram catalog covers 15 EGE subjects and 14 OGE subjects", async () => {
  const catalog = await readFile(new URL("../knowledge-base/exams/exam-subjects.ts", import.meta.url), "utf8");
  const slugsBlock = catalog.match(/examSubjectSlugs = \[([\s\S]*?)\] as const/)?.[1] ?? "";
  const slugs = [...slugsBlock.matchAll(/"([a-z]+)"/g)].map((match) => match[1]);
  assert.equal(slugs.length, 15);
  assert.equal(new Set(slugs).size, 15);
  assert.match(catalog, /slug: "chinese"[\s\S]*?ogeAvailable: false/);
  assert.equal((catalog.match(/ogeAvailable: true/g) ?? []).length, 14);
});

test("daily Telegram bank is derived from checked subject tasks and guards empty tracks", async () => {
  const bank = await readFile(new URL("../knowledge-base/tasks/task-bank.ts", import.meta.url), "utf8");
  assert.match(bank, /getDemoTasks\(subject\)/);
  assert.match(bank, /task\.kind === "single"/);
  assert.match(bank, /task\.kind === "number"/);
  assert.match(bank, /numericOptions/);
  assert.match(bank, /answer is missing from options/);
  assert.match(bank, /No daily tasks for/);
  assert.match(bank, /isTrackAvailable\(exam, subject\)/);
});

test("bot uses exam-first routing, all-subject keyboards and safe payment updates", async () => {
  const [webhook, setup] = await Promise.all([
    readFile(new URL("../app/api/telegram/webhook/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../scripts/setup-telegram.ps1", import.meta.url), "utf8"),
  ]);
  assert.match(webhook, /track:exam:oge/);
  assert.match(webhook, /track:exam:ege/);
  assert.match(webhook, /track:subject:\$\{subject\.slug\}/);
  assert.match(webhook, /getTelegramTrackCatalog/);
  assert.match(webhook, /task\.exam !== student\.exam \|\| task\.subject !== student\.subject/);
  assert.match(webhook, /command === "\/exam"/);
  assert.match(webhook, /command === "\/mistakes"/);
  assert.match(webhook, /command === "\/practice"/);
  assert.match(webhook, /command === "\/resume"/);
  assert.match(webhook, /command === "\/report"/);
  assert.match(setup, /pre_checkout_query/);
  assert.match(setup, /getWebhookInfo/);
  assert.match(setup, /PublicUrl must use HTTPS/);
});

test("Mini App changes the verified server track and exposes adaptive mobile sections", async () => {
  const [miniApp, trackApi, css] = await Promise.all([
    readFile(new URL("../app/components/TelegramMiniAppClient.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/telegram/track/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  for (const label of ["Сегодня", "Практика", "Вариант", "Ошибки", "Профиль"]) assert.match(miniApp, new RegExp(label));
  assert.match(miniApp, /\/api\/telegram\/track/);
  assert.match(miniApp, /level: student\.exam/);
  assert.match(miniApp, /source: "telegram"/);
  assert.match(miniApp, /miniAppHref/);
  assert.match(miniApp, /БЕСПЛАТНЫЙ РЕЖИМ MINI APP/);
  assert.match(miniApp, /Персональный серверный профиль, напоминания и оплата пока не подключены/);
  assert.match(trackApi, /verifyTelegramInitData/);
  assert.match(trackApi, /isTrackAvailable/);
  assert.match(css, /env\(safe-area-inset-top\)/);
  assert.match(css, /\.telegram-tabs/);
});

test("daily sender has no stale production URL", async () => {
  const script = await readFile(new URL("../scripts/send-daily-telegram.ps1", import.meta.url), "utf8");
  assert.doesNotMatch(script, /chatgpt\.site/);
  assert.match(script, /PUBLIC_APP_URL/);
  assert.match(script, /Endpoint must use HTTPS/);
});
