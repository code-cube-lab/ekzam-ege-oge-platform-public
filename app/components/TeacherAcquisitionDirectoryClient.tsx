"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { teacherAcquisitionPlaybooks } from "../../knowledge-base/marketing/teacher-acquisition";

export function TeacherAcquisitionDirectoryClient() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("all");
  const subjectOptions = useMemo(() => Array.from(new Map(teacherAcquisitionPlaybooks.map((item) => [item.subjectSlug, item.subjectName])).entries()), []);
  const visible = teacherAcquisitionPlaybooks.filter((item) => {
    const haystack = `${item.name} ${item.subjectName} ${item.focus.join(" ")}`.toLowerCase();
    return (subject === "all" || item.subjectSlug === subject) && haystack.includes(query.trim().toLowerCase());
  });

  return <main className="teacher-ecosystem-directory">
    <header className="teacher-ecosystem-top">
      <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
      <nav><Link href="/growth">Центр роста</Link><Link href="/teachers">Команда</Link><Link className="button button-red button-small" href="/exam">Тренажёр</Link></nav>
    </header>

    <section className="teacher-directory-hero">
      <div><span className="exam-kicker light">Экосистема привлечения учеников</span><h1>Не один общий план.<br /><em>27 отдельных маршрутов.</em></h1><p>У каждого преподавателя — собственная страница, боль аудитории, диагностическое задание, подробные Reels, партнёрские источники и сообщения классным руководителям.</p></div>
      <div className="teacher-directory-stats"><article><strong>{teacherAcquisitionPlaybooks.length}</strong><span>персональных страниц</span></article><article><strong>{teacherAcquisitionPlaybooks.reduce((sum, item) => sum + item.reels.length, 0)}</strong><span>подробных сценариев</span></article><article><strong>4</strong><span>ссылки с разными метками</span></article></div>
    </section>

    <section className="teacher-directory-explainer">
      <article><span>01</span><div><h2>Преподаватель показывает пользу</h2><p>Короткий ролик ведёт не на главную, а сразу в конкретное экзаменационное задание.</p></div></article>
      <article><span>02</span><div><h2>Родитель видит причину</h2><p>После попытки открывается объяснение и понятный следующий шаг — без обещания гарантированного балла.</p></div></article>
      <article><span>03</span><div><h2>Заказ приходит человеку</h2><p>Платное продолжение связано с именем преподавателя, его расписанием и подтверждённой услугой.</p></div></article>
    </section>

    <section className="teacher-directory-catalog">
      <header><div><span className="exam-kicker">Выберите преподавателя</span><h2>Открыть персональный маршрут</h2></div><div className="teacher-directory-filters"><input aria-label="Поиск преподавателя" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Имя, предмет или специализация" /><select aria-label="Фильтр предмета" value={subject} onChange={(event) => setSubject(event.target.value)}><option value="all">Все предметы</option>{subjectOptions.map(([slug, name]) => <option key={slug} value={slug}>{name}</option>)}</select></div></header>
      <div className="teacher-ecosystem-grid">{visible.map((teacher, index) => <article key={teacher.id}>
        <div className="teacher-card-index"><span>{String(index + 1).padStart(2, "0")}</span><b>{teacher.initials}</b></div>
        <small>{teacher.subjectName}</small><h3>{teacher.name}</h3><p>{teacher.positioning}</p>
        <div className="teacher-card-focus">{teacher.focus.slice(0, 3).map((focus) => <span key={focus}>{focus}</span>)}</div>
        <footer><em>{teacher.participationLabel}</em><Link href={`/growth/teachers/${teacher.id}`}>Открыть маршрут →</Link></footer>
      </article>)}</div>
      {visible.length === 0 ? <p className="teacher-directory-empty">Ничего не найдено. Сбросьте предмет или измените запрос.</p> : null}
    </section>
  </main>;
}

