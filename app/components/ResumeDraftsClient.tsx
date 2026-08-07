"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { emptyLearningProgress, loadLearningProgress, type LearningProgress, type WritingDraft } from "../lib/learning-progress";

function clock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function practiceHref(draft: WritingDraft) {
  if (!draft.href) return "/practice";
  const url = new URL(draft.href, "https://ekzam.local");
  url.searchParams.set("mode", "training");
  return `${url.pathname}?${url.searchParams.toString()}`;
}

function taskNumber(draft: WritingDraft) {
  if (draft.href) return new URL(draft.href, "https://ekzam.local").searchParams.get("task") ?? "";
  return draft.label?.match(/(\d+)$/)?.[1] ?? "";
}

export function ResumeDraftsClient() {
  const [progress, setProgress] = useState<LearningProgress>(() => emptyLearningProgress());
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setProgress(loadLearningProgress(window.localStorage)));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const drafts = useMemo(() => Object.values(progress.drafts).sort((left, right) => right.savedAt.localeCompare(left.savedAt)), [progress]);

  return <main className="resume-page">
    <header className="report-topbar"><Link className="brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link><div><Link href="/practice">Практика</Link><Link href="/parent-report">Отчёт</Link></div></header>
    <section className="practice-hero"><span className="exam-label">Черновики</span><h1>Работа сохранена. Что делать дальше?</h1><p>Можно продолжить изложение или сочинение с сохранённого места либо открыть серию только этого номера — без полного варианта и перехода к другим заданиям.</p></section>
    <section className="resume-list">{drafts.length ? drafts.map((draft) => {
      const number = taskNumber(draft);
      return <article key={draft.taskId}><div><span>Сохранено {new Date(draft.savedAt).toLocaleString("ru-RU")}</span><h2>{draft.label ?? draft.taskId}</h2><p>{draft.text.slice(0, 180) || "Пустой черновик"}{draft.text.length > 180 ? "…" : ""}</p><small>{draft.text.trim().split(/\s+/).filter(Boolean).length} слов · время {clock(draft.elapsedSeconds)}</small></div><div className="resume-actions"><Link className="button button-red" href={draft.href ?? "/practice"}>Продолжить эту работу →</Link><Link className="button button-dark" href={practiceHref(draft)}>Отрабатывать только задание{number ? ` № ${number}` : ""} →</Link></div></article>;
    }) : <article className="report-empty"><h2>Сохранённых работ пока нет</h2><p>Откройте изложение или сочинение, начните писать и нажмите «Поставить на паузу».</p><Link className="button button-dark" href="/practice">Выбрать задание</Link></article>}</section>
  </main>;
}
