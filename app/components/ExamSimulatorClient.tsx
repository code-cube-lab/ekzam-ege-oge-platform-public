"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { examSubjects, getExamSubject } from "../../knowledge-base/exams/exam-subjects";
import { getTrainingVariantTasks, type ExamTask } from "../../knowledge-base/tasks/exam-demo-bank";
import { getOgeRouteTasks } from "../../knowledge-base/tasks/oge-demo-bank";
import { getSchoolTopics, getSubjectSchoolProfile, officialSchoolLinks } from "../../knowledge-base/curriculum/school-curriculum";
import {
  analyzeTaskResults,
  getRussianAuthorBankSize,
  getRussianFamilyTasks,
  getRussianTaskFamily,
  russianTaskFamilies,
} from "../../knowledge-base/tasks/variant-engine.js";

type ResultState = "correct" | "incorrect" | "review";
type ExamMode = "training" | "route";
type ExamLevel = "oge" | "ege";

function normal(value: string) {
  return value.trim().toLowerCase().replace(/ё/g, "е").replace(/,/g, ".").replace(/\s+/g, "");
}

function lessonHref(subject: string, topic: string) {
  return `/learn?${new URLSearchParams({ subject, topic, variant: "1" }).toString()}`;
}

type Props = {
  initialSubject?: string;
  initialFamily?: string;
  initialCount?: number;
  initialLevel?: string;
};

export function ExamSimulatorClient({
  initialSubject = "russian",
  initialFamily = "stress",
  initialCount = 0,
  initialLevel = "ege",
}: Props) {
  const [subjectSlug, setSubjectSlug] = useState(() => {
    const requested = getExamSubject(initialSubject).slug;
    return initialLevel === "oge" && !getSubjectSchoolProfile(requested).ogeAvailable ? "russian" : requested;
  });
  const [mode, setMode] = useState<ExamMode>("route");
  const [level, setLevel] = useState<ExamLevel>(() => initialLevel === "oge" ? "oge" : "ege");
  const [familyId, setFamilyId] = useState(() => getRussianTaskFamily(initialFamily).id);
  const [subjectFocus, setSubjectFocus] = useState("all");
  const [assignmentCount] = useState(() => Math.max(0, initialCount));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [written, setWritten] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, ResultState>>({});
  const subject = getExamSubject(subjectSlug);
  const schoolProfile = getSubjectSchoolProfile(subjectSlug);
  const family = getRussianTaskFamily(familyId);
  const authorBankSize = getRussianAuthorBankSize();
  const availableSubjects = examSubjects.filter((item) => level === "ege" || getSubjectSchoolProfile(item.slug).ogeAvailable);
  const tasks = useMemo(() => {
    const ogeBase = getOgeRouteTasks(subjectSlug, getSchoolTopics(schoolProfile, 9));
    if (mode === "route") {
      const route = level === "oge"
        ? ogeBase
        : getTrainingVariantTasks(subjectSlug, subject.fullTaskCount, subject.focus, 1);
      return assignmentCount ? route.slice(0, assignmentCount) : route;
    }
    if (level === "ege" && subjectSlug === "russian") return getRussianFamilyTasks(familyId, assignmentCount || undefined) as ExamTask[];
    const base = level === "oge"
      ? ogeBase
      : getTrainingVariantTasks(subjectSlug, subject.fullTaskCount, subject.focus, 1);
    const grouped = subjectFocus === "all" ? base : base.filter((item) => item.topic === subjectFocus);
    return assignmentCount ? grouped.slice(0, assignmentCount) : grouped;
  }, [assignmentCount, familyId, level, mode, schoolProfile, subject.focus, subject.fullTaskCount, subjectFocus, subjectSlug]);
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
  const currentRisk = schoolProfile.examRisks.find((risk) =>
    `${risk.skill} ${risk.signal}`.toLowerCase().includes(nextTopic.toLowerCase()),
  ) ?? schoolProfile.examRisks[0];
  const minimumLength = task?.id.startsWith("chinese") ? 40 : 80;

  function resetAnswer() {
    setSelected([]);
    setWritten("");
    setSubmitted(false);
  }

  function selectSubject(slug: string) {
    setSubjectSlug(slug);
    setSubjectFocus("all");
    setIndex(0);
    resetAnswer();
  }

  function selectMode(next: ExamMode) {
    setMode(next);
    setIndex(0);
    resetAnswer();
  }

  function selectLevel(next: ExamLevel) {
    setLevel(next);
    if (next === "oge" && !getSubjectSchoolProfile(subjectSlug).ogeAvailable) setSubjectSlug("russian");
    setSubjectFocus("all");
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

  const hasAnswer = task && (task.kind === "single" || task.kind === "multiple" ? selected.length > 0 : written.trim().length > 0);
  const result = task ? results[task.id] : undefined;

  return <main className="exam-simulator">
    <header className="exam-sim-top">
      <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
      <div><b>Задания ОГЭ и ЕГЭ на сайте</b><span>Одно за другим: ответ → разбор → отработка слабого места</span></div>
      <Link className="button button-ghost button-small" href="/for-teachers">Для педагогов</Link>
    </header>

    <section className="exam-subject-picker" aria-label="Выбор предмета">
      <div><span className="exam-label">Выберите предмет</span><b>{level === "oge" ? "14 предметов ОГЭ" : "Все 15 предметов ЕГЭ"}</b></div>
      <div className="exam-subject-scroll">
        {availableSubjects.map((item) => <button className={item.slug === subjectSlug ? "active" : ""} onClick={() => selectSubject(item.slug)} key={item.slug}>
          <span>{item.shortName}</span><small>{item.exam}</small>
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
        <button className={mode === "route" ? "active" : ""} onClick={() => selectMode("route")}><b>Экзаменационный маршрут</b><span>Задания идут одно за другим прямо на сайте</span></button>
      </div>
      {mode === "route" && <div className="route-bank-note">
        <div><span className="exam-label">Без скачивания</span><b>{subject.name} · {level.toUpperCase()} · {tasks.length} заданий на сайте</b></div>
        <p>Ребёнок отвечает здесь, сразу видит разбор и переходит к следующему заданию. Это авторский маршрут по открытой структуре ФИПИ, а не закрытый экзаменационный КИМ.</p>
      </div>}
      {mode === "training" && level === "ege" && subjectSlug === "russian" && <div className="family-bank">
        <div className="family-bank-head"><div><span className="exam-label">Банк по линиям ЕГЭ-2026</span><b>{authorBankSize} авторских заданий · {russianTaskFamilies.length} типов</b></div><small>Без копирования закрытых КИМ. Основа: спецификация, навигатор и методические рекомендации ФИПИ.</small></div>
        <div className="family-tabs" aria-label="Типы заданий русского языка">
          {russianTaskFamilies.map((item) => <button key={item.id} className={familyId === item.id ? "active" : ""} onClick={() => selectFamily(item.id)}>
            <span>№ {item.egeNumber}</span><b>{item.title}</b><small>{item.count} заданий</small>
          </button>)}
        </div>
      </div>}
      {mode === "training" && (level === "oge" || subjectSlug !== "russian") && <div className="subject-bank-note grouped-bank">
        <div><b>{subject.name}: стартовая практика {level.toUpperCase()}</b><span>Задания сгруппированы по умениям. Расширенный авторский банк проходит предметную редактуру; скачивать материалы для начала не нужно.</span></div>
        <div className="subject-focus-tabs" aria-label={`Умения: ${subject.name}`}>
          <button className={subjectFocus === "all" ? "active" : ""} onClick={() => { setSubjectFocus("all"); setIndex(0); resetAnswer(); }}>Все {tasks.length}</button>
          {level === "ege" && subject.focus.map((focus) => <button className={subjectFocus === focus ? "active" : ""} key={focus} onClick={() => { setSubjectFocus(focus); setIndex(0); resetAnswer(); }}>{focus}</button>)}
        </div>
      </div>}
    </section>

    <section className="exam-workspace">
      <aside className="exam-map">
        <span className="exam-label light">{level.toUpperCase()} · {subject.name}</span>
        <h1>{mode === "route" ? "Решаем одно за другим" : level === "ege" && subjectSlug === "russian" ? `№ ${family.egeNumber} · ${family.title}` : "Практика по умениям"}</h1>
        <p className="exam-map-intro">{mode === "route"
          ? `${tasks.length} авторских заданий выполняются внутри платформы. После каждого ответа открывается разбор.`
          : level === "ege" && subjectSlug === "russian"
            ? `${family.category}. Серия из ${tasks.length} разных авторских заданий на одно проверяемое умение.`
            : `Стартовый авторский набор: ${tasks.length} заданий для ${level.toUpperCase()}.`}</p>
        <div className="exam-progress"><span style={{ width: `${progress}%` }} /></div>
        <p>Выполнено {done} из {tasks.length} · верно {correct}</p>
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
        <h2>{task.prompt}</h2>
        {task.options && <div className="exam-options">{task.options.map((option, optionIndex) => <button className={selected.includes(option) ? "selected" : ""} disabled={submitted} onClick={() => choose(option)} key={`${option}-${optionIndex}`}><span>{optionIndex + 1}</span>{option}</button>)}</div>}
        {(task.kind === "text" || task.kind === "number") && <label className="exam-input"><span>Ответ для бланка</span><input disabled={submitted} value={written} onChange={(event) => setWritten(event.target.value)} placeholder={task.kind === "number" ? "Только число" : "Без лишних знаков"} /></label>}
        {task.kind === "extended" && <label className="exam-input"><span>Развёрнутый ответ</span><textarea disabled={submitted} value={written} onChange={(event) => setWritten(event.target.value)} placeholder="Позиция → два примера → связь → своё отношение" /><small>{written.trim().length} знаков · минимум {minimumLength} для отправки на проверку</small></label>}
        {!submitted ? <button className="button button-red" disabled={!hasAnswer} onClick={submit}>Проверить решение</button> : <>
          <div className={`exam-solution ${result}`}><div className="solution-title"><span>{result === "correct" ? "Верно" : result === "review" ? "Принято на проверку" : "Есть ошибка"}</span><b>Разбор ответа</b></div><ol>{task.solution.map((step) => <li key={step}>{step}</li>)}</ol></div>
          {result === "incorrect" && <section className="remediation-panel" data-testid="inline-remediation">
            <div className="remediation-title"><span>Отработка слабого места</span><b>Не идём дальше, пока правило не закреплено</b></div>
            <div className="remediation-steps">
              <article><span>01</span><div><b>Короткая теория</b><p>{task.theory ?? `${currentRisk.intervention}. Сначала назовите проверяемый признак по теме «${task.topic ?? "текущий тип"}», затем снова решайте задачу.`}</p></div></article>
              <article><span>02</span><div><b>Почему возникла ошибка</b><p>{task.solution[0]}</p></div></article>
              <article><span>03</span><div><b>Сразу похожее задание</b><p>Следующая попытка проверяет это же умение на другом материале.</p><button className="button button-dark" onClick={practiceSimilar}>Отработать похожее →</button></div></article>
            </div>
          </section>}
          {result === "correct" && <button className="button button-ghost next-similar" onClick={practiceSimilar}>Закрепить ещё одним похожим →</button>}
        </>}
        <div className="exam-nav"><button disabled={index === 0} onClick={() => move(-1)}>← Предыдущее</button><span>{index + 1} / {tasks.length}</span><button disabled={index === tasks.length - 1} onClick={() => move(1)}>Следующее →</button></div>
        {done === tasks.length && <div className="exam-complete exam-verdict" data-testid="exam-verdict"><div><span className="exam-label">{mode === "route" ? `Итог маршрута ${level.toUpperCase()}` : "Освоение типа"}</span><b>{accuracy >= 80 ? "Можно переходить дальше" : "Нужна отработка слабых тем"}</b><strong>{accuracy}% автоматически проверяемых ответов верны</strong><span>{review ? `${review} развёрнутых ответов ожидают проверки преподавателя. ` : ""}Это учебная аналитика, а не официальный балл {level.toUpperCase()}.</span><p><b>Сильные темы:</b> {strongTopics.length ? strongTopics.slice(0, 3).join(", ") : "пока не выявлены"}.</p><p><b>Слабые темы:</b> {weakTopics.length ? weakTopics.slice(0, 3).join(", ") : "ошибок не выявлено"}.</p></div><Link className="button button-dark" href={lessonHref(subjectSlug, nextTopic)}>Открыть занятие →</Link></div>}
      </section>
    </section>
  </main>;
}
