import Link from "next/link";
import { subjectLeads, verifiedTeacherPhotos } from "../../knowledge-base/teachers/subject-leads";
import { TeacherPhoto } from "../components/TeacherPhoto";

export default function TeachersPage() {
  return <main className="faculty-page">
    <header className="faculty-top">
      <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
      <div className="catalog-actions"><Link href="/subjects">Все предметы</Link><Link className="button button-red button-small" href="/exam">Бесплатная диагностика</Link></div>
    </header>

    <section className="faculty-hero exam-faculty-hero">
      <div className="exam-label">Преподаватели по предметам</div>
      <h1>Понятно, кто отвечает<br /><em>за обучение ребёнка.</em></h1>
      <p>Для каждого основного направления выбран предметный профиль по официальным материалам Ставропольского президентского кадетского училища. На карточке видны предмет, преподаватель и ссылка на источник.</p>
      <div className="teacher-role-strip"><article><b>Система</b><span>выдаёт практику и собирает прогресс</span></article><article><b>Преподаватель</b><span>проверяет сложные работы и объясняет ошибки</span></article><article><b>Родитель</b><span>получает короткий отчёт раз в неделю</span></article></div>
    </section>

    <section className="section subject-leads-section">
      <div className="section-kicker">13 предметных профилей · 7 официальных фотографий</div>
      <div className="subject-lead-grid compact-leads">
        {subjectLeads.map((lead) => <article className="subject-lead-card" key={lead.slug}>
          <div className="subject-lead-top"><span>{lead.initials}</span><b>{lead.exam}</b></div>
          <h2>{lead.subject}</h2>
          <div className="lead-person"><TeacherPhoto lead={lead} /><div><b>{lead.teacher}</b><small>{lead.department}</small></div></div>
          <p>{verifiedTeacherPhotos[lead.skillSlug] ? "На карточке используется изображение из официальной публикации училища." : "Для этого профиля оставлены инициалы: однозначно подписанное официальное фото ещё не найдено."}</p>
          <div className="lead-foot"><span>Участие уточняется</span><a href={lead.sourceUrl} target="_blank" rel="noreferrer">Профиль ↗</a></div>
        </article>)}
      </div>
    </section>

    <section className="catalog-note teacher-legal-note"><b>Почему написано «участие уточняется»</b><p>Публичная карточка подтверждает только профессиональный профиль из официального источника. До открытия платного потока школа должна получить согласие преподавателя, согласовать программу, расписание, договор и коммерческое использование имени и изображения.</p></section>
  </main>;
}
