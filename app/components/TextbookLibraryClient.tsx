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

export function TextbookLibraryClient() {
  const [grade, setGrade] = useState<SchoolGrade>(5);
  const [subjectSlug, setSubjectSlug] = useState("russian");
  const [chapterIndex, setChapterIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [online, setOnline] = useState(true);
  const subject = subjectSchoolProfiles.find((item) => item.slug === subjectSlug) ?? subjectSchoolProfiles[0];
  const chapters = useMemo(() => getTextbookChapters(subject, grade), [grade, subject]);
  const chapter = chapters[chapterIndex] ?? chapters[0];

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
    setAnswer(null);
    setChecked(false);
  }

  function changeGrade(next: SchoolGrade) {
    setGrade(next);
    setChapterIndex(0);
    setAnswer(null);
    setChecked(false);
  }

  function changeChapter(index: number) {
    setChapterIndex(index);
    setAnswer(null);
    setChecked(false);
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

    <section className="book-reader" style={{ "--subject-color": subject.color } as CSSProperties}>
      <aside>
        <span className="exam-label light">{grade} класс · {subject.name}</span>
        <h2>Оглавление</h2>
        <nav>{chapters.map((item, index) => <button className={chapterIndex === index ? "active" : ""} key={item.id} onClick={() => changeChapter(index)}><span>{String(index + 1).padStart(2, "0")}</span><b>{item.title}</b></button>)}</nav>
        <p>{textbookLegalNote}</p>
      </aside>
      <article>
        <span className="exam-label">Глава {chapterIndex + 1} из {chapters.length}</span>
        <h1>{chapter.title}</h1>
        <p className="chapter-goal">{chapter.goal}</p>
        <section className="rule-card"><span>Главная опора</span><strong>{chapter.keyRule}</strong></section>
        <h2>Как работать с темой</h2>
        <ol className="chapter-method">{chapter.method.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol>
        <section className="chapter-example">
          <span className="exam-label">Пример из предмета</span>
          <h3>{subject.lesson.title}</h3>
          <p>{subject.lesson.theory}</p>
          <blockquote>{subject.lesson.example}</blockquote>
        </section>
        <section className="chapter-check">
          <span className="exam-label">Проверьте понимание</span>
          <h3>{subject.lesson.question}</h3>
          <div>{subject.lesson.options.map((option, index) => <button className={answer === index ? "selected" : ""} disabled={checked} key={option} onClick={() => setAnswer(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>
          {!checked ? <button className="button button-red" disabled={answer === null} onClick={() => setChecked(true)}>Проверить</button> : <p className={answer === subject.lesson.answerIndex ? "check-result correct" : "check-result incorrect"}><b>{answer === subject.lesson.answerIndex ? "Верно" : "Нужно повторить правило"}</b><span>{subject.lesson.explanation}</span></p>}
        </section>
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
