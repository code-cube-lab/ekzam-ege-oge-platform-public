import { getDemoTasks, type ExamTask } from "./exam-demo-bank";

const ogeTaskIndexes: Record<string, number[]> = {
  russian: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  math: [0, 1, 2, 3, 6, 7, 8, 9],
};

export function getOgeRouteTasks(subjectSlug: string, topics: string[]): ExamTask[] {
  const seeds = getDemoTasks(subjectSlug);
  const indexes = ogeTaskIndexes[subjectSlug] ?? seeds.map((_, index) => index);

  return indexes.map((seedIndex, index) => {
    const seed = seeds[seedIndex];
    return {
      ...seed,
      id: `oge-${subjectSlug}-${index + 1}`,
      number: `Задание ${index + 1}`,
      topic: topics[index % Math.max(1, topics.length)] ?? seed.topic ?? seed.format,
    };
  });
}
