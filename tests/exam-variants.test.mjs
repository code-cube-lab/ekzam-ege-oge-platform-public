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

async function loadOfficialStructure() {
  const source = await readFile(new URL("../knowledge-base/exams/official-exam-structure-2026.ts", import.meta.url), "utf8");
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
    if (slug === "math") {
      assert.ok(draft.every((task) => /Авторский материал/.test(task.sourceLabel)), "math: authored route awaits final release gate");
      assert.ok(draft.every((task) => !task.prompt.includes("Линия ")), "math: no generic line filler");
      continue;
    }
    assert.ok(draft.every((task) => /не допущен к ученикам/.test(task.sourceLabel)), `${slug}: draft label`);
    assert.ok(draft.every((task) => !task.prompt.includes("Выполните линию")), `${slug}: no cosmetic exam suffix`);
  }
});

test("official 2026 registry covers every EGE and OGE subject with exact route counts", async () => {
  const registry = await loadOfficialStructure();
  assert.equal(registry.officialEgeTracks2026.length, 15);
  assert.equal(registry.officialOgeTracks2026.length, 14);
  assert.equal(new Set(registry.officialEgeTracks2026.map((track) => track.subject)).size, 15);
  assert.equal(new Set(registry.officialOgeTracks2026.map((track) => track.subject)).size, 14);
  assert.ok([...registry.officialEgeTracks2026, ...registry.officialOgeTracks2026].every((track) => track.sourceArchive.startsWith("https://doc.fipi.ru/")));
  assert.equal(registry.getOfficialExamTrack2026("ege", "math").taskCount, 19);
  assert.equal(registry.officialMathBaseEge2026.taskCount, 21);
  assert.equal(registry.getOfficialExamTrack2026("oge", "literature").taskCount, 12);
});

test("twelve Russian routes follow all 27 lines and produce different complete variants", async () => {
  const bank = await loadSeedBank();
  const variants = Array.from({ length: 12 }, (_, index) => buildTrainingVariant("russian", 27, ["орфография", "пунктуация", "сочинение"], bank.russian, index + 1));
  assert.equal(variants.length, 12);
  assert.equal(new Set(variants.map((tasks) => JSON.stringify(tasks.map(signature)))).size, 12);
  assert.equal(new Set(variants.map((tasks) => tasks[0].stimulus)).size, 12, "line 1 has twelve distinct source versions");
  assert.equal(new Set(variants.map((tasks) => tasks[22].stimulus)).size, 12, "lines 23-27 have twelve distinct source versions");
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
    assert.equal(tasks[22].stimulus, tasks[26].stimulus, "lines 23-27 use one shared source text");
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
    if (slug === "math") {
      assert.ok(tasks.every((task) => /Авторский материал/.test(task.sourceLabel)), "math: authored route awaits final release gate");
      assert.ok(tasks.every((task) => !task.prompt.includes("Выполните линию")), "math: no generic line filler");
      continue;
    }
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
  assert.ok(tasksWithOptions.filter((task) => task.number !== "Задание 5").every((task) => /^\d+$/.test(task.answer)));
  assert.match(tasks[3].answer, /^\d+$/, "line 4 is answered with the numbers of correctly stressed words");
  assert.match(tasks[4].answer, /^[а-яё]+$/i, "line 5 is answered with the corrected paronym");
});

test("Russian EGE route reproduces the response mechanics of all 27 lines", async () => {
  const bank = await loadSeedBank();
  const tasks = buildTrainingVariant("russian", 27, ["орфография", "пунктуация", "сочинение"], bank.russian, 4);
  assert.equal(tasks[0].format, "самостоятельный подбор слова");
  assert.match(tasks[1].prompt, /лексическое значение слова соответствует его значению в данном тексте/);
  assert.match(tasks[3].prompt, /верно выделена буква/i);
  assert.match(tasks[3].responseInstruction, /номера всех выбранных позиций/i);
  assert.match(tasks[4].prompt, /подобрав к выделенному слову пароним/i);
  assert.match(tasks[4].responseInstruction, /подобранное слово/i);
  for (const line of [2, 3, 4, 5, 9, 10, 11, 12, 13, 14, 16, 23, 24]) {
    assert.equal(tasks[line - 1].options.length, 5, `line ${line}: five positions`);
    assert.equal(tasks[line - 1].interaction, "exam-blank", `line ${line}: exam blank`);
  }
  for (const line of [8, 22]) {
    assert.equal(tasks[line - 1].format, "установление соответствия", `line ${line}: matching`);
    assert.equal(tasks[line - 1].options.length, 9, `line ${line}: nine right-column positions`);
    assert.match(tasks[line - 1].answer, /^\d{5}$/, `line ${line}: five-digit mapping`);
  }
  for (const line of [9, 10]) {
    assert.ok(tasks[line - 1].options.every((option) => option.split(",").length === 3), `line ${line}: three words in every row`);
  }
  for (const line of [13, 14]) {
    assert.ok(tasks[line - 1].options.every((option) => /[.!?]$/.test(option)), `line ${line}: full-sentence contexts`);
  }
  for (const line of [15, 17, 18, 19, 20, 21, 26]) {
    assert.match(tasks[line - 1].answer, /^\d+$/, `line ${line}: digit sequence`);
  }
  assert.equal(tasks[18].answer, "1234", "line 19: all four subordinate-clause boundaries");
  assert.match(tasks[24].prompt, /фразеологизм/i, "line 25: phraseological unit from the source text");
  assert.ok(/\s/.test(tasks[24].answer), "line 25: authored phraseological unit, not a generic single word");
  assert.equal(tasks[26].rubricVersion, "ФИПИ-2026 · К1–К10");
  assert.equal(tasks[26].maxScore, 22);
  assert.equal(tasks[26].kind, "extended");
  assert.equal(tasks[26].minWords, 150);
});

test("all twelve Russian variants have separately authored lines 5-7 with valid keys", async () => {
  const bank = await loadSeedBank();
  const variants = Array.from({ length: 12 }, (_, index) => buildTrainingVariant("russian", 27, [], bank.russian, index + 1));
  for (const line of [5, 6, 7]) {
    assert.equal(new Set(variants.map((tasks) => signature(tasks[line - 1]))).size, 12, `line ${line}: twelve authored versions`);
  }
  for (const tasks of variants) {
    assert.equal(tasks[4].options.length, 5);
    assert.equal(tasks[6].prompt.split("\n").length, 6);
    assert.ok(tasks.slice(3, 7).every((task) => task.solution.join(" ").includes(String(task.answer))), "lines 4-7 explain the visible key");
  }
});

test("every Russian EGE line in every variant has a complete checkable contract", async () => {
  const bank = await loadSeedBank();
  for (const variant of Array.from({ length: 12 }, (_, index) => index + 1)) {
    const tasks = buildTrainingVariant("russian", 27, [], bank.russian, variant);
    for (const [index, task] of tasks.entries()) {
      assert.ok(task.prompt?.trim(), `variant ${variant}, line ${index + 1}: prompt`);
      assert.ok(task.theory?.trim(), `variant ${variant}, line ${index + 1}: theory`);
      assert.ok(task.solution?.length, `variant ${variant}, line ${index + 1}: explanation`);
      assert.ok(task.answer !== undefined && task.answer !== "", `variant ${variant}, line ${index + 1}: answer or rubric`);
      if (task.options?.length && /^\d+$/.test(String(task.answer))) {
        for (const digit of String(task.answer)) {
          assert.ok(Number(digit) >= 1 && Number(digit) <= task.options.length, `variant ${variant}, line ${index + 1}: answer digit ${digit} exists`);
        }
      }
    }
    const phraseAnswer = tasks[24].answer.toLocaleLowerCase("ru-RU");
    assert.ok(tasks[24].stimulus.toLocaleLowerCase("ru-RU").includes(phraseAnswer), `variant ${variant}: line 25 answer occurs in text`);
    const linkSentenceNumber = Number(tasks[25].answer);
    const linkSentence = tasks[25].stimulus.match(new RegExp(`\\(${linkSentenceNumber}\\)([^()]*)$`))?.[1] ?? "";
    assert.match(linkSentence, /Этот вывод/, `variant ${variant}: line 26 demonstrative pronoun and repeated word`);
    assert.equal(tasks[22].stimulus, tasks[26].stimulus, `variant ${variant}: shared text for lines 23-27`);
  }
});

test("Russian answer explanations follow the shuffled order shown to the student", async () => {
  const bank = await loadSeedBank();
  for (const variant of Array.from({ length: 12 }, (_, index) => index + 1)) {
    const tasks = buildTrainingVariant("russian", 27, ["орфография", "пунктуация", "сочинение"], bank.russian, variant);
    for (const line of [4, 5, 8, 9, 10, 11, 12, 13, 14, 16, 21, 22]) {
      const task = tasks[line - 1];
      assert.match(task.solution.join(" "), new RegExp(`Ответ[^.]*${task.answer}`), `variant ${variant}, line ${line}: visible-order answer`);
    }
    assert.ok(tasks.every((task) => /Авторск/.test(task.sourceLabel)), `variant ${variant}: authored label`);
  }
});

test("twelve mathematics EGE routes follow the 2026 profile structure without generic filler", async () => {
  const bank = await loadSeedBank();
  const variants = Array.from(
    { length: 12 },
    (_, index) => buildTrainingVariant("math", 19, ["алгебра", "геометрия"], bank.math, index + 1),
  );

  for (const [variantIndex, tasks] of variants.entries()) {
    const variant = variantIndex + 1;
    assert.equal(tasks.length, 19, `variant ${variant}: 19 lines`);
    for (const [index, task] of tasks.entries()) {
      assert.equal(task.id, `math-v${variant}-${index + 1}`);
      assert.ok(task.prompt?.trim(), `variant ${variant}, line ${index + 1}: prompt`);
      assert.ok(task.theory?.trim(), `variant ${variant}, line ${index + 1}: theory`);
      assert.ok(task.solution?.length, `variant ${variant}, line ${index + 1}: solution`);
      assert.doesNotMatch(task.prompt, /Линия \d+\.|номер корректного вывода/i, `variant ${variant}, line ${index + 1}: no generic filler`);
    }
    assert.ok(tasks.slice(0, 12).every((task) => task.interaction === "exam-blank"), `variant ${variant}: short answers use the exam blank`);
    assert.ok(tasks.slice(0, 12).every((task) => Number.isFinite(Number(String(task.answer).replace(",", ".")))), `variant ${variant}: numeric keys are checkable`);
    assert.ok(tasks.slice(12).every((task) => task.kind === "extended" && task.answer === "teacher-review"), `variant ${variant}: lines 13-19 require full solutions`);
    assert.deepEqual(tasks.slice(12).map((task) => task.maxScore), [2, 3, 2, 2, 3, 4, 4], `variant ${variant}: official maximum scores by line`);
  }

  for (const line of Array.from({ length: 19 }, (_, index) => index + 1)) {
    assert.equal(
      new Set(variants.map((tasks) => signature(tasks[line - 1]))).size,
      12,
      `mathematics line ${line}: twelve authored versions`,
    );
  }
});

test("twelve mathematics OGE routes follow the 25-line structure without generic filler", async () => {
  const bank = await loadSeedBank();
  const { getOgeRouteTasks } = await loadOgeBank((slug) => bank[slug] ?? bank.russian);
  const variants = Array.from(
    { length: 12 },
    (_, index) => getOgeRouteTasks("math", ["числа", "алгебра", "геометрия"], index + 1),
  );

  for (const [variantIndex, tasks] of variants.entries()) {
    const variant = variantIndex + 1;
    assert.equal(tasks.length, 25, `variant ${variant}: 25 lines`);
    assert.equal(
      JSON.stringify(tasks.map((task) => task.number)),
      JSON.stringify(Array.from({ length: 25 }, (_, index) => `Задание ${index + 1}`)),
      `variant ${variant}: consecutive task numbers`,
    );
    for (const [index, task] of tasks.entries()) {
      assert.equal(task.id, `oge-math-v${variant}-${index + 1}`);
      assert.ok(task.prompt?.trim(), `variant ${variant}, line ${index + 1}: prompt`);
      assert.ok(task.theory?.trim(), `variant ${variant}, line ${index + 1}: theory`);
      assert.ok(task.solution?.length, `variant ${variant}, line ${index + 1}: solution`);
      assert.doesNotMatch(task.prompt, /Выполните линию|номер корректного вывода/i, `variant ${variant}, line ${index + 1}: no generic filler`);
    }
    assert.ok(tasks.slice(0, 19).every((task) => task.interaction === "exam-blank"), `variant ${variant}: lines 1-19 use exam blanks`);
    assert.ok(tasks.slice(0, 19).every((task) => task.answer !== undefined && task.answer !== ""), `variant ${variant}: short-answer keys exist`);
    assert.ok(tasks.slice(19).every((task) => task.kind === "extended" && task.answer === "teacher-review"), `variant ${variant}: lines 20-25 require full solutions`);
    assert.equal(new Set(tasks.slice(0, 5).map((task) => task.stimulus)).size, 1, `variant ${variant}: practical lines 1-5 share one source`);
  }

  for (const line of Array.from({ length: 25 }, (_, index) => index + 1)) {
    assert.equal(
      new Set(variants.map((tasks) => signature(tasks[line - 1]))).size,
      12,
      `mathematics OGE line ${line}: twelve authored versions`,
    );
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
