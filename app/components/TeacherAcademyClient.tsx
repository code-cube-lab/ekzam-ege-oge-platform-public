"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  getSubjectSchoolProfile,
  schoolGrades,
  subjectSchoolProfiles,
  teacherLessonProtocol,
  tutorMarketSnapshot,
} from "../../knowledge-base/curriculum/school-curriculum";

type Props = { initialSubject?: string };

export function TeacherAcademyClient({ initialSubject = "russian" }: Props) {
  const [subjectSlug, setSubjectSlug] = useState(
    () => getSubjectSchoolProfile(initialSubject).slug,
  );
  const subject = getSubjectSchoolProfile(subjectSlug);

  return (
    <main className="teacher-academy">
      <header className="academy-top">
        <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
        <nav><Link href="/school">Школа 6–11</Link><Link href="/for-teachers">Инструменты</Link><Link href="/teacher">Кабинет</Link></nav>
        <Link className="button button-dark button-small" href={`/exam?subject=${subject.slug}&count=5&teacher=academy`}>Собрать работу</Link>
      </header>

      <section className="academy-hero">
        <div><span className="exam-label">Академия педагога · 15 предметов</span><h1>Методика, которая начинается <em>после ошибки ученика.</em></h1><p>Для каждого предмета: школьные предпосылки 6–11 классов, дефициты по аналитике ФИПИ, сценарий объяснения, авторская практика и повторение.</p></div>
        <div className="academy-hero-note"><span>Принцип</span><strong>Не показать ответ.<br />Научить переносу.</strong><p>Диагностика → причина → короткая теория → похожая задача → смешанная задача → дневник.</p></div>
      </section>

      <section className="academy-subjects" aria-label="Предметные методики">
        {subjectSchoolProfiles.map((item) => (
          <button className={item.slug === subjectSlug ? "active" : ""} key={item.slug} onClick={() => setSubjectSlug(item.slug)} style={{ "--subject-color": item.color } as CSSProperties}>
            <span>{item.code}</span><b>{item.name}</b><small>{item.authorTaskCount} заданий</small>
          </button>
        ))}
      </section>

      <section className="academy-method" style={{ "--subject-color": subject.color } as CSSProperties}>
        <div className="academy-method-title">
          <span className="subject-code large">{subject.code}</span>
          <div><span className="exam-label">{subject.name}</span><h2>{subject.teacherFocus}</h2><p>{subject.teacherMove}</p></div>
          <div className={`academy-readiness ${subject.bankStatus}`}><b>{subject.authorTaskCount}</b><span>авторских заданий</span><small>{subject.bankStatus === "expanded" ? "расширенный банк" : "стартовый предметный выпуск"}</small></div>
        </div>

        <div className="academy-grid">
          <article className="academy-risks">
            <span className="exam-label">Ошибки участников ЕГЭ-2025 → педагогическое действие</span>
            <h3>Точки, которые нельзя закрыть ещё одним пробником</h3>
            {subject.examRisks.map((risk, index) => (
              <div key={risk.skill}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <section><b>{risk.skill}</b><p><strong>Сигнал:</strong> {risk.signal}.</p><p><strong>Отработка:</strong> {risk.intervention}.</p></section>
              </div>
            ))}
            <a className="academy-source" href={subject.methodologyUrl} target="_blank" rel="noreferrer">Открыть методические рекомендации ФИПИ ↗</a>
          </article>

          <article className="academy-protocol">
            <span className="exam-label">Конструктор урока</span>
            <h3>Семь обязательных шагов</h3>
            <ol>{teacherLessonProtocol.map((step) => <li key={step}>{step}</li>)}</ol>
          </article>
        </div>
      </section>

      <section className="academy-continuity">
        <div><span className="exam-label">Преемственность 6–11</span><h2>Экзамен не начинается в десятом классе</h2><p>Каждая экзаменационная линия привязана к школьной теме, которую нужно вернуть в маршрут при обнаружении пробела.</p></div>
        <div className="continuity-row">
          {schoolGrades.map((grade) => (
            <article key={grade}><span>{grade}</span><b>{subject.gradeTopics[grade][0]}</b><p>{subject.gradeTopics[grade].slice(1).join(" · ")}</p></article>
          ))}
        </div>
      </section>

      <section className="academy-lesson">
        <div><span className="exam-label">Готовый микроурок</span><h2>{subject.lesson.title}</h2><p>{subject.lesson.theory}</p><blockquote>{subject.lesson.example}</blockquote></div>
        <div><span className="exam-label">Проверка переноса</span><h3>{subject.lesson.question}</h3><ul>{subject.lesson.options.map((option, index) => <li key={option}><span>{String.fromCharCode(65 + index)}</span>{option}</li>)}</ul><p><b>Ключ для педагога:</b> {subject.lesson.explanation}</p></div>
      </section>

      <section className="tutor-market">
        <div className="school-section-head">
          <div><span className="exam-label">Цены репетиторов Москвы</span><h2>С чем сравнивает родитель</h2></div>
          <span className="demo-label">проверено {tutorMarketSnapshot.checkedAt}</span>
        </div>
        <p className="market-limit">{tutorMarketSnapshot.limitation}</p>
        <div className="market-offers">
          {tutorMarketSnapshot.offers.map((offer) => (
            <a href={offer.url} target="_blank" rel="noreferrer" key={offer.label}>
              <span>{offer.source}</span><b>{offer.label}</b><strong>{offer.price}</strong><small>Открыть источник ↗</small>
            </a>
          ))}
        </div>
        <div className="market-position">
          <article><span>Цифровой маршрут</span><strong>1 490 ₽/мес.</strong><p>Самостоятельная практика, объяснения и отчёт родителю — дешевле типичного индивидуального занятия.</p></article>
          <article><span>Группа с педагогом</span><strong>4 490 ₽/мес.</strong><p>Платформа + еженедельный урок и проверка — стоимость объясняется не количеством тестов, а обратной связью.</p></article>
          <article><span>Инструмент педагога</span><strong>990 ₽/мес.</strong><p>Работы, автоматическая отработка и аналитика класса. Оплата пока принимается только через заявку.</p></article>
        </div>
      </section>

      <section className="academy-cta">
        <div><span className="exam-label">Практика</span><h2>Соберите работу по выбранному предмету</h2><p>Начните с пяти заданий, посмотрите причины ошибок и назначьте повторную серию.</p></div>
        <div><Link className="button button-primary" href={`/exam?subject=${subject.slug}&count=5&teacher=academy`}>Открыть тренажёр</Link><Link className="button button-ghost" href="/for-teachers">Тарифы для педагогов</Link></div>
      </section>
    </main>
  );
}
