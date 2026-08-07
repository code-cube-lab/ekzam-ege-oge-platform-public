import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("practice mode selects one exam line across authored variants", async () => {
  const simulator = await readFile(new URL("../app/components/ExamSimulatorClient.tsx", import.meta.url), "utf8");
  assert.match(simulator, /practiceLine/);
  assert.match(simulator, /routeForVariant\(variant \+ 1\)\[safeLine - 1\]/);
  assert.match(simulator, /3 верных подряд/);
  assert.match(simulator, /Отработать задание №/);
  assert.match(simulator, /appendAttempt/);
});

test("extended answers can pause, persist and resume", async () => {
  const [simulator, progress, resume] = await Promise.all([
    readFile(new URL("../app/components/ExamSimulatorClient.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/learning-progress.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ResumeDraftsClient.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(simulator, /Поставить на паузу/);
  assert.match(simulator, /Сохранить и выйти/);
  assert.match(simulator, /appHref\("\/resume\/"\)/);
  assert.doesNotMatch(simulator, /window\.location\.assign\("\/practice"\)/);
  assert.match(simulator, /Черновик восстановлен/);
  assert.match(progress, /ekzam-learning-progress-v2/);
  assert.match(progress, /drafts/);
  assert.match(resume, /продолжить изложение или сочинение/i);
  assert.match(resume, /Отрабатывать только задание/);
  assert.match(resume, /searchParams\.set\("mode", "training"\)/);
});

test("parent report derives weaknesses from real attempts and states its limits", async () => {
  const [report, progress] = await Promise.all([
    readFile(new URL("../app/components/ParentReportClient.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/learning-progress.ts", import.meta.url), "utf8"),
  ]);
  assert.match(progress, /summarizeLearningProgress/);
  assert.match(progress, /mastery < 80/);
  assert.match(report, /Слабые стороны/);
  assert.match(report, /Это учебная аналитика, а не официальный прогноз балла/);
});

test("outreach board contains 300 verified public entries and excludes bulk sending", async () => {
  const [rawText, board, plan] = await Promise.all([
    readFile(new URL("../research/education-public-leads.json", import.meta.url), "utf8"),
    readFile(new URL("../public/client-search.html", import.meta.url), "utf8"),
    readFile(new URL("../research/client-acquisition-plan.md", import.meta.url), "utf8"),
  ]);
  const raw = JSON.parse(rawText);
  assert.equal(raw.selected, 300);
  assert.equal(raw.leads.length, 300);
  assert.ok(raw.leads.every((item) => item.source_url.startsWith("https://t.me/")));
  assert.ok(raw.leads.every((item) => item.verified_at));
  assert.match(board, /300 проверенных публичных страниц/);
  assert.match(plan, /Не подписываться автоматически/);
  assert.match(plan, /Не писать участникам/);
});
