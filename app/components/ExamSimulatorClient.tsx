"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { examSubjects, getExamSubject } from "../../knowledge-base/exams/exam-subjects";
import { getOfficialTaskTopic, getOfficialVariantSource, officialFipiLinks } from "../../knowledge-base/exams/official-variants";
import { getTrainingVariantTasks, type ExamTask } from "../../knowledge-base/tasks/exam-demo-bank";
import { analyzeTaskResults, trainingVariants } from "../../knowledge-base/tasks/variant-engine.js";

type ResultState = "correct" | "incorrect" | "review";
type ExamMode = "training" | "official";

function normal(value: string) {
  return value.trim().toLowerCase().replace(/ё/g, "е").replace(/,/g, ".").replace(/\s+/g, "");
}

function lessonHref(subject: string, topic: string, variant: number) {
  const query = new URLSearchParams({ subject, topic, variant: String(variant) });
  return `/learn?${query.toString()}`;
}

function resultLabel(state?: ResultState) {
  if (state === "correct") return "Верно";
  if (state === "incorrect") return "Ошибка";
  if (state === "review") return "Нужна проверка";
  return "Не отмечено";
}

export function ExamSimulatorClient({ initialSubject = "russian", initialVariant = 1 }: { initialSubject?: string; initialVariant?: number }) {
  const [subjectSlug, setSubjectSlug] = useState(() => getExamSubject(initialSubject).slug);
  const [mode, setMode] = useState<ExamMode>("training");
  const [variantId, setVariantId] = useState(() => Math.min(3, Math.max(1, initialVariant)));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [written, setWritten] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, ResultState>>({});
  const subject = getExamSubject(subjectSlug);
  const source = getOfficialVariantSource(subjectSlug);
  const tasks = useMemo(
    () => getTrainingVariantTasks(subjectSlug, subject.fullTaskCount, subject.focus, variantId),
    [subjectSlug, subject.fullTaskCount, subject.focus, variantId],
  );
  const task: ExamTask = tasks[index] ?? tasks[0];
  const subjectResults = tasks.map((item) => results[item.id]).filter(Boolean);
  const done = subjectResults.length;
  const correct = subjectResults.filter((item) => item === "correct").length;
  const review = subjectResults.filter((item) => item === "review").length;
  const progress = Math.round((done / tasks.length) * 100);
  const autoChecked = Math.max(1, done - review);
  const accuracy = Math.round((correct / autoChecked) * 100);
  const analysis = analyzeTaskResults(tasks, results);
  const weakTopics = analysis.weaknesses as string[];
  const strongTopics = analysis.strengths as string[];
  const nextTopic = weakTopics[0] ?? subject.focus[0] ?? "базовая подготовка";
  const verdict = accuracy >= 85 ? "уверенный высокий старт" : accuracy >= 70 ? "хорошая база" : accuracy >= 45 ? "база есть, но есть пробелы" : "нужно укрепить основу";
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

  function selectVariant(next: number) {
    setVariantId(next);
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
      <div><b>Диагностика по предмету</b><span>Результат → сильные и слабые темы → следующее занятие</span></div>
      <Link className="button button-ghost button-small" href="/dashboard">Мой прогресс</Link>
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
        <button className={mode === "training" ? "active" : ""} onClick={() => selectMode("training")}><b>Тренировка на сайте</b><span>Ответ проверяется сразу</span></button>
        <button className={mode === "official" ? "active" : ""} onClick={() => selectMode("official")}><b>Официальный вариант ФИПИ</b><span>Скачать и занести результат</span></button>
      </div>
      {mode === "training" && <div className="exam-variant-tabs" aria-label="Выбор тренировочного варианта">
        {trainingVariants.map((variant) => <button key={variant.id} className={variantId === variant.id ? "active" : ""} onClick={() => selectVariant(variant.id)}><b>{variant.label}</b><span>{variant.note}</span></button>)}
      </div>}
    </section>

    {mode === "official" ? <section className="official-workspace">
      <div className="official-start">
        <span className="exam-label">Реальный открытый КИМ · ФИПИ-2026</span>
        <h1>{subject.name}: полный вариант</h1>
        <p>Скачайте официальный архив, решите задания и сверьтесь с ответами из комплекта. Затем отметьте результат каждого номера: один клик — верно, второй — ошибка, третий — нужна проверка.</p>
        <div className="official-actions">
          <a className="button button-red" href={source.downloadUrl} target="_blank" rel="noreferrer">Скачать вариант с ФИПИ ↗</a>
          <a className="button button-ghost" href={officialFipiLinks.openVariants} target="_blank" rel="noreferrer">Проверить на странице ФИПИ</a>
        </div>
        <small>Платформа не переименовывает авторские задания в официальные и не копирует КИМ: архив открывается с домена ФИПИ.</small>
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
            <Link className="button button-dark" href={lessonHref(subjectSlug, officialNextTopic, variantId)}>Занятие по слабой теме →</Link>
          </section>
        </div>}
      </div>
    </section> : <section className="exam-workspace">
      <aside className="exam-map">
        <span className="exam-label light">{subject.exam} · вариант {variantId}</span>
        <h1>{subject.name}</h1>
        <p className="exam-map-intro">{subjectSlug === "russian" ? `Полный авторский вариант: ${tasks.length} разных заданий.` : `Проверочный набор: ${tasks.length} разных заданий. Полный официальный вариант из ${subject.fullTaskCount} заданий доступен в соседнем режиме.`}</p>
        <div className="exam-progress"><span style={{ width: `${progress}%` }} /></div>
        <p>Выполнено {done} из {tasks.length} · верно {correct}</p>
        <nav aria-label={`Задания: ${subject.name}`}>
          {tasks.map((item, itemIndex) => <button className={`${itemIndex === index ? "active" : ""} ${results[item.id] ?? ""}`} onClick={() => jump(itemIndex)} key={item.id}>
            <span>{itemIndex + 1}</span><div><b>{item.number}</b><small>{item.topic ?? item.format}</small></div>
          </button>)}
        </nav>
        <p className="exam-map-note"><b>Важно:</b> это авторская тренировка по экзаменационным темам, а не официальный КИМ. Решение появляется только после вашей попытки.</p>
        <button className="fipi-link fipi-button" onClick={() => selectMode("official")}>Перейти к полному варианту ФИПИ →</button>
      </aside>

      <section className="exam-paper">
        <div className="exam-paper-head"><div><span>{task.subject}</span><b>{task.number} из {tasks.length}</b></div><em>{task.format}</em></div>
        <h2>{task.prompt}</h2>
        {task.options && <div className="exam-options">{task.options.map((option, optionIndex) => <button className={selected.includes(option) ? "selected" : ""} disabled={submitted} onClick={() => choose(option)} key={`${option}-${optionIndex}`}><span>{optionIndex + 1}</span>{option}</button>)}</div>}
        {(task.kind === "text" || task.kind === "number") && <label className="exam-input"><span>Ответ для бланка</span><input disabled={submitted} value={written} onChange={(event) => setWritten(event.target.value)} placeholder={task.kind === "number" ? "Только число" : "Без лишних знаков"} /></label>}
        {task.kind === "extended" && <label className="exam-input"><span>Развёрнутый ответ</span><textarea disabled={submitted} value={written} onChange={(event) => setWritten(event.target.value)} placeholder="Тезис → пример → объяснение → вывод" /><small>{written.trim().length} знаков · минимум {minimumLength} для отправки на проверку</small></label>}
        {!submitted ? <button className="button button-red" disabled={!hasAnswer} onClick={submit}>Проверить решение</button> : <div className={`exam-solution ${result}`}><div className="solution-title"><span>{result === "correct" ? "Верно" : result === "review" ? "Принято на проверку" : "Есть ошибка"}</span><b>Разбор ответа</b></div><ol>{task.solution.map((step) => <li key={step}>{step}</li>)}</ol></div>}
        <div className="exam-nav"><button disabled={index === 0} onClick={() => move(-1)}>← Предыдущее</button><span>{index + 1} / {tasks.length}</span><button disabled={index === tasks.length - 1} onClick={() => move(1)}>Следующее →</button></div>
        {done === tasks.length && <div className="exam-complete exam-verdict" data-testid="exam-verdict"><div><span className="exam-label">Итог по предмету</span><b>{verdict}</b><strong>{accuracy}% автоматически проверяемых ответов верны</strong><span>{review ? `${review} развёрнутых ответов ожидают проверки преподавателя. ` : ""}Это диагностический уровень, а не официальный балл ЕГЭ.</span><p><b>Сильные темы:</b> {strongTopics.length ? strongTopics.slice(0, 3).join(", ") : "пока не выявлены"}.</p><p><b>Начать с тем:</b> {weakTopics.length ? weakTopics.slice(0, 3).join(", ") : "усложнённая практика"}.</p></div><Link className="button button-dark" href={lessonHref(subjectSlug, nextTopic, variantId)}>Начать занятие →</Link></div>}
      </section>
    </section>}
  </main>;
}
