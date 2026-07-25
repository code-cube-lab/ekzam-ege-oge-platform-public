"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  schoolGrades,
  subjectSchoolProfiles,
  type SchoolGrade,
} from "../../knowledge-base/curriculum/school-curriculum";
import {
  getTextbookChapters,
  textbookLegalNote,
} from "../../knowledge-base/curriculum/textbook-library";

type SaveState = "idle" | "saving" | "saved" | "error";
type MissionAttempt = "challenge" | "retry";

export function TextbookLibraryClient() {
  const [grade, setGrade] = useState<SchoolGrade>(5);
  const [subjectSlug, setSubjectSlug] = useState("russian");
  const [chapterIndex, setChapterIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [missionOpen, setMissionOpen] = useState(false);
  const [attempt, setAttempt] = useState<MissionAttempt>("challenge");
  const [xp, setXp] = useState(0);
  const [energy, setEnergy] = useState(3);
  const [completed, setCompleted] = useState<string[]>([]);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [online, setOnline] = useState(true);
  const subject = subjectSchoolProfiles.find((item) => item.slug === subjectSlug) ?? subjectSchoolProfiles[0];
  const chapters = useMemo(() => getTextbookChapters(subject, grade), [grade, subject]);
  const chapter = chapters[chapterIndex] ?? chapters[0];
  const activeChallenge = attempt === "challenge" ? chapter.challenge : chapter.retry;
  const correct = checked && answer === activeChallenge.answerIndex;

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  function changeSubject(slug: string) {
    setSubjectSlug(slug);
    setChapterIndex(0);
    resetMission();
  }

  function changeGrade(next: SchoolGrade) {
    setGrade(next);
    setChapterIndex(0);
    resetMission();
  }

  function changeChapter(index: number) {
    setChapterIndex(index);
    resetMission();
  }

  function resetMission() {
    setAnswer(null);
    setChecked(false);
    setMissionOpen(false);
    setAttempt("challenge");
    setEnergy(3);
  }

  function startMission() {
    setMissionOpen(true);
    setAnswer(null);
    setChecked(false);
  }

  function checkMission() {
    if (answer === null) return;
    const isCorrect = answer === activeChallenge.answerIndex;
    setChecked(true);
    if (!isCorrect) setEnergy((value) => Math.max(1, value - 1));
    if (isCorrect && attempt === "retry" && !completed.includes(chapter.id)) {
      setCompleted((items) => [...items, chapter.id]);
      setXp((value) => value + 50);
      setEnergy(3);
    }
  }

  function openTransferTask() {
    setAttempt("retry");
    setAnswer(null);
    setChecked(false);
    setMissionOpen(true);
  }

  function returnToRule() {
    setAttempt("challenge");
    setAnswer(null);
    setChecked(false);
    setMissionOpen(false);
  }

  async function saveForOffline() {
    if (!("caches" in window)) {
      setSaveState("error");
      return;
    }
    setSaveState("saving");
    try {
      const cache = await caches.open("ekzam-textbooks-v1");
      const resourceUrls = performance
        .getEntriesByType("resource")
        .map((entry) => entry.name)
        .filter((url) => url.startsWith(window.location.origin) && !url.includes("/api/"));
      const urls = [...new Set([window.location.href, `${window.location.origin}/textbooks`, `${window.location.origin}/school`, ...resourceUrls])];
      const attempts = await Promise.allSettled(urls.map((url) => cache.add(url)));
      if (!attempts.some((item) => item.status === "fulfilled")) throw new Error("cache-empty");
      window.localStorage.setItem("ekzam-offline-textbooks", new Date().toISOString());
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return <main className="textbook-library">
    <header className="library-topbar">
      <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
      <nav><Link href="/school">Школа 5–11</Link><Link href="/exam?level=oge">ОГЭ</Link><Link href="/exam?level=ege">ЕГЭ</Link></nav>
      <span className={`connection-state ${online ? "online" : "offline"}`}>{online ? "Интернет есть" : "Офлайн-режим"}</span>
    </header>

    <section className="library-hero">
      <div><span className="exam-label">Учебники внутри платформы · 5–11 классы</span><h1>Читайте. Решайте.<br /><em>Даже без интернета.</em></h1><p>Выберите класс и предмет. Главы, примеры и задания открываются здесь — переходить на другой сайт или сначала скачивать файл не нужно.</p></div>
      <div className="offline-card">
        <span>Офлайн-доступ</span>
        <strong>{saveState === "saved" ? "Учебники сохранены" : "Сохраните библиотеку на устройство"}</strong>
        <p>После первого сохранения уже открытые главы и интерфейс останутся доступны при пропадании связи.</p>
        <button className="button button-primary" onClick={saveForOffline} disabled={saveState === "saving"}>
          {saveState === "saving" ? "Сохраняем…" : saveState === "saved" ? "Сохранено для офлайн ✓" : "Сохранить для офлайн"}
        </button>
        {saveState === "error" && <small>Браузер не разрешил сохранение. Откройте платформу в обычной вкладке и попробуйте ещё раз.</small>}
      </div>
    </section>

    <section className="library-controls">
      <div><span className="exam-label">Класс</span><div className="grade-switch">{schoolGrades.map((item) => <button className={grade === item ? "active" : ""} key={item} onClick={() => changeGrade(item)}>{item}</button>)}</div></div>
      <div><span className="exam-label">Предмет</span><div className="library-subjects">{subjectSchoolProfiles.map((item) => <button className={subjectSlug === item.slug ? "active" : ""} key={item.slug} onClick={() => changeSubject(item.slug)} style={{ "--subject-color": item.color } as CSSProperties}><span>{item.code}</span>{item.name}</button>)}</div></div>
    </section>

    <section className="mission-hud" aria-label="Игровой прогресс">
      <div><span>Кампания</span><strong>{grade} класс · {subject.name}</strong></div>
      <div><span>Пройдено</span><strong>{completed.filter((id) => id.startsWith(`${subject.slug}-${grade}-`)).length} / {chapters.length} глав</strong></div>
      <div><span>Опыт</span><strong>{xp} XP</strong></div>
      <div><span>Энергия</span><strong aria-label={`${energy} из 3`}>{"●".repeat(energy)}{"○".repeat(3 - energy)}</strong></div>
    </section>

    <section className="book-reader game-reader" style={{ "--subject-color": subject.color } as CSSProperties}>
      <aside>
        <span className="exam-label light">{grade} класс · {subject.name}</span>
        <h2>Карта миссий</h2>
        <p className="mission-count">{chapters.length} главы · {chapters.length * 2} заданий переноса</p>
        <nav>{chapters.map((item, index) => <button className={`${chapterIndex === index ? "active" : ""} ${completed.includes(item.id) ? "complete" : ""}`} key={item.id} onClick={() => changeChapter(index)}><span>{completed.includes(item.id) ? "✓" : String(index + 1).padStart(2, "0")}</span><b>{item.title}<small>{completed.includes(item.id) ? "пройдено · 50 XP" : "правило → 2 попытки"}</small></b></button>)}</nav>
        <p>{textbookLegalNote}</p>
      </aside>
      <article>
        <span className="exam-label">Глава {chapterIndex + 1} из {chapters.length} · учебная миссия</span>
        <h1>{chapter.title}</h1>
        <p className="chapter-goal">{chapter.goal}</p>
        <section className="rule-card mission-rule" data-testid="rule-before-task">
          <span>01 · Сначала правило</span>
          <strong>{chapter.keyRule}</strong>
          <p>Не заучивайте ответ. Назовите признак или ход решения, который сможете применить к другому примеру.</p>
        </section>
        <details className="mission-method">
          <summary>Открыть алгоритм из 3 шагов</summary>
          <ol className="chapter-method">{chapter.method.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol>
        </details>
        <section className="chapter-example">
          <span className="exam-label">02 · Разобранный пример</span>
          <h3>Смотрим не на ответ, а на ход мысли</h3>
          <p>{chapter.example}</p>
          <blockquote><b>Ловушка:</b> {chapter.counterExample}</blockquote>
        </section>

        {!missionOpen ? <section className="mission-gate">
          <div><span>03 · Ваша очередь</span><h2>Пример закончился. В задании будут другие данные.</h2><p>Сначала проговорите правило своими словами. Затем откройте миссию без подсказки ответа.</p></div>
          <button className="button button-red" onClick={startMission}>Правило понял — начать миссию</button>
        </section> : <section className={`chapter-check mission-challenge ${checked ? correct ? "is-correct" : "is-wrong" : ""}`} aria-live="polite">
          <span className="exam-label">{attempt === "challenge" ? "03 · Самостоятельная попытка" : "04 · Новая задача на перенос"}</span>
          <div className="mission-level"><b>{attempt === "challenge" ? "Разведка" : "Босс уровня"}</b><span>{attempt === "challenge" ? "+20 XP за способ" : "+50 XP за перенос"}</span></div>
          <h3>{activeChallenge.prompt}</h3>
          <div>{activeChallenge.options.map((option, index) => <button
            className={`${answer === index ? "selected" : ""} ${checked && index === activeChallenge.answerIndex ? "right-answer" : ""} ${checked && answer === index && index !== activeChallenge.answerIndex ? "wrong-answer" : ""}`}
            disabled={checked}
            key={`${option}-${index}`}
            onClick={() => setAnswer(index)}
          ><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>
          {!checked && <button className="button button-red" disabled={answer === null} onClick={checkMission}>Проверить мой ход</button>}
          {checked && <section className={`mission-feedback ${correct ? "correct" : "incorrect"}`} data-testid="mistake-explanation">
            <span>{correct ? "Ход принят" : "Ошибка разобрана — энергия сохранена"}</span>
            <h3>{correct ? attempt === "retry" ? "Глава пройдена: перенос получился" : "Первый барьер взят" : "Не просто «неверно»: вот где сломалось решение"}</h3>
            {!correct && <p><b>Диагноз:</b> {activeChallenge.misconception}</p>}
            <p><b>Правило:</b> {chapter.keyRule}</p>
            <p><b>Почему:</b> {activeChallenge.explanation}</p>
            <p><b>Следующий шаг:</b> {attempt === "challenge" ? "Решите новую задачу с другими данными — ответ из примера скопировать не получится." : correct ? "Закройте главу или вернитесь к ней на повторение через 1, 3 и 7 дней." : "Вернитесь к правилу, проговорите алгоритм и начните миссию заново."}</p>
            <div className="mission-actions">
              {attempt === "challenge" && <button className="button button-dark" onClick={openTransferTask}>{correct ? "Закрепить на новой задаче →" : "Решить другое похожее →"}</button>}
              {attempt === "retry" && !correct && <button className="button button-dark" onClick={returnToRule}>Вернуться к правилу</button>}
              {attempt === "retry" && correct && chapterIndex < chapters.length - 1 && <button className="button button-dark" onClick={() => changeChapter(chapterIndex + 1)}>Следующая глава →</button>}
            </div>
          </section>}
        </section>}
        <section className="chapter-selfcheck"><span className="exam-label">Самостоятельная работа</span><ul>{chapter.selfCheck.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <div className="chapter-nav"><button disabled={chapterIndex === 0} onClick={() => changeChapter(chapterIndex - 1)}>← Предыдущая глава</button><button disabled={chapterIndex === chapters.length - 1} onClick={() => changeChapter(chapterIndex + 1)}>Следующая глава →</button></div>
      </article>
    </section>

    <section className="licensed-books-note">
      <div><span className="exam-label">Те же издательские учебники</span><h2>Можно подключить после подтверждения прав.</h2></div>
      <p>Чтобы добавить конкретные учебники школы без нарушения авторских прав, нужны список «класс → предмет → автор → издательство» и лицензия либо разрешённые электронные файлы. Библиотека уже готова принять такие комплекты.</p>
    </section>
  </main>;
}
