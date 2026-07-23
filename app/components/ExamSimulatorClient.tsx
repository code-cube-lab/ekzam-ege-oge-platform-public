"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { examSubjects, getExamSubject } from "../../knowledge-base/exams/exam-subjects";
import { getOfficialTaskTopic, getOfficialVariantSource, officialFipiLinks } from "../../knowledge-base/exams/official-variants";
import { getTrainingVariantTasks, type ExamTask } from "../../knowledge-base/tasks/exam-demo-bank";
import {
  analyzeTaskResults,
  getRussianAuthorBankSize,
  getRussianFamilyTasks,
  getRussianTaskFamily,
  russianTaskFamilies,
} from "../../knowledge-base/tasks/variant-engine.js";

type ResultState = "correct" | "incorrect" | "review";
type ExamMode = "training" | "official";

function normal(value: string) {
  return value.trim().toLowerCase().replace(/ё/g, "е").replace(/,/g, ".").replace(/\s+/g, "");
}

function lessonHref(subject: string, topic: string) {
  return `/learn?${new URLSearchParams({ subject, topic, variant: "1" }).toString()}`;
}

function resultLabel(state?: ResultState) {
  if (state === "correct") return "Верно";
  if (state === "incorrect") return "Ошибка";
  if (state === "review") return "Нужна проверка";
  return "Не отмечено";
}

type Props = {
  initialSubject?: string;
  initialFamily?: string;
  initialCount?: number;
};

export function ExamSimulatorClient({
  initialSubject = "russian",
  initialFamily = "stress",
  initialCount = 0,
}: Props) {
  const [subjectSlug, setSubjectSlug] = useState(() => getExamSubject(initialSubject).slug);
  const [mode, setMode] = useState<ExamMode>("training");
  const [familyId, setFamilyId] = useState(() => getRussianTaskFamily(initialFamily).id);
  const [assignmentCount] = useState(() => Math.max(0, initialCount));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [written, setWritten] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, ResultState>>({});
  const subject = getExamSubject(subjectSlug);
  const source = getOfficialVariantSource(subjectSlug);
  const family = getRussianTaskFamily(familyId);
  const authorBankSize = getRussianAuthorBankSize();
  const tasks = useMemo(() => {
    if (subjectSlug === "russian") return getRussianFamilyTasks(familyId, assignmentCount || undefined) as ExamTask[];
    const base = getTrainingVariantTasks(subjectSlug, subject.fullTaskCount, subject.focus, 1);
    return assignmentCount ? base.slice(0, assignmentCount) : base;
  }, [assignmentCount, familyId, subject.focus, subject.fullTaskCount, subjectSlug]);
  const task: ExamTask = tasks[index] ?? tasks[0];
  const subjectResults = tasks.map((item) => results[item.id]).filter(Boolean);
  const done = subjectResults.length;
  const correct = subjectResults.filter((item) => item === "correct").length;
  const review = subjectResults.filter((item) => item === "review").length;
  const progress = Math.round((done / Math.max(1, tasks.length)) * 100);
  const autoChecked = Math.max(1, done - review);
  const accuracy = Math.round((correct / autoChecked) * 100);
  const analysis = analyzeTaskResults(tasks, results);
  const weakTopics = analysis.weaknesses as string[];
  const strongTopics = analysis.strengths as string[];
  const nextTopic = weakTopics[0] ?? task?.topic ?? subject.focus[0] ?? "базовая подготовка";
  const minimumLength = task?.id.startsWith("chinese") ? 40 : 80;

  const officialTasks = useMemo(() => Array.from({ length: subject.fullTaskCount }, (_, taskIndex) => ({
    id: `${subject.slug}-official-2026-${taskIndex + 1}`,
    number: taskIndex + 1,
    topic: getOfficialTaskTopic(subject.slug, taskIndex + 1),
  })), [subject]);
  const officialDone = officialTasks.filter((item) => results[item.id]).length;
  const officialCorrect = officialTasks.filter((item) => results[item.id] === "correct").length;
  const officialIncorrect = officialTasks.filter((item) => results[item.id] === "incorrect").length;
  const officialReview = officialTasks.filter((item) => results[item.id] === "review").length;
  const officialWeak = [...new Set(officialTasks.filter((item) => results[item.id] === "incorrect").map((item) => item.topic))];
  const officialStrong = [...new Set(officialTasks.filter((item) => results[item.id] === "correct").map((item) => item.topic))];
  const officialNextTopic = officialWeak[0] ?? subject.focus[0] ?? "базовая подготовка";

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

  function selectMode(next: ExamMode) {
    setMode(next);
    setIndex(0);
    resetAnswer();
  }

  function selectFamily(next: string) {
    setFamilyId(next);
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

  function practiceSimilar() {
    const nextIndex = index < tasks.length - 1 ? index + 1 : 0;
    setIndex(nextIndex);
    resetAnswer();
  }

  function cycleOfficial(id: string) {
    setResults((current) => {
      const next = { ...current };
      if (!next[id]) next[id] = "correct";
      else if (next[id] === "correct") next[id] = "incorrect";
      else if (next[id] === "incorrect") next[id] = "review";
      else delete next[id];
      return next;
    });
  }

  const hasAnswer = task && (task.kind === "single" || task.kind === "multiple" ? selected.length > 0 : written.trim().length > 0);
  const result = task ? results[task.id] : undefined;

  return <main className="exam-simulator">
    <header className="exam-sim-top">
      <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
      <div><b>Тренажёр по типам заданий</b><span>Ошибка → правило → похожая задача → закрепление</span></div>
      <Link className="button button-ghost button-small" href="/for-teachers">Для педагогов</Link>
    </header>

    <section className="exam-subject-picker" aria-label="Выбор предмета">
      <div><span className="exam-label">Выберите предмет</span><b>Все 15 предметов ЕГЭ</b></div>
      <div className="exam-subject-scroll">
        {examSubjects.map((item) => <button className={item.slug === subjectSlug ? "active" : ""} onClick={() => selectSubject(item.slug)} key={item.slug}>
          <span>{item.shortName}</span><small>{item.exam}</small>
        </button>)}
      </div>
    </section>

    <section className="exam-mode-panel">
      <div className="exam-mode-tabs" aria-label="Режим работы">
        <button className={mode === "training" ? "active" : ""} onClick={() => selectMode("training")}><b>Практика по типу</b><span>Не три варианта: серия одного умения до закрепления</span></button>
        <button className={mode === "official" ? "active" : ""} onClick={() => selectMode("official")}><b>Открытый материал ФИПИ</b><span>Скачать и занести результат по каждому номеру</span></button>
      </div>
      {mode === "training" && subjectSlug === "russian" && <div className="family-bank">
        <div className="family-bank-head"><div><span className="exam-label">Банк по линиям ЕГЭ-2026</span><b>{authorBankSize} авторских заданий · {russianTaskFamilies.length} типов</b></div><small>Без копирования закрытых КИМ. Основа: спецификация, навигатор и методические рекомендации ФИПИ.</small></div>
        <div className="family-tabs" aria-label="Типы заданий русского языка">
          {russianTaskFamilies.map((item) => <button key={item.id} className={familyId === item.id ? "active" : ""} onClick={() => selectFamily(item.id)}>
            <span>№ {item.egeNumber}</span><b>{item.title}</b><small>{item.count} заданий</small>
          </button>)}
        </div>
      </div>}
      {mode === "training" && subjectSlug !== "russian" && <div className="subject-bank-note"><b>{subject.name}: стартовый банк</b><span>Сейчас доступен проверочный набор и полный официальный трекер. Большие банки по типам подключаются предметными редакторами по той же модели, что русский язык.</span></div>}
    </section>

    {mode === "official" ? <section className="official-workspace">
      <div className="official-start">
        <span className="exam-label">Открытые материалы · ФИПИ</span>
        <h1>{subject.name}: полный трекер</h1>
        <p>Скачайте опубликованный ФИПИ комплект, решите задания и сверьтесь с ответами. Затем отметьте результат каждого номера: один клик — верно, второй — ошибка, третий — нужна проверка.</p>
        <div className="official-actions">
          <a className="button button-red" href={source.downloadUrl} target="_blank" rel="noreferrer">Открыть комплект ФИПИ ↗</a>
          <a className="button button-ghost" href={officialFipiLinks.openVariants} target="_blank" rel="noreferrer">Проверить страницу источника</a>
        </div>
        <small>Платформа не выдаёт авторские упражнения за реальные экзаменационные КИМ и не использует утечки.</small>
      </div>
      <div className="official-tracker">
        <div className="official-tracker-head"><div><span className="exam-label">Лист результата</span><h2>{officialDone} из {officialTasks.length} отмечено</h2></div><div className="official-legend"><span className="correct">верно</span><span className="incorrect">ошибка</span><span className="review">проверка</span></div></div>
        <div className="official-task-grid">
          {officialTasks.map((item) => <button key={item.id} className={results[item.id] ?? ""} onClick={() => cycleOfficial(item.id)} aria-label={`Задание ${item.number}: ${resultLabel(results[item.id])}`}><b>{item.number}</b><span>{item.topic}</span><small>{resultLabel(results[item.id])}</small></button>)}
        </div>
        {officialDone > 0 && <div className="official-analysis">
          <div><span>Верно</span><b>{officialCorrect}</b></div><div><span>Ошибки</span><b>{officialIncorrect}</b></div><div><span>На проверке</span><b>{officialReview}</b></div>
          <section><h3>{officialDone === officialTasks.length ? "Вердикт по полному варианту" : "Промежуточный анализ"}</h3>
            <p><b>Сильные темы:</b> {officialStrong.length ? officialStrong.join(", ") : "появятся после верных ответов"}.</p>
            <p><b>Слабые темы:</b> {officialWeak.length ? officialWeak.join(", ") : "пока не выявлены"}.</p>
            <Link className="button button-dark" href={lessonHref(subjectSlug, officialNextTopic)}>Занятие по слабой теме →</Link>
          </section>
        </div>}
      </div>
    </section> : <section className="exam-workspace">
      <aside className="exam-map">
        <span className="exam-label light">{subject.exam}</span>
        <h1>{subjectSlug === "russian" ? `№ ${family.egeNumber} · ${family.title}` : subject.name}</h1>
        <p className="exam-map-intro">{subjectSlug === "russian" ? `${family.category}. Серия из ${tasks.length} разных авторских заданий на одно проверяемое умение.` : `Стартовый авторский набор: ${tasks.length} заданий. Полный официальный объём — ${subject.fullTaskCount}.`}</p>
        <div className="exam-progress"><span style={{ width: `${progress}%` }} /></div>
        <p>Выполнено {done} из {tasks.length} · верно {correct}</p>
        <nav aria-label={`Задания: ${subject.name}`}>
          {tasks.map((item, itemIndex) => <button className={`${itemIndex === index ? "active" : ""} ${results[item.id] ?? ""}`} onClick={() => jump(itemIndex)} key={item.id}>
            <span>{itemIndex + 1}</span><div><b>Попытка {itemIndex + 1}</b><small>{item.topic ?? item.format}</small></div>
          </button>)}
        </nav>
        <p className="exam-map-note"><b>Честная маркировка:</b> это авторская практика по проверяемому умению ФИПИ, а не задание из закрытого КИМ.</p>
        <button className="fipi-link fipi-button" onClick={() => selectMode("official")}>Перейти к трекеру ФИПИ →</button>
      </aside>

      <section className="exam-paper">
        <div className="exam-paper-head"><div><span>{task.subject}</span><b>{task.number} · попытка {index + 1} из {tasks.length}</b></div><em>{task.format}</em></div>
        <h2>{task.prompt}</h2>
        {task.options && <div className="exam-options">{task.options.map((option, optionIndex) => <button className={selected.includes(option) ? "selected" : ""} disabled={submitted} onClick={() => choose(option)} key={`${option}-${optionIndex}`}><span>{optionIndex + 1}</span>{option}</button>)}</div>}
        {(task.kind === "text" || task.kind === "number") && <label className="exam-input"><span>Ответ для бланка</span><input disabled={submitted} value={written} onChange={(event) => setWritten(event.target.value)} placeholder={task.kind === "number" ? "Только число" : "Без лишних знаков"} /></label>}
        {task.kind === "extended" && <label className="exam-input"><span>Развёрнутый ответ</span><textarea disabled={submitted} value={written} onChange={(event) => setWritten(event.target.value)} placeholder="Позиция → два примера → связь → своё отношение" /><small>{written.trim().length} знаков · минимум {minimumLength} для отправки на проверку</small></label>}
        {!submitted ? <button className="button button-red" disabled={!hasAnswer} onClick={submit}>Проверить решение</button> : <>
          <div className={`exam-solution ${result}`}><div className="solution-title"><span>{result === "correct" ? "Верно" : result === "review" ? "Принято на проверку" : "Есть ошибка"}</span><b>Разбор ответа</b></div><ol>{task.solution.map((step) => <li key={step}>{step}</li>)}</ol></div>
          {result === "incorrect" && <section className="remediation-panel" data-testid="inline-remediation">
            <div className="remediation-title"><span>Отработка слабого места</span><b>Не идём дальше, пока правило не закреплено</b></div>
            <div className="remediation-steps">
              <article><span>01</span><div><b>Короткая теория</b><p>{task.theory ?? `Повторите правило по теме «${task.topic ?? "текущий тип"}» и найдите признак, который определяет ответ.`}</p></div></article>
              <article><span>02</span><div><b>Почему возникла ошибка</b><p>{task.solution[0]}</p></div></article>
              <article><span>03</span><div><b>Сразу похожее задание</b><p>Следующая попытка проверяет это же умение на другом материале.</p><button className="button button-dark" onClick={practiceSimilar}>Отработать похожее →</button></div></article>
            </div>
          </section>}
          {result === "correct" && <button className="button button-ghost next-similar" onClick={practiceSimilar}>Закрепить ещё одним похожим →</button>}
        </>}
        <div className="exam-nav"><button disabled={index === 0} onClick={() => move(-1)}>← Предыдущее</button><span>{index + 1} / {tasks.length}</span><button disabled={index === tasks.length - 1} onClick={() => move(1)}>Следующее →</button></div>
        {done === tasks.length && <div className="exam-complete exam-verdict" data-testid="exam-verdict"><div><span className="exam-label">Освоение типа</span><b>{accuracy >= 80 ? "Тип закреплён" : "Нужен ещё один круг отработки"}</b><strong>{accuracy}% автоматически проверяемых ответов верны</strong><span>{review ? `${review} развёрнутых ответов ожидают проверки преподавателя. ` : ""}Это учебная аналитика, а не официальный балл ЕГЭ.</span><p><b>Сильные темы:</b> {strongTopics.length ? strongTopics.slice(0, 3).join(", ") : "пока не выявлены"}.</p><p><b>Слабые темы:</b> {weakTopics.length ? weakTopics.slice(0, 3).join(", ") : "ошибок не выявлено"}.</p></div><Link className="button button-dark" href={lessonHref(subjectSlug, nextTopic)}>Открыть занятие →</Link></div>}
      </section>
    </section>}
  </main>;
}
