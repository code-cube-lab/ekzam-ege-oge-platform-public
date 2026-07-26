"use client";

import { useEffect, useMemo, useState } from "react";
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
type ExamMode = "training" | "route" | "mistakes";
type ExamLevel = "oge" | "ege";
const RUSSIAN_VARIANT_COUNT = 12;
const MISTAKE_STORAGE_KEY = "ekzam-mistakes-v1";

function normal(value: string, order: ExamTask["answerOrder"] = "fixed") {
  const cleaned = value.trim().toLowerCase().replace(/ё/g, "е").replace(/,/g, ".").replace(/\s+/g, "");
  return order === "any" && /^\d+$/.test(cleaned) ? [...cleaned].sort().join("") : cleaned;
}

function lessonHref(subject: string, topic: string) {
  return `/learn?${new URLSearchParams({ subject, topic, variant: "1" }).toString()}`;
}

type Props = {
  initialSubject?: string;
  initialFamily?: string;
  initialCount?: number;
  initialLevel?: string;
  initialVariant?: number;
  initialMode?: string;
};

export function ExamSimulatorClient({
  initialSubject = "russian",
  initialFamily = "stress",
  initialCount = 0,
  initialLevel,
  initialVariant = 1,
  initialMode = "route",
}: Props) {
  const [examChosen, setExamChosen] = useState(() => initialLevel === "oge" || initialLevel === "ege");
  const [subjectSlug, setSubjectSlug] = useState(() => {
    const requested = getExamSubject(initialSubject).slug;
    return initialLevel === "oge" && !getSubjectSchoolProfile(requested).ogeAvailable ? "russian" : requested;
  });
  const [mode, setMode] = useState<ExamMode>(() => initialMode === "mistakes" ? "mistakes" : initialMode === "training" ? "training" : "route");
  const [level, setLevel] = useState<ExamLevel>(() => initialLevel === "oge" ? "oge" : "ege");
  const [variantId, setVariantId] = useState(() => Math.min(RUSSIAN_VARIANT_COUNT, Math.max(1, initialVariant || 1)));
  const [familyId, setFamilyId] = useState(() => getRussianTaskFamily(initialFamily).id);
  const [subjectFocus, setSubjectFocus] = useState("all");
  const [assignmentCount] = useState(() => Math.max(0, initialCount));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [written, setWritten] = useState("");
  const [audioPlays, setAudioPlays] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, ResultState>>({});
  const [mistakeIds, setMistakeIds] = useState<string[]>([]);
  const subject = getExamSubject(subjectSlug);
  const schoolProfile = getSubjectSchoolProfile(subjectSlug);
  const family = getRussianTaskFamily(familyId);
  const authorBankSize = getRussianAuthorBankSize();
  const levelLabel = level === "oge" ? "ОГЭ" : "ЕГЭ";
  const durationMinutes = level === "oge" && subjectSlug === "russian" ? 235 : level === "ege" && subjectSlug === "russian" ? 210 : undefined;
  const partCount = level === "oge" && subjectSlug === "russian" ? 3 : level === "ege" && subjectSlug === "russian" ? 2 : undefined;
  const availableSubjects = examSubjects.filter((item) => level === "ege" || getSubjectSchoolProfile(item.slug).ogeAvailable);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const stored = JSON.parse(window.localStorage.getItem(MISTAKE_STORAGE_KEY) ?? "[]");
        if (Array.isArray(stored)) setMistakeIds(stored.filter((item): item is string => typeof item === "string"));
      } catch {
        setMistakeIds([]);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const tasks = useMemo(() => {
    const ogeBase = getOgeRouteTasks(subjectSlug, getSchoolTopics(schoolProfile, 9), variantId);
    if (mode === "mistakes") {
      const bank = level === "oge"
        ? subjectSlug === "russian"
          ? Array.from({ length: RUSSIAN_VARIANT_COUNT }, (_, variant) =>
              getOgeRouteTasks(subjectSlug, getSchoolTopics(schoolProfile, 9), variant + 1),
            ).flat()
          : ogeBase
        : subjectSlug === "russian"
          ? Array.from({ length: RUSSIAN_VARIANT_COUNT }, (_, variant) =>
              getTrainingVariantTasks(subjectSlug, subject.fullTaskCount, subject.focus, variant + 1),
            ).flat()
          : getTrainingVariantTasks(subjectSlug, subject.fullTaskCount, subject.focus, 1);
      const mistakes = bank.filter((item, itemIndex) =>
        mistakeIds.includes(item.id) && bank.findIndex((candidate) => candidate.id === item.id) === itemIndex,
      );
      return assignmentCount ? mistakes.slice(0, assignmentCount) : mistakes;
    }
    if (mode === "route") {
      const route = level === "oge"
        ? ogeBase
        : getTrainingVariantTasks(subjectSlug, subject.fullTaskCount, subject.focus, variantId);
      return assignmentCount ? route.slice(0, assignmentCount) : route;
    }
    if (level === "ege" && subjectSlug === "russian") return getRussianFamilyTasks(familyId, assignmentCount || undefined) as ExamTask[];
    const base = level === "oge"
      ? ogeBase
      : getTrainingVariantTasks(subjectSlug, subject.fullTaskCount, subject.focus, 1);
    const grouped = subjectFocus === "all" ? base : base.filter((item) => item.topic === subjectFocus);
    return assignmentCount ? grouped.slice(0, assignmentCount) : grouped;
  }, [assignmentCount, familyId, level, mistakeIds, mode, schoolProfile, subject.focus, subject.fullTaskCount, subjectFocus, subjectSlug, variantId]);
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
  const wordCount = written.trim() ? written.trim().split(/\s+/).length : 0;

  function resetAnswer() {
    setSelected([]);
    setWritten("");
    setSubmitted(false);
    setAudioPlays(0);
  }

  function selectSubject(slug: string) {
    setSubjectSlug(slug);
    setVariantId(1);
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
    setExamChosen(true);
    setLevel(next);
    setVariantId(1);
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

  function selectVariant(next: number) {
    setVariantId(next);
    setResults({});
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

  function playAudio() {
    if (!task.audioText || audioPlays >= (task.maxPlays ?? 2) || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(task.audioText);
    utterance.lang = "ru-RU";
    utterance.rate = 0.86;
    window.speechSynthesis.speak(utterance);
    setAudioPlays((count) => count + 1);
  }

  function submit() {
    let state: ResultState = "incorrect";
    if (task.kind === "extended") state = task.minWords ? wordCount >= task.minWords ? "review" : "incorrect" : written.trim().length >= minimumLength ? "review" : "incorrect";
    else if (Array.isArray(task.answer)) state = [...selected].sort().join("|") === [...task.answer].sort().join("|") ? "correct" : "incorrect";
    else if (task.kind === "single") state = selected[0] === task.answer ? "correct" : "incorrect";
    else state = normal(written, task.answerOrder) === normal(task.answer, task.answerOrder) ? "correct" : "incorrect";
    setResults((items) => ({ ...items, [task.id]: state }));
    const nextMistakes = state === "incorrect"
      ? [...new Set([...mistakeIds, task.id])]
      : mode === "mistakes" && state === "correct"
        ? mistakeIds.filter((id) => id !== task.id)
        : mistakeIds;
    setMistakeIds(nextMistakes);
    window.localStorage.setItem(MISTAKE_STORAGE_KEY, JSON.stringify(nextMistakes));
    setSubmitted(true);
  }

  function jump(itemIndex: number) {
    setIndex(Math.min(tasks.length - 1, Math.max(0, itemIndex)));
    resetAnswer();
  }

  function practiceSimilar() {
    if (subjectSlug === "russian" && level === "ege" && task.familyId) {
      setFamilyId(task.familyId);
      setMode("training");
      setIndex(0);
      resetAnswer();
      return;
    }
    const sameTopic = tasks.findIndex((candidate, candidateIndex) =>
      candidateIndex !== index && candidate.topic === task.topic && !results[candidate.id],
    );
    setIndex(sameTopic >= 0 ? sameTopic : index < tasks.length - 1 ? index + 1 : 0);
    resetAnswer();
  }

  const hasAnswer = task && (task.interaction !== "exam-blank" && (task.kind === "single" || task.kind === "multiple") ? selected.length > 0 : written.trim().length > 0);
  const result = task ? results[task.id] : undefined;

  if (!examChosen) {
    return <main className="exam-gate">
      <header className="exam-sim-top">
        <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
        <div><b>Сначала выберите экзамен</b><span>ОГЭ и ЕГЭ откроются как две разные системы заданий</span></div>
        <Link className="button button-ghost button-small" href="/">На главную</Link>
      </header>
      <section className="exam-gate-panel" aria-labelledby="exam-gate-title">
        <span className="exam-label">Шаг 1 из 2</span>
        <h1 id="exam-gate-title">Что сдаёт ребёнок?</h1>
        <p>Выберите только один формат. После этого откроются предметы, полный вариант, практика по номеру и тетрадь ошибок.</p>
        <div>
          <button type="button" onClick={() => selectLevel("oge")}><span>9 класс</span><b>ОГЭ</b><small>Русский: 13 заданий · 235 минут · 3 части</small><em>Выбрать ОГЭ →</em></button>
          <button type="button" onClick={() => selectLevel("ege")}><span>11 класс</span><b>ЕГЭ</b><small>Русский: 27 заданий · 210 минут · 2 части</small><em>Выбрать ЕГЭ →</em></button>
        </div>
      </section>
    </main>;
  }

  if (mode === "mistakes" && !task) {
    return <main className="exam-simulator">
      <header className="exam-sim-top">
        <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
        <div><b>Тетрадь ошибок пока пуста</b><span>Ошибочные ответы автоматически появятся здесь</span></div>
        <Link className="button button-ghost button-small" href="/how-it-works">Как работает система</Link>
      </header>
      <section className="mistakes-empty">
        <span className="exam-label">Персональная отработка</span>
        <h1>Сначала решите хотя бы одно задание</h1>
        <p>После ошибки система сохранит номер, тему и вариант на этом устройстве. Здесь появится короткий список только тех заданий, которые нужно решить повторно.</p>
        <div><button className="button button-red" onClick={() => selectMode("route")}>Открыть пробный вариант</button><Link className="button button-dark" href="/how-it-works">Поклацать демо-разбор</Link></div>
      </section>
    </main>;
  }

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
          <span>{item.shortName}</span><small>{level === "oge" ? "ОГЭ · 9 класс" : item.exam}</small>
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
        <button className={mode === "route" ? "active" : ""} onClick={() => selectMode("route")}><b>Пробный вариант</b><span>{level === "oge" ? "13 заданий и три части" : "27 заданий и две части"} прямо на сайте</span></button>
        <button className={mode === "mistakes" ? "active" : ""} onClick={() => selectMode("mistakes")}><b>Мои ошибки · {mistakeIds.length}</b><span>Только неверные задания до повторного успеха</span></button>
      </div>
      {mode === "route" && subjectSlug === "russian" && <div className="variant-picker">
        <div><span className="exam-label">12 пробных вариантов</span><b>Русский язык · {levelLabel}-2026 · вариант № {variantId}</b><small>Авторские задания выстроены по официальной структуре: {level === "oge" ? "13 заданий, три части" : "27 заданий, две части"}. Это не закрытые КИМ.</small></div>
        <div className="exam-variant-tabs" aria-label="Пробные варианты русского языка">
          {Array.from({ length: RUSSIAN_VARIANT_COUNT }, (_, item) => item + 1).map((item) =>
            <button key={item} className={variantId === item ? "active" : ""} onClick={() => selectVariant(item)}><b>№ {item}</b><span>{level === "oge" ? "13" : "27"} заданий</span></button>,
          )}
        </div>
      </div>}
      {mode === "route" && <div className="route-bank-note">
        <div><span className="exam-label">Без скачивания</span><b>{subject.name} · {levelLabel} · {tasks.length} заданий на сайте</b></div>
        <p>Ребёнок отвечает здесь, сразу видит разбор и переходит к следующему заданию. В русском языке задания идут в порядке выбранного экзамена, а поле ответа повторяет требуемый тип: слово, число, последовательность цифр или развёрнутая работа.</p>
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
        <div><b>{subject.name}: стартовая практика {levelLabel}</b><span>Задания сгруппированы по умениям. Расширенный авторский банк проходит предметную редактуру; скачивать материалы для начала не нужно.</span></div>
        <div className="subject-focus-tabs" aria-label={`Умения: ${subject.name}`}>
          <button className={subjectFocus === "all" ? "active" : ""} onClick={() => { setSubjectFocus("all"); setIndex(0); resetAnswer(); }}>Все {tasks.length}</button>
          {level === "ege" && subject.focus.map((focus) => <button className={subjectFocus === focus ? "active" : ""} key={focus} onClick={() => { setSubjectFocus(focus); setIndex(0); resetAnswer(); }}>{focus}</button>)}
        </div>
      </div>}
    </section>

    <section className="exam-workspace">
      <aside className="exam-map">
        <span className="exam-label light">{levelLabel} · {subject.name}</span>
        <h1>{mode === "route" ? `Вариант № ${variantId}` : mode === "mistakes" ? "Тетрадь ошибок" : level === "ege" && subjectSlug === "russian" ? `№ ${family.egeNumber} · ${family.title}` : "Практика по умениям"}</h1>
        {mode === "route" && subjectSlug === "russian" && <div className="exam-passport"><span><b>{tasks.length}</b> заданий</span><span><b>{durationMinutes}</b> минут</span><span><b>{partCount}</b> части</span></div>}
        <p className="exam-map-intro">{mode === "route"
          ? `${tasks.length} авторских заданий выполняются внутри платформы. После каждого ответа открывается разбор.`
          : mode === "mistakes"
            ? `${tasks.length} неверных заданий сохранено на этом устройстве. Верный повтор убирает задание из списка.`
          : level === "ege" && subjectSlug === "russian"
            ? `${family.category}. Серия из ${tasks.length} разных авторских заданий на одно проверяемое умение.`
            : `Стартовый авторский набор: ${tasks.length} заданий для ${levelLabel}.`}</p>
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
        {task.audioText && <div className="exam-audio-task">
          <div><span>Текст для изложения</span><b>Прослушивание {audioPlays} из {task.maxPlays ?? 2}</b><small>Используется голосовое воспроизведение авторского текста в браузере.</small></div>
          <button type="button" disabled={audioPlays >= (task.maxPlays ?? 2)} onClick={playAudio}>{audioPlays ? "Прослушать ещё раз" : "Включить текст"} →</button>
        </div>}
        {task.stimulus && <article className="exam-stimulus"><span>Текст к заданиям</span><p>{task.stimulus}</p></article>}
        <h2>{task.prompt}</h2>
        {task.options && task.interaction === "exam-blank" && <ol className="exam-static-options">{task.options.map((option, optionIndex) => <li key={`${option}-${optionIndex}`}><span>{optionIndex + 1}</span><p>{option}</p></li>)}</ol>}
        {task.options && task.interaction !== "exam-blank" && <div className="exam-options">{task.options.map((option, optionIndex) => <button className={selected.includes(option) ? "selected" : ""} disabled={submitted} onClick={() => choose(option)} key={`${option}-${optionIndex}`}><span>{optionIndex + 1}</span>{option}</button>)}</div>}
        {(task.interaction === "exam-blank" || task.kind === "text" || task.kind === "number") && <label className="exam-input"><span>Ответ для бланка</span><input disabled={submitted} value={written} onChange={(event) => setWritten(event.target.value)} placeholder={task.kind === "number" ? "Только число" : task.answerOrder === "fixed" ? "Порядок символов важен" : "Без пробелов, запятых и лишних знаков"} /></label>}
        {task.kind === "extended" && <label className="exam-input"><span>Развёрнутый ответ</span><textarea disabled={submitted} value={written} onChange={(event) => setWritten(event.target.value)} placeholder={level === "oge" && index === 0 ? "Сжатое изложение: микротемы → главное → связный текст" : "Тезис → примеры → объяснение → вывод"} /><small>{task.minWords ? `${wordCount} слов · минимум ${task.minWords} слов` : `${written.trim().length} знаков · минимум ${minimumLength} для отправки на проверку`}</small></label>}
        {!submitted ? <button className="button button-red" disabled={!hasAnswer} onClick={submit}>Проверить решение</button> : <>
          <div className={`exam-solution ${result}`}><div className="solution-title"><span>{result === "correct" ? "Верно" : result === "review" ? "Принято на проверку" : "Есть ошибка"}</span><b>Разбор ответа</b></div><ol>{task.solution.map((step) => <li key={step}>{step}</li>)}</ol></div>
          <section className="verification-lanes" aria-label="Кто проверяет ответ">
            <article><span>АВТОПРОВЕРКА</span><b>Точные ответы</b><p>Сверяет ответ, тему и правило. Работает сразу и без ожидания преподавателя.</p></article>
            <article><span>НЕЙРОСЕТЬ</span><b>Свободное объяснение</b><p>После подключения защищённого AI-ключа разбирает ход мысли и предлагает подсказку. Сейчас в открытом демо используется проверенная база правил.</p></article>
            <article className={result === "review" ? "active" : ""}><span>УЧИТЕЛЬ</span><b>Сочинение и спорные места</b><p>Выставляет итог по критериям, проверяет низкую уверенность и объясняет, что изменить в следующей версии.</p></article>
          </section>
          {result === "incorrect" && <section className="remediation-panel" data-testid="inline-remediation">
            <div className="remediation-title"><span>Отработка слабого места</span><b>Не идём дальше, пока правило не закреплено</b></div>
            <div className="remediation-steps">
              <article><span>01</span><div><b>Короткая теория</b><p>{task.theory ?? `${currentRisk.intervention}. Сначала назовите проверяемый признак по теме «${task.topic ?? "текущий тип"}», затем снова решайте задачу.`}</p></div></article>
              <article><span>02</span><div><b>Почему возникла ошибка</b><p>{task.solution[0]}</p></div></article>
              <article><span>03</span><div><b>Сразу похожее задание</b><p>Ошибка сохранена в «Мои ошибки». Следующая попытка проверяет это же умение на другом материале.</p><button className="button button-dark" onClick={practiceSimilar}>Отработать похожее →</button></div></article>
            </div>
          </section>}
          {result === "correct" && <button className="button button-ghost next-similar" onClick={practiceSimilar}>Закрепить ещё одним похожим →</button>}
        </>}
        <div className="exam-nav"><button disabled={index === 0} onClick={() => jump(index - 1)}>← Предыдущее</button><span>{index + 1} / {tasks.length}</span><button disabled={index === tasks.length - 1} onClick={() => jump(index + 1)}>Следующее →</button></div>
        {done === tasks.length && <div className="exam-complete exam-verdict" data-testid="exam-verdict"><div><span className="exam-label">{mode === "route" ? `Итог маршрута ${levelLabel}` : "Освоение типа"}</span><b>{accuracy >= 80 ? "Можно переходить дальше" : "Нужна отработка слабых тем"}</b><strong>{accuracy}% автоматически проверяемых ответов верны</strong><span>{review ? `${review} развёрнутых ответов ожидают проверки преподавателя. ` : ""}Это учебная аналитика, а не официальный балл {levelLabel}.</span><p><b>Сильные темы:</b> {strongTopics.length ? strongTopics.slice(0, 3).join(", ") : "пока не выявлены"}.</p><p><b>Слабые темы:</b> {weakTopics.length ? weakTopics.slice(0, 3).join(", ") : "ошибок не выявлено"}.</p></div><Link className="button button-dark" href={lessonHref(subjectSlug, nextTopic)}>Открыть занятие →</Link></div>}
      </section>
    </section>
  </main>;
}
