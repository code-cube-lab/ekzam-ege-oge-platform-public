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

async function loadOgeBank(getDemoTasks = () => []) {
  const source = await readFile(new URL("../knowledge-base/tasks/oge-demo-bank.ts", import.meta.url), "utf8");
  const withoutImport = source.replace(/^import .*exam-demo-bank";\r?\n/m, "");
  const javascript = ts.transpileModule(withoutImport, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const context = { exports: {}, getDemoTasks };
  vm.runInNewContext(javascript, context);
  return context.exports;
}

function signature(task) {
  return JSON.stringify([task.prompt, task.stimulus ?? "", task.audioText ?? "", task.options ?? [], task.answer]);
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
      assert.equal(tasks.length, fullCount, `${slug} v${variant}: full official task count`);
      assert.equal(new Set(tasks.map((task) => task.id)).size, tasks.length, `${slug} v${variant}: unique ids`);
      assert.equal(new Set(tasks.map(signature)).size, tasks.length, `${slug} v${variant}: no repeated task-answer pairs`);
      assert.ok(tasks.every((task) => !task.prompt.includes("Тренировочная параллель")), `${slug} v${variant}: old clone marker removed`);
      for (const task of tasks) {
        assert.ok(task.prompt.trim().length >= 10, `${task.id}: non-empty prompt`);
        assert.ok(task.solution.length > 0 && task.solution.every((step) => step.trim().length >= 5), `${task.id}: usable solution`);
        assert.ok(typeof task.answer === "string" ? task.answer.trim().length > 0 : task.answer.length > 0, `${task.id}: non-empty answer`);
        assert.equal(task.examYear, 2026, `${task.id}: exam year`);
        assert.match(task.sourceLabel, /ФИПИ-2026/, `${task.id}: honest source label`);
        if (task.options) assert.equal(new Set(task.options).size, task.options.length, `${task.id}: no duplicate options`);
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

test("twelve Russian OGE routes follow the official 13-task structure", async () => {
  const { getRussianOgeVariantTasks } = await loadOgeBank();
  const variants = Array.from({ length: 12 }, (_, index) => getRussianOgeVariantTasks(index + 1));
  assert.equal(variants.length, 12);
  for (const [variantIndex, tasks] of variants.entries()) {
    assert.equal(tasks.length, 13, `OGE v${variantIndex + 1}: 13 tasks`);
    assert.deepEqual(Array.from(tasks, (task) => task.number), Array.from({ length: 13 }, (_, index) => `Задание ${index + 1}`));
    assert.equal(tasks[0].kind, "extended");
    assert.equal(tasks[0].minWords, 70);
    assert.ok(tasks[0].audioText.length > 300);
    assert.equal(tasks[0].maxPlays, 2);
    assert.ok(tasks.slice(1, 12).every((task) => task.interaction === "exam-blank"));
    assert.ok(tasks.slice(1, 12).every((task) => typeof task.answer === "string"));
    assert.equal(tasks[12].kind, "extended");
    assert.equal(tasks[12].minWords, 70);
    assert.equal(new Set(tasks.map((task) => task.id)).size, 13);
  }
  assert.equal(new Set(variants.map((tasks) => JSON.stringify(tasks.map(signature)))).size, 12);
});

test("all OGE subjects expose complete 2026 routes instead of ten demo questions", async () => {
  const bank = await loadSeedBank();
  const { getOgeRouteTasks } = await loadOgeBank((slug) => bank[slug] ?? bank.russian);
  const profiles = [
    ["math", 25], ["informatics", 16], ["physics", 22], ["chemistry", 23], ["biology", 26],
    ["history", 24], ["social", 24], ["geography", 30], ["literature", 5],
    ["english", 38], ["german", 38], ["french", 38], ["spanish", 38],
  ];
  for (const [slug, count] of profiles) {
    const tasks = getOgeRouteTasks(slug, ["основы", "анализ", "применение"], 3);
    assert.equal(tasks.length, count, `${slug}: complete OGE route`);
    assert.equal(new Set(tasks.map((task) => task.id)).size, count, `${slug}: unique ids`);
    assert.ok(tasks.every((task) => task.examYear === 2026), `${slug}: current exam year`);
    assert.ok(tasks.filter((task) => task.options).every((task) => task.options.length >= 5), `${slug}: no reduced choice cards`);
    assert.ok(tasks.some((task) => task.kind === "extended"), `${slug}: extended response section`);
  }
});

test("Russian EGE choices are answered through the exam blank, not clickable guessing", async () => {
  const bank = await loadSeedBank();
  const tasks = buildTrainingVariant("russian", 27, ["орфография", "пунктуация", "сочинение"], bank.russian, 1);
  const tasksWithOptions = tasks.filter((task) => task.options?.length);
  assert.ok(tasksWithOptions.length > 10);
  assert.ok(tasksWithOptions.every((task) => task.interaction === "exam-blank"));
  assert.ok(tasksWithOptions.every((task) => task.kind === "text"));
  assert.ok(tasksWithOptions.every((task) => /^\d+$/.test(task.answer)));
});

test("Russian EGE route reproduces the response mechanics of all 27 lines", async () => {
  const bank = await loadSeedBank();
  const tasks = buildTrainingVariant("russian", 27, ["орфография", "пунктуация", "сочинение"], bank.russian, 4);
  assert.equal(tasks[0].format, "самостоятельный подбор слова");
  for (const line of [2, 3, 4, 9, 10, 11, 12, 13, 14, 16, 23, 24]) {
    assert.equal(tasks[line - 1].options.length, 5, `line ${line}: five positions`);
    assert.equal(tasks[line - 1].interaction, "exam-blank", `line ${line}: exam blank`);
  }
  for (const line of [8, 22]) {
    assert.equal(tasks[line - 1].format, "установление соответствия", `line ${line}: matching`);
    assert.equal(tasks[line - 1].options.length, 9, `line ${line}: nine right-column positions`);
    assert.match(tasks[line - 1].answer, /^\d{5}$/, `line ${line}: five-digit mapping`);
  }
  for (const line of [15, 17, 18, 19, 20, 21, 26]) {
    assert.match(tasks[line - 1].answer, /^\d+$/, `line ${line}: digit sequence`);
  }
  assert.equal(tasks[26].kind, "extended");
  assert.equal(tasks[26].minWords, 150);
});

test("every EGE subject exposes full routes with exam blanks and extended high-level work", async () => {
  const bank = await loadSeedBank();
  const profiles = [
    ["math", 19], ["informatics", 27], ["physics", 26], ["chemistry", 34], ["biology", 28],
    ["history", 21], ["social", 25], ["geography", 29], ["literature", 11],
    ["english", 42], ["german", 42], ["french", 42], ["spanish", 42], ["chinese", 32],
  ];
  for (const [slug, count] of profiles) {
    const tasks = buildTrainingVariant(slug, count, ["основы", "анализ", "применение"], bank[slug], 2);
    assert.equal(tasks.length, count, `${slug}: complete route`);
    assert.ok(tasks.some((task) => task.interaction === "exam-blank"), `${slug}: blank responses`);
    assert.ok(tasks.filter((task) => task.options).every((task) => task.options.length >= 5), `${slug}: no reduced three-option questions`);
    assert.ok(tasks.some((task) => task.difficulty === "повышенный" || task.difficulty === "высокий"), `${slug}: non-basic tasks`);
    if (slug !== "informatics") assert.ok(tasks.some((task) => task.kind === "extended"), `${slug}: extended response`);
  }
});

test("every subject has a non-repeating Telegram daily practice pool", async () => {
  const bank = await loadSeedBank();
  for (const [subject, tasks] of Object.entries(bank)) {
    const autoChecked = tasks.filter((task) => task.kind === "single" || task.kind === "number");
    assert.ok(autoChecked.length >= 2, `${subject}: at least two daily tasks`);
    for (const task of autoChecked) {
      if (task.kind === "single") {
        assert.equal(new Set(task.options).size, task.options.length, `${task.id}: unique options`);
        assert.ok(task.options.includes(task.answer), `${task.id}: answer exists`);
      } else {
        assert.ok(Number.isFinite(Number(String(task.answer).replace(",", "."))), `${task.id}: numeric answer`);
      }
    }
  }
});
