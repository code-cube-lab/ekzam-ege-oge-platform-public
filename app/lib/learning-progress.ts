export type AttemptOutcome = "correct" | "incorrect" | "review";

export type LearningAttempt = {
  id: string;
  taskId: string;
  subject: string;
  level: "oge" | "ege";
  mode: "training" | "route" | "mistakes";
  variantId: number;
  taskNumber: string;
  topic: string;
  outcome: AttemptOutcome;
  durationSeconds: number;
  answeredAt: string;
};

export type WritingDraft = {
  taskId: string;
  text: string;
  elapsedSeconds: number;
  savedAt: string;
  label?: string;
  href?: string;
};

export type LearningProgress = {
  version: 2;
  xp: number;
  attempts: LearningAttempt[];
  drafts: Record<string, WritingDraft>;
};

export type TopicSummary = {
  topic: string;
  attempts: number;
  correct: number;
  incorrect: number;
  review: number;
  mastery: number;
  nextStep: string;
};

export type ParentLearningReport = {
  attempts: number;
  automaticAttempts: number;
  accuracy: number;
  xp: number;
  strengths: TopicSummary[];
  weaknesses: TopicSummary[];
  awaitingReview: TopicSummary[];
  recommendation: string;
};

export const LEARNING_PROGRESS_KEY = "ekzam-learning-progress-v2";

export function emptyLearningProgress(): LearningProgress {
  return { version: 2, xp: 0, attempts: [], drafts: {} };
}

export function loadLearningProgress(storage: Pick<Storage, "getItem">): LearningProgress {
  try {
    const parsed = JSON.parse(storage.getItem(LEARNING_PROGRESS_KEY) ?? "null") as Partial<LearningProgress> | null;
    if (!parsed || parsed.version !== 2 || !Array.isArray(parsed.attempts)) return emptyLearningProgress();
    return {
      version: 2,
      xp: Number.isFinite(parsed.xp) ? Math.max(0, Number(parsed.xp)) : 0,
      attempts: parsed.attempts.filter((item): item is LearningAttempt => Boolean(item?.taskId && item?.answeredAt && item?.outcome)),
      drafts: parsed.drafts && typeof parsed.drafts === "object" ? parsed.drafts : {},
    };
  } catch {
    return emptyLearningProgress();
  }
}

export function saveLearningProgress(storage: Pick<Storage, "setItem">, progress: LearningProgress) {
  storage.setItem(LEARNING_PROGRESS_KEY, JSON.stringify(progress));
}

export function appendAttempt(progress: LearningProgress, attempt: Omit<LearningAttempt, "id" | "answeredAt">): LearningProgress {
  const answeredAt = new Date().toISOString();
  const next: LearningProgress = {
    ...progress,
    xp: progress.xp + (attempt.outcome === "correct" ? 12 : attempt.outcome === "review" ? 8 : 3),
    attempts: [
      ...progress.attempts,
      { ...attempt, id: `${attempt.taskId}-${answeredAt}`, answeredAt },
    ].slice(-1000),
  };
  return next;
}

export function upsertDraft(progress: LearningProgress, draft: Omit<WritingDraft, "savedAt">): LearningProgress {
  return {
    ...progress,
    drafts: {
      ...progress.drafts,
      [draft.taskId]: { ...draft, savedAt: new Date().toISOString() },
    },
  };
}

export function removeDraft(progress: LearningProgress, taskId: string): LearningProgress {
  const drafts = { ...progress.drafts };
  delete drafts[taskId];
  return { ...progress, drafts };
}

export function summarizeLearningProgress(progress: LearningProgress): ParentLearningReport {
  const topics = new Map<string, Omit<TopicSummary, "topic" | "mastery" | "nextStep">>();
  for (const attempt of progress.attempts) {
    const item = topics.get(attempt.topic) ?? { attempts: 0, correct: 0, incorrect: 0, review: 0 };
    item.attempts += 1;
    item[attempt.outcome] += 1;
    topics.set(attempt.topic, item);
  }

  const summaries = [...topics.entries()].map(([topic, item]): TopicSummary => {
    const automatic = item.correct + item.incorrect;
    const mastery = automatic ? Math.round((item.correct / automatic) * 100) : 0;
    const nextStep = item.incorrect
      ? `Повторить правило и решить ещё ${Math.max(2, 4 - item.correct)} похожих задания без подсказки.`
      : item.review
        ? "Дождаться проверки развёрнутой работы и переписать её по замечаниям преподавателя."
        : "Закрепить тему контрольным повтором через 2–3 дня.";
    return { topic, ...item, mastery, nextStep };
  });

  const automaticAttempts = progress.attempts.filter((item) => item.outcome !== "review").length;
  const correct = progress.attempts.filter((item) => item.outcome === "correct").length;
  const weaknesses = summaries
    .filter((item) => item.incorrect > 0 && item.mastery < 80)
    .sort((left, right) => left.mastery - right.mastery || right.incorrect - left.incorrect);
  const strengths = summaries
    .filter((item) => item.correct >= 2 && item.mastery >= 80)
    .sort((left, right) => right.mastery - left.mastery || right.correct - left.correct);
  const awaitingReview = summaries.filter((item) => item.review > 0);

  return {
    attempts: progress.attempts.length,
    automaticAttempts,
    accuracy: automaticAttempts ? Math.round((correct / automaticAttempts) * 100) : 0,
    xp: progress.xp,
    strengths,
    weaknesses,
    awaitingReview,
    recommendation: weaknesses[0]
      ? `Начать с темы «${weaknesses[0].topic}»: короткое правило, разбор последней ошибки и серия до трёх верных ответов подряд.`
      : progress.attempts.length
        ? "Слабая тема пока не подтверждена. Сделайте контрольный повтор через 2–3 дня."
        : "Сначала решите один полный вариант или выберите номер задания для тренировки.",
  };
}
