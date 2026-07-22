import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("landing contains the product promise and primary path", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  assert.match(page, /Понимать/);
  assert.match(page, /Пройти диагностику/);
  assert.match(page, /Елены/);
  assert.match(layout, /Слово — AI-подготовка к ОГЭ и ЕГЭ/);
  assert.doesNotMatch(`${page}\n${layout}`, /codex-preview|react-loading-skeleton/i);
});

test("required support pages exist", async () => {
  for (const path of ["../app/terms/page.tsx", "../app/support/page.tsx", "../app/paysupport/page.tsx"]) {
    await access(new URL(path, import.meta.url));
  }
});

test("coach route checks identity and entitlement before returning content", async () => {
  const route = await readFile(new URL("../app/api/coach/route.ts", import.meta.url), "utf8");
  assert.match(route, /status:\s*401/);
  assert.match(route, /status:\s*403/);
  assert.match(route, /session\.state !== "paid"/);
});

test("server entitlement contract forbids browser storage as source of truth", async () => {
  const contract = JSON.parse(await readFile(new URL("../site-state-contract.json", import.meta.url), "utf8"));
  assert.equal(contract.sourceOfTruth, "D1 server session plus HttpOnly session id");
  assert.equal(contract.states.free.canUseCoachApi, false);
  assert.equal(contract.states.paid.canUseCoachApi, true);
  assert.ok(contract.forbiddenSourcesOfTruth.includes("localStorage"));
});

test("Telegram endpoints validate identity and delivery secrets", async () => {
  const [telegram, webhook, daily] = await Promise.all([
    readFile(new URL("../app/lib/telegram.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/telegram/webhook/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/telegram/daily/route.ts", import.meta.url), "utf8"),
  ]);
  assert.match(telegram, /Invalid Telegram signature/);
  assert.match(telegram, /auth_date/);
  assert.match(webhook, /x-telegram-bot-api-secret-token/);
  assert.match(daily, /authorization !== `Bearer \$\{expected\}`/);
});

test("daily task selection prioritizes weak topics", async () => {
  const source = await readFile(new URL("../knowledge-base/tasks/task-bank.ts", import.meta.url), "utf8");
  assert.match(source, /weakTopics\.includes\(task\.topic\)/);
  assert.match(source, /Аргументация сочинения/);
  assert.match(source, /Пунктуация/);
  assert.match(source, /exam === exam && task\.subject === subject/);
});

test("knowledge base names the teacher, levels and lesson cycle", async () => {
  const [manifest, teacher, levels, lesson] = await Promise.all([
    readFile(new URL("../knowledge-base/manifest.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../knowledge-base/teacher/teacher-profile.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../knowledge-base/levels/level-model.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../knowledge-base/lessons/lesson-units.ts", import.meta.url), "utf8"),
  ]);
  assert.equal(manifest.expert, "Елена Николаевна Михайличенко");
  assert.equal(teacher.corePrinciple, "AI является помощником преподавателя, а не заменяет его");
  assert.equal(levels.levels.length, 4);
  assert.match(lesson, /youtubeId/);
  assert.match(lesson, /explanation/);
  assert.match(lesson, /nextStep/);
});
