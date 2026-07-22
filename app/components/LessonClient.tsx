"use client";

import { useState } from "react";
import Link from "next/link";
import type { LessonLevel, LessonUnit } from "../../knowledge-base/lessons/lesson-units";

const order: LessonLevel[] = ["foundation", "basic", "exam", "advanced"];

export function LessonClient({ lesson }: { lesson: LessonUnit }) {
  const [level, setLevel] = useState<LessonLevel>("foundation");
  const [answer, setAnswer] = useState<number | null>(null);
  const task = lesson.levels[level];
  const correct = answer === task.correctIndex;
  const embed = `https://www.youtube-nocookie.com/embed/${lesson.video.youtubeId}?start=${lesson.video.startSeconds}&end=${lesson.video.endSeconds}&rel=0`;

  function changeLevel(next: LessonLevel) {
    setLevel(next);
    setAnswer(null);
  }

  return (
    <main className="lesson-shell">
      <header className="lesson-top">
        <Link className="brand" href="/"><span className="brand-mark">С</span><span>СЛОВО</span></Link>
        <div><span>Первый модуль</span><b>{lesson.subject}</b></div>
        <Link className="button button-ghost button-small" href="/dashboard">В кабинет</Link>
      </header>

      <section className="lesson-hero">
        <div><span className="section-kicker">Видео → объяснение → задание → разбор</span><h1>{lesson.title}</h1><p>{lesson.purpose}</p></div>
        <div className="lesson-track">{lesson.examTracks.join(" · ")}</div>
      </section>

      <nav className="level-switch" aria-label="Уровень сложности">
        {order.map((item) => <button key={item} className={level === item ? "active" : ""} onClick={() => changeLevel(item)}>{lesson.levels[item].label}</button>)}
      </nav>

      <div className="lesson-grid">
        <section className="lesson-panel video-panel">
          <div className="lesson-panel-head"><span>01</span><div><h2>Короткий видеофрагмент</h2><p>{lesson.video.title}</p></div></div>
          <div className="video-frame"><iframe src={embed} title={lesson.video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
          <div className="source-note"><b>Источник:</b> {lesson.video.author}. <a href={lesson.video.sourceUrl} target="_blank" rel="noreferrer">Открыть оригинал</a><small>{lesson.video.sourceStatus}</small></div>
        </section>

        <section className="lesson-panel theory-panel">
          <div className="lesson-panel-head"><span>02</span><div><h2>Объяснение преподавателя</h2><p>По проверенной базе знаний платформы</p></div></div>
          <ol>{lesson.theory.map((item) => <li key={item}>{item}</li>)}</ol>
          <div className="worked-example"><b>Разобранный пример</b><p>{lesson.example}</p></div>
        </section>

        <section className="lesson-panel task-panel">
          <div className="lesson-panel-head"><span>03</span><div><h2>Самостоятельная попытка</h2><p>{task.label} уровень</p></div></div>
          <p className="task-instruction">{task.instruction}</p>
          <h3>{task.question}</h3>
          <div className="answer-list">
            {task.options.map((option, index) => <button key={option} className={`answer ${answer === index ? "selected" : ""}`} disabled={answer !== null} onClick={() => setAnswer(index)}>{String.fromCharCode(65 + index)}. {option}</button>)}
          </div>
        </section>

        <section className={`lesson-panel review-panel ${answer === null ? "waiting" : correct ? "correct" : "incorrect"}`}>
          <div className="lesson-panel-head"><span>04</span><div><h2>Разбор ответа</h2><p>Формирующая обратная связь</p></div></div>
          {answer === null ? <div className="review-wait"><b>Сначала выберите ответ</b><p>Разбор откроется после самостоятельной попытки — не до неё.</p></div> : <div className="review-content"><b>{correct ? "Верно" : "Пока неверно"}</b><p><strong>Диагноз:</strong> {lesson.title}</p><p><strong>Правило:</strong> {task.explanation}</p><p><strong>Следующий шаг:</strong> {task.nextStep}</p><button className="button button-dark" onClick={() => setAnswer(null)}>Попробовать ещё раз</button></div>}
        </section>
      </div>

      <section className="subjects-roadmap"><div><span className="section-kicker">Масштабирование</span><h2>Один учебный двигатель — разные предметы</h2></div><div className="subject-pills"><span className="active">Русский · подключён</span><span>Литература · база растёт</span><span>Математика · следующий модуль</span><span>История · по контракту</span><span>Другие предметы · позже</span></div></section>
    </main>
  );
}
