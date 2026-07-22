import Link from "next/link";
import { subjectLeads } from "../../knowledge-base/teachers/subject-leads";
import { TeacherPhoto } from "../components/TeacherPhoto";

export default function SubjectsPage() {
  return <main className="catalog-page">
    <header className="faculty-top">
      <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
      <div className="catalog-actions"><Link href="/exam">Тренажёр</Link><Link className="button button-ghost button-small" href="/">На главную</Link></div>
    </header>
    <section className="catalog-hero">
      <div><span className="exam-label">Предметная школа</span><h1>Один кабинет.<br /><em>Все предметы ЕГЭ.</em></h1></div>
      <p>На старте выбрано по одному публично подтверждаемому предметному профилю СПКУ. Это кандидаты для интервью и построения методики, а не заявление об их участии в платформе.</p>
    </section>
    <section className="subject-lead-grid" aria-label="Предметы и преподаватели">
      {subjectLeads.map((lead, index) => <article className="subject-lead-card" key={lead.slug}>
        <div className="subject-lead-top"><span>{String(index + 1).padStart(2, "0")}</span><b>{lead.exam}</b></div>
        <h2>{lead.subject}</h2>
        <div className="lead-person"><TeacherPhoto lead={lead} /><div><b>{lead.teacher}</b><small>{lead.department}</small></div></div>
        <p>{lead.publicEvidence}</p>
        <div className="lead-foot"><span>Участие не подтверждено</span><a href={lead.sourceUrl} target="_blank" rel="noreferrer">Источник ↗</a></div>
      </article>)}
    </section>
    <section className="catalog-note"><b>Почему пока не обещаем занятия с этими преподавателями</b><p>До публикации расписания и платного курса школа должна получить согласие педагога, провести интервью по методике, проверить задания и оформить отношения. Карточка — начало предметного направления, а не рекламное обещание.</p></section>
  </main>;
}
