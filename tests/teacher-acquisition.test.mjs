import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("teacher acquisition ecosystem generates a separate static route for all 27 profiles", async () => {
  const [registry, leads, growth, acquisition, directory, route] = await Promise.all([
    readFile(new URL("../knowledge-base/teachers/teacher-registry.ts", import.meta.url), "utf8"),
    readFile(new URL("../knowledge-base/teachers/subject-leads.ts", import.meta.url), "utf8"),
    readFile(new URL("../knowledge-base/marketing/teacher-growth.ts", import.meta.url), "utf8"),
    readFile(new URL("../knowledge-base/marketing/teacher-acquisition.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/TeacherAcquisitionDirectoryClient.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/growth/teachers/[teacherId]/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.equal((registry.match(/^  \{ slug:/gm) ?? []).length, 16);
  assert.equal((leads.match(/^  \{ slug:/gm) ?? []).length, 13);
  assert.match(growth, /russianTeachers\.map/);
  assert.match(growth, /!\["russian", "literature"\]\.includes/);
  assert.match(acquisition, /teacherGrowthProfiles\.map\(buildTeacherAcquisitionPlaybook\)/);
  assert.match(route, /generateStaticParams/);
  assert.match(route, /teacherAcquisitionPlaybooks\.map/);
  assert.match(directory, /teacherAcquisitionPlaybooks\.length/);
  assert.match(directory, /27 отдельных маршрутов/);
  assert.match(directory, /Открыть маршрут/);
});

test("every teacher playbook joins acquisition sources, tagged task links and conversion messages", async () => {
  const data = await readFile(new URL("../knowledge-base/marketing/teacher-acquisition.ts", import.meta.url), "utf8");
  const component = await readFile(new URL("../app/components/TeacherAcquisitionClient.tsx", import.meta.url), "utf8");

  const sources = data.split("export const teacherAcquisitionSources")[1].split("export const partnershipSafety")[0];
  assert.ok((sources.match(/access: "/g) ?? []).length >= 14);
  assert.match(sources, /public-contact/);
  assert.match(sources, /paid-catalog/);
  assert.match(sources, /reply-only/);
  assert.match(sources, /research-only/);
  assert.match(data, /utm_source: source/);
  assert.match(data, /utm_campaign: profile\.id/);
  assert.match(data, /class_teacher/);
  assert.match(data, /parent_channel/);
  assert.match(data, /parent_referral/);
  assert.match(component, /playbook\.referralPaths\.map/);
  assert.match(component, /playbook\.messages\.map/);
  assert.match(component, /Скопировать сообщение/);
  assert.match(component, /Кому писать и что предлагать/);
});

test("teacher reels are shoot-ready and class-teacher partnerships have a legal stop gate", async () => {
  const [data, component] = await Promise.all([
    readFile(new URL("../knowledge-base/marketing/teacher-acquisition.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/TeacherAcquisitionClient.tsx", import.meta.url), "utf8"),
  ]);

  for (const id of ["student-challenge", "parent-proof", "class-teacher-pilot"]) assert.match(data, new RegExp(`id: "${id}"`));
  assert.ok((data.match(/time: "[0-9]/g) ?? []).length >= 18);
  assert.ok((data.match(/show:/g) ?? []).length >= 18);
  assert.ok((data.match(/action:/g) ?? []).length >= 28);
  assert.ok((data.match(/say:/g) ?? []).length >= 18);
  assert.ok((data.match(/overlay:/g) ?? []).length >= 18);
  assert.match(data, /скрытая выплата за каждого ребёнка выключена/);
  assert.match(data, /Контакты учеников нам передавать не нужно/);
  assert.match(data, /конфликт интересов/);
  assert.match(data, /273-ФЗ/);
  assert.match(component, /ЧТО СКАЗАТЬ ДОСЛОВНО/);
  assert.match(component, /Скопировать полный сценарий/);
  assert.match(component, /partnershipSafety\.blocked\.map/);
  assert.doesNotMatch(`${data}\n${component}`, /пишите участникам|скрытый процент разрешён|гарантированн(?:ый|о) балл/i);
});

test("teacher sprint is a transparent local checklist rather than a fake public CRM", async () => {
  const component = await readFile(new URL("../app/components/TeacherAcquisitionClient.tsx", import.meta.url), "utf8");
  assert.match(component, /localStorage\.getItem/);
  assert.match(component, /localStorage\.setItem/);
  assert.match(component, /публичная GitHub Pages-версия не является CRM/);
  assert.match(component, /playbook\.sprint\.map/);
  assert.match(component, /completed\.length/);
});

test("forum research maps real topic-level sources into seven ethical routes per teacher", async () => {
  const [research, acquisition, component] = await Promise.all([
    readFile(new URL("../knowledge-base/marketing/teacher-forum-research.ts", import.meta.url), "utf8"),
    readFile(new URL("../knowledge-base/marketing/teacher-acquisition.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/TeacherAcquisitionClient.tsx", import.meta.url), "utf8"),
  ]);

  assert.equal((research.match(/^    id: "/gm) ?? []).length, 27);
  assert.ok((research.match(/actionMode: "expert-reply"/g) ?? []).length >= 20);
  assert.equal((research.match(/actionMode: "special-listing"/g) ?? []).length, 2);
  assert.ok((research.match(/actionMode: "research-only"/g) ?? []).length >= 5);
  assert.match(research, /https:\/\/u-mama\.ru\/forum\/rules/);
  assert.match(research, /https:\/\/www\.babyblog\.ru\/community\/shkola\/rules-and-faq/);
  assert.match(research, /обычных темах запрещены реклама сайтов, услуг и маркетинговые исследования/);
  assert.match(research, /Не писать автору и не предлагать услугу несовершеннолетнему/);
  assert.match(research, /\.slice\(0, 7\)/);
  assert.match(research, /specialListings/);
  assert.match(acquisition, /forumRoutes: buildTeacherForumRoutes\(profile\)/);
  assert.match(component, /playbook\.forumRoutes\.filter/);
  assert.match(component, /Не «форумы вообще», а конкретные темы и безопасный ответ/);
  assert.match(component, /Скопировать ответ/);
  assert.match(component, /Проверка перед публикацией/);
  assert.doesNotMatch(`${research}\n${component}`, /выдать себя за родителя|скрыт(?:ая|ую) реклам(?:а|у) разреш/iu);
});
