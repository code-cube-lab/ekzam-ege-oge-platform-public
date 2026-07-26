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
  page.on("pageerror", (error) => runtimeErrors.push(String(error)));

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  assert(await page.locator(".exam-level-cards button").count() === 2, "главная требует выбор ОГЭ или ЕГЭ");
  assert(await page.locator('a[href="/school"], a[href="/textbooks"]').count() === 0, "нет ссылок на школу и учебники");
  assert(await page.getByText("Что сдаёт ребёнок?").isVisible(), "вопрос выбора экзамена виден");
  await page.screenshot({ path: path.join(outputDir, "home-desktop.png"), fullPage: true });

  await page.locator(".exam-level-cards button").nth(0).click();
  assert(await page.locator(".exam-entry-next.visible").count() === 1, "после ОГЭ открываются предмет и режим");
  await page.getByLabel("Предмет").selectOption("russian");
  await Promise.all([
    page.waitForURL(/level=oge/),
    page.locator(".exam-entry-submit").click(),
  ]);
  await page.waitForLoadState("networkidle");
  const ogePassport = await page.locator(".exam-passport").innerText();
  assert(/13\s*заданий/i.test(ogePassport) && /235\s*минут/i.test(ogePassport) && /3\s*части/i.test(ogePassport), `паспорт русского ОГЭ: 13 заданий, 235 минут, 3 части; фактически ${JSON.stringify(ogePassport)}`);
  assert(await page.locator(".exam-map nav button").count() === 13, "карта ОГЭ содержит 13 отдельных заданий");
  assert(await page.locator(".exam-audio-task").isVisible(), "задание 1 ОГЭ содержит прослушивание");

  const audioButton = page.locator(".exam-audio-task button");
  await audioButton.click();
  await audioButton.click();
  assert(await audioButton.isDisabled(), "третье прослушивание изложения заблокировано");

  await page.locator(".exam-map nav button").nth(1).click();
  assert(await page.locator(".exam-static-options li").count() === 5, "варианты ответа показаны как статический экзаменационный список");
  assert(await page.locator(".exam-options button").count() === 0, "цветного угадывания в бланковом задании нет");
  await page.getByLabel("Ответ для бланка").fill("999");
  await page.getByRole("button", { name: "Проверить решение" }).click();
  assert(await page.getByTestId("inline-remediation").isVisible(), "после ошибки открывается теория, причина и отработка");
  assert(/1/.test(await page.locator(".exam-mode-tabs button").nth(2).innerText()), "ошибка попала в тетрадь");
  await page.screenshot({ path: path.join(outputDir, "oge-error-remediation.png"), fullPage: false });

  await page.getByRole("button", { name: /Отработать похожее/ }).click();
  assert(await page.getByRole("button", { name: "Проверить решение" }).isVisible(), "похожее задание открывается без перезагрузки");

  await page.locator(".exam-mode-tabs button").nth(2).click();
  assert(await page.locator(".exam-map nav button").count() === 1, "тетрадь показывает только неверное задание");
  await page.getByLabel("Ответ для бланка").fill("531");
  await page.getByRole("button", { name: "Проверить решение" }).click();
  await page.getByText("Тетрадь ошибок пока пуста").waitFor();
  assert(await page.getByText("Тетрадь ошибок пока пуста").isVisible(), "верный повтор удаляет ошибку");

  await page.getByRole("button", { name: "Открыть пробный вариант" }).click();
  const firstVariantPrompt = await page.locator(".exam-paper h2").innerText();
  await page.locator(".exam-variant-tabs button").nth(1).click();
  const secondVariantPrompt = await page.locator(".exam-paper h2").innerText();
  assert(firstVariantPrompt !== secondVariantPrompt, "вариант №2 меняет авторский материал");

  await page.locator(".exam-level-switch button").nth(1).click();
  const egePassport = await page.locator(".exam-passport").innerText();
  assert(/27\s*заданий/i.test(egePassport) && /210\s*минут/i.test(egePassport) && /2\s*части/i.test(egePassport), `паспорт русского ЕГЭ: 27 заданий, 210 минут, 2 части; фактически ${JSON.stringify(egePassport)}`);
  assert(await page.locator(".exam-map nav button").count() === 27, "карта ЕГЭ содержит 27 заданий");
  await page.locator(".exam-map nav button").nth(3).click();
  assert(await page.locator(".exam-static-options li").count() > 0, "в ЕГЭ варианты видны перед полем бланка");
  assert(await page.getByLabel("Ответ для бланка").isVisible(), "в ЕГЭ ответ вводится вручную");
  await page.screenshot({ path: path.join(outputDir, "ege-desktop.png"), fullPage: false });

  await page.goto(`${baseUrl}/exam`, { waitUntil: "networkidle" });
  assert(await page.locator(".exam-gate-panel button").count() === 2, "прямой вход в тренажёр не пропускает выбор экзамена");

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    locale: "ru-RU",
    reducedMotion: "reduce",
  });
  const mobilePage = await mobile.newPage();
  mobilePage.on("pageerror", (error) => runtimeErrors.push(String(error)));

  await mobilePage.goto(baseUrl, { waitUntil: "networkidle" });
  await mobilePage.evaluate(() => window.scrollTo(0, 0));
  const homeOverflow = await mobilePage.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  assert(homeOverflow.scroll <= homeOverflow.client, "главная 390 px не имеет горизонтального переполнения");
  await mobilePage.screenshot({ path: path.join(outputDir, "home-mobile.png"), fullPage: false });

  await mobilePage.goto(`${baseUrl}/exam?level=oge&subject=russian&mode=route&variant=1`, { waitUntil: "networkidle" });
  const examOverflow = await mobilePage.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  assert(examOverflow.scroll <= examOverflow.client, "русский ОГЭ 390 px не имеет горизонтального переполнения");
  assert(await mobilePage.locator(".exam-map h1").isVisible(), "мобильный ОГЭ показывает выбранный вариант");
  await mobilePage.screenshot({ path: path.join(outputDir, "oge-mobile.png"), fullPage: false });

  await mobile.close();
  await desktop.close();
  assert(runtimeErrors.length === 0, "нет ошибок JavaScript в браузере");

  const result = {
    checkedAt: new Date().toISOString(),
    checks,
    runtimeErrors,
    artifacts: [
      "home-desktop.png",
      "oge-error-remediation.png",
      "ege-desktop.png",
      "home-mobile.png",
      "oge-mobile.png",
    ],
  };
  await writeFile(path.join(outputDir, "browser-results.json"), JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ passed: checks.length, ...result }));
} finally {
  await browser.close();
  if (server) await server.close();
}
