"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  getSubjectSchoolProfile,
  officialSchoolLinks,
  schoolGrades,
  subjectSchoolProfiles,
  teacherLessonProtocol,
  type SchoolGrade,
} from "../../knowledge-base/curriculum/school-curriculum";

type SchoolRole = "student" | "parent" | "teacher";
type AnswerState = "idle" | "correct" | "incorrect";

const diaryRows = [
  { day: "Пн", subject: "Математика", mark: "4", work: "Проценты · выполнено", status: "Сдано" },
  { day: "Вт", subject: "Русский язык", mark: "5", work: "Н и НН · 8/9", status: "Сдано" },
  { day: "Ср", subject: "Физика", mark: "—", work: "Сила и ускорение", status: "Сегодня" },
  { day: "Чт", subject: "История", mark: "—", work: "Причины реформ", status: "Назначено" },
  { day: "Пт", subject: "Английский", mark: "—", work: "Письмо · 120 слов", status: "Назначено" },
];

const roleLabels: Record<SchoolRole, string> = {
  student: "Ученик",
  parent: "Родитель",
  teacher: "Педагог",
};

function progressFor(index: number, grade: SchoolGrade) {
  return 42 + ((index * 13 + grade * 7) % 49);
}

export function SchoolHubClient() {
  const [role, setRole] = useState<SchoolRole>("student");
  const [grade, setGrade] = useState<SchoolGrade>(9);
  const [subjectSlug, setSubjectSlug] = useState("math");
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [xp, setXp] = useState(640);
  const subject = getSubjectSchoolProfile(subjectSlug);
  const stageLabel = grade <= 7 ? "Фундамент" : grade <= 9 ? "Маршрут к ОГЭ" : "Маршрут к ЕГЭ";
  const averageProgress = useMemo(
    () =>
      Math.round(
        subjectSchoolProfiles.reduce(
          (sum, _, index) => sum + progressFor(index, grade),
          0,
        ) / subjectSchoolProfiles.length,
      ),
    [grade],
  );

  function chooseSubject(slug: string) {
    setSubjectSlug(slug);
    setAnswerState("idle");
    setSelectedAnswer(null);
  }

  function checkAnswer() {
    if (selectedAnswer === null) return;
    const correct = selectedAnswer === subject.lesson.answerIndex;
    setAnswerState(correct ? "correct" : "incorrect");
    if (correct) setXp((value) => value + 30);
  }

  return (
    <main className="school-hub">
      <header className="school-topbar">
        <Link className="brand exam-brand" href="/">
          <span className="brand-mark">Э</span><span>ЭКЗАМ</span>
        </Link>
        <nav aria-label="Разделы школы">
          <a href="#route">Маршрут</a>
          <a href="#textbook">Учебник</a>
          <a href="#diary">Дневник</a>
          <Link href="/teacher-academy">Академия педагога</Link>
        </nav>
        <Link className="button button-dark button-small" href="/exam">Тренироваться</Link>
      </header>

      <section className="school-hero">
        <div>
          <span className="exam-label">Школа 6–11 классов · ОГЭ · ЕГЭ</span>
          <h1>Не набор тестов.<br /><em>Единый учебный маршрут.</em></h1>
          <p>Тема из школьной программы превращается в понятное объяснение, практику, исправление ошибки, повторение и запись результата в дневник.</p>
        </div>
        <div className="school-hero-board" aria-label="Сводка маршрута">
          <div><span>Класс</span><strong>{grade}</strong></div>
          <div><span>Предметов</span><strong>15</strong></div>
          <div><span>Общий прогресс</span><strong>{averageProgress}%</strong></div>
          <div><span>Режим</span><strong>{stageLabel}</strong></div>
        </div>
      </section>

      <section className="school-role-switch" aria-label="Просмотр по роли">
        <div>
          <span className="exam-label">Один учебный процесс — разные роли</span>
          <h2>Что видит каждый участник</h2>
        </div>
        <div className="school-role-buttons">
          {(Object.keys(roleLabels) as SchoolRole[]).map((item) => (
            <button
              className={role === item ? "active" : ""}
              key={item}
              onClick={() => setRole(item)}
            >
              {roleLabels[item]}
            </button>
          ))}
        </div>
      </section>

      {role === "student" && (
        <section className="role-preview student-preview" data-testid="student-school-view">
          <div className="game-status">
            <div><span>Уровень 8</span><strong>{xp} XP</strong><small>До следующего уровня — {Math.max(0, 800 - xp)} XP</small></div>
            <div><span>Серия</span><strong>6 дней</strong><small>Лучший результат месяца</small></div>
            <div><span>Лига</span><strong>Исследователь</strong><small>5 место в учебной группе</small></div>
          </div>
          <article className="daily-quest">
            <div><span className="quest-badge">Квест дня · +30 XP</span><h2>{subject.lesson.title}</h2><p>{subject.lesson.question}</p></div>
            <div className="quest-options">
              {subject.lesson.options.map((option, index) => (
                <button
                  className={selectedAnswer === index ? "selected" : ""}
                  disabled={answerState !== "idle"}
                  key={option}
                  onClick={() => setSelectedAnswer(index)}
                >
                  <span>{String.fromCharCode(65 + index)}</span>{option}
                </button>
              ))}
            </div>
            {answerState === "idle" ? (
              <button className="button button-primary" disabled={selectedAnswer === null} onClick={checkAnswer}>Проверить и получить XP</button>
            ) : (
              <div className={`quest-result ${answerState}`}>
                <b>{answerState === "correct" ? "Верно · +30 XP" : "Пока нет — разберём причину"}</b>
                <p>{subject.lesson.explanation}</p>
                <button onClick={() => { setAnswerState("idle"); setSelectedAnswer(null); }}>Попробовать ещё раз</button>
              </div>
            )}
          </article>
        </section>
      )}

      {role === "parent" && (
        <section className="role-preview parent-preview" data-testid="parent-school-view">
          <div className="parent-summary">
            <article><span>Ритм</span><strong>4 из 5 дней</strong><p>Без пропусков обязательных работ</p></article>
            <article><span>Средний результат</span><strong>4,4</strong><p>Рост на 0,3 за четыре недели</p></article>
            <article><span>Нужна поддержка</span><strong>2 темы</strong><p>Проценты и пунктуационный анализ</p></article>
          </div>
          <article className="parent-action">
            <div><span className="exam-label">Не просто оценка</span><h2>Что обсудить с ребёнком сегодня</h2></div>
            <p><b>Факт:</b> три ошибки в задачах на проценты возникли при переводе условия в математическую модель.</p>
            <p><b>Следующий шаг:</b> попросите ребёнка объяснить, почему после скидки 25% остаётся 75% цены. Не подсказывайте вычисление.</p>
            <Link className="button button-dark" href="/exam?subject=math&count=5">Открыть отработку →</Link>
          </article>
          <p className="school-honesty">Это демонстрация родительского отчёта. Реальный доступ родителя должен открываться только после подтверждённой связи с учеником и отдельного согласия.</p>
        </section>
      )}

      {role === "teacher" && (
        <section className="role-preview teacher-preview" data-testid="teacher-school-view">
          <div className="teacher-school-grid">
            <article><span>7Б класс</span><strong>24 ученика</strong><p>17 выполнили работу · 6 нужна отработка</p></article>
            <article><span>Слабая линия</span><strong>{subject.examRisks[0].skill}</strong><p>{subject.examRisks[0].signal}</p></article>
            <article><span>Следующий урок</span><strong>40 минут</strong><p>{subject.teacherMove}</p></article>
          </div>
          <article className="teacher-protocol">
            <div><span className="exam-label">Методический маршрут</span><h2>{subject.name}: как провести занятие</h2><p>{subject.teacherFocus}</p></div>
            <ol>{teacherLessonProtocol.slice(0, 5).map((step) => <li key={step}>{step}</li>)}</ol>
            <div className="teacher-protocol-actions">
              <Link className="button button-primary" href={`/exam?subject=${subject.slug}&count=5&teacher=school`}>Собрать работу</Link>
              <Link className="button button-ghost" href={`/teacher-academy?subject=${subject.slug}`}>Открыть методику</Link>
            </div>
          </article>
        </section>
      )}

      <section className="school-route" id="route">
        <div className="school-section-head">
          <div><span className="exam-label">Сквозная программа</span><h2>От школьной темы к экзаменационному умению</h2></div>
          <div className="grade-switch" aria-label="Выберите класс">
            {schoolGrades.map((item) => (
              <button className={grade === item ? "active" : ""} key={item} onClick={() => setGrade(item)}>{item}</button>
            ))}
          </div>
        </div>
        <div className="subject-school-grid">
          {subjectSchoolProfiles.map((item, index) => {
            const progress = progressFor(index, grade);
            return (
              <button
                className={item.slug === subjectSlug ? "active" : ""}
                key={item.slug}
                onClick={() => chooseSubject(item.slug)}
                style={{ "--subject-color": item.color } as CSSProperties}
              >
                <span className="subject-code">{item.code}</span>
                <div><b>{item.name}</b><small>{item.gradeTopics[grade].join(" · ")}</small></div>
                <em>{progress}%</em>
                <span className="subject-progress"><i style={{ width: `${progress}%` }} /></span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="digital-textbook" id="textbook" style={{ "--subject-color": subject.color } as CSSProperties}>
        <aside>
          <span className="subject-code large">{subject.code}</span>
          <span className="exam-label">{grade} класс · {stageLabel}</span>
          <h2>{subject.name}</h2>
          <p>{subject.gradeTopics[grade].join(" → ")}</p>
          <div className="bank-status">
            <b>{subject.authorTaskCount} авторских заданий подключено</b>
            <span>{subject.bankStatus === "expanded" ? "расширенный банк" : "стартовый банк — редакторское расширение продолжается"}</span>
          </div>
        </aside>
        <article>
          <span className="exam-label">Фрагмент электронного учебника</span>
          <h2>{subject.lesson.title}</h2>
          <div className="textbook-step"><span>01</span><div><b>Понять</b><p>{subject.lesson.theory}</p></div></div>
          <div className="textbook-step"><span>02</span><div><b>Увидеть на примере</b><p>{subject.lesson.example}</p></div></div>
          <div className="textbook-step"><span>03</span><div><b>Выполнить самому</b><p>{subject.lesson.question}</p></div></div>
          <Link className="button button-dark" href={`/exam?subject=${subject.slug}&count=5`}>Перейти к серии заданий →</Link>
        </article>
      </section>

      <section className="exam-shelf">
        <div className="school-section-head">
          <div><span className="exam-label">Официальная полка</span><h2>Реальные открытые материалы ФИПИ</h2></div>
          <p>Демоверсии, спецификации и открытые банки остаются на стороне ФИПИ. Платформа строит поверх них авторскую отработку, но не выдаёт закрытые КИМ за собственный контент.</p>
        </div>
        <div className="exam-shelf-grid">
          <a href={officialSchoolLinks.egeSpecifications} target="_blank" rel="noreferrer"><span>ЕГЭ</span><b>Демоверсии и спецификации</b><small>Официальная структура экзамена ↗</small></a>
          <a href={officialSchoolLinks.ogeSpecifications} target="_blank" rel="noreferrer"><span>ОГЭ</span><b>Демоверсии и спецификации</b><small>Официальная структура 9 класса ↗</small></a>
          <a href={officialSchoolLinks.egeBank} target="_blank" rel="noreferrer"><span>ЕГЭ</span><b>Открытый банк заданий</b><small>Практика ФИПИ ↗</small></a>
          <a href={officialSchoolLinks.ogeBank} target="_blank" rel="noreferrer"><span>ОГЭ</span><b>Открытый банк заданий</b><small>Практика ФИПИ ↗</small></a>
        </div>
      </section>

      <section className="electronic-diary" id="diary">
        <div className="school-section-head">
          <div><span className="exam-label">Электронный дневник</span><h2>Оценка, домашняя работа и причина ошибки</h2></div>
          <span className="demo-label">демо-данные</span>
        </div>
        <div className="diary-table-wrap">
          <table>
            <thead><tr><th>День</th><th>Предмет</th><th>Оценка</th><th>Работа</th><th>Статус</th></tr></thead>
            <tbody>{diaryRows.map((row) => <tr key={`${row.day}-${row.subject}`}><td>{row.day}</td><td><b>{row.subject}</b></td><td><span className={row.mark === "5" ? "mark excellent" : row.mark === "4" ? "mark good" : "mark"}>{row.mark}</span></td><td>{row.work}</td><td>{row.status}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="diary-foot">
          <p><b>Следующий производственный этап:</b> подтверждённые аккаунты ученика и родителя, школьное расписание, журнал посещаемости, реальные домашние работы и выгрузка отчёта. Сейчас показан проверяемый интерфейс без выдачи демонстрационных оценок за настоящие.</p>
          <Link className="button button-ghost" href="/privacy">Как защищаются данные</Link>
        </div>
      </section>
    </main>
  );
}
