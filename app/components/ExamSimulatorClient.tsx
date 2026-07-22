"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type ExamTask = {
  id: string;
  subject: string;
  number: string;
  kind: "single" | "multiple" | "text" | "number" | "extended";
  format: string;
  prompt: string;
  options?: string[];
  answer: string | string[];
  solution: string[];
};

const tasks: ExamTask[] = [
  {
    id: "rus-single", subject: "Русский язык", number: "Задание 4", kind: "single", format: "один ответ из четырёх", prompt: "В каком слове верно выделена буква, обозначающая ударный гласный звук?", options: ["красИвее", "звОнит", "тОрты", "бАловать"], answer: "красИвее", solution: ["Проверьте каждое слово по орфоэпической норме.", "Верно: красИвее. Нормы остальных слов: звонИт, тортЫ, баловАть."],
  },
  {
    id: "rus-multiple", subject: "Русский язык", number: "Задание 15", kind: "multiple", format: "несколько ответов", prompt: "Выберите все слова, в которых на месте пропуска пишется НН.", options: ["организова..ый", "кожа..ый", "време..ый", "ветре..ый", "стекля..ый"], answer: ["организова..ый", "време..ый", "стекля..ый"], solution: ["Организованный образовано от глагола совершенного вида и имеет суффикс -ованн-.", "Временный пишется с НН; стеклянный — слово-исключение.", "Кожаный и ветреный пишутся с одной Н."],
  },
  {
    id: "math-number", subject: "Математика · профиль", number: "Задание 1", kind: "number", format: "числовой ответ", prompt: "Решите уравнение 3x − 9 = 0. В бланк запишите только число.", answer: "3", solution: ["Перенесите −9 в правую часть: 3x = 9.", "Разделите обе части на 3: x = 3.", "В ответе указывается только число 3."],
  },
  {
    id: "history-sequence", subject: "История", number: "Задание 1", kind: "text", format: "последовательность цифр", prompt: "Расположите события в хронологическом порядке: 1) отмена крепостного права; 2) Ледовое побоище; 3) начало правления Петра I; 4) Куликовская битва. Запишите последовательность цифр без пробелов.", answer: "2431", solution: ["Ледовое побоище — 1242 год.", "Куликовская битва — 1380 год.", "Начало правления Петра I — 1682 год.", "Отмена крепостного права — 1861 год. Ответ: 2431."],
  },
  {
    id: "literature-extended", subject: "Литература", number: "Задание с развёрнутым ответом", kind: "extended", format: "ответ проверяет преподаватель", prompt: "Почему при анализе поступка героя недостаточно пересказать эпизод? Дайте связный ответ: тезис, конкретная деталь текста и вывод — не менее 80 знаков.", answer: "teacher-review", solution: ["Сначала сформулируйте тезис, который прямо отвечает на вопрос.", "Приведите конкретную деталь или поступок, не заменяя анализ пересказом.", "Объясните, что эта деталь доказывает, и верните вывод к исходному вопросу.", "Итоговый балл за развёрнутый ответ выставляет преподаватель по критериям."],
  },
];

function normal(value: string) { return value.trim().toLowerCase().replace(/ё/g, "е").replace(/\s+/g, ""); }

export function ExamSimulatorClient() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [written, setWritten] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, "correct" | "incorrect" | "review">>({});
  const task = tasks[index];
  const done = Object.keys(results).length;
  const correct = Object.values(results).filter((item) => item === "correct").length;
  const progress = useMemo(() => Math.round((done / tasks.length) * 100), [done]);

  function choose(value: string) {
    if (submitted) return;
    if (task.kind === "multiple") setSelected((items) => items.includes(value) ? items.filter((item) => item !== value) : [...items, value]);
    else setSelected([value]);
  }

  function submit() {
    let state: "correct" | "incorrect" | "review" = "incorrect";
    if (task.kind === "extended") state = written.trim().length >= 80 ? "review" : "incorrect";
    else if (Array.isArray(task.answer)) state = [...selected].sort().join("|") === [...task.answer].sort().join("|") ? "correct" : "incorrect";
    else if (task.kind === "single") state = selected[0] === task.answer ? "correct" : "incorrect";
    else state = normal(written) === normal(task.answer) ? "correct" : "incorrect";
    setResults((items) => ({ ...items, [task.id]: state }));
    setSubmitted(true);
  }

  function move(delta: number) {
    const next = Math.min(tasks.length - 1, Math.max(0, index + delta));
    setIndex(next); setSelected([]); setWritten(""); setSubmitted(false);
  }

  const hasAnswer = task.kind === "single" || task.kind === "multiple" ? selected.length > 0 : written.trim().length > 0;
  const result = results[task.id];

  return <main className="exam-simulator">
    <header className="exam-sim-top"><Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link><div><b>Тренажёр форматов</b><span>Авторские задания по структуре ФИПИ-2026</span></div><Link className="button button-ghost button-small" href="/dashboard">В кабинет</Link></header>
    <section className="exam-workspace">
      <aside className="exam-map">
        <span className="exam-label">Мини-вариант</span><h1>Не угадывать.<br />Решать как на ЕГЭ.</h1>
        <div className="exam-progress"><span style={{ width: `${progress}%` }} /></div><p>Выполнено {done} из {tasks.length} · верно {correct}</p>
        <nav>{tasks.map((item, itemIndex) => <button className={`${itemIndex === index ? "active" : ""} ${results[item.id] ?? ""}`} onClick={() => { setIndex(itemIndex); setSelected([]); setWritten(""); setSubmitted(false); }} key={item.id}><span>{itemIndex + 1}</span><div><b>{item.subject}</b><small>{item.format}</small></div></button>)}</nav>
        <a className="fipi-link" href="https://fipi.ru/ege/demoversii-specifikacii-kodifikatory" target="_blank" rel="noreferrer">Структура и демоверсии ФИПИ ↗</a>
      </aside>
      <section className="exam-paper">
        <div className="exam-paper-head"><div><span>{task.subject}</span><b>{task.number}</b></div><em>{task.format}</em></div>
        <h2>{task.prompt}</h2>
        {task.options && <div className="exam-options">{task.options.map((option, optionIndex) => <button className={selected.includes(option) ? "selected" : ""} disabled={submitted} onClick={() => choose(option)} key={option}><span>{optionIndex + 1}</span>{option}</button>)}</div>}
        {(task.kind === "text" || task.kind === "number") && <label className="exam-input"><span>Ответ для бланка</span><input disabled={submitted} value={written} onChange={(event) => setWritten(event.target.value)} placeholder={task.kind === "number" ? "Только число" : "Без пробелов и знаков"} /></label>}
        {task.kind === "extended" && <label className="exam-input"><span>Развёрнутый ответ</span><textarea disabled={submitted} value={written} onChange={(event) => setWritten(event.target.value)} placeholder="Тезис → пример из текста → объяснение → вывод" /><small>{written.trim().length} знаков · минимум 80 для отправки преподавателю</small></label>}
        {!submitted ? <button className="button button-red" disabled={!hasAnswer} onClick={submit}>Проверить решение</button> : <div className={`exam-solution ${result}`}><div className="solution-title"><span>{result === "correct" ? "Верно" : result === "review" ? "Принято на проверку" : "Есть ошибка"}</span><b>Полное решение</b></div><ol>{task.solution.map((step) => <li key={step}>{step}</li>)}</ol></div>}
        <div className="exam-nav"><button disabled={index === 0} onClick={() => move(-1)}>← Предыдущее</button><span>{index + 1} / {tasks.length}</span><button disabled={index === tasks.length - 1} onClick={() => move(1)}>Следующее →</button></div>
      </section>
    </section>
  </main>;
}
