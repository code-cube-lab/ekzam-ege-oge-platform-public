import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("growth center covers every declared OGE and EGE task with a reusable teacher brief", async () => {
  const [catalog, data, component, page] = await Promise.all([
    readFile(new URL("../knowledge-base/exams/exam-subjects.ts", import.meta.url), "utf8"),
    readFile(new URL("../knowledge-base/marketing/growth-center.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/GrowthCenterClient.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/growth/page.tsx", import.meta.url), "utf8"),
  ]);

  const subjectLines = catalog.split("\n").filter((line) => line.includes("{ slug:") && line.includes("fullTaskCount:"));
  assert.equal(subjectLines.length, 15);
  const coverage = subjectLines.map((line) => {
    const slug = line.match(/slug: "([a-z]+)"/)?.[1];
    const ege = Number(line.match(/fullTaskCount: (\d+)/)?.[1]);
    const oge = Number(line.match(/ogeTaskCount: (\d+)/)?.[1] ?? 0);
    assert.ok(slug && ege > 0, `invalid subject coverage: ${line}`);
    return { slug, ege, oge };
  });
  const total = coverage.reduce((sum, item) => sum + item.ege + item.oge, 0);
  assert.ok(total > 700, `expected full task coverage, received ${total}`);

  assert.match(data, /export function buildTeacherCampaign/);
  assert.match(data, /Math\.min\(taskCount, Math\.max\(1/);
  assert.match(data, /mode: "training"/);
  assert.match(data, /utm_campaign/);
  assert.match(data, /hooks:/);
  assert.match(data, /shots:/);
  assert.match(data, /reviewGate/);
  assert.match(component, /campaign\.hooks\.map/);
  assert.match(component, /campaign\.shots\.map/);
  assert.match(component, /Скопировать задание преподавателю/);
  assert.match(page, /GrowthCenterClient/);
});

test("growth center includes verified references, public partners and ethical message flow", async () => {
  const [data, component, home, teachers, reels] = await Promise.all([
    readFile(new URL("../knowledge-base/marketing/growth-center.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/GrowthCenterClient.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/TeacherProductClient.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ReelsLabClient.tsx", import.meta.url), "utf8"),
  ]);

  const references = data.split("export const viralEducationReferences")[1].split("export const publicPartners")[0];
  const partners = data.split("export const publicPartners")[1].split("export const outreachTemplates")[0];
  const messages = data.split("export const outreachTemplates")[1].split("export const forumRoutes")[0];
  assert.ok((references.match(/evidenceUrl:/g) ?? []).length >= 11);
  assert.ok((references.match(/(?:tiktok\.com|instagram\.com)/g) ?? []).length >= 10);
  assert.match(references, /3,6 млн просмотров/);
  assert.match(references, /4,4 млн просмотров/);
  assert.match(references, /июнь 2026 года/);
  assert.equal((partners.match(/category: "(?:teacher|exam|parent|school)"/g) ?? []).length, 12);
  assert.equal((messages.match(/id: "/g) ?? []).length, 6);
  assert.match(component, /Никогда не писать участникам в личку без приглашения/);
  assert.match(component, /без массовой рассылки/);
  assert.match(component, /не гарантируют повтор результата/);
  assert.match(component, /коммерческие гипотезы/);
  assert.match(component, /Скопировать план на 14 дней/);
  assert.match(data, /studentAcquisitionSprint/);
  assert.match(data, /promotionCompliance/);
  assert.match(data, /Федеральный закон № 72-ФЗ/);
  assert.match(data, /Приказ Роскомнадзора № 68/);
  assert.match(home, /href="\/growth"/);
  assert.match(teachers, /href="\/growth"/);
  assert.match(reels, /href="\/growth/);
  assert.doesNotMatch(`${data}\n${component}`, /education-priority-leads\.json|education-lead-board-input\.json|local-private\//i);
  assert.doesNotMatch(`${data}\n${component}`, /гарантируем|гарантия 100|точно сдаст|гарантированный балл/i);
});

test("private outreach board remains outside the public tree", async () => {
  for (const publicPath of [
    "../public/education-priority-leads.json",
    "../public/education-lead-board-input.json",
    "../docs/education-priority-leads.json",
    "../docs/education-lead-board-input.json",
  ]) await assert.rejects(access(new URL(publicPath, import.meta.url)));
});

test("every public teacher has a separate consent-gated growth brief", async () => {
  const [data, component] = await Promise.all([
    readFile(new URL("../knowledge-base/marketing/teacher-growth.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/GrowthCenterClient.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(data, /russianTeachers\.map/);
  assert.match(data, /subjectLeads[\s\S]*\.filter/);
  assert.match(data, /Участие в платформе не подтверждено/);
  assert.match(data, /право использовать своё имя/);
  assert.match(data, /targetAudiences/);
  assert.match(data, /outreachMessage/);
  assert.match(component, /teacherGrowthProfiles\.map/);
  assert.match(component, /Преподаватель для рекламного плана/);
  assert.match(component, /Скопировать весь план/);
  assert.match(component, /Скопировать сообщение/);
  assert.match(component, /teacherGrowthProfiles\.length} уникальных персональных брифов/);
});

test("channel launch series has five original image-backed posts", async () => {
  const [posts, component] = await Promise.all([
    readFile(new URL("../knowledge-base/marketing/telegram-channel-posts.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/GrowthCenterClient.tsx", import.meta.url), "utf8"),
  ]);
  assert.equal((posts.match(/id: "/g) ?? []).length, 5);
  assert.equal((posts.match(/image: "\/marketing\/channel\//g) ?? []).length, 5);
  assert.equal((posts.match(/buttonUrl: (?:`|")/g) ?? []).length, 5);
  assert.match(posts, /защищённый личный прогресс/i);
  assert.match(component, /telegramChannelPosts\.map/);
  assert.match(component, /Скопировать пост/);
  for (const file of [
    "post-01-weak-skill.jpg",
    "post-02-thinking-path.jpg",
    "post-03-focused-practice.jpg",
    "post-04-parent-report.jpg",
    "post-05-miniapp.jpg",
  ]) await access(new URL(`../public/marketing/channel/${file}`, import.meta.url));
});

test("Russian teacher pilot has a complete path from short video to an honest order gate", async () => {
  const [pilot, component] = await Promise.all([
    readFile(new URL("../knowledge-base/marketing/russian-teacher-pilot.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/GrowthCenterClient.tsx", import.meta.url), "utf8"),
  ]);

  const funnel = pilot.split("funnel:")[1].split("contentPlan:")[0];
  const content = pilot.split("contentPlan:")[1].split("offers:")[0];
  const offers = pilot.split("offers:")[1].split("channels:")[0];
  const channels = pilot.split("channels:")[1].split("messages:")[0];
  assert.equal((funnel.match(/step: "/g) ?? []).length, 6);
  assert.equal((content.match(/day: "/g) ?? []).length, 7);
  assert.equal((offers.match(/label: "/g) ?? []).length, 3);
  assert.equal((channels.match(/name: "/g) ?? []).length, 4);
  assert.match(pilot, /task=5/);
  assert.match(pilot, /ответ \/start/);
  assert.match(pilot, /не писать участникам канала в личку/);
  assert.match(component, /id="russian-pilot"/);
  assert.match(component, /Открыть бесплатное задание № 5/);
  assert.match(component, /Скопировать весь запуск/);
  assert.match(component, /russianTeacherPilot\.contentPlan\.map/);
  assert.match(component, /russianTeacherPilot\.channels\.map/);
});
