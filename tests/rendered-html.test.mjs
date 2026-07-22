import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("landing presents the EKZAM promise, exam path and pilot prices", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(page, /Ребёнок готовится/);
  assert.match(page, /Вы видите, к чему/);
  assert.match(page, /href="\/exam"/);
  assert.match(page, /390 ₽/);
  assert.match(page, /от 590 ₽/);
  assert.match(layout, /ЭКЗАМ — школа подготовки к ОГЭ и ЕГЭ/);
  assert.doesNotMatch(`${page}\n${layout}`, /codex-preview|react-loading-skeleton/i);
});

test("required support pages exist", async () => {
  for (const path of ["../app/terms/page.tsx", "../app/support/page.tsx", "../app/paysupport/page.tsx", "../app/offer/page.tsx", "../app/privacy/page.tsx", "../app/consent/page.tsx"]) {
    await access(new URL(path, import.meta.url));
  }
});

test("personal data consent is separate and accounts for minors", async () => {
  const [dashboard, consentApi, consentPage] = await Promise.all([
    readFile(new URL("../app/components/DashboardClient.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/consent/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/consent/page.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(dashboard, /personalDataAccepted/);
  assert.match(dashboard, /termsAccepted/);
  assert.match(dashboard, /Я родитель/);
  assert.match(consentApi, /Нужны две отдельные отметки/);
  assert.match(consentPage, /родитель или иной законный представитель/);
});

test("coach route checks identity and entitlement and accepts director role", async () => {
  const route = await readFile(new URL("../app/api/coach/route.ts", import.meta.url), "utf8");
  assert.match(route, /status:\s*401/);
  assert.match(route, /status:\s*403/);
  assert.match(route, /session\.state !== "paid"/);
  assert.match(route, /session\.state !== "director"/);
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

test("daily task selection prioritizes weak topics and uses at least four options", async () => {
  const source = await readFile(new URL("../knowledge-base/tasks/task-bank.ts", import.meta.url), "utf8");
  assert.match(source, /weakTopics\.includes\(task\.topic\)/);
  assert.match(source, /Аргументация сочинения/);
  assert.match(source, /Пунктуация/);
  assert.match(source, /exam === exam && task\.subject === subject/);
  assert.match(source, /options:\s*\[[^\]]+,[^\]]+,[^\]]+,[^\]]+\]/s);
});

test("knowledge base names the first expert, levels and lesson cycle", async () => {
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

test("subject lead registry has 13 directions and only verified official photos", async () => {
  const [registry, page, photoComponent] = await Promise.all([
    readFile(new URL("../knowledge-base/teachers/subject-leads.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/teachers/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/TeacherPhoto.tsx", import.meta.url), "utf8"),
  ]);
  assert.equal((registry.match(/skillSlug: "/g) ?? []).length, 13);
  assert.equal((registry.match(/src: "\/teachers\//g) ?? []).length, 4);
  assert.match(registry, /not-confirmed/);
  assert.match(page, /Участие не подтверждено/);
  assert.match(page, /отдельное согласие на использование имени и изображения/);
  assert.match(photoComponent, /Фото с официального сайта/);
});

test("realistic simulator includes mixed answer formats and hides solutions until submit", async () => {
  const source = await readFile(new URL("../app/components/ExamSimulatorClient.tsx", import.meta.url), "utf8");
  for (const kind of ["single", "multiple", "number", "text", "extended"]) assert.match(source, new RegExp(`kind: "${kind}"`));
  assert.match(source, /!submitted \?/);
  assert.match(source, /solution\.map/);
  assert.match(source, /Структура и демоверсии ФИПИ/);
});

test("director dashboard has protected report and editable persisted prices", async () => {
  const [route, client, store] = await Promise.all([
    readFile(new URL("../app/api/director/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/DirectorClient.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/demo-store.ts", import.meta.url), "utf8"),
  ]);
  assert.match(route, /session\.role !== "director"/);
  assert.match(route, /updatePlanPrice/);
  assert.match(client, /Сохранить/);
  assert.match(store, /school_plans/);
  assert.match(store, /1290/);
  assert.match(store, /2490/);
});

test("official teacher photo assets are bundled", async () => {
  for (const path of ["../public/teachers/sergey-dedov.jpg", "../public/teachers/elena-shcherbakova.jpg", "../public/teachers/anna-morozova.jpg", "../public/teachers/elena-kazanovskaya-class.jpg"]) {
    await access(new URL(path, import.meta.url));
  }
});
