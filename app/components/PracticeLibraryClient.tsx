"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { examSubjects, getExamSubject } from "../../knowledge-base/exams/exam-subjects";
import { getExamRouteValidation } from "../../knowledge-base/exams/exam-validation";
import { getSubjectSchoolProfile } from "../../knowledge-base/curriculum/school-curriculum";

type ExamLevel = "oge" | "ege";

export function PracticeLibraryClient() {
  const [level, setLevel] = useState<ExamLevel>("ege");
  const [subjectSlug, setSubjectSlug] = useState("russian");
  const subject = getExamSubject(subjectSlug);
  const validation = getExamRouteValidation(level, subject.slug);
  const count = level === "oge" ? subject.ogeTaskCount ?? 0 : subject.fullTaskCount;
  const availableSubjects = useMemo(
    () => examSubjects.filter((item) => level === "ege" || getSubjectSchoolProfile(item.slug).ogeAvailable),
    [level],
  );

  function selectLevel(next: ExamLevel) {
    setLevel(next);
    if (next === "oge" && !getSubjectSchoolProfile(subjectSlug).ogeAvailable) setSubjectSlug("russian");
  }

  return <main className="practice-library-page">
    <header className="report-topbar"><Link className="brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link><div><Link href="/parent-report">Отчёт родителю</Link><Link href="/telegram">Mini App</Link></div></header>
    <section className="practice-hero"><span className="exam-label">Тренажёр по номеру</span><h1>Не весь вариант. Одно слабое задание — до уверенного решения.</h1><p>Выберите экзамен, предмет и номер. Внутри будет серия разных авторских условий, правило после ошибки, разбор и цель «три верных подряд».</p></section>

    <section className="practice-step"><div><span>01</span><h2>Экзамен</h2></div><div className="practice-level-buttons"><button className={level === "oge" ? "active" : ""} onClick={() => selectLevel("oge")}><b>ОГЭ</b><small>9 класс</small></button><button className={level === "ege" ? "active" : ""} onClick={() => selectLevel("ege")}><b>ЕГЭ</b><small>11 класс</small></button></div></section>

    <section className="practice-step"><div><span>02</span><h2>Предмет</h2></div><div className="practice-subject-grid">{availableSubjects.map((item) => {
      const itemValidation = getExamRouteValidation(level, item.slug);
      return <button key={item.slug} className={`${subjectSlug === item.slug ? "active" : ""} ${itemValidation.status === "blocked" ? "blocked" : ""}`} onClick={() => setSubjectSlug(item.slug)}><b>{item.shortName}</b><small>{itemValidation.status === "preview-ready" ? "тренажёр открыт" : "предметная проверка"}</small></button>;
    })}</div></section>

    <section className="practice-step practice-lines"><div><span>03</span><h2>Номер задания</h2></div>{validation.status === "preview-ready" ? <>
      <div className="practice-line-grid">{Array.from({ length: count }, (_, index) => index + 1).map((line) => {
        const isExposition = level === "oge" && subjectSlug === "russian" && line === 1;
        return <Link key={line} href={`/exam?${new URLSearchParams({ level, subject: subjectSlug, mode: "training", task: String(line) }).toString()}`}><b>{line}</b><span>{isExposition ? "12 разных текстов" : "12 попыток"}</span><small>{isExposition ? "слушать и писать →" : "открыть →"}</small></Link>;
      })}</div>
      <div className="practice-route-actions"><Link className="button button-dark" href={`/exam?${new URLSearchParams({ level, subject: subjectSlug, mode: "route", variant: "1" }).toString()}`}>Решить полный вариант</Link><Link className="button button-ghost" href={`/exam?${new URLSearchParams({ level, subject: subjectSlug, mode: "mistakes" }).toString()}`}>Открыть мои ошибки</Link></div>
    </> : <div className="practice-editor-gate"><span>Банк не выдаётся за готовый</span><h3>{subject.name} проходит предметную проверку</h3><p>{validation.reason}</p><ul>{validation.requirements.map((item) => <li key={item}>{item}</li>)}</ul><a href={validation.sourceUrl} target="_blank" rel="noreferrer">Документы ФИПИ ↗</a></div>}</section>
  </main>;
}
