import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { createServer } from "vite";

const port = Number(process.env.EXAM_QA_PORT ?? 3015);
const baseUrl = process.env.EXAM_QA_BASE ?? `http://127.0.0.1:${port}`;
const outputDir = path.resolve("output/qa");
const checks = [];
const runtimeErrors = [];
let server = null;

function assert(condition, label) {
  if (!condition) throw new Error(`QA failed: ${label}`);
  checks.push(label);
}

await mkdir(outputDir, { recursive: true });

if (!process.env.EXAM_QA_BASE) {
  server = await createServer({
    root: process.cwd(),
    server: {
      host: "127.0.0.1",
      port,
      strictPort: true,
    },
  });
  await server.listen();
}

const browser = await chromium.launch({ headless: true, channel: "chrome" });

try {
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "ru-RU",
    reducedMotion: "reduce",
  });
  const page = await desktop.newPage();
  page.setDefaultNavigationTimeout(90_000);
  page.on("pageerror", (error) => runtimeErrors.push(String(error)));
  await page.addInitScript(() => {
    window.__qaAudio = { play: 0, pause: 0, resume: 0, cancel: 0, text: "", utterance: null };
    class QaUtterance {
      constructor(text) { this.text = text; this.lang = ""; this.rate = 1; this.onend = null; this.onerror = null; }
    }
    Object.defineProperty(window, "SpeechSynthesisUtterance", { configurable: true, value: QaUtterance });
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: {
      speak(utterance) { window.__qaAudio.play += 1; window.__qaAudio.text = utterance.text; window.__qaAudio.utterance = utterance; },
      pause() { window.__qaAudio.pause += 1; },
      resume() { window.__qaAudio.resume += 1; },
      cancel() { window.__qaAudio.cancel += 1; },
    }});
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  assert(await page.locator(".exam-level-cards button").count() === 2, "главная требует выбор ОГЭ или ЕГЭ");
  assert(await page.locator('a[href="/school"], a[href="/textbooks"]').count() === 0, "нет ссылок на школу и учебники");
  assert(await page.getByText("Что сдаёт ребёнок?").isVisible(), "вопрос выбора экзамена виден");
  assert(await page.locator(".sales-audience-card").count() === 3, "главная разделяет путь родителя, репетитора и школы");
  assert(await page.getByText("Сейчас открыт проверяемый пилот по русскому языку.").isVisible(), "главная честно показывает границу публичного предметного банка");
  await page.locator(".sales-story-visuals").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => Array.from(document.querySelectorAll(".sales-story-visuals img")).every((image) => image.complete));
  const marketingImages = await page.locator(".sales-story-visuals img").evaluateAll((images) => images.map((image) => ({ complete: image.complete, width: image.naturalWidth })));
  assert(marketingImages.length === 3 && marketingImages.every((image) => image.complete && image.width > 0), "три новые продающие обложки загружены");
  await page.screenshot({ path: path.join(outputDir, "home-desktop.png"), fullPage: true });

  await page.goto(`${baseUrl}/for-parents`, { waitUntil: "networkidle" });
  assert(await page.getByText("Первый результат за 10 минут").isVisible(), "страница родителя объясняет первый полезный результат");
  assert(await page.getByText("Это заменяет репетитора?").isVisible(), "страница родителя честно разделяет платформу и преподавателя");

  await page.goto(`${baseUrl}/for-schools`, { waitUntil: "networkidle" });
  assert(await page.getByText("ПИЛОТ · 4 НЕДЕЛИ").isVisible(), "страница школы предлагает ограниченный проверяемый пилот");
  assert(await page.getByText("Автоматика не подменяет предметную комиссию").isVisible(), "страница школы показывает границы автоматической оценки");

  await page.goto(`${baseUrl}/for-teachers`, { waitUntil: "networkidle" });
  assert(await page.locator(".teacher-skill-stack article").count() === 8, "педагог видит восемь методических навыков");
  assert(await page.getByText("Бесплатная практика приводит к вашей платной экспертизе.").isVisible(), "репетитор видит путь от демо к своей услуге");

  await page.goto(`${baseUrl}/reels`, { waitUntil: "networkidle" });
  assert(await page.locator(".reels-idea-grid > article").count() === 12, "видеолаборатория показывает двенадцать идей");
  assert(await page.locator(".reels-script-list > article").count() === 3, "видеолаборатория содержит три полных сценария");
  assert(await page.locator(".shot-table > div").count() === 18, "три сценария содержат восемнадцать кадров");
  assert(await page.locator(".reference-grid > a").count() === 7, "семь публичных видеореференсов ведут к оригиналам");
  await page.getByRole("button", { name: "Репетитору" }).click();
  assert(await page.locator(".reels-idea-grid > article").count() === 3, "фильтр оставляет идеи для репетитора без перезагрузки");
  await page.locator(".reels-script-list > article").first().getByRole("button", { name: "Скопировать сценарий" }).click();
  await page.getByRole("button", { name: "Скопировано ✓" }).waitFor({ state: "visible" });
  assert(await page.getByRole("button", { name: "Скопировано ✓" }).isVisible(), "сценарий копируется одной кнопкой");
  await page.screenshot({ path: path.join(outputDir, "reels-desktop.png"), fullPage: true });

  await page.goto(`${baseUrl}/growth`, { waitUntil: "networkidle" });
  assert(await page.locator(".growth-subject-matrix button").count() === 15, "центр роста покрывает пятнадцать предметов ЕГЭ");
  assert(await page.locator(".growth-reference-grid article").count() === 11, "центр роста показывает одиннадцать популярных образовательных референсов");
  assert(await page.getByText("Alvernia University", { exact: true }).isVisible(), "центр роста показывает свежий вирусный референс Alvernia University");
  assert(await page.locator(".growth-sprint-grid article").count() === 10, "центр роста содержит десять шагов маршрута на 14 дней");
  assert(await page.locator(".media-compliance article").count() === 3, "центр роста объясняет три обязательных правила безопасного продвижения");
  assert(await page.locator(".partner-grid article").count() === 12, "центр роста показывает двенадцать публичных партнёров");
  await page.locator(".growth-controls fieldset button").nth(1).click();
  await page.locator(".growth-controls label select").nth(0).selectOption("english");
  assert(await page.locator(".growth-controls label select").nth(1).locator("option").count() === 42, "для английского ЕГЭ доступны все 42 номера");
  await page.locator(".growth-controls label select").nth(1).selectOption("42");
  assert((await page.getByTestId("teacher-campaign").innerText()).includes("№ 42"), "бриф перестраивается под выбранный номер");
  await page.getByRole("button", { name: "Скопировать задание преподавателю" }).click();
  await page.getByRole("button", { name: "Задание скопировано ✓" }).waitFor({ state: "visible" });
  assert(await page.getByRole("button", { name: "Задание скопировано ✓" }).isVisible(), "полный съёмочный бриф копируется одной кнопкой");
  await page.getByRole("button", { name: "Родители" }).click();
  assert(await page.locator(".partner-grid article").count() === 2, "фильтр показывает только родительских партнёров");
  await page.locator(".message-grid article").first().getByRole("button", { name: "Скопировать текст" }).click();
  await page.getByRole("button", { name: "Скопировано ✓" }).waitFor({ state: "visible" });
  assert(await page.getByRole("button", { name: "Скопировано ✓" }).isVisible(), "сообщение партнёру копируется одной кнопкой");
  await page.getByRole("button", { name: "Скопировать план на 14 дней" }).click();
  await page.getByRole("button", { name: "План скопирован ✓" }).waitFor({ state: "visible" });
  assert(await page.getByRole("button", { name: "План скопирован ✓" }).isVisible(), "маршрут поиска учеников на 14 дней копируется одной кнопкой");
  await page.screenshot({ path: path.join(outputDir, "growth-desktop.png"), fullPage: true });

  await page.goto(baseUrl, { waitUntil: "networkidle" });

  await page.locator(".exam-level-cards button").nth(0).click();
  assert(await page.locator(".exam-entry-next.visible").count() === 1, "после ОГЭ открываются предмет и режим");
  await page.locator(".exam-entry-field select").selectOption("russian");
  await Promise.all([
    page.waitForURL(/level=oge/),
    page.locator(".exam-entry-submit").click(),
  ]);
  await page.waitForLoadState("networkidle");
  const ogePassport = await page.locator(".exam-passport").innerText();
  assert(/13\s*заданий/i.test(ogePassport) && /235\s*минут/i.test(ogePassport) && /3\s*части/i.test(ogePassport), `паспорт русского ОГЭ: 13 заданий, 235 минут, 3 части; фактически ${JSON.stringify(ogePassport)}`);
  assert(await page.locator(".exam-map nav button").count() === 13, "карта ОГЭ содержит 13 отдельных заданий");
  assert(await page.locator(".exam-audio-task").isVisible(), "задание 1 ОГЭ содержит прослушивание");

  const audioButton = page.locator(".exam-audio-actions button").first();
  await audioButton.click();
  assert(await audioButton.innerText() === "Пауза аудио", "после запуска аудио появляется отдельная кнопка паузы");
  await audioButton.click();
  assert(await audioButton.innerText() === "Продолжить аудио", "аудио действительно переходит в состояние паузы");
  assert(await page.evaluate(() => window.__qaAudio.pause) === 1, "пауза вызывает speechSynthesis.pause");
  await audioButton.click();
  assert(await page.evaluate(() => window.__qaAudio.resume) === 1, "продолжение вызывает speechSynthesis.resume без нового прослушивания");
  await page.evaluate(() => window.__qaAudio.utterance?.onend?.());
  await audioButton.click();
  await page.evaluate(() => window.__qaAudio.utterance?.onend?.());
  assert(await audioButton.isDisabled(), "третье прослушивание изложения заблокировано");

  await page.locator(".exam-map nav button").nth(1).click();
  assert(await page.locator(".exam-static-options li").count() === 5, "варианты ответа показаны как статический экзаменационный список");
  assert(await page.locator(".exam-options button").count() === 0, "цветного угадывания в бланковом задании нет");
  await page.getByLabel("Ответ для бланка").fill("999");
  await page.getByRole("button", { name: "Проверить решение" }).click();
  assert(await page.getByTestId("inline-remediation").isVisible(), "после ошибки открывается теория, причина и отработка");
  const remediationText = await page.getByTestId("inline-remediation").innerText();
  const repeatAnswer = remediationText.match(/Верная последовательность:\s*([0-9]+)/i)?.[1];
  assert(Boolean(repeatAnswer), "разбор содержит проверяемый правильный ответ для повтора");
  assert(/1/.test(await page.locator(".exam-mode-tabs button").nth(2).innerText()), "ошибка попала в тетрадь");
  await page.screenshot({ path: path.join(outputDir, "oge-error-remediation.png"), fullPage: false });

  await page.getByRole("button", { name: /Отработать задание|Отработать похожее/ }).click();
  assert(await page.getByRole("button", { name: "Проверить решение" }).isVisible(), "похожее задание открывается без перезагрузки");
  assert(await page.locator(".game-status").isVisible(), "после ошибки открыт игровой режим одного номера");
  assert(/3/.test(await page.locator(".mastery-goal").innerText()), "игровая цель требует три верных ответа подряд");

  await page.locator(".exam-mode-tabs button").nth(2).click();
  assert(await page.locator(".exam-map nav button").count() === 1, "тетрадь показывает только неверное задание");
  await page.getByLabel("Ответ для бланка").fill(repeatAnswer);
  await page.getByRole("button", { name: "Проверить решение" }).click();
  await page.getByText("Тетрадь ошибок пока пуста").waitFor();
  assert(await page.getByText("Тетрадь ошибок пока пуста").isVisible(), "верный повтор удаляет ошибку");

  await page.getByRole("button", { name: "Открыть пробный вариант" }).click();
  await page.locator(".exam-variant-tabs button").nth(0).click();
  await page.locator(".exam-map nav button").nth(1).click();
  const firstVariantPrompt = await page.locator(".exam-stimulus").innerText();
  await page.locator(".exam-variant-tabs button").nth(1).click();
  await page.locator(".exam-map nav button").nth(1).click();
  const secondVariantPrompt = await page.locator(".exam-stimulus").innerText();
  assert(firstVariantPrompt !== secondVariantPrompt, "вариант №2 меняет авторский материал");

  await page.locator(".exam-level-switch button").nth(1).click();
  const egePassport = await page.locator(".exam-passport").innerText();
  assert(/27\s*заданий/i.test(egePassport) && /210\s*минут/i.test(egePassport) && /2\s*части/i.test(egePassport), `паспорт русского ЕГЭ: 27 заданий, 210 минут, 2 части; фактически ${JSON.stringify(egePassport)}`);
  assert(await page.locator(".exam-map nav button").count() === 27, "карта ЕГЭ содержит 27 заданий");
  await page.locator(".exam-map nav button").nth(3).click();
  assert(await page.locator(".exam-static-options li").count() > 0, "в ЕГЭ варианты видны перед полем бланка");
  assert(await page.getByLabel("Ответ для бланка").isVisible(), "в ЕГЭ ответ вводится вручную");
  await page.screenshot({ path: path.join(outputDir, "ege-desktop.png"), fullPage: false });

  await page.goto(`${baseUrl}/practice`, { waitUntil: "networkidle" });
  assert(await page.getByText("Не весь вариант. Одно слабое задание — до уверенного решения.").isVisible(), "отдельная библиотека объясняет практику по номеру");
  assert(await page.locator(".practice-line-grid a").count() === 27, "для русского ЕГЭ показаны 27 номеров");
  const lineFiveHref = await page.locator(".practice-line-grid a").nth(4).getAttribute("href");
  assert(lineFiveHref?.includes("mode=training") && lineFiveHref.includes("task=5"), "номер 5 ведёт в точечную отработку задания 5");

  await page.goto(`${baseUrl}/exam?level=oge&subject=russian&mode=route&variant=1&task=1`, { waitUntil: "networkidle" });
  const essay = page.getByLabel("Ваш текст");
  const draftText = "Это сохранённый черновик изложения. Он нужен, чтобы проверить паузу, восстановление текста и безопасное продолжение работы после возвращения ученика на сайт.";
  const inputStarted = Date.now();
  await essay.fill(draftText);
  assert(Date.now() - inputStarted < 1500, "ввод большого фрагмента изложения не тормозит интерфейс");
  await page.locator(".exam-audio-actions button").first().click();
  const pausesBeforeWorkPause = await page.evaluate(() => window.__qaAudio.pause);
  await page.getByRole("button", { name: "Поставить работу и аудио на паузу" }).click();
  assert(await essay.isDisabled(), "сочинение останавливается по кнопке паузы");
  assert(await page.evaluate(() => window.__qaAudio.pause) === pausesBeforeWorkPause + 1, "общая пауза одновременно останавливает аудио");
  await page.reload({ waitUntil: "networkidle" });
  assert((await page.getByLabel("Ваш текст").inputValue()).includes("сохранённый черновик"), "черновик сочинения восстановлен после перезагрузки");
  assert(await page.getByText(/Черновик восстановлен/).isVisible(), "ученик видит подтверждение восстановления черновика");
  await page.getByRole("button", { name: "Продолжить работу и аудио" }).click();
  assert(!(await page.getByLabel("Ваш текст").isDisabled()), "после паузы сочинение можно продолжить");
  await page.getByRole("button", { name: "Сохранить и выйти" }).click();
  await page.waitForURL(/\/resume\/?$/);
  assert(await page.getByText("Работа сохранена. Что делать дальше?").isVisible(), "сохранить и выйти ведёт к списку сохранённых работ внутри приложения");
  const oneTaskPractice = page.getByRole("link", { name: /Отрабатывать только задание № 1/ });
  await oneTaskPractice.waitFor({ state: "visible" });
  assert(await oneTaskPractice.isVisible(), "после выхода доступна отработка только задания № 1");
  const oneTaskHref = await oneTaskPractice.getAttribute("href");
  assert(oneTaskHref?.includes("mode=training") && oneTaskHref.includes("task=1"), "точечная отработка сохраняет номер задания № 1");
  await oneTaskPractice.click();
  await page.waitForURL(/mode=training.*task=1|task=1.*mode=training/);
  await page.getByText("Отработка одного номера").waitFor({ state: "visible" });
  assert(await page.getByText("Отработка одного номера").isVisible(), "после сохранения открывается серия только выбранного номера");
  if (await page.getByRole("button", { name: "Продолжить работу и аудио" }).isVisible().catch(() => false)) {
    await page.getByRole("button", { name: "Продолжить работу и аудио" }).click();
  }
  await page.locator(".exam-audio-actions button").first().click();
  const firstTrainingAudio = await page.evaluate(() => window.__qaAudio.text);
  const exposition = Array.from({ length: 85 }, (_, word) => `слово${word + 1}`).join(" ");
  await page.getByLabel("Ваш текст").fill(exposition);
  await page.getByRole("button", { name: "Проверить решение" }).click();
  assert(await page.getByTestId("review-next-card").isVisible(), "после изложения появляется понятный переход к следующему тексту");
  await page.getByTestId("next-reviewed-task").click();
  await page.locator(".exam-audio-actions button").first().click();
  const secondTrainingAudio = await page.evaluate(() => window.__qaAudio.text);
  assert(Boolean(firstTrainingAudio) && firstTrainingAudio !== secondTrainingAudio, "следующая попытка задания № 1 содержит другой текст изложения");
  await page.screenshot({ path: path.join(outputDir, "oge-single-task-audio.png"), fullPage: false });

  await page.goto(`${baseUrl}/parent-report`, { waitUntil: "networkidle" });
  assert(await page.getByText("Что ребёнок уже умеет и что делать дальше").isVisible(), "отчёт родителю открывается отдельной страницей");
  assert(await page.getByRole("button", { name: "Скопировать для родителя" }).isVisible(), "отчёт можно скопировать родителю");

  await page.goto(`${baseUrl}/exam`, { waitUntil: "networkidle" });
  assert(await page.locator(".exam-gate-panel button").count() === 2, "прямой вход в тренажёр не пропускает выбор экзамена");

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    locale: "ru-RU",
    reducedMotion: "reduce",
  });
  const mobilePage = await mobile.newPage();
  mobilePage.setDefaultNavigationTimeout(90_000);
  mobilePage.on("pageerror", (error) => runtimeErrors.push(String(error)));

  await mobilePage.goto(baseUrl, { waitUntil: "networkidle" });
  await mobilePage.evaluate(() => window.scrollTo(0, 0));
  const homeOverflow = await mobilePage.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  assert(homeOverflow.scroll <= homeOverflow.client, "главная 390 px не имеет горизонтального переполнения");
  await mobilePage.screenshot({ path: path.join(outputDir, "home-mobile.png"), fullPage: false });

  for (const route of ["/for-parents", "/for-schools", "/for-teachers"]) {
    await mobilePage.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    const audienceOverflow = await mobilePage.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    assert(audienceOverflow.scroll <= audienceOverflow.client, `${route} на 390 px не имеет горизонтального переполнения`);
  }

  await mobilePage.goto(`${baseUrl}/reels`, { waitUntil: "networkidle" });
  const reelsOverflow = await mobilePage.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  assert(reelsOverflow.scroll <= reelsOverflow.client, "/reels на 390 px не имеет горизонтального переполнения");
  assert(await mobilePage.getByRole("link", { name: "Взять готовый сценарий →" }).isVisible(), "мобильная видеолаборатория показывает основной CTA");
  await mobilePage.screenshot({ path: path.join(outputDir, "reels-mobile.png"), fullPage: false });

  await mobilePage.goto(`${baseUrl}/growth`, { waitUntil: "networkidle" });
  const growthOverflow = await mobilePage.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  assert(growthOverflow.scroll <= growthOverflow.client, "/growth на 390 px не имеет горизонтального переполнения");
  assert(await mobilePage.getByRole("button", { name: "Скопировать задание преподавателю" }).isVisible(), "мобильный центр роста показывает главный инструмент преподавателя");
  await mobilePage.screenshot({ path: path.join(outputDir, "growth-mobile.png"), fullPage: false });

  await mobilePage.goto(`${baseUrl}/exam?level=oge&subject=russian&mode=route&variant=1`, { waitUntil: "networkidle" });
  const examOverflow = await mobilePage.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  assert(examOverflow.scroll <= examOverflow.client, "русский ОГЭ 390 px не имеет горизонтального переполнения");
  assert(await mobilePage.locator(".exam-map h1").isVisible(), "мобильный ОГЭ показывает выбранный вариант");
  await mobilePage.screenshot({ path: path.join(outputDir, "oge-mobile.png"), fullPage: false });

  await mobilePage.goto(`${baseUrl}/telegram`, { waitUntil: "networkidle" });
  assert(await mobilePage.getByText("ПРЕДПРОСМОТР MINI APP").isVisible(), "Mini App без initData показывает честный предпросмотр");
  assert(await mobilePage.locator(".telegram-exam-switch button").count() === 2, "в мобильном предпросмотре отдельно выбираются ОГЭ и ЕГЭ");
  await mobilePage.locator(".telegram-exam-switch button").nth(0).click();
  await mobilePage.locator(".telegram-subject-select select").selectOption("math");
  const previewHref = await mobilePage.getByRole("link", { name: "Открыть вариант № 1" }).getAttribute("href");
  assert(previewHref?.includes("level=oge") && previewHref.includes("subject=math"), "предпросмотр собирает ссылку на выбранные экзамен и предмет");
  if (baseUrl.includes("/ekzam-ege-oge-platform-public")) {
    assert(previewHref?.startsWith("/ekzam-ege-oge-platform-public/exam"), "Mini App сохраняет базовый путь GitHub Pages во внутренних ссылках");
  }
  const telegramOverflow = await mobilePage.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  assert(telegramOverflow.scroll <= telegramOverflow.client, "Telegram Mini App 390 px не имеет горизонтального переполнения");
  await mobilePage.screenshot({ path: path.join(outputDir, "telegram-mobile.png"), fullPage: false });

  await mobilePage.goto(`${baseUrl}/practice`, { waitUntil: "networkidle" });
  const practiceOverflow = await mobilePage.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  assert(practiceOverflow.scroll <= practiceOverflow.client, "библиотека заданий 390 px не имеет горизонтального переполнения");
  await mobilePage.screenshot({ path: path.join(outputDir, "practice-mobile.png"), fullPage: false });

  await mobilePage.goto(`${baseUrl}/director`, { waitUntil: "networkidle" });
  assert(await mobilePage.getByText(/Кабинет администратора не публикуется/).isVisible(), "публичный административный адрес не показывает внутренние данные");
  const privateText = await mobilePage.locator("body").innerText();
  assert(!/Выручка месяца|Активные ученики|списки клиентов/i.test(privateText), "на публичной странице нет служебных показателей и клиентских списков");
  const privateOverflow = await mobilePage.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  assert(privateOverflow.scroll <= privateOverflow.client, "закрытый кабинет 390 px не имеет горизонтального переполнения");
  await mobilePage.screenshot({ path: path.join(outputDir, "private-area-mobile.png"), fullPage: false });

  await mobile.close();
  await desktop.close();
  assert(runtimeErrors.length === 0, "нет ошибок JavaScript в браузере");

  const result = {
    checkedAt: new Date().toISOString(),
    checks,
    runtimeErrors,
    artifacts: [
      "home-desktop.png",
      "reels-desktop.png",
      "growth-desktop.png",
      "oge-error-remediation.png",
      "oge-single-task-audio.png",
      "ege-desktop.png",
      "home-mobile.png",
      "reels-mobile.png",
      "growth-mobile.png",
      "oge-mobile.png",
      "telegram-mobile.png",
      "practice-mobile.png",
      "private-area-mobile.png",
    ],
  };
  await writeFile(path.join(outputDir, "browser-results.json"), JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ passed: checks.length, ...result }));
} finally {
  await browser.close();
  if (server) await server.close();
}
