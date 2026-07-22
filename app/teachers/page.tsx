import Link from "next/link";
import { russianTeachers } from "../../knowledge-base/teachers/teacher-registry";
import { subjectLeads } from "../../knowledge-base/teachers/subject-leads";
import { TeacherPhoto } from "../components/TeacherPhoto";

export default function TeachersPage() {
  return <main className="faculty-page">
    <header className="faculty-top">
      <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
      <div className="catalog-actions"><Link href="/subjects">Все предметы</Link><Link className="button button-ghost button-small" href="/">На главную</Link></div>
    </header>

    <section className="faculty-hero exam-faculty-hero">
      <div className="exam-label">Педагогическая система · СПКУ как исходный реестр</div>
      <h1>Преподаватель отвечает<br /><em>за свой предмет.</em></h1>
      <p>Для запуска многопредметной школы мы выделили 13 направлений и по одному публично подтверждаемому профилю на каждое. Полный первый реестр русского языка и литературы сохранён ниже.</p>
      <div className="faculty-warning"><b>Важно:</b> ни одна карточка не означает согласия педагога работать в проекте. Перед публикацией курса нужны приглашение, интервью, договорённость и проверка методики самим преподавателем.</div>
      <div className="faculty-warning photo-warning"><b>О фотографиях:</b> показаны только четыре изображения, которые удалось однозначно связать с педагогом через официальные страницы. Для остальных оставлены инициалы. Перед коммерческим запуском нужно отдельное согласие на использование имени и изображения.</div>
    </section>

    <section className="section subject-leads-section">
      <div className="section-kicker">01 — Предметные лидеры запуска</div>
      <div className="subject-lead-grid compact-leads">
        {subjectLeads.map((lead) => <article className="subject-lead-card" key={lead.slug}>
          <div className="subject-lead-top"><span>{lead.initials}</span><b>{lead.exam}</b></div>
          <h2>{lead.subject}</h2>
          <div className="lead-person"><TeacherPhoto lead={lead} /><div><b>{lead.teacher}</b><small>{lead.department}</small></div></div>
          <p>{lead.publicEvidence}</p>
          <div className="lead-foot"><span>Участие не подтверждено</span><a href={lead.sourceUrl} target="_blank" rel="noreferrer">Источник ↗</a></div>
        </article>)}
      </div>
    </section>

    <section className="section russian-faculty-section">
      <div className="section-kicker">02 — Полный первый реестр</div>
      <h2 className="faculty-section-title">Русский язык и литература · {russianTeachers.length} профилей</h2>
      <div className="faculty-grid" aria-label="Список преподавателей русского языка и литературы">
        {russianTeachers.map((teacher) => <article className={`faculty-card ${teacher.participation === "project-lead-by-brief" ? "lead" : ""}`} key={teacher.slug}>
          <div className="faculty-card-top">
            <span className="faculty-avatar">{teacher.initials}</span>
            <span className={`evidence-chip ${teacher.evidenceStatus === "official-archive-profile" ? "archive" : ""}`}>{teacher.evidenceStatus === "official-current-section" ? "действующая публикация" : "архивный профиль"}</span>
          </div>
          <h2>{teacher.name}</h2>
          <p className="faculty-subjects">{teacher.subjects.join(" · ")}</p>
          <div className="faculty-focus">{teacher.publicFocus.map((focus) => <span key={focus}>{focus}</span>)}</div>
          <p className="faculty-note">{teacher.evidenceNote}</p>
          <div className="faculty-foot"><span>{teacher.participation === "project-lead-by-brief" ? "Кандидат по заданию владельца" : "Участие не подтверждено"}</span><a href={teacher.sourceUrl} target="_blank" rel="noreferrer">Источник ↗</a></div>
        </article>)}
      </div>
    </section>
  </main>;
}
