"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { examSubjects } from "../../knowledge-base/exams/exam-subjects";
import { getSubjectSchoolProfile } from "../../knowledge-base/curriculum/school-curriculum";

type ExamLevel = "oge" | "ege";
type ExamMode = "route" | "training" | "mistakes";

const modes: { id: ExamMode; title: string; text: string }[] = [
  { id: "route", title: "Полный вариант", text: "Все задания по порядку" },
  { id: "training", title: "Практика по номеру", text: "Один тип до закрепления" },
  { id: "mistakes", title: "Мои ошибки", text: "Только неверные ответы" },
];

export function ExamEntryClient() {
  const [level, setLevel] = useState<ExamLevel | null>(null);
  const [subject, setSubject] = useState("russian");
  const [mode, setMode] = useState<ExamMode>("route");
  const availableSubjects = useMemo(
    () => examSubjects.filter((item) => level === "ege" || getSubjectSchoolProfile(item.slug).ogeAvailable),
    [level],
  );
  const selectedSubject = availableSubjects.find((item) => item.slug === subject) ?? availableSubjects[0];
  const href = level
    ? `/exam?${new URLSearchParams({ level, subject: selectedSubject?.slug ?? "russian", mode, variant: "1" }).toString()}`
    : "#exam-start";

  function chooseLevel(next: ExamLevel) {
    setLevel(next);
    if (next === "oge" && !getSubjectSchoolProfile(subject).ogeAvailable) setSubject("russian");
  }

  return (
    <section className="exam-entry-card" id="exam-start" aria-labelledby="exam-entry-title">
      <div className="exam-entry-head">
        <span>Бесплатный старт</span>
        <b id="exam-entry-title">Что сдаёт ребёнок?</b>
        <small>Сначала выберите один формат. Задания не смешиваются.</small>
      </div>
      <div className="exam-level-cards" aria-label="Выбор экзамена">
        <button type="button" aria-pressed={level === "oge"} className={level === "oge" ? "active" : ""} onClick={() => chooseLevel("oge")}>
          <span>9 класс</span><strong>ОГЭ</strong><small>13 заданий · 235 минут</small>
        </button>
        <button type="button" aria-pressed={level === "ege"} className={level === "ege" ? "active" : ""} onClick={() => chooseLevel("ege")}>
          <span>11 класс</span><strong>ЕГЭ</strong><small>27 заданий · 210 минут</small>
        </button>
      </div>
      <div className={`exam-entry-next ${level ? "visible" : ""}`} aria-live="polite">
        {level ? (
          <>
            <label className="exam-entry-field">
              <span>Предмет</span>
              <select value={selectedSubject?.slug ?? "russian"} onChange={(event) => setSubject(event.target.value)}>
                {availableSubjects.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}
              </select>
            </label>
            <div className="exam-entry-modes" aria-label="Режим работы">
              {modes.map((item) => (
                <button type="button" aria-pressed={mode === item.id} className={mode === item.id ? "active" : ""} onClick={() => setMode(item.id)} key={item.id}>
                  <b>{item.title}</b><span>{item.text}</span>
                </button>
              ))}
            </div>
            <Link className="exam-entry-submit" href={href}>
              Открыть {level.toUpperCase()} · {selectedSubject?.shortName ?? "Русский"} <span>→</span>
            </Link>
          </>
        ) : <p>Нажмите «ОГЭ» или «ЕГЭ», чтобы выбрать предмет и режим.</p>}
      </div>
    </section>
  );
}
