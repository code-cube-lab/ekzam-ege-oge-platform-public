import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("entry requires an explicit OGE or EGE choice", async () => {
  const [home, entry, simulator] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ExamEntryClient.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ExamSimulatorClient.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(home, /ExamEntryClient/);
  assert.match(entry, /Что сдаёт ребёнок/);
  assert.match(entry, /useState<ExamLevel \| null>\(null\)/);
  assert.match(entry, /aria-pressed=\{level === "oge"\}/);
  assert.match(entry, /aria-pressed=\{level === "ege"\}/);
  assert.match(simulator, /if \(!examChosen\)/);
  assert.match(simulator, /13 заданий · 235 минут · 3 части/);
  assert.match(simulator, /27 заданий · 210 минут · 2 части/);
});

test("Russian tasks use exam blanks and separate OGE structure", async () => {
  const [oge, engine, simulator] = await Promise.all([
    readFile(new URL("../knowledge-base/tasks/oge-demo-bank.ts", import.meta.url), "utf8"),
    readFile(new URL("../knowledge-base/tasks/variant-engine.js", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ExamSimulatorClient.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(oge, /getRussianOgeVariantTasks/);
  assert.match(oge, /number: `Задание \$\{number\}`/);
  assert.match(oge, /13\.1 \/ 13\.2 \/ 13\.3/);
  assert.match(oge, /minWords: 70/);
  assert.match(oge, /maxPlays: 2/);
  assert.match(engine, /function toExamBlank/);
  assert.match(engine, /interaction: "exam-blank"/);
  assert.match(simulator, /exam-static-options/);
  assert.match(simulator, /Ответ для бланка/);
});

test("unverified subject banks are visibly blocked before student use", async () => {
  const [validation, simulator, oge] = await Promise.all([
    readFile(new URL("../knowledge-base/exams/exam-validation.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ExamSimulatorClient.tsx", import.meta.url), "utf8"),
    readFile(new URL("../knowledge-base/tasks/oge-demo-bank.ts", import.meta.url), "utf8"),
  ]);
  assert.match(validation, /status: "blocked"/);
  assert.match(validation, /Готово к вашей предварительной проверке/);
  assert.match(validation, /candidateEge\("Математика, профильный уровень", 19/);
  assert.match(validation, /базового уровня на 21 задание/);
  assert.match(simulator, /if \(!routeReady\)/);
  assert.match(simulator, /задания временно закрыты/);
  assert.doesNotMatch(oge, /Вывод \$\{options\.length \+ 1\} не следует/);
  assert.doesNotMatch(oge, /Выполните линию \$\{line\}/);
});

test("grade-five textbook routes are absent from the released app", async () => {
  await assert.rejects(access(new URL("../app/textbooks/page.tsx", import.meta.url)));
  await assert.rejects(access(new URL("../app/school/page.tsx", import.meta.url)));
  const [home, nav] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AppNav.tsx", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(`${home}\n${nav}`, /href=["']\/(?:textbooks|school)/i);
});

test("mobile and accessible states have explicit styling", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.skip-nav:focus/);
  assert.match(css, /@media \(max-width: 640px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.exam-audio-task/);
  assert.match(css, /\.exam-gate-panel/);
  assert.match(css, /\.exam-audit-gate/);
});
