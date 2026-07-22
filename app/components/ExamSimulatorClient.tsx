"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { examSubjects, getExamSubject } from "../../knowledge-base/exams/exam-subjects";
import { getDemoTasks } from "../../knowledge-base/tasks/exam-demo-bank";

type ResultState = "correct" | "incorrect" | "review";

function normal(value: string) {
  return value.trim().toLowerCase().replace(/ё/g, "е").replace(/,/g, ".").replace(/\s+/g, "");
}

export function ExamSimulatorClient({ initialSubject = "russian" }: { initialSubject?: string }) {
  const [subjectSlug, setSubjectSlug] = useState(() => getExamSubject(initialSubject).slug);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [written, setWritten] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, ResultState>>({});
  const subject = getExamSubject(subjectSlug);
  const tasks = useMemo(() => getDemoTasks(subjectSlug), [subjectSlug]);
  const task = tasks[index];
  const subjectResults = tasks.map((item) => results[item.id]).filter(Boolean);
  const done = subjectResults.length;
  const correct = subjectResults.filter((item) => item === "correct").length;
  const progress = Math.round((done / tasks.length) * 100);
  const minimumLength = task.id === "zh-10" ? 40 : 80;

  function resetAnswer() {
    setSelected([]);
    setWritten("");
    setSubmitted(false);
  }

  function selectSubject(slug: string) {
    setSubjectSlug(slug);
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

  function submit() {
    let state: ResultState = "incorrect";
    if (task.kind === "extended") state = written.trim().length >= minimumLength ? "review" : "incorrect";
    else if (Array.isArray(task.answer)) state = [...selected].sort().join("|") === [...task.answer].sort().join("|") ? "correct" : "incorrect";
    else if (task.kind === "single") state = selected[0] === task.answer ? "correct" : "incorrect";
    else state = normal(written) === normal(task.answer) ? "correct" : "incorrect";
    setResults((items) => ({ ...items, [task.id]: state }));
    setSubmitted(true);
  }

  function move(delta: number) {
    setIndex((current) => Math.min(tasks.length - 1, Math.max(0, current + delta)));
    resetAnswer();
  }

  function jump(itemIndex: number) {
    setIndex(itemIndex);
    resetAnswer();
  }

  const hasAnswer = task.kind === "single" || task.kind === "multiple" ? selected.length > 0 : written.trim().length > 0;
  const result = results[task.id];

  return <main className="exam-simulator">
    <header className="exam-sim-top">
      <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
      <div><b>Стартовая диагностика</b><span>10 заданий по одному выбранному предмету</span></div>
      <Link className="button button-ghost button-small" href="/dashboard">Мой прогресс</Link>
    </header>

    <section className="exam-subject-picker" aria-label="Выбор предмета">
      <div><span className="exam-label">Сначала выберите предмет</span><b>Все 15 предметов ЕГЭ</b></div>
      <div className="exam-subject-scroll">
        {examSubjects.map((item) => <button className={item.slug === subjectSlug ? "active" : ""} onClick={() => selectSubject(item.slug)} key={item.slug}>
          <span>{item.shortName}</span><small>{item.exam}</small>
        </button>)}
      </div>
    </section>

    <section className="exam-workspace">
      <aside className="exam-map">
        <span className="exam-label light">{subject.exam}</span>
        <h1>{subject.name}</h1>
        <p className="exam-map-intro">Вопросы больше не перемешаны: весь стартовый вариант относится только к выбранному предмету.</p>
        <div className="exam-progress"><span style={{ width: `${progress}%` }} /></div>
        <p>Выполнено {done} из {tasks.length} · верно {correct}</p>
        <nav aria-label={`Задания: ${subject.name}`}>
          {tasks.map((item, itemIndex) => <button className={`${itemIndex === index ? "active" : ""} ${results[item.id] ?? ""}`} onClick={() => jump(itemIndex)} key={item.id}>
            <span>{itemIndex + 1}</span><div><b>{item.number}</b><small>{item.format}</small></div>
          </button>)}
        </nav>
        <p className="exam-map-note"><b>Почему 10?</b> Это быстрый срез на 15–20 минут. Он не выдаётся за полный КИМ: полный вариант проходит отдельно по структуре ФИПИ.</p>
        <a className="fipi-link" href="https://fipi.ru/ege/demoversii-specifikacii-kodifikatory" target="_blank" rel="noreferrer">Демоверсии и спецификации ФИПИ ↗</a>
      </aside>

      <section className="exam-paper">
        <div className="exam-paper-head"><div><span>{task.subject}</span><b>{task.number} из {tasks.length}</b></div><em>{task.format}</em></div>
        <h2>{task.prompt}</h2>
        {task.options && <div className="exam-options">{task.options.map((option, optionIndex) => <button className={selected.includes(option) ? "selected" : ""} disabled={submitted} onClick={() => choose(option)} key={option}><span>{optionIndex + 1}</span>{option}</button>)}</div>}
        {(task.kind === "text" || task.kind === "number") && <label className="exam-input"><span>Ответ для бланка</span><input disabled={submitted} value={written} onChange={(event) => setWritten(event.target.value)} placeholder={task.kind === "number" ? "Только число" : "Без лишних знаков"} /></label>}
        {task.kind === "extended" && <label className="exam-input"><span>Развёрнутый ответ</span><textarea disabled={submitted} value={written} onChange={(event) => setWritten(event.target.value)} placeholder="Тезис → пример → объяснение → вывод" /><small>{written.trim().length} знаков · минимум {minimumLength} для отправки на проверку</small></label>}
        {!submitted ? <button className="button button-red" disabled={!hasAnswer} onClick={submit}>Проверить решение</button> : <div className={`exam-solution ${result}`}><div className="solution-title"><span>{result === "correct" ? "Верно" : result === "review" ? "Принято на проверку" : "Есть ошибка"}</span><b>Разбор ответа</b></div><ol>{task.solution.map((step) => <li key={step}>{step}</li>)}</ol></div>}
        <div className="exam-nav"><button disabled={index === 0} onClick={() => move(-1)}>← Предыдущее</button><span>{index + 1} / {tasks.length}</span><button disabled={index === tasks.length - 1} onClick={() => move(1)}>Следующее →</button></div>
        {done === tasks.length && <div className="exam-complete"><div><b>Стартовый срез завершён</b><span>{correct} правильных из {tasks.length}. В кабинете сохраним результат и соберём план по слабым темам.</span></div><Link className="button button-dark" href="/dashboard">Получить план</Link></div>}
      </section>
    </section>
  </main>;
}
