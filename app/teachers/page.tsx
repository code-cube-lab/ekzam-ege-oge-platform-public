import Link from "next/link";
import { generatedTeacherVisuals, subjectLeads, verifiedTeacherPhotos } from "../../knowledge-base/teachers/subject-leads";
import { examSubjects } from "../../knowledge-base/exams/exam-subjects";
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
      <p>Для каждого направления показаны предметный профиль, экзаменационные умения и методика работы после ошибки. Публичный профиль не означает участия в проекте: подключить занятия можно только после отдельного согласия преподавателя.</p>
      <div className="teacher-role-strip"><article><b>Система</b><span>выдаёт практику и собирает прогресс</span></article><article><b>Преподаватель</b><span>проверяет сложные работы и объясняет ошибки</span></article><article><b>Родитель</b><span>получает короткий отчёт раз в неделю</span></article></div>
    </section>

    <section className="section subject-leads-section">
      <div className="section-kicker">13 предметных профилей · 7 официальных фото · 6 AI-визуалов направлений</div>
      <div className="subject-lead-grid compact-leads">
        {subjectLeads.map((lead) => {
          const subject = examSubjects.find((item) => item.slug === lead.slug);
          return <article className="subject-lead-card" key={lead.slug}>
          <div className="subject-lead-top"><span>{lead.initials}</span><b>{lead.exam}</b></div>
          <h2>{lead.subject}</h2>
          <div className="lead-person"><TeacherPhoto lead={lead} /><div><b>{lead.teacher}</b><small>{lead.department}</small></div></div>
          <div className="subject-skill-list"><span>Предметные умения</span>{subject?.focus.map((skill) => <b key={skill}>{skill}</b>)}</div>
          <p>{verifiedTeacherPhotos[lead.skillSlug] ? "Фотография взята из официальной публикации училища — источник открывается по нажатию." : generatedTeacherVisuals[lead.skillSlug] ? "Это продающий AI-визуал предметного направления, а не изображение указанного преподавателя." : "Однозначно подписанное официальное фото ещё не найдено."}</p>
          <div className="lead-foot"><span>Участие уточняется</span><Link href={`/teacher-academy?subject=${lead.slug}`}>Методика →</Link><a href={lead.sourceUrl} target="_blank" rel="noreferrer">Источник ↗</a></div>
        </article>})}
      </div>
    </section>

    <section className="catalog-note teacher-legal-note"><b>Почему написано «участие уточняется»</b><p>Публичная карточка подтверждает только профессиональный профиль из официального источника. AI-визуал показывает атмосферу предмета и не изображает конкретного человека. До открытия платного потока школа должна получить согласие преподавателя, согласовать программу, расписание, договор и коммерческое использование имени и реальной фотографии.</p></section>
  </main>;
}
