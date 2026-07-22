import Link from "next/link";
import { examSubjects } from "../../knowledge-base/exams/exam-subjects";
import { subjectLeads } from "../../knowledge-base/teachers/subject-leads";
import { TeacherPhoto } from "../components/TeacherPhoto";

export default function SubjectsPage() {
  return <main className="catalog-page">
    <header className="faculty-top">
      <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
      <div className="catalog-actions"><Link href="/teachers">Преподаватели</Link><Link className="button button-red button-small" href="/exam">Начать диагностику</Link></div>
    </header>
    <section className="catalog-hero">
      <div><span className="exam-label">15 предметов ЕГЭ</span><h1>Выберите предмет.<br /><em>Начните с 10 заданий.</em></h1></div>
      <p>Каждое направление имеет отдельный стартовый срез, карту тем и план подготовки. Французский и испанский уже доступны в диагностике; преподаватели этих направлений ещё подбираются.</p>
    </section>
    <section className="subject-lead-grid" aria-label="Предметы и преподаватели">
      {examSubjects.map((subject, index) => {
        const lead = subjectLeads.find((item) => item.skillSlug === subject.teacherSkillSlug);
        return <article className="subject-lead-card" key={subject.slug}>
          <div className="subject-lead-top"><span>{String(index + 1).padStart(2, "0")}</span><b>{subject.exam}</b></div>
          <h2>{subject.name}</h2>
          {lead ? <><div className="lead-person"><TeacherPhoto lead={lead} /><div><b>{lead.teacher}</b><small>{lead.department}</small></div></div><p>Стартовая диагностика: {subject.focus.join(", ")}. Профиль преподавателя выбран по официальным публикациям СПКУ.</p><div className="lead-foot"><span>Участие уточняется</span><a href={lead.sourceUrl} target="_blank" rel="noreferrer">Источник ↗</a></div></> : <><div className="lead-person"><span className="teacher-photo-fallback">+</span><div><b>Преподаватель подбирается</b><small>Иностранный язык</small></div></div><p>Диагностика из 10 заданий уже доступна. До запуска платной группы будет выбран и представлен преподаватель.</p><div className="lead-foot"><span>Набор не открыт</span><Link href="/exam">Попробовать →</Link></div></>}
        </article>;
      })}
    </section>
    <section className="catalog-note"><b>Что доступно сейчас</b><p>Бесплатная диагностика работает по всем 15 предметам. Платные группы откроются только после утверждения преподавателей, расписания и программы. Поэтому на сайте нет обещаний занятий с человеком, который ещё не подтвердил участие.</p></section>
  </main>;
}
