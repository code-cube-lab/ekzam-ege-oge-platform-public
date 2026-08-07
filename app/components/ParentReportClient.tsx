"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  emptyLearningProgress,
  loadLearningProgress,
  summarizeLearningProgress,
  type LearningProgress,
} from "../lib/learning-progress";

function subjectLabel(slug: string) {
  const labels: Record<string, string> = {
    russian: "Русский язык",
    math: "Математика",
    informatics: "Информатика",
    physics: "Физика",
    chemistry: "Химия",
    biology: "Биология",
    history: "История",
    social: "Обществознание",
    geography: "География",
    literature: "Литература",
    english: "Английский язык",
    german: "Немецкий язык",
    french: "Французский язык",
    spanish: "Испанский язык",
    chinese: "Китайский язык",
  };
  return labels[slug] ?? slug;
}

export function ParentReportClient() {
  const [progress, setProgress] = useState<LearningProgress>(() => emptyLearningProgress());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setProgress(loadLearningProgress(window.localStorage)));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const report = useMemo(() => summarizeLearningProgress(progress), [progress]);
  const latestWeakAttempt = report.weaknesses[0]
    ? [...progress.attempts].reverse().find((item) => item.topic === report.weaknesses[0].topic)
    : undefined;
  const practiceHref = latestWeakAttempt
    ? `/exam?${new URLSearchParams({
        level: latestWeakAttempt.level,
        subject: latestWeakAttempt.subject,
        mode: "training",
        task: latestWeakAttempt.taskNumber.replace(/\D/g, "") || "1",
      }).toString()}`
    : "/practice";

  async function copyReport() {
    const lines = [
      "ЭКЗАМ — отчёт о подготовке",
      `Выполнено попыток: ${report.attempts}`,
      `Точность автопроверки: ${report.accuracy}%`,
      `Сильные темы: ${report.strengths.map((item) => item.topic).join(", ") || "пока не выявлены"}`,
      `Слабые темы: ${report.weaknesses.map((item) => `${item.topic} (${item.mastery}%)`).join(", ") || "пока не выявлены"}`,
      `Рекомендация: ${report.recommendation}`,
      "Развёрнутые работы требуют проверки преподавателя.",
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
  }

  return <main className="parent-report-page">
    <header className="report-topbar"><Link className="brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link><div><Link href="/practice">Выбрать задание</Link><Link href="/exam">Пробный вариант</Link></div></header>

    <section className="report-hero">
      <div><span className="exam-label">Отчёт родителю</span><h1>Что ребёнок уже умеет и что делать дальше</h1><p>Отчёт строится по фактическим ответам на этом устройстве. Он показывает не «оценку вообще», а конкретные темы, где нужна следующая отработка.</p></div>
      <div className="report-score"><span>Точность автопроверки</span><strong>{report.accuracy}%</strong><small>{report.automaticAttempts} ответов проверено автоматически</small></div>
    </section>

    {report.attempts === 0 ? <section className="report-empty"><h2>Пока нет выполненных заданий</h2><p>Ребёнок может начать с полного пробника или выбрать один номер и решить серию похожих заданий.</p><Link className="button button-red" href="/practice">Начать практику →</Link></section> : <>
      <section className="report-metrics">
        <article><span>Попыток</span><b>{report.attempts}</b><small>включая повторные</small></article>
        <article><span>Учебный опыт</span><b>{report.xp} XP</b><small>за усилие и верные ответы</small></article>
        <article><span>Слабых тем</span><b>{report.weaknesses.length}</b><small>ниже 80% освоения</small></article>
        <article><span>На проверке</span><b>{report.awaitingReview.reduce((sum, item) => sum + item.review, 0)}</b><small>сочинения и развёрнутые ответы</small></article>
      </section>

      <section className="report-columns">
        <article className="report-panel weakness"><span className="exam-label">Сначала подтянуть</span><h2>Слабые стороны</h2>{report.weaknesses.length ? <div className="report-topic-list">{report.weaknesses.slice(0, 6).map((item) => <div key={item.topic}><div><b>{item.topic}</b><span>{item.mastery}% освоения</span></div><progress max="100" value={item.mastery} /><p>{item.nextStep}</p></div>)}</div> : <p>Повторяющихся ошибок пока не обнаружено.</p>}</article>
        <article className="report-panel strength"><span className="exam-label">Можно опираться</span><h2>Сильные стороны</h2>{report.strengths.length ? <div className="report-topic-list">{report.strengths.slice(0, 6).map((item) => <div key={item.topic}><div><b>{item.topic}</b><span>{item.mastery}% освоения</span></div><progress max="100" value={item.mastery} /><p>{item.correct} верных ответов. Контрольный повтор через 2–3 дня.</p></div>)}</div> : <p>Для подтверждения сильной темы нужны хотя бы два верных ответа.</p>}</article>
      </section>

      <section className="parent-next-step"><div><span className="exam-label">План на ближайшее занятие</span><h2>{report.recommendation}</h2><p>{latestWeakAttempt ? `${latestWeakAttempt.level.toUpperCase()} · ${subjectLabel(latestWeakAttempt.subject)} · ${latestWeakAttempt.taskNumber}` : "Выберите экзамен и предмет, чтобы начать."}</p></div><Link className="button button-red" href={practiceHref}>Начать отработку →</Link></section>
    </>}

    <section className="report-actions"><button className="button button-dark" type="button" onClick={copyReport}>{copied ? "Отчёт скопирован" : "Скопировать для родителя"}</button><button className="button button-ghost" type="button" onClick={() => window.print()}>Распечатать / сохранить PDF</button></section>
    <p className="report-disclaimer">Это учебная аналитика, а не официальный прогноз балла. Данные открытого режима хранятся только в браузере этого устройства; синхронизация с родительским кабинетом требует входа и отдельного согласия.</p>
  </main>;
}
