import {
  examSubjects,
  getExamSubject,
  isExamSubject,
  isSubjectAvailableForExam,
  type ExamSubjectSlug,
} from "../exams/exam-subjects";
import { getDemoTasks } from "./exam-demo-bank";

export type ExamTrack = "oge" | "ege";
export type SubjectTrack = ExamSubjectSlug;

export type DailyTask = {
  key: string;
  exam: ExamTrack;
  subject: SubjectTrack;
  examYear: number;
  topic: string;
  title: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  skillHint: string;
  estimatedMinutes: number;
};

export type TopicStat = {
  mastery: number;
  errorCount: number;
  streak: number;
  nextReviewAt: string | null;
};

export const telegramSubjectCatalog = examSubjects.map((subject) => ({
  slug: subject.slug,
  name: subject.name,
  shortName: subject.shortName,
  ogeAvailable: subject.ogeAvailable,
}));

export function isExamTrack(value: string): value is ExamTrack {
  return value === "oge" || value === "ege";
}

export function isSubjectTrack(value: string): value is SubjectTrack {
  return isExamSubject(value);
}

export function isTrackAvailable(exam: ExamTrack, subject: SubjectTrack) {
  return isSubjectAvailableForExam(exam, subject);
}

function numericOptions(answer: string, seed: number) {
  const value = Number(answer.replace(",", "."));
  if (!Number.isFinite(value)) return [];
  const precision = answer.includes(".") || answer.includes(",") ? Math.max(answer.split(/[.,]/)[1]?.length ?? 1, 1) : 0;
  const step = precision ? 10 ** -precision : 1;
  const format = (item: number) => {
    const normalized = precision ? item.toFixed(precision) : String(Math.round(item));
    return answer.includes(",") ? normalized.replace(".", ",") : normalized;
  };
  const distractors = [value + step, value - step, value + step * 2, value * 2, value / 2]
    .map(format)
    .filter((item) => item !== answer);
  const unique = [...new Set([answer, ...distractors])].slice(0, 4);
  const shift = seed % unique.length;
  return [...unique.slice(shift), ...unique.slice(0, shift)];
}

function toDailyTasks(exam: ExamTrack, subject: SubjectTrack): DailyTask[] {
  if (!isTrackAvailable(exam, subject)) return [];
  const profile = getExamSubject(subject);
  return getDemoTasks(subject)
    .filter((task) => (
      (task.kind === "single" && task.options?.length && typeof task.answer === "string")
      || (task.kind === "number" && typeof task.answer === "string")
    ))
    .map((task, index) => {
      const options = task.kind === "number" ? numericOptions(String(task.answer), index) : task.options ?? [];
      const correctIndex = options.indexOf(String(task.answer));
      if (correctIndex < 0) throw new Error(`${task.id}: answer is missing from options`);
      const topic = profile.focus[index % profile.focus.length] ?? profile.name;
      return {
        key: `${exam}_${subject}_${task.id.replace(/[^a-z0-9_-]/gi, "_")}`,
        exam,
        subject,
        examYear: 2026,
        topic,
        title: `${task.number} · короткая отработка`,
        question: task.prompt,
        options,
        correctIndex,
        explanation: task.solution.join(" "),
        skillHint: `Откройте полный ${exam.toUpperCase()}-вариант и закрепите линию по теме «${topic}».`,
        estimatedMinutes: 4,
      };
    });
}

export const taskBank: DailyTask[] = (["oge", "ege"] as const).flatMap((exam) =>
  examSubjects.flatMap((subject) => toDailyTasks(exam, subject.slug)),
);

export function chooseDailyTask(
  weakTopics: string[],
  telegramId: string,
  exam: ExamTrack = "ege",
  subject: SubjectTrack = "russian",
  stats: Record<string, TopicStat> = {},
  excludeKey?: string,
) {
  const trackTasks = taskBank.filter((task) => task.exam === exam && task.subject === subject);
  if (!trackTasks.length) throw new Error(`No daily tasks for ${exam}:${subject}`);
  const candidates = trackTasks.filter((task) => task.key !== excludeKey);
  const pool = candidates.length ? candidates : trackTasks;
  const today = new Date().toISOString().slice(0, 10);

  const scored = pool.map((task) => {
    const stat = stats[task.topic];
    const weak = weakTopics.includes(task.topic);
    const due = Boolean(stat?.nextReviewAt && stat.nextReviewAt <= today);
    const mastery = stat?.mastery ?? 0.5;
    const score = (weak ? 40 : 0) + (due ? 25 : 0) + (1 - mastery) * 20 + Math.min(stat?.errorCount ?? 0, 5) * 4;
    return { task, score };
  });
  const maxScore = Math.max(...scored.map((item) => item.score));
  const priority = scored.filter((item) => item.score === maxScore).map((item) => item.task);
  const day = Math.floor(Date.now() / 86400000);
  const salt = [...telegramId].reduce((total, char) => total + char.charCodeAt(0), 0);
  return priority[(day + salt) % priority.length] ?? trackTasks[0];
}

export function findTask(key: string) {
  return taskBank.find((task) => task.key === key) ?? null;
}

export function trackLabel(exam: ExamTrack, subject: SubjectTrack) {
  return `${exam.toUpperCase()} · ${getExamSubject(subject).name}`;
}
