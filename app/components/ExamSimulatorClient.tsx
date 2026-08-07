"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { examSubjects, getExamSubject } from "../../knowledge-base/exams/exam-subjects";
import { getExamRouteValidation } from "../../knowledge-base/exams/exam-validation";
import { getTrainingVariantTasks, type ExamTask } from "../../knowledge-base/tasks/exam-demo-bank";
import { getOgeRouteTasks } from "../../knowledge-base/tasks/oge-demo-bank";
import { getSchoolTopics, getSubjectSchoolProfile, officialSchoolLinks } from "../../knowledge-base/curriculum/school-curriculum";
import {
  analyzeTaskResults,
  getRussianAuthorBankSize,
  getRussianFamilyTasks,
  getRussianTaskFamily,
  russianTaskFamilies,
  subjectExamProfiles,
} from "../../knowledge-base/tasks/variant-engine.js";
import {
  appendAttempt,
  emptyLearningProgress,
  loadLearningProgress,
  removeDraft,
  saveLearningProgress,
  summarizeLearningProgress,
  upsertDraft,
  type LearningProgress,
} from "../lib/learning-progress";

type ResultState = "correct" | "incorrect" | "review";
type ExamMode = "training" | "route" | "mistakes";
type ExamLevel = "oge" | "ege";
type AudioState = "idle" | "playing" | "paused" | "finished" | "unavailable";
const EXAM_VARIANT_COUNT = 12;
const MISTAKE_STORAGE_KEY = "ekzam-mistakes-v1";

function normal(value: string, order: ExamTask["answerOrder"] = "fixed") {
  const cleaned = value.trim().toLowerCase().replace(/ё/g, "е").replace(/,/g, ".").replace(/\s+/g, "");
  return order === "any" && /^\d+$/.test(cleaned) ? [...cleaned].sort().join("") : cleaned;
}

function lessonHref(subject: string, topic: string) {
  return `/learn?${new URLSearchParams({ subject, topic, variant: "1" }).toString()}`;
}

function appHref(path: string) {
  const examSegment = window.location.pathname.indexOf("/exam");
  const basePath = examSegment >= 0 ? window.location.pathname.slice(0, examSegment) : "";
  return `${basePath}${path}`;
}

function formatClock(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

function renderStimulus(text: string, highlights: string[] = []) {
  if (!highlights.length) return text;

  const loweredText = text.toLocaleLowerCase("ru-RU");
  const ranges = highlights
    .map((word) => {
      const start = loweredText.indexOf(word.toLocaleLowerCase("ru-RU"));
      return { start, end: start + word.length };
    })
    .filter((range) => range.start >= 0)
    .sort((left, right) => left.start - right.start);

  const fragments: ReactNode[] = [];
  let cursor = 0;
  for (const [rangeIndex, range] of ranges.entries()) {
    if (range.start < cursor) continue;
    if (range.start > cursor) fragments.push(text.slice(cursor, range.start));
    fragments.push(<mark className="exam-highlighted-word" title="Выделенное слово" key={`${range.start}-${rangeIndex}`}>{text.slice(range.start, range.end)}</mark>);
    cursor = range.end;
  }
  if (cursor < text.length) fragments.push(text.slice(cursor));
  return fragments;
}

type Props = {
  initialSubject?: string;
  initialFamily?: string;
  initialCount?: number;
  initialLevel?: string;
  initialVariant?: number;
  initialMode?: string;
  initialTask?: number;
};

export function ExamSimulatorClient({
  initialSubject = "russian",
  initialFamily = "stress",
  initialCount = 0,
  initialLevel,
  initialVariant = 1,
  initialMode = "route",
  initialTask = 1,
}: Props) {
  const [examChosen, setExamChosen] = useState(() => initialLevel === "oge" || initialLevel === "ege");
  const [subjectSlug, setSubjectSlug] = useState<string>(() => {
    const requested = getExamSubject(initialSubject).slug;
    return initialLevel === "oge" && !getSubjectSchoolProfile(requested).ogeAvailable ? "russian" : requested;
  });
  const [mode, setMode] = useState<ExamMode>(() => initialMode === "mistakes" ? "mistakes" : initialMode === "training" ? "training" : "route");
  const [level, setLevel] = useState<ExamLevel>(() => initialLevel === "oge" ? "oge" : "ege");
  const [variantId, setVariantId] = useState(() => Math.min(EXAM_VARIANT_COUNT, Math.max(1, initialVariant || 1)));
  const [familyId, setFamilyId] = useState(() => getRussianTaskFamily(initialFamily).id);
  const [assignmentCount, setAssignmentCount] = useState(() => Math.max(0, initialCount));
  const [practiceLine, setPracticeLine] = useState(() => Math.max(1, initialTask || 1));
  const [trainingSource, setTrainingSource] = useState<"variants" | "extended">("variants");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [written, setWritten] = useState("");
  const [audioPlays, setAudioPlays] = useState(0);
  const [audioState, setAudioState] = useState<AudioState>("idle");
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, ResultState>>({});
  const [mistakeIds, setMistakeIds] = useState<string[]>([]);
  const [learningProgress, setLearningProgress] = useState<LearningProgress>(() => emptyLearningProgress());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [draftStatus, setDraftStatus] = useState("");
  const activeUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const draftReadyTask = useRef<string | null>(null);
  const elapsedSecondsRef = useRef(0);
  const lastPersistedText = useRef("");
  const subject = getExamSubject(subjectSlug);
  const schoolProfile = getSubjectSchoolProfile(subjectSlug);
  const family = getRussianTaskFamily(familyId);
  const authorBankSize = getRussianAuthorBankSize();
  const levelLabel = level === "oge" ? "ОГЭ" : "ЕГЭ";
  const durationMinutes = level === "oge" ? subject.ogeDurationMinutes : subject.durationMinutes;
  const partCount = level === "oge" ? subject.ogePartCount : subject.egePartCount;
  const plannedTaskCount = level === "oge" ? subject.ogeTaskCount ?? 0 : subject.fullTaskCount;
  const subjectProfile = subjectExamProfiles[subjectSlug as keyof typeof subjectExamProfiles];
  const availableSubjects = examSubjects.filter((item) => level === "ege" || getSubjectSchoolProfile(item.slug).ogeAvailable);
  const validation = getExamRouteValidation(level, subject.slug);
  const routeReady = validation.status === "preview-ready";
  const officialBankUrl = level === "oge" ? officialSchoolLinks.ogeBank : officialSchoolLinks.egeBank;
  const formatExampleUrl = level === "oge"
    ? "https://rus-oge.sdamgia.ru/archive"
    : "https://rus-ege.sdamgia.ru/test?id=57153574";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedLevel = params.get("level");
    if (requestedLevel !== "oge" && requestedLevel !== "ege") return;

    const requestedSubject = getExamSubject(params.get("subject") ?? initialSubject).slug;
    const safeSubject = requestedLevel === "oge" && !getSubjectSchoolProfile(requestedSubject).ogeAvailable
      ? "russian"
      : requestedSubject;
    const requestedMode = params.get("mode");
    const requestedVariant = Number(params.get("variant"));
    const requestedCount = Number(params.get("count"));
    const requestedTask = Number(params.get("task"));
    const resolvedMode: ExamMode = requestedMode === "mistakes" ? "mistakes" : requestedMode === "training" ? "training" : "route";

    const frame = window.requestAnimationFrame(() => {
      setExamChosen(true);
      setLevel(requestedLevel);
      setSubjectSlug(safeSubject);
      setMode(resolvedMode);
      setVariantId(Math.min(EXAM_VARIANT_COUNT, Math.max(1, requestedVariant || 1)));
      setFamilyId(getRussianTaskFamily(params.get("family") ?? initialFamily).id);
      setTrainingSource(params.has("family") ? "extended" : "variants");
      setAssignmentCount(Math.max(0, requestedCount || 0));
      setPracticeLine(Math.max(1, requestedTask || initialTask || 1));
      setIndex(resolvedMode === "route" ? Math.max(0, (requestedTask || 1) - 1) : 0);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [initialFamily, initialSubject, initialTask]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const stored = JSON.parse(window.localStorage.getItem(MISTAKE_STORAGE_KEY) ?? "[]");
        if (Array.isArray(stored)) setMistakeIds(stored.filter((item): item is string => typeof item === "string"));
        setLearningProgress(loadLearningProgress(window.localStorage));
      } catch {
        setMistakeIds([]);
        setLearningProgress(emptyLearningProgress());
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const mistakeIdsKey = mistakeIds.join("|");
  const tasks = useMemo(() => {
    if (!routeReady) return [];
    const currentSubject = getExamSubject(subjectSlug);
    const currentSchoolProfile = getSubjectSchoolProfile(subjectSlug);
    const currentPlannedTaskCount = level === "oge" ? currentSubject.ogeTaskCount ?? 0 : currentSubject.fullTaskCount;
    const currentMistakeIds = mistakeIdsKey ? mistakeIdsKey.split("|") : [];
    const routeForVariant = (variant: number) => level === "oge"
      ? getOgeRouteTasks(subjectSlug, getSchoolTopics(currentSchoolProfile, 9), variant)
      : getTrainingVariantTasks(subjectSlug, currentSubject.fullTaskCount, currentSubject.focus, variant);
    if (mode === "mistakes") {
      const bank = level === "oge"
        ? Array.from({ length: EXAM_VARIANT_COUNT }, (_, variant) =>
            getOgeRouteTasks(subjectSlug, getSchoolTopics(currentSchoolProfile, 9), variant + 1),
          ).flat()
        : Array.from({ length: EXAM_VARIANT_COUNT }, (_, variant) =>
            getTrainingVariantTasks(subjectSlug, currentSubject.fullTaskCount, currentSubject.focus, variant + 1),
          ).flat();
      const mistakes = bank.filter((item, itemIndex) =>
        currentMistakeIds.includes(item.id) && bank.findIndex((candidate) => candidate.id === item.id) === itemIndex,
      );
      return assignmentCount ? mistakes.slice(0, assignmentCount) : mistakes;
    }
    if (mode === "route") {
      const route = routeForVariant(variantId);
      return assignmentCount ? route.slice(0, assignmentCount) : route;
    }
    if (trainingSource === "extended" && level === "ege" && subjectSlug === "russian") {
      const extendedBank = getRussianFamilyTasks(familyId, assignmentCount || undefined) as ExamTask[];
      return extendedBank;
    }
    const safeLine = Math.min(Math.max(1, practiceLine), Math.max(1, currentPlannedTaskCount));
    const lineBank = Array.from({ length: EXAM_VARIANT_COUNT }, (_, variant) => routeForVariant(variant + 1)[safeLine - 1]).filter(Boolean);
    if (assignmentCount) return lineBank.slice(0, assignmentCount);
    return lineBank;
  }, [assignmentCount, familyId, level, mistakeIdsKey, mode, practiceLine, routeReady, subjectSlug, trainingSource, variantId]);
  const task: ExamTask = tasks[index] ?? tasks[0];
  const taskId = task?.id;
  const taskKind = task?.kind;
  const subjectResults = tasks.map((item) => results[item.id]).filter(Boolean);
  const done = subjectResults.length;
  const correct = subjectResults.filter((item) => item === "correct").length;
  const review = subjectResults.filter((item) => item === "review").length;
  const isExtendedLine = tasks.length > 0 && tasks.every((item) => item.kind === "extended");
  const progress = Math.round((done / Math.max(1, tasks.length)) * 100);
  const autoChecked = Math.max(1, done - review);
  const accuracy = Math.round((correct / autoChecked) * 100);
  const analysis = analyzeTaskResults(tasks, results);
  const weakTopics = analysis.weaknesses as string[];
  const strongTopics = analysis.strengths as string[];
  const nextTopic = weakTopics[0] ?? task?.topic ?? subject.focus[0] ?? "базовая подготовка";
  const currentRisk = schoolProfile.examRisks.find((risk) =>
    `${risk.skill} ${risk.signal}`.toLowerCase().includes(nextTopic.toLowerCase()),
  ) ?? schoolProfile.examRisks[0];
  const minimumLength = task?.id.startsWith("chinese") ? 40 : 80;
  const wordCount = written.trim() ? written.trim().split(/\s+/).length : 0;
  const currentLine = Math.min(Math.max(1, practiceLine), Math.max(1, plannedTaskCount));
  const correctStreak = tasks.reduce((streak, item) => {
    const state = results[item.id];
    if (state === "correct") return streak + 1;
    if (state === "incorrect") return 0;
    return streak;
  }, 0);
  const masteryPercent = done ? Math.max(0, Math.min(100, Math.round((correct / Math.max(1, done - review)) * 100))) : 0;
  const parentReport = summarizeLearningProgress(learningProgress);

  useEffect(() => {
    if (!taskId) return;
    draftReadyTask.current = null;
    const progressState = loadLearningProgress(window.localStorage);
    const draft = progressState.drafts[taskId];
    const frame = window.requestAnimationFrame(() => {
      setWritten(draft?.text ?? "");
      lastPersistedText.current = draft?.text ?? "";
      setElapsedSeconds(draft?.elapsedSeconds ?? 0);
      elapsedSecondsRef.current = draft?.elapsedSeconds ?? 0;
      setIsPaused(Boolean(draft));
      setDraftStatus(draft ? `Черновик восстановлен: ${new Date(draft.savedAt).toLocaleString("ru-RU")}` : "");
      draftReadyTask.current = taskId;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [taskId]);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      activeUtterance.current = null;
    };
  }, [taskId]);

  useEffect(() => {
    if (taskKind !== "extended" || isPaused || submitted) return;
    const timer = window.setInterval(() => setElapsedSeconds((value) => {
      const next = value + 1;
      elapsedSecondsRef.current = next;
      return next;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [isPaused, submitted, taskId, taskKind]);

  useEffect(() => {
    if (!taskId || taskKind !== "extended" || submitted || draftReadyTask.current !== taskId || written === lastPersistedText.current) return;
    const timer = window.setTimeout(() => {
      const progressState = loadLearningProgress(window.localStorage);
      const next = upsertDraft(progressState, {
        taskId,
        text: written,
        elapsedSeconds: elapsedSecondsRef.current,
        label: `${levelLabel} · ${subject.name} · ${task.number}`,
        href: `/exam?${new URLSearchParams({ level, subject: subjectSlug, mode, variant: String(variantId), task: String(mode === "route" ? index + 1 : currentLine) }).toString()}`,
      });
      setLearningProgress(next);
      saveLearningProgress(window.localStorage, next);
      lastPersistedText.current = written;
      setDraftStatus("Черновик сохранён на этом устройстве");
    }, 650);
    return () => window.clearTimeout(timer);
  }, [currentLine, index, level, levelLabel, mode, subject.name, subjectSlug, submitted, task, taskId, taskKind, variantId, written]);

  function persistProgress(next: LearningProgress) {
    setLearningProgress(next);
    saveLearningProgress(window.localStorage, next);
  }

  function updateWritten(value: string) {
    setWritten(value);
    if (task?.kind === "extended") setDraftStatus("Сохраняем черновик…");
  }

  function pauseAudio() {
    if (!("speechSynthesis" in window) || audioState !== "playing") return;
    window.speechSynthesis.pause();
    setAudioState("paused");
  }

  function continueWork() {
    setIsPaused(false);
    if (audioState === "paused" && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
      setAudioState("playing");
    }
    setDraftStatus("Работа продолжена. Черновик сохраняется автоматически.");
  }

  function saveAndPause() {
    if (!task || task.kind !== "extended") return;
    const next = upsertDraft(loadLearningProgress(window.localStorage), {
      taskId: task.id,
      text: written,
      elapsedSeconds,
      label: `${levelLabel} · ${subject.name} · ${task.number}`,
      href: `/exam?${new URLSearchParams({ level, subject: subjectSlug, mode, variant: String(variantId), task: String(mode === "route" ? index + 1 : currentLine) }).toString()}`,
    });
    persistProgress(next);
    lastPersistedText.current = written;
    pauseAudio();
    setIsPaused(true);
    setDraftStatus("Пауза включена. Можно закрыть страницу и продолжить позже.");
  }

  function saveAndExit() {
    saveAndPause();
    window.location.assign(appHref("/resume/"));
  }

  function resetAnswer() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    activeUtterance.current = null;
    setSelected([]);
    setWritten("");
    lastPersistedText.current = "";
    setElapsedSeconds(0);
    elapsedSecondsRef.current = 0;
    setIsPaused(false);
    setDraftStatus("");
    setSubmitted(false);
    setAudioPlays(0);
    setAudioState("idle");
  }

  function selectSubject(slug: string) {
    setSubjectSlug(slug);
    setVariantId(1);
    setPracticeLine(1);
    setTrainingSource("variants");
    setIndex(0);
    resetAnswer();
  }

  function selectMode(next: ExamMode) {
    setMode(next);
    setIndex(0);
    resetAnswer();
  }

  function selectLevel(next: ExamLevel) {
    setExamChosen(true);
    setLevel(next);
    setVariantId(1);
    setPracticeLine(1);
    setTrainingSource("variants");
    if (next === "oge" && !getSubjectSchoolProfile(subjectSlug).ogeAvailable) setSubjectSlug("russian");
    setIndex(0);
    resetAnswer();
  }

  function selectFamily(next: string) {
    setFamilyId(next);
    setTrainingSource("extended");
    const egeNumber = Number.parseInt(getRussianTaskFamily(next).egeNumber, 10);
    if (Number.isFinite(egeNumber)) setPracticeLine(egeNumber);
    setIndex(0);
    resetAnswer();
  }

  function selectPracticeLine(next: number) {
    setPracticeLine(next);
    setTrainingSource("variants");
    setResults({});
    setIndex(0);
    resetAnswer();
  }

  function selectVariant(next: number) {
    setVariantId(next);
    setResults({});
    setIndex(0);
    resetAnswer();
  }

  function choose(value: string) {
    if (submitted) return;
    if (task.kind === "multiple") {
      setSelected((items) => items.includes(value) ? items.filter((item) => item !== value) : [...items, value]);
    } else {
      setSelected([value]);
    }
  }

  function toggleAudio() {
    if (!task.audioText || !("speechSynthesis" in window) || typeof window.SpeechSynthesisUtterance === "undefined") {
      setAudioState("unavailable");
      return;
    }
    if (audioState === "playing") {
      pauseAudio();
      return;
    }
    if (audioState === "paused") {
      window.speechSynthesis.resume();
      setAudioState("playing");
      return;
    }
    if (audioPlays >= (task.maxPlays ?? 2)) return;
    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(task.audioText);
    utterance.lang = "ru-RU";
    utterance.rate = 0.86;
    utterance.onend = () => {
      activeUtterance.current = null;
      setAudioState("finished");
    };
    utterance.onerror = () => {
      activeUtterance.current = null;
      setAudioState("unavailable");
    };
    activeUtterance.current = utterance;
    window.speechSynthesis.speak(utterance);
    setAudioState("playing");
    setAudioPlays((count) => count + 1);
  }

  function submit() {
    let state: ResultState = "incorrect";
    if (task.kind === "extended") state = task.minWords ? wordCount >= task.minWords ? "review" : "incorrect" : written.trim().length >= minimumLength ? "review" : "incorrect";
    else if (Array.isArray(task.answer)) state = [...selected].sort().join("|") === [...task.answer].sort().join("|") ? "correct" : "incorrect";
    else if (task.kind === "single") state = selected[0] === task.answer ? "correct" : "incorrect";
    else state = normal(written, task.answerOrder) === normal(task.answer, task.answerOrder) ? "correct" : "incorrect";
    setResults((items) => ({ ...items, [task.id]: state }));
    const nextMistakes = state === "incorrect"
      ? [...new Set([...mistakeIds, task.id])]
      : mode === "mistakes" && state === "correct"
        ? mistakeIds.filter((id) => id !== task.id)
        : mistakeIds;
    setMistakeIds(nextMistakes);
    window.localStorage.setItem(MISTAKE_STORAGE_KEY, JSON.stringify(nextMistakes));
    const attemptProgress = appendAttempt(loadLearningProgress(window.localStorage), {
      taskId: task.id,
      subject: subjectSlug,
      level,
      mode,
      variantId,
      taskNumber: task.number,
      topic: task.topic ?? "общая подготовка",
      outcome: state,
      durationSeconds: elapsedSeconds,
    });
    persistProgress(task.kind === "extended" ? removeDraft(attemptProgress, task.id) : attemptProgress);
    setSubmitted(true);
  }

  function jump(itemIndex: number) {
    const nextIndex = Math.min(tasks.length - 1, Math.max(0, itemIndex));
    setIndex(nextIndex);
    if (mode === "route") {
      const url = new URL(window.location.href);
      url.searchParams.set("task", String(nextIndex + 1));
      window.history.replaceState({}, "", url);
    }
    resetAnswer();
  }

  function practiceSimilar() {
    if (mode === "route") {
      setPracticeLine(index + 1);
      setMode("training");
      setResults({});
      setIndex(0);
      resetAnswer();
      return;
    }
    const sameTopic = tasks.findIndex((candidate, candidateIndex) =>
      candidateIndex !== index && candidate.topic === task.topic && !results[candidate.id],
    );
    setIndex(sameTopic >= 0 ? sameTopic : index < tasks.length - 1 ? index + 1 : 0);
    resetAnswer();
  }

  function skipToNextMaterial() {
    if (tasks.length < 2) return;
    practiceSimilar();
  }

  const hasAnswer = task && (task.interaction !== "exam-blank" && (task.kind === "single" || task.kind === "multiple") ? selected.length > 0 : written.trim().length > 0);
  const result = task ? results[task.id] : undefined;
  const audioStatusLabel: Record<AudioState, string> = {
    idle: "Аудио готово",
    playing: "Текст звучит — можно поставить на паузу",
    paused: "Аудио на паузе",
    finished: "Прослушивание завершено",
    unavailable: "Голос браузера недоступен. Откройте страницу в Chrome, Edge или Safari.",
  };

  if (!examChosen) {
    return <main className="exam-gate">
      <header className="exam-sim-top">
        <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
        <div><b>Сначала выберите экзамен</b><span>ОГЭ и ЕГЭ откроются как две разные системы заданий</span></div>
        <Link className="button button-ghost button-small" href="/">На главную</Link>
      </header>
      <section className="exam-gate-panel" aria-labelledby="exam-gate-title">
        <span className="exam-label">Шаг 1 из 2</span>
        <h1 id="exam-gate-title">Что сдаёт ребёнок?</h1>
        <p>Выберите только один формат. После этого откроются предметы, полный вариант, практика по номеру и тетрадь ошибок.</p>
        <div>
          <button type="button" onClick={() => selectLevel("oge")}><span>9 класс</span><b>ОГЭ</b><small>Русский: 13 заданий · 235 минут · 3 части</small><em>Выбрать ОГЭ →</em></button>
          <button type="button" onClick={() => selectLevel("ege")}><span>11 класс</span><b>ЕГЭ</b><small>Русский: 27 заданий · 210 минут · 2 части</small><em>Выбрать ЕГЭ →</em></button>
        </div>
      </section>
    </main>;
  }

  if (!routeReady) {
    return <main className="exam-simulator">
      <header className="exam-sim-top">
        <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
        <div><b>Предварительная проверка банка заданий</b><span>Неверные маршруты закрыты до предметной редакции</span></div>
        <Link className="button button-ghost button-small" href="/">На главную</Link>
      </header>

      <section className="exam-subject-picker" aria-label="Выбор предмета">
        <div><span className="exam-label">Выберите предмет</span><b>{level === "oge" ? "14 предметов ОГЭ" : "Все 15 предметов ЕГЭ"}</b></div>
        <div className="exam-subject-scroll">
          {availableSubjects.map((item) => {
            const itemValidation = getExamRouteValidation(level, item.slug);
            return <button className={item.slug === subjectSlug ? "active" : ""} onClick={() => selectSubject(item.slug)} key={item.slug}>
              <span>{item.shortName}</span>
              <small>{itemValidation.status === "preview-ready" ? "можно проверять" : "банк на редактуре"}</small>
            </button>;
          })}
        </div>
      </section>

      <section className="exam-audit-gate">
        <div className="exam-audit-levels" aria-label="Выберите экзамен">
          <button className={level === "oge" ? "active" : ""} onClick={() => selectLevel("oge")}><b>ОГЭ</b><span>9 класс</span></button>
          <button className={level === "ege" ? "active" : ""} onClick={() => selectLevel("ege")}><b>ЕГЭ</b><span>11 класс</span></button>
        </div>
        <div className="exam-audit-card">
          <span className="exam-label">Результат аудита · {validation.checkedAt}</span>
          <h1>{subject.name}: задания временно закрыты</h1>
          <p>{validation.reason}</p>
          <div className="exam-audit-facts">
            <span><b>{plannedTaskCount}</b> заданий по спецификации</span>
            <span><b>{durationMinutes}</b> минут</span>
            <span><b>{partCount}</b> {partCount === 1 ? "часть" : partCount && partCount < 5 ? "части" : "разделов"}</span>
          </div>
          <div className="exam-audit-work">
            <b>Что нужно закончить перед открытием ученикам</b>
            <ol>{validation.requirements.map((item) => <li key={item}>{item}</li>)}</ol>
          </div>
          <div className="exam-audit-actions">
            <button className="button button-red" onClick={() => selectSubject("russian")}>Проверить готовый русский →</button>
            <a className="button button-ghost" href={validation.sourceUrl} target="_blank" rel="noreferrer">Открыть документы ФИПИ ↗</a>
          </div>
          <small>На GitHub эта предварительная версия ещё не опубликована. После вашей проверки будет отдельное подтверждение на публикацию.</small>
        </div>
      </section>
    </main>;
  }

  if (mode === "mistakes" && !task) {
    return <main className="exam-simulator">
      <header className="exam-sim-top">
        <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
        <div><b>Тетрадь ошибок пока пуста</b><span>Ошибочные ответы автоматически появятся здесь</span></div>
        <Link className="button button-ghost button-small" href="/how-it-works">Как работает система</Link>
      </header>
      <section className="mistakes-empty">
        <span className="exam-label">Персональная отработка</span>
        <h1>Сначала решите хотя бы одно задание</h1>
        <p>После ошибки система сохранит номер, тему и вариант на этом устройстве. Здесь появится короткий список только тех заданий, которые нужно решить повторно.</p>
        <div><button className="button button-red" onClick={() => selectMode("route")}>Открыть пробный вариант</button><Link className="button button-dark" href="/how-it-works">Поклацать демо-разбор</Link></div>
      </section>
    </main>;
  }

  return <main className="exam-simulator">
    <header className="exam-sim-top">
      <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
      <div><b>Задания ОГЭ и ЕГЭ на сайте</b><span>Одно за другим: ответ → разбор → отработка слабого места</span></div>
      <div className="exam-top-actions"><Link className="button button-ghost button-small" href="/parent-report">Отчёт родителю</Link><Link className="button button-ghost button-small" href="/for-teachers">Для педагогов</Link></div>
    </header>

    <section className="exam-subject-picker" aria-label="Выбор предмета">
      <div><span className="exam-label">Выберите предмет</span><b>{level === "oge" ? "14 предметов ОГЭ" : "Все 15 предметов ЕГЭ"}</b></div>
      <div className="exam-subject-scroll">
        {availableSubjects.map((item) => <button className={item.slug === subjectSlug ? "active" : ""} onClick={() => selectSubject(item.slug)} key={item.slug}>
          <span>{item.shortName}</span><small>{getExamRouteValidation(level, item.slug).status === "preview-ready" ? "можно проверять" : "банк на редактуре"}</small>
        </button>)}
      </div>
    </section>

    <section className="exam-mode-panel">
      <div className="exam-level-switch" aria-label="Выберите экзамен">
        <div><span className="exam-label">Экзамен</span><b>Что готовим сейчас?</b></div>
        <div>
          <button className={level === "oge" ? "active" : ""} onClick={() => selectLevel("oge")}><b>ОГЭ</b><span>9 класс</span></button>
          <button className={level === "ege" ? "active" : ""} onClick={() => selectLevel("ege")}><b>ЕГЭ</b><span>11 класс</span></button>
        </div>
      </div>
      <div className="exam-mode-tabs" aria-label="Режим работы">
        <button className={mode === "training" ? "active" : ""} onClick={() => selectMode("training")}><b>Практика по типу</b><span>Серия одного умения до закрепления</span></button>
        <button className={mode === "route" ? "active" : ""} onClick={() => selectMode("route")}><b>Пробный вариант</b><span>{plannedTaskCount} заданий · {partCount} {partCount === 1 ? "часть" : partCount && partCount < 5 ? "части" : "разделов"} прямо на сайте</span></button>
        <button className={mode === "mistakes" ? "active" : ""} onClick={() => selectMode("mistakes")}><b>Мои ошибки · {mistakeIds.length}</b><span>Только неверные задания до повторного успеха</span></button>
      </div>
      {mode === "route" && <div className="variant-picker">
        <div><span className="exam-label">12 пробных вариантов</span><b>{subject.name} · {levelLabel}-2026 · вариант № {variantId}</b><small>Полный маршрут: {tasks.length} заданий, {partCount} {partCount === 1 ? "часть" : partCount && partCount < 5 ? "части" : "разделов"}. Авторские материалы повторяют тип ответа и проверяемое умение, но не являются закрытыми КИМ.</small></div>
        <div className="exam-variant-tabs" aria-label={`Пробные варианты: ${subject.name}`}>
          {Array.from({ length: EXAM_VARIANT_COUNT }, (_, item) => item + 1).map((item) =>
            <button key={item} className={variantId === item ? "active" : ""} onClick={() => selectVariant(item)}><b>№ {item}</b><span>{tasks.length} заданий</span></button>,
          )}
        </div>
      </div>}
      {mode === "route" && <div className="route-bank-note">
        <div><span className="exam-label">Без скачивания</span><b>{subject.name} · {levelLabel} · {tasks.length} заданий на сайте</b></div>
        <p>Ребёнок отвечает здесь, сразу видит разбор и переходит к следующему заданию. Задания идут в порядке выбранного экзамена; ответ вводится как в бланке: слово, число, последовательность цифр, соответствие или развёрнутая работа.</p>
        {subjectProfile?.note && level === "ege" && <small>{subjectProfile.note}. Содержание каждого задания помечено как авторская тренировка по модели ФИПИ-2026.</small>}
      </div>}
      {mode === "training" && <div className="practice-line-bank">
        <div className="family-bank-head"><div><span className="exam-label">Отработка одного номера</span><b>{subject.name} · {trainingSource === "extended" ? `№ ${family.egeNumber} · ${family.title}` : `задание № ${currentLine}`} · {tasks.length} разных попыток</b></div><small>Каждая попытка сохраняет экзаменационный тип ответа. Цель — три верных решения подряд, а не угадывание одного вопроса.</small></div>
        <div className="practice-line-tabs" aria-label={`Номера заданий: ${subject.name}`}>
          {Array.from({ length: plannedTaskCount }, (_, item) => item + 1).map((item) =>
            <button key={item} className={currentLine === item ? "active" : ""} onClick={() => selectPracticeLine(item)} aria-label={`Отрабатывать задание ${item}`}>
              <b>{item}</b><span>{item === currentLine ? "сейчас" : "выбрать"}</span>
            </button>,
          )}
        </div>
        {level === "ege" && subjectSlug === "russian" && <details className="expanded-family-bank" open={trainingSource === "extended"}>
          <summary>Расширенный банк: {authorBankSize} упражнений по правилам</summary>
          <div className="family-tabs" aria-label="Расширенные типы русского языка">
            {russianTaskFamilies.map((item) => <button key={item.id} className={trainingSource === "extended" && familyId === item.id ? "active" : ""} onClick={() => selectFamily(item.id)}>
              <span>№ {item.egeNumber}</span><b>{item.title}</b><small>{item.count} заданий</small>
            </button>)}
          </div>
        </details>}
      </div>}
    </section>

    <section className="exam-workspace">
      <aside className="exam-map">
        <span className="exam-label light">{levelLabel} · {subject.name}</span>
        <h1>{mode === "route" ? `Вариант № ${variantId}` : mode === "mistakes" ? "Тетрадь ошибок" : trainingSource === "extended" ? `№ ${family.egeNumber} · ${family.title}` : `Задание № ${currentLine}`}</h1>
        {mode === "route" && <div className="exam-passport"><span><b>{tasks.length}</b> заданий</span><span><b>{durationMinutes}</b> минут</span><span><b>{partCount}</b> {partCount === 1 ? "часть" : partCount && partCount < 5 ? "части" : "разделов"}</span></div>}
        <p className="exam-map-intro">{mode === "route"
          ? `${tasks.length} авторских заданий выполняются внутри платформы. После каждого ответа открывается разбор.`
          : mode === "mistakes"
            ? `${tasks.length} неверных заданий сохранено на этом устройстве. Верный повтор убирает задание из списка.`
          : trainingSource === "extended"
            ? `${family.category}. Серия из ${tasks.length} разных авторских заданий на одно проверяемое умение.`
            : `Серия из ${tasks.length} вариантов задания № ${currentLine} в форме ${levelLabel}.`}</p>
        <div className="exam-progress"><span style={{ width: `${progress}%` }} /></div>
        <p>Выполнено {done} из {tasks.length} · верно {correct}</p>
        {mode === "training" && <div className="mastery-goal"><span>Игровая цель</span><b>{isExtendedLine ? `${done} из ${tasks.length} работ выполнено` : correctStreak >= 3 ? "Линия закреплена!" : `${correctStreak} из 3 верных подряд`}</b><small>{isExtendedLine ? "Каждая попытка — новый материал; итог ставит преподаватель" : `Освоение ${masteryPercent}%`} · {learningProgress.xp} XP · всего попыток {parentReport.attempts}</small></div>}
        <nav aria-label={`Задания: ${subject.name}`}>
          {tasks.map((item, itemIndex) => <button className={`${itemIndex === index ? "active" : ""} ${results[item.id] ?? ""}`} onClick={() => jump(itemIndex)} key={item.id}>
            <span>{itemIndex + 1}</span><div><b>{mode === "route" ? `Задание ${itemIndex + 1}` : `Попытка ${itemIndex + 1}`}</b><small>{item.topic ?? item.format}</small></div>
          </button>)}
        </nav>
        <p className="exam-map-note"><b>Честная маркировка:</b> это авторская практика по проверяемому умению ФИПИ, а не задание из закрытого КИМ.</p>
        <a className="fipi-link fipi-button" href={level === "oge" ? officialSchoolLinks.ogeSpecifications : officialSchoolLinks.egeSpecifications} target="_blank" rel="noreferrer">Сверить структуру на ФИПИ ↗</a>
      </aside>

      <section className="exam-paper">
        <div className="exam-paper-head"><div><span>{task.subject}</span><b>{task.number} · попытка {index + 1} из {tasks.length}</b></div><em>{task.format}</em></div>
        <div className="exam-authorship-strip">
          <span>{task.difficulty ?? "базовый"} уровень</span>
          <small>{task.sourceLabel ?? "Авторская тренировка по проверяемому умению экзамена"}</small>
        </div>
        {mode === "training" && <div className="game-status" aria-label="Игровой прогресс">
          <div><span>СЕРИЯ</span><b>{isExtendedLine ? `${done} / ${tasks.length}` : `${correctStreak} / 3`}</b></div><div><span>{isExtendedLine ? "ПРОВЕРКА" : "ОСВОЕНИЕ"}</span><b>{isExtendedLine ? `${review} работ` : `${masteryPercent}%`}</b></div><div><span>ОПЫТ</span><b>{learningProgress.xp} XP</b></div>
        </div>}
        <div className="exam-format-references" aria-label="Источники формата задания">
          <span>Сверить тип вопроса</span>
          <a href={officialBankUrl} target="_blank" rel="noreferrer">Открытый банк ФИПИ ↗</a>
          {subjectSlug === "russian" && <a href={formatExampleUrl} target="_blank" rel="noreferrer">Образец полного варианта ↗</a>}
          <small>Вопрос ниже — авторский аналог: структура сохранена, чужой текст не копируется.</small>
        </div>
        {task.audioText && <div className={`exam-audio-task ${audioState}`}>
          <div><span>Текст для изложения</span><b>Прослушивание {audioPlays} из {task.maxPlays ?? 2}</b><small role="status">{audioStatusLabel[audioState]}</small></div>
          <div className="exam-audio-actions">
            <button type="button" disabled={(audioState === "idle" || audioState === "finished") && audioPlays >= (task.maxPlays ?? 2)} onClick={toggleAudio}>{audioState === "playing" ? "Пауза аудио" : audioState === "paused" ? "Продолжить аудио" : audioPlays ? "Прослушать ещё раз" : "Включить текст"}</button>
            {mode === "training" && tasks.length > 1 && <button className="audio-next" type="button" onClick={skipToNextMaterial}>Другой текст →</button>}
          </div>
        </div>}
        {task.stimulus && <article className="exam-stimulus"><span>Текст к заданиям</span><p>{renderStimulus(task.stimulus, task.stimulusHighlights)}</p></article>}
        <h2>{task.prompt}</h2>
        {task.options && task.interaction === "exam-blank" && <ol className="exam-static-options">{task.options.map((option, optionIndex) => <li key={`${option}-${optionIndex}`}><span>{optionIndex + 1}</span><p>{option}</p></li>)}</ol>}
        {task.options && task.interaction !== "exam-blank" && <div className="exam-options">{task.options.map((option, optionIndex) => <button className={selected.includes(option) ? "selected" : ""} disabled={submitted} onClick={() => choose(option)} key={`${option}-${optionIndex}`}><span>{optionIndex + 1}</span>{option}</button>)}</div>}
        {task.responseInstruction && <p className="exam-response-instruction"><b>Как записать ответ:</b> {task.responseInstruction}</p>}
        {(task.interaction === "exam-blank" || task.kind === "text" || task.kind === "number") && <label className="exam-input"><span>Ответ для бланка</span><input disabled={submitted} value={written} onChange={(event) => setWritten(event.target.value)} placeholder={task.kind === "number" ? "Только число" : task.answerOrder === "fixed" ? "Порядок символов важен" : "Без пробелов, запятых и лишних знаков"} /></label>}
        {task.kind === "extended" && <section className={`writing-session ${isPaused ? "paused" : ""}`}>
          <div className="writing-session-head"><div><span>РАЗВЁРНУТАЯ РАБОТА</span><b>{isPaused ? "Работа на паузе" : "Время работы идёт"}</b></div><time>{formatClock(elapsedSeconds)}</time></div>
          <label className="exam-input"><span>Ваш текст</span><textarea disabled={submitted || isPaused} value={written} onChange={(event) => updateWritten(event.target.value)} placeholder={level === "oge" && currentLine === 1 ? "Сжатое изложение: микротемы → главное → связный текст" : "Тезис → примеры → объяснение → вывод"} /><small>{task.minWords ? `${wordCount} слов · минимум ${task.minWords} слов` : `${written.trim().length} знаков · минимум ${minimumLength} для отправки на проверку`}</small></label>
          {!submitted && <div className="writing-controls"><button className="button button-ghost" type="button" onClick={() => isPaused ? continueWork() : saveAndPause()}>{isPaused ? "Продолжить работу и аудио" : "Поставить работу и аудио на паузу"}</button><button className="button button-dark" type="button" onClick={saveAndExit}>{isPaused ? "Выйти к сохранённым работам" : "Сохранить и выйти"}</button></div>}
          {draftStatus && <p className="draft-status" role="status">{draftStatus}</p>}
        </section>}
        {!submitted ? <button className="button button-red" disabled={!hasAnswer || isPaused} onClick={submit}>Проверить решение</button> : <>
          <div className={`exam-solution ${result}`}><div className="solution-title"><span>{result === "correct" ? "Верно" : result === "review" ? "Принято на проверку" : "Есть ошибка"}</span><b>Разбор ответа</b></div><ol>{task.solution.map((step) => <li key={step}>{step}</li>)}</ol></div>
          <section className="verification-lanes" aria-label="Кто проверяет ответ">
            <article><span>АВТОПРОВЕРКА</span><b>Точные ответы</b><p>Сверяет ответ, тему и правило. Работает сразу и без ожидания преподавателя.</p></article>
            <article><span>НЕЙРОСЕТЬ</span><b>Свободное объяснение</b><p>После подключения защищённого AI-ключа разбирает ход мысли и предлагает подсказку. Сейчас в открытом демо используется проверенная база правил.</p></article>
            <article className={result === "review" ? "active" : ""}><span>УЧИТЕЛЬ</span><b>Сочинение и спорные места</b><p>Выставляет итог по критериям, проверяет низкую уверенность и объясняет, что изменить в следующей версии.</p></article>
          </section>
          {result === "incorrect" && <section className="remediation-panel" data-testid="inline-remediation">
            <div className="remediation-title"><span>Отработка слабого места</span><b>Не идём дальше, пока правило не закреплено</b></div>
            <div className="remediation-steps">
              <article><span>01</span><div><b>Короткая теория</b><p>{task.theory ?? `${currentRisk.intervention}. Сначала назовите проверяемый признак по теме «${task.topic ?? "текущий тип"}», затем снова решайте задачу.`}</p></div></article>
              <article><span>02</span><div><b>Почему возникла ошибка</b><p>{task.solution[0]}</p></div></article>
              <article><span>03</span><div><b>Сразу похожее задание</b><p>{mode === "route"
                ? `Ошибка сохранена в «Мои ошибки». Откроется серия задания № ${index + 1}: тот же экзаменационный тип, но другой авторский материал.`
                : "Ошибка сохранена в «Мои ошибки». Следующая попытка проверяет это же умение на другом материале."}</p><button className="button button-dark" onClick={practiceSimilar}>{mode === "route" ? `Отработать задание № ${index + 1} →` : "Отработать похожее →"}</button></div></article>
            </div>
          </section>}
          {result === "review" && <section className="review-next-card" data-testid="review-next-card"><span>ПОПЫТКА СОХРАНЕНА</span><b>{task.audioText ? "Изложение готово к проверке" : "Развёрнутый ответ готов к проверке"}</b><p>Платформа сохранила текст и время. Итог по критериям выставит преподаватель; сейчас можно продолжить эту же линию на новом материале.</p><button className="button button-dark" data-testid="next-reviewed-task" onClick={practiceSimilar}>{mode === "route" ? `Отрабатывать только задание № ${index + 1} →` : task.audioText ? "Следующий новый текст →" : "Следующее задание этого типа →"}</button></section>}
          {result === "correct" && <button className="button button-ghost next-similar" onClick={practiceSimilar}>{mode === "route" ? `Закрепить задание № ${index + 1} в серии →` : correctStreak >= 3 ? "Линия закреплена — контрольная попытка →" : "Закрепить ещё одним похожим →"}</button>}
        </>}
        <div className="exam-nav"><button disabled={index === 0} onClick={() => jump(index - 1)}>← Предыдущее</button><span>{index + 1} / {tasks.length}</span><button disabled={index === tasks.length - 1} onClick={() => jump(index + 1)}>Следующее →</button></div>
        {done === tasks.length && <div className="exam-complete exam-verdict" data-testid="exam-verdict"><div><span className="exam-label">{mode === "route" ? `Итог маршрута ${levelLabel}` : "Освоение типа"}</span><b>{isExtendedLine ? "Серия письменных работ завершена" : accuracy >= 80 ? "Можно переходить дальше" : "Нужна отработка слабых тем"}</b><strong>{isExtendedLine ? `${review} работ передано преподавателю` : `${accuracy}% автоматически проверяемых ответов верны`}</strong><span>{review ? `${review} развёрнутых ответов ожидают проверки преподавателя. ` : ""}Это учебная аналитика, а не официальный балл {levelLabel}.</span>{!isExtendedLine && <><p><b>Сильные темы:</b> {strongTopics.length ? strongTopics.slice(0, 3).join(", ") : "пока не выявлены"}.</p><p><b>Слабые темы:</b> {weakTopics.length ? weakTopics.slice(0, 3).join(", ") : "ошибок не выявлено"}.</p></>}</div><div className="verdict-actions"><Link className="button button-dark" href={lessonHref(subjectSlug, nextTopic)}>Открыть занятие →</Link><Link className="button button-ghost" href="/parent-report">Отчёт для родителя →</Link></div></div>}
      </section>
    </section>
  </main>;
}
