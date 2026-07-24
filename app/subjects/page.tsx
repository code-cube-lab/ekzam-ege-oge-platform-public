import Link from "next/link";
import { examSubjects } from "../../knowledge-base/exams/exam-subjects";
import { subjectLeads } from "../../knowledge-base/teachers/subject-leads";
import { TeacherPhoto } from "../components/TeacherPhoto";

export default function SubjectsPage() {
  return <main className="catalog-page">
    <header className="faculty-top">
      <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
      <div className="catalog-actions"><Link href="/school">Школа 5–11</Link><Link href="/teachers">Преподаватели</Link><Link className="button button-red button-small" href="/exam">Начать практику</Link></div>
    </header>
    <section className="catalog-hero">
      <div><span className="exam-label">15 предметов · 5–11 классы</span><h1>Выберите предмет.<br /><em>Увидьте весь маршрут.</em></h1></div>
      <p>У каждого направления есть школьная вертикаль, стартовая авторская практика и отдельный трекер полного открытого материала ФИПИ. Французский и испанский уже доступны; преподаватели этих направлений ещё подбираются.</p>
    </section>
    <section className="subject-lead-grid" aria-label="Предметы и преподаватели">
      {examSubjects.map((subject, index) => {
        const lead = subjectLeads.find((item) => item.skillSlug === subject.teacherSkillSlug);
        return <article className="subject-lead-card" key={subject.slug}>
          <div className="subject-lead-top"><span>{String(index + 1).padStart(2, "0")}</span><b>{subject.exam}</b></div>
          <h2>{subject.name}</h2>
          {lead ? <><div className="lead-person"><TeacherPhoto lead={lead} /><div><b>{lead.teacher}</b><small>{lead.department}</small></div></div><p>{subject.slug === "russian" ? "105 авторских заданий" : "10 стартовых авторских заданий"}: {subject.focus.join(", ")}. Задания ОГЭ и ЕГЭ решаются по одному прямо на платформе.</p><div className="lead-foot"><span>Участие уточняется</span><Link href={`/exam?subject=${subject.slug}`}>Открыть предмет →</Link></div></> : <><div className="lead-person"><span className="teacher-photo-fallback">+</span><div><b>Преподаватель подбирается</b><small>Иностранный язык</small></div></div><p>Подключены методика 5–11 классов и 10 стартовых заданий на сайте. Платная группа пока не открыта.</p><div className="lead-foot"><span>Набор не открыт</span><Link href={`/exam?subject=${subject.slug}`}>Открыть предмет →</Link></div></>}
        </article>;
      })}
    </section>
    <section className="catalog-note"><b>Что доступно сейчас</b><p>Бесплатная диагностика работает по всем 15 предметам. Платные группы откроются только после утверждения преподавателей, расписания и программы. Поэтому на сайте нет обещаний занятий с человеком, который ещё не подтвердил участие.</p></section>
  </main>;
}
