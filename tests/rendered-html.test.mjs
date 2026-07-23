import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("landing is parent-first, shows 15 subjects and researched prices", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(page, /Ребёнок готовится/);
  assert.match(page, /За что платит родитель/);
  assert.match(page, /15 предметов ЕГЭ/);
  assert.match(page, /1 490 ₽/);
  assert.match(page, /4 490 ₽/);
  assert.match(page, /7 990 ₽/);
  assert.doesNotMatch(page, /Олег|Кабинет директора|директор школы/i);
  assert.match(layout, /ЭКЗАМ/);
  assert.doesNotMatch(`${page}\n${layout}`, /codex-preview|react-loading-skeleton/i);
});

test("required support and consent pages exist", async () => {
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

test("coach route checks identity and server entitlement", async () => {
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

test("daily task selection prioritizes weak topics", async () => {
  const source = await readFile(new URL("../knowledge-base/tasks/task-bank.ts", import.meta.url), "utf8");
  assert.match(source, /weakTopics\.includes\(task\.topic\)/);
  assert.match(source, /Аргументация сочинения/);
  assert.match(source, /Пунктуация/);
  assert.match(source, /exam === exam && task\.subject === subject/);
});

test("knowledge base keeps expert, levels and lesson cycle", async () => {
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

test("all 15 EGE subjects expose honest training and official flows", async () => {
  const [catalog, bank, simulator, official] = await Promise.all([
    readFile(new URL("../knowledge-base/exams/exam-subjects.ts", import.meta.url), "utf8"),
    readFile(new URL("../knowledge-base/tasks/exam-demo-bank.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ExamSimulatorClient.tsx", import.meta.url), "utf8"),
    readFile(new URL("../knowledge-base/exams/official-variants.ts", import.meta.url), "utf8"),
  ]);
  assert.equal((catalog.match(/slug: "/g) ?? []).length, 15);
  assert.match(catalog, /Французский язык/);
  assert.match(catalog, /Испанский язык/);
  const groups = [...bank.matchAll(/^  (\w+): \[([\s\S]*?)^  \],/gm)];
  assert.equal(groups.length, 15);
  for (const [, slug, body] of groups) assert.equal((body.match(/\("[a-z]+-\d+"/g) ?? []).length, 10, `${slug} must have ten tasks`);
  for (const kind of ["single", "multiple", "text", "number", "extended"]) assert.match(bank, new RegExp(`"${kind}"`));
  assert.match(simulator, /Все 15 предметов ЕГЭ/);
  assert.match(simulator, /getTrainingVariantTasks/);
  assert.match(simulator, /getRussianFamilyTasks/);
  assert.match(simulator, /Отработка слабого места/);
  assert.match(simulator, /Отработать похожее/);
  assert.doesNotMatch(simulator, /trainingVariants|Выбор тренировочного варианта|Вариант 1/);
  assert.match(simulator, /subject\.fullTaskCount/);
  assert.match(simulator, /Открытый материал ФИПИ/);
  assert.match(simulator, /Сильные темы/);
  assert.match(simulator, /Слабые темы/);
  assert.match(simulator, /не официальный балл ЕГЭ/);
  assert.match(simulator, /!submitted \?/);
  assert.match(simulator, /task\.solution\.map/);
  assert.equal((official.match(/_1_ege2026\.zip/g) ?? []).length, 15);
  assert.doesNotMatch(bank, /Тренировочная параллель/);
});

test("public teacher product has a working assignment builder and paid pilot", async () => {
  const [page, builder, home] = await Promise.all([
    readFile(new URL("../app/for-teachers/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/TeacherProductClient.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(page, /TeacherProductClient/);
  assert.match(builder, /Соберите ссылку на задание/);
  assert.match(builder, /navigator\.clipboard\.writeText/);
  assert.match(builder, /990 ₽/);
  assert.match(builder, /4 990 ₽/);
  assert.match(builder, /DIDAK/);
  assert.match(builder, /CoreApp/);
  assert.match(builder, /Оплата на сайте пока не включена/);
  assert.match(home, /href="\/for-teachers"/);
});

test("Telegram Stars access is granted only after verified server payment", async () => {
  const [telegram, webhook, invoice, miniapp] = await Promise.all([
    readFile(new URL("../app/lib/telegram.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/telegram/webhook/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/telegram/payment/invoice/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/TelegramMiniAppClient.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(telegram, /currency: "XTR"/);
  assert.match(telegram, /answerPreCheckoutQuery/);
  assert.match(telegram, /telegram_payment_charge_id TEXT PRIMARY KEY/);
  assert.match(telegram, /recordSuccessfulTelegramPayment/);
  assert.match(webhook, /successful_payment/);
  assert.match(invoice, /verifyTelegramInitData/);
  assert.match(miniapp, /openInvoice/);
  assert.match(miniapp, /readAuth\(initData\)/);
});

test("Russian dashboard diagnostic also has ten questions", async () => {
  const [dashboard, route] = await Promise.all([
    readFile(new URL("../app/components/DashboardClient.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/diagnostic/route.ts", import.meta.url), "utf8"),
  ]);
  assert.equal((dashboard.match(/question: "/g) ?? []).length, 10);
  assert.match(route, /const answerKey = \[[^\]]*(?:,[^\]]*){9}\]/);
  assert.match(route, /body\.answers\.length !== answerKey\.length/);
});

test("teacher registry has 13 profiles, seven official photos and six labeled AI visuals", async () => {
  const [registry, page, photoComponent] = await Promise.all([
    readFile(new URL("../knowledge-base/teachers/subject-leads.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/teachers/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/TeacherPhoto.tsx", import.meta.url), "utf8"),
  ]);
  assert.equal((registry.match(/skillSlug: "/g) ?? []).length, 13);
  assert.equal((registry.match(/src: "\/teachers\//g) ?? []).length, 13);
  assert.equal((registry.match(/ai-[a-z]+-direction\.webp/g) ?? []).length, 6);
  assert.match(page, /13 предметных профилей · 7 официальных фото · 6 AI-визуалов направлений/);
  assert.match(page, /Участие уточняется/);
  assert.match(photoComponent, /Официальное фото/);
  assert.match(photoComponent, /AI-визуал/);
  assert.match(photoComponent, /Не изображает конкретного преподавателя/);
});

test("administration remains protected and uses researched prices", async () => {
  const [route, client, store] = await Promise.all([
    readFile(new URL("../app/api/director/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/DirectorClient.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/demo-store.ts", import.meta.url), "utf8"),
  ]);
  assert.match(route, /session\.role !== "director"/);
  assert.match(route, /updatePlanPrice/);
  assert.match(client, /Сохранить/);
  assert.match(store, /school_plans/);
  assert.match(store, /1490/);
  assert.match(store, /4490/);
  assert.match(store, /7990/);
  assert.doesNotMatch(`${client}\n${store}`, /Олег/);
});

test("seven official teacher photo assets are bundled", async () => {
  for (const path of [
    "../public/teachers/sergey-dedov.jpg",
    "../public/teachers/elena-shcherbakova.jpg",
    "../public/teachers/anna-morozova.jpg",
    "../public/teachers/elena-kazanovskaya-class.jpg",
    "../public/teachers/elena-mikhaylichenko-class.jpg",
    "../public/teachers/maria-nosenko-class.jpg",
    "../public/teachers/lilia-belomestnaya-class.jpg",
  ]) await access(new URL(path, import.meta.url));
});

test("six lightweight subject AI visuals are bundled", async () => {
  for (const path of [
    "../public/teachers/ai-literature-direction.webp",
    "../public/teachers/ai-informatics-direction.webp",
    "../public/teachers/ai-physics-direction.webp",
    "../public/teachers/ai-history-direction.webp",
    "../public/teachers/ai-english-direction.webp",
    "../public/teachers/ai-german-direction.webp",
  ]) await access(new URL(path, import.meta.url));
});
