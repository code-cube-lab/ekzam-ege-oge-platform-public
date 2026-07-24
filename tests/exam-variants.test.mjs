import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import {
  analyzeTaskResults,
  buildTrainingVariant,
  getRussianAuthorBankSize,
  getRussianFamilyTasks,
  russianTaskFamilies,
} from "../knowledge-base/tasks/variant-engine.js";

async function loadSeedBank() {
  const source = await readFile(new URL("../knowledge-base/tasks/exam-demo-bank.ts", import.meta.url), "utf8");
  const withoutImport = source
    .replace(/^import .*variant-engine\.js";\r?\n/m, "")
    .replace(/export function getTrainingVariantTasks[\s\S]*$/m, "");
  const javascript = ts.transpileModule(withoutImport, {
    compilerOptions: { module: ts.ModuleKind.None, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const context = { exports: {} };
  vm.runInNewContext(javascript, context);
  return context.exports.demoTasksBySubject;
}

function signature(task) {
  return JSON.stringify([task.prompt, task.options ?? [], task.answer]);
}

test("student audit passes every training variant for all 15 subjects", async () => {
  const bank = await loadSeedBank();
  const subjects = [
    ["russian", 27, ["орфография", "пунктуация", "сочинение"]],
    ["math", 19, ["алгебра", "геометрия", "практические задачи"]],
    ["informatics", 27, ["алгоритмы", "логика", "программирование"]],
    ["physics", 26, ["механика", "электричество", "квантовая физика"]],
    ["chemistry", 34, ["реакции", "расчёты", "органическая химия"]],
    ["biology", 28, ["клетка", "генетика", "экология"]],
    ["history", 21, ["хронология", "источники", "аргументация"]],
    ["social", 25, ["право", "экономика", "общество"]],
    ["geography", 29, ["карты", "население", "хозяйство"]],
    ["literature", 11, ["теория", "анализ текста", "сочинение"]],
    ["english", 42, ["аудирование", "лексика", "говорение"]],
    ["german", 42, ["чтение", "грамматика", "говорение"]],
    ["french", 42, ["чтение", "лексика", "говорение"]],
    ["spanish", 42, ["чтение", "лексика", "говорение"]],
    ["chinese", 32, ["иероглифика", "чтение", "говорение"]],
  ];

  assert.equal(Object.keys(bank).length, 15);
  for (const [slug, fullCount, topics] of subjects) {
    for (const variant of Array.from({ length: 12 }, (_, index) => index + 1)) {
      const tasks = buildTrainingVariant(slug, fullCount, topics, bank[slug], variant);
      assert.equal(tasks.length, slug === "russian" ? 27 : 10, `${slug} v${variant}: task count`);
      assert.equal(new Set(tasks.map((task) => task.id)).size, tasks.length, `${slug} v${variant}: unique ids`);
      assert.equal(new Set(tasks.map(signature)).size, tasks.length, `${slug} v${variant}: no repeated task-answer pairs`);
      assert.ok(tasks.every((task) => !task.prompt.includes("Тренировочная параллель")), `${slug} v${variant}: old clone marker removed`);
      for (const task of tasks) {
        if (task.kind === "single") assert.ok(task.options.includes(task.answer), `${task.id}: answer exists in options`);
        if (task.kind === "multiple") assert.ok(task.answer.every((answer) => task.options.includes(answer)), `${task.id}: all answers exist in options`);
      }

      const perfect = Object.fromEntries(tasks.map((task) => [task.id, task.kind === "extended" ? "review" : "correct"]));
      const perfectAnalysis = analyzeTaskResults(tasks, perfect);
      assert.equal(perfectAnalysis.weaknesses.length, 0, `${slug} v${variant}: perfect student has no weak topics`);

      const mixed = Object.fromEntries(tasks.map((task, index) => [task.id, task.kind === "extended" ? "review" : index % 3 === 0 ? "incorrect" : "correct"]));
      const mixedAnalysis = analyzeTaskResults(tasks, mixed);
      assert.ok(mixedAnalysis.weaknesses.length > 0, `${slug} v${variant}: mistakes produce weak topics`);
      assert.ok(mixedAnalysis.strengths.length > 0, `${slug} v${variant}: correct answers produce strong topics`);
    }
  }
});

test("twelve Russian routes follow all 27 lines and produce different complete variants", async () => {
  const bank = await loadSeedBank();
  const variants = Array.from({ length: 12 }, (_, index) => buildTrainingVariant("russian", 27, ["орфография", "пунктуация", "сочинение"], bank.russian, index + 1));
  assert.equal(variants.length, 12);
  assert.equal(new Set(variants.map((tasks) => JSON.stringify(tasks.map(signature)))).size, 12);
  for (const tasks of variants) {
    assert.deepEqual(tasks.map((task) => task.number), Array.from({ length: 27 }, (_, index) => `Задание ${index + 1}`));
    assert.equal(tasks[26].kind, "extended");
    assert.equal(tasks[26].minWords, 150);
    assert.ok(tasks[0].stimulus.length > 200);
  }
});

test("Russian type bank contains 105 distinct authored tasks grouped by EGE skill", () => {
  assert.equal(russianTaskFamilies.length, 14);
  assert.equal(getRussianAuthorBankSize(), 105);
  const all = russianTaskFamilies.flatMap((family) => {
    const tasks = getRussianFamilyTasks(family.id);
    assert.equal(tasks.length, family.count, `${family.id}: declared count`);
    assert.ok(tasks.every((task) => task.familyId === family.id), `${family.id}: family id`);
    assert.ok(tasks.every((task) => task.theory?.length > 40), `${family.id}: remediation theory`);
    assert.equal(new Set(tasks.map(signature)).size, tasks.length, `${family.id}: unique content`);
    for (const task of tasks) {
      if (task.kind === "single") assert.ok(task.options.includes(task.answer), `${task.id}: answer exists`);
      if (task.kind === "multiple") assert.ok(task.answer.every((answer) => task.options.includes(answer)), `${task.id}: answers exist`);
    }
    return tasks;
  });
  assert.equal(all.length, 105);
  assert.equal(new Set(all.map((task) => task.id)).size, 105);
});
