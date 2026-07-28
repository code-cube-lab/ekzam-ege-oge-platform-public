import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import {
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

async function loadValidationRegistry() {
  const source = await readFile(new URL("../knowledge-base/exams/exam-validation.ts", import.meta.url), "utf8");
  const withoutImport = source.replace(/^import type .*exam-subjects";\r?\n/m, "");
  const javascript = ts.transpileModule(withoutImport, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const context = { exports: {} };
  vm.runInNewContext(javascript, context);
  return context.exports;
}

function signature(task) {
  return JSON.stringify([task.prompt, task.stimulus ?? "", task.audioText ?? "", task.options ?? [], task.answer]);
}

test("unverified EGE subject banks are quarantined instead of presented as full variants", async () => {
  const bank = await loadSeedBank();
  const validation = await loadValidationRegistry();
  const subjects = Object.keys(bank);
  assert.equal(Object.keys(bank).length, 15);
  for (const slug of subjects) {
    const gate = validation.getExamRouteValidation("ege", slug);
    if (slug === "russian") {
      assert.equal(gate.status, "preview-ready");
      continue;
    }
    assert.equal(gate.status, "blocked", `${slug}: hidden from students until subject review`);
    const draft = buildTrainingVariant(slug, Math.max(1, bank[slug].length), ["черновик"], bank[slug], 1);
    assert.ok(draft.every((task) => /не допущен к ученикам/.test(task.sourceLabel)), `${slug}: draft label`);
    assert.ok(draft.every((task) => !task.prompt.includes("Выполните линию")), `${slug}: no cosmetic exam suffix`);
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
    assert.ok(tasks[0].stimulus.length > 900, "line 1 uses a full-length authored source text");
    assert.equal(tasks[1].stimulusHighlights.length, 5, "line 2 visibly identifies all five analyzed words");
    for (const word of tasks[1].stimulusHighlights) {
      assert.ok(tasks[1].stimulus.toLocaleLowerCase("ru-RU").includes(word.toLocaleLowerCase("ru-RU")), `line 2 contains highlighted word «${word}»`);
    }
    assert.ok(tasks[22].stimulus.length > 900, "line 23 uses a second full-length authored source text");
    assert.ok(tasks[26].stimulus.length > 900, "line 27 essay uses a full-length authored source text");
    assert.notEqual(tasks[0].stimulus, tasks[22].stimulus, "the first and second source blocks are different");
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
    assert.ok(tasks[0].audioText.length > 800, "OGE summary uses a full listening text");
    assert.equal(tasks[0].maxPlays, 2);
    assert.ok(tasks.slice(1, 12).every((task) => task.interaction === "exam-blank"));
    assert.ok(tasks.slice(1, 12).every((task) => typeof task.answer === "string"));
    assert.equal(tasks[12].kind, "extended");
    assert.equal(tasks[12].minWords, 70);
    assert.ok(tasks[9].stimulus.length > 900, "OGE text-analysis block uses a full-length source");
    assert.ok((tasks[9].stimulus.match(/\(\d+\)/g) ?? []).length >= 15, "OGE reading text is numbered like the exam source");
    assert.equal(new Set(tasks.map((task) => task.id)).size, 13);
  }
  assert.equal(new Set(variants.map((tasks) => JSON.stringify(tasks.map(signature)))).size, 12);
});

test("unverified OGE routes contain no fabricated answer options and stay behind the release gate", async () => {
  const bank = await loadSeedBank();
  const validation = await loadValidationRegistry();
  const { getOgeRouteTasks } = await loadOgeBank((slug) => bank[slug] ?? bank.russian);
  const profiles = [
    "math", "informatics", "physics", "chemistry", "biology",
    "history", "social", "geography", "literature",
    "english", "german", "french", "spanish",
  ];
  for (const slug of profiles) {
    assert.equal(validation.getExamRouteValidation("oge", slug).status, "blocked", `${slug}: blocked pending subject review`);
    const tasks = getOgeRouteTasks(slug, ["основы", "анализ", "применение"], 3);
    assert.ok(tasks.every((task) => /не допущен к ученикам/.test(task.sourceLabel)), `${slug}: draft-only label`);
    assert.ok(tasks.every((task) => !task.prompt.includes("Выполните линию")), `${slug}: no fake line suffix`);
    assert.ok(tasks.flatMap((task) => task.options ?? []).every((option) => !option.includes("не следует из условия задания")), `${slug}: no padded options`);
  }
});

test("Russian EGE choices are answered through the exam blank, not clickable guessing", async () => {
  const bank = await loadSeedBank();
  const tasks = buildTrainingVariant("russian", 27, ["орфография", "пунктуация", "сочинение"], bank.russian, 1);
  const tasksWithOptions = tasks.filter((task) => task.options?.length);
  assert.ok(tasksWithOptions.length > 10);
  assert.ok(tasksWithOptions.every((task) => task.interaction === "exam-blank"));
  assert.ok(tasksWithOptions.every((task) => task.kind === "text"));
  assert.ok(tasksWithOptions.filter((task) => task.number !== "Задание 4").every((task) => /^\d+$/.test(task.answer)));
  assert.match(tasks[3].answer, /^[а-яё]+$/i, "line 4 is answered with the incorrectly stressed word");
});

test("Russian EGE route reproduces the response mechanics of all 27 lines", async () => {
  const bank = await loadSeedBank();
  const tasks = buildTrainingVariant("russian", 27, ["орфография", "пунктуация", "сочинение"], bank.russian, 4);
  assert.equal(tasks[0].format, "самостоятельный подбор слова");
  assert.match(tasks[1].prompt, /лексическое значение слова соответствует его значению в данном тексте/);
  assert.match(tasks[3].prompt, /неверно выделена буква/i);
  assert.match(tasks[3].responseInstruction, /только слово/i);
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
  assert.equal(tasks[18].answer, "1234", "line 19: all four subordinate-clause boundaries");
  assert.equal(tasks[26].kind, "extended");
  assert.equal(tasks[26].minWords, 150);
});

test("Russian answer explanations follow the shuffled order shown to the student", async () => {
  const bank = await loadSeedBank();
  for (const variant of Array.from({ length: 12 }, (_, index) => index + 1)) {
    const tasks = buildTrainingVariant("russian", 27, ["орфография", "пунктуация", "сочинение"], bank.russian, variant);
    for (const line of [8, 9, 10, 11, 12, 13, 14, 16, 21, 22]) {
      const task = tasks[line - 1];
      assert.match(task.solution.join(" "), new RegExp(`Ответ[^.]*${task.answer}`), `variant ${variant}, line ${line}: visible-order answer`);
    }
    assert.ok(tasks.every((task) => /Авторск/.test(task.sourceLabel)), `variant ${variant}: authored label`);
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
