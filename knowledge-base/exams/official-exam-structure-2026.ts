import type { ExamSubjectSlug } from "./exam-subjects";

export type OfficialExamTrack2026 = {
  level: "ege" | "oge";
  subject: ExamSubjectSlug;
  taskCount: number;
  durationMinutes: number;
  delivery: "paper" | "computer" | "paper-and-oral";
  sourceArchive: string;
  note: string;
};

const egeBase = "https://doc.fipi.ru/ege/demoversii-specifikacii-kodifikatory/2026";
const ogeBase = "https://doc.fipi.ru/oge/demoversii-specifikacii-kodifikatory/2026";

export const officialEgeTracks2026: OfficialExamTrack2026[] = [
  { level: "ege", subject: "russian", taskCount: 27, durationMinutes: 210, delivery: "paper", sourceArchive: `${egeBase}/ru_11_2026.zip`, note: "26 кратких ответов и сочинение" },
  { level: "ege", subject: "math", taskCount: 19, durationMinutes: 235, delivery: "paper", sourceArchive: `${egeBase}/ma_11_2026.zip`, note: "Профильный уровень: 12 кратких и 7 развёрнутых ответов; базовый уровень хранится отдельным треком из 21 задания" },
  { level: "ege", subject: "physics", taskCount: 26, durationMinutes: 235, delivery: "paper", sourceArchive: `${egeBase}/fi_11_2026.zip`, note: "20 кратких и 6 развёрнутых ответов" },
  { level: "ege", subject: "chemistry", taskCount: 34, durationMinutes: 210, delivery: "paper", sourceArchive: `${egeBase}/hi_11_2026.zip`, note: "28 кратких и 6 развёрнутых ответов" },
  { level: "ege", subject: "informatics", taskCount: 27, durationMinutes: 235, delivery: "computer", sourceArchive: `${egeBase}/inf_11_2026.zip`, note: "Компьютерный экзамен с файлами и программированием" },
  { level: "ege", subject: "biology", taskCount: 28, durationMinutes: 235, delivery: "paper", sourceArchive: `${egeBase}/bi_11_2026.zip`, note: "21 краткий и 7 развёрнутых ответов" },
  { level: "ege", subject: "history", taskCount: 21, durationMinutes: 210, delivery: "paper", sourceArchive: `${egeBase}/is_11_2026.zip`, note: "12 кратких и 9 развёрнутых ответов" },
  { level: "ege", subject: "geography", taskCount: 29, durationMinutes: 180, delivery: "paper", sourceArchive: `${egeBase}/gg_11_2026.zip`, note: "21 краткий и 8 развёрнутых ответов" },
  { level: "ege", subject: "social", taskCount: 25, durationMinutes: 210, delivery: "paper", sourceArchive: `${egeBase}/ob_11_2026.zip`, note: "16 кратких и 9 развёрнутых ответов" },
  { level: "ege", subject: "literature", taskCount: 11, durationMinutes: 235, delivery: "paper", sourceArchive: `${egeBase}/li_11_2026.zip`, note: "Литературоведческий анализ, сопоставление и сочинение" },
  { level: "ege", subject: "english", taskCount: 42, durationMinutes: 207, delivery: "paper-and-oral", sourceArchive: `${egeBase}/aya_11_2026.zip`, note: "38 заданий письменной и 4 задания устной части" },
  { level: "ege", subject: "german", taskCount: 42, durationMinutes: 207, delivery: "paper-and-oral", sourceArchive: `${egeBase}/nya_11_2026.zip`, note: "38 заданий письменной и 4 задания устной части" },
  { level: "ege", subject: "french", taskCount: 42, durationMinutes: 207, delivery: "paper-and-oral", sourceArchive: `${egeBase}/fya_11_2026.zip`, note: "38 заданий письменной и 4 задания устной части" },
  { level: "ege", subject: "spanish", taskCount: 42, durationMinutes: 207, delivery: "paper-and-oral", sourceArchive: `${egeBase}/iya_11_2026.zip`, note: "38 заданий письменной и 4 задания устной части" },
  { level: "ege", subject: "chinese", taskCount: 32, durationMinutes: 194, delivery: "paper-and-oral", sourceArchive: `${egeBase}/kya_11_2026.zip`, note: "Письменная и устная части" },
];

export const officialOgeTracks2026: OfficialExamTrack2026[] = [
  { level: "oge", subject: "russian", taskCount: 13, durationMinutes: 235, delivery: "paper", sourceArchive: `${ogeBase}/ru_9_2026.zip`, note: "Изложение, тестовая часть и одно сочинение по выбору" },
  { level: "oge", subject: "math", taskCount: 25, durationMinutes: 235, delivery: "paper", sourceArchive: `${ogeBase}/ma_9_2026.zip`, note: "19 кратких и 6 развёрнутых ответов" },
  { level: "oge", subject: "physics", taskCount: 22, durationMinutes: 180, delivery: "paper", sourceArchive: `${ogeBase}/fi_9_2026.zip`, note: "Включает экспериментальное задание" },
  { level: "oge", subject: "chemistry", taskCount: 23, durationMinutes: 180, delivery: "paper", sourceArchive: `${ogeBase}/hi_9_2026.zip`, note: "Включает практическую часть" },
  { level: "oge", subject: "informatics", taskCount: 16, durationMinutes: 150, delivery: "computer", sourceArchive: `${ogeBase}/inf_9_2026.zip`, note: "Практические задания используют комплект файлов" },
  { level: "oge", subject: "biology", taskCount: 26, durationMinutes: 150, delivery: "paper", sourceArchive: `${ogeBase}/bi_9_2026.zip`, note: "Краткие и развёрнутые ответы" },
  { level: "oge", subject: "history", taskCount: 24, durationMinutes: 180, delivery: "paper", sourceArchive: `${ogeBase}/is_9_2026.zip`, note: "Работа с фактами, картой и источниками" },
  { level: "oge", subject: "geography", taskCount: 30, durationMinutes: 150, delivery: "paper", sourceArchive: `${ogeBase}/gg_9_2026.zip`, note: "Карты, статистика, расчёты и объяснения" },
  { level: "oge", subject: "social", taskCount: 24, durationMinutes: 180, delivery: "paper", sourceArchive: `${ogeBase}/ob_9_2026.zip`, note: "Краткие и развёрнутые ответы" },
  { level: "oge", subject: "literature", taskCount: 12, durationMinutes: 235, delivery: "paper", sourceArchive: `${ogeBase}/li_9_2026.zip`, note: "12 заданий, а не прежние 5 на платформе" },
  { level: "oge", subject: "english", taskCount: 38, durationMinutes: 135, delivery: "paper-and-oral", sourceArchive: `${ogeBase}/aya_9_2026.zip`, note: "35 заданий письменной и 3 задания устной части" },
  { level: "oge", subject: "german", taskCount: 38, durationMinutes: 135, delivery: "paper-and-oral", sourceArchive: `${ogeBase}/nya_9_2026.zip`, note: "35 заданий письменной и 3 задания устной части" },
  { level: "oge", subject: "french", taskCount: 38, durationMinutes: 135, delivery: "paper-and-oral", sourceArchive: `${ogeBase}/fya_9_2026.zip`, note: "35 заданий письменной и 3 задания устной части" },
  { level: "oge", subject: "spanish", taskCount: 38, durationMinutes: 135, delivery: "paper-and-oral", sourceArchive: `${ogeBase}/iya_9_2026.zip`, note: "35 заданий письменной и 3 задания устной части" },
];

export const officialMathBaseEge2026 = {
  level: "ege" as const,
  subject: "math" as const,
  taskCount: 21,
  durationMinutes: 180,
  delivery: "paper" as const,
  sourceArchive: `${egeBase}/ma_11_2026.zip`,
  note: "Базовый уровень должен открываться отдельным выбором, а не смешиваться с профильным маршрутом.",
};

export function getOfficialExamTrack2026(level: "ege" | "oge", subject: ExamSubjectSlug) {
  const tracks = level === "ege" ? officialEgeTracks2026 : officialOgeTracks2026;
  return tracks.find((track) => track.subject === subject);
}
