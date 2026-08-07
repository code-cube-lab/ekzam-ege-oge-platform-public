import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("practice mode selects one exam line across authored variants", async () => {
  const simulator = await readFile(new URL("../app/components/ExamSimulatorClient.tsx", import.meta.url), "utf8");
  assert.match(simulator, /practiceLine/);
  assert.match(simulator, /routeForVariant\(variant \+ 1\)\[safeLine - 1\]/);
  assert.match(simulator, /3 верных подряд/);
  assert.match(simulator, /Отработать задание №/);
  assert.match(simulator, /appendAttempt/);
  assert.match(simulator, /useMemo/);
  assert.match(simulator, /Следующий новый текст/);
});

test("extended answers can pause, persist and resume", async () => {
  const [simulator, progress, resume] = await Promise.all([
    readFile(new URL("../app/components/ExamSimulatorClient.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/learning-progress.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ResumeDraftsClient.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(simulator, /Поставить работу и аудио на паузу/);
  assert.match(simulator, /speechSynthesis\.pause\(\)/);
  assert.match(simulator, /speechSynthesis\.resume\(\)/);
  assert.match(simulator, /650/);
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

test("internal outreach data is absent from the public website", async () => {
  await assert.rejects(access(new URL("../public/client-search.html", import.meta.url)));
  const [notice, director, dashboard, teacher] = await Promise.all([
    readFile(new URL("../app/components/PrivateAreaNotice.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/director/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/dashboard/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/teacher/page.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(notice, /нет демонстрационных учеников, финансовых показателей, списков клиентов/i);
  for (const page of [director, dashboard, teacher]) {
    assert.match(page, /PrivateAreaNotice/);
    assert.doesNotMatch(page, /DirectorClient|DashboardClient|TeacherClient/);
  }
});
