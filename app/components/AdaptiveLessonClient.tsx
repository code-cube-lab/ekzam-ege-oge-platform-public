"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getExamSubject } from "../../knowledge-base/exams/exam-subjects";
import { officialFipiLinks } from "../../knowledge-base/exams/official-variants";
import { getTrainingVariantTasks, type ExamTask } from "../../knowledge-base/tasks/exam-demo-bank";

function normal(value: string) {
  return value.trim().toLowerCase().replace(/ё/g, "е").replace(/,/g, ".").replace(/\s+/g, "");
}

const topicAliases: Record<string, string[]> = {
  "работа с текстом": ["выразительность речи", "синтаксис"],
  "анализ текста": ["выразительность речи", "синтаксис"],
  "языковые нормы": ["грамматические нормы", "синтаксические нормы"],
  "задачи высокой сложности": ["алгебра", "геометрия"],
  "развёрнутые биологические задачи": ["генетика", "экология"],
  "аргументация и развёрнутый ответ": ["аргументация"],
  "право и развёрнутый ответ": ["право"],
  "расчёты и развёрнутый ответ": ["расчёты"],
  "сопоставительный анализ": ["анализ текста"],
  "грамматика и лексика": ["лексика", "грамматика"],
  "иероглифика и лексика": ["иероглифика"],
};

export function AdaptiveLessonClient({ subjectSlug, topic, variantId }: { subjectSlug: string; topic: string; variantId: number }) {
  const subject = getExamSubject(subjectSlug);
  const tasks = useMemo(() => getTrainingVariantTasks(subject.slug, subject.fullTaskCount, subject.focus, variantId), [subject, variantId]);
  const nextVariant = variantId >= 3 ? 1 : variantId + 1;
  const nextTasks = useMemo(() => getTrainingVariantTasks(subject.slug, subject.fullTaskCount, subject.focus, nextVariant), [subject, nextVariant]);
  const acceptedTopics = [topic, ...(topicAliases[topic] ?? [])];
  const related = [...tasks, ...nextTasks].filter((item) => acceptedTopics.some((accepted) => item.topic === accepted || item.topic?.includes(accepted) || accepted.includes(item.topic ?? "")));
  const hasExactPractice = related.length > 0;
  const example = related[0] ?? tasks[0];
  const practice: ExamTask = related.find((item) => item.id !== example.id) ?? tasks.find((item) => item.id !== example.id) ?? example;
  const [selected, setSelected] = useState<string[]>([]);
  const [written, setWritten] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const minimumLength = subject.slug === "chinese" ? 40 : 80;

  function choose(value: string) {
    if (submitted) return;
    if (practice.kind === "multiple") setSelected((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
    else setSelected([value]);
  }

  function submit() {
    if (practice.kind === "extended") setCorrect(written.trim().length >= minimumLength);
    else if (Array.isArray(practice.answer)) setCorrect([...selected].sort().join("|") === [...practice.answer].sort().join("|"));
    else if (practice.kind === "single") setCorrect(selected[0] === practice.answer);
    else setCorrect(normal(written) === normal(practice.answer));
    setSubmitted(true);
  }

  function retry() {
    setSelected([]);
    setWritten("");
    setSubmitted(false);
    setCorrect(false);
  }

  const hasAnswer = practice.kind === "single" || practice.kind === "multiple" ? selected.length > 0 : written.trim().length > 0;

  return <main className="adaptive-lesson">
    <header className="lesson-top">
      <Link className="brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
      <div><span>Персональное занятие</span><b>{subject.name}</b></div>
      <Link className="button button-ghost button-small" href={`/exam?subject=${subject.slug}`}>Вернуться к варианту</Link>
    </header>

    <section className="adaptive-hero">
      <div><span className="section-kicker">Построено по результату ученика</span><h1>Укрепляем тему «{topic}»</h1><p>Система выбрала тему, где была ошибка, показывает способ решения и сразу даёт новую самостоятельную попытку.</p></div>
      <aside><span>Маршрут на сегодня</span><b>12–18 минут</b><p>Разобрать ошибку → решить похожее → перейти к новому варианту</p></aside>
    </section>

    <section className="adaptive-steps">
      <article><span>01 · Диагноз</span><h2>Что именно проседает</h2><p>Предмет: <b>{subject.name}</b>. Тема: <b>{topic}</b>. Основание — неверный ответ в пройденном варианте, а не общий случайный урок.</p>{!hasExactPractice && <p className="adaptive-caution">В текущем авторском банке пока нет точной интерактивной пары по этой теме. Ниже — смежная проверка по предмету; точные задания берите из открытого банка ФИПИ.</p>}</article>
      <article><span>02 · Правило</span><h2>Короткий разбор</h2><ol>{example.solution.map((step) => <li key={step}>{step}</li>)}</ol><div className="adaptive-example"><b>Разобранный пример</b><p>{example.prompt}</p></div></article>
      <article className="adaptive-practice"><span>03 · Новая попытка</span><h2>{practice.prompt}</h2>
        {practice.options && <div className="answer-list">{practice.options.map((option, optionIndex) => <button key={`${option}-${optionIndex}`} className={`answer ${selected.includes(option) ? "selected" : ""}`} disabled={submitted} onClick={() => choose(option)}>{optionIndex + 1}. {option}</button>)}</div>}
        {(practice.kind === "text" || practice.kind === "number") && <label className="exam-input"><span>Ответ</span><input disabled={submitted} value={written} onChange={(event) => setWritten(event.target.value)} placeholder={practice.kind === "number" ? "Только число" : "Без лишних знаков"} /></label>}
        {practice.kind === "extended" && <label className="exam-input"><span>Развёрнутый ответ</span><textarea disabled={submitted} value={written} onChange={(event) => setWritten(event.target.value)} /><small>{written.trim().length} знаков</small></label>}
        {!submitted && <button className="button button-red" disabled={!hasAnswer} onClick={submit}>Проверить попытку</button>}
      </article>
      <article className={`adaptive-feedback ${submitted ? correct ? "correct" : "incorrect" : ""}`}><span>04 · Обратная связь</span><h2>{!submitted ? "Сначала решите сами" : correct ? "Тема закрепляется" : "Нужна ещё одна попытка"}</h2>
        {!submitted ? <p>Объяснение скрыто до ответа. Так диагностика не превращается в угадывание.</p> : <><ol>{practice.solution.map((step) => <li key={step}>{step}</li>)}</ol><div className="adaptive-actions"><button className="button button-ghost" onClick={retry}>Повторить</button><Link className="button button-dark" href={`/exam?subject=${subject.slug}&variant=${nextVariant}`}>Следующий вариант →</Link></div></>}
      </article>
    </section>

    <section className="adaptive-source"><div><span className="section-kicker">Официальная опора</span><h2>Сверяйтесь с первоисточником</h2><p>Задание выше — авторская тренировка. Официальные КИМ и открытый банк остаются на сайте ФИПИ.</p></div><div><a href={officialFipiLinks.openBank} target="_blank" rel="noreferrer">Открытый банк ФИПИ ↗</a><a href={officialFipiLinks.specifications} target="_blank" rel="noreferrer">Спецификации ЕГЭ-2026 ↗</a></div></section>
  </main>;
}
