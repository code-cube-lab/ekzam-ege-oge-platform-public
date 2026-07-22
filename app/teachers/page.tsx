import Link from "next/link";
import { russianTeachers } from "../../knowledge-base/teachers/teacher-registry";

export default function TeachersPage() {
  return <main className="faculty-page">
    <header className="faculty-top">
      <Link className="brand" href="/"><span className="brand-mark">С</span><span>СЛОВО</span></Link>
      <Link className="button button-ghost button-small" href="/">На главную</Link>
    </header>
    <section className="faculty-hero">
      <div className="section-kicker">Педагогическая система · русский язык и литература</div>
      <h1>Публичный реестр<br /><em>преподавателей.</em></h1>
      <p>Источник первого набора — официальный сайт и архив Ставропольского президентского кадетского училища, найденные по точному совпадению профиля Елены Николаевны Михайличенко. Для каждого профиля создан отдельный каркас навыка.</p>
      <div className="faculty-warning"><b>Важно:</b> публикация в реестре не означает участие преподавателя в проекте. До появления курса, личного кабинета или обещания проверки работ требуется согласие самого педагога и интервью по его методике.</div>
    </section>
    <section className="faculty-grid" aria-label="Список преподавателей русского языка и литературы">
      {russianTeachers.map((teacher) => <article className={`faculty-card ${teacher.participation === "project-lead-by-brief" ? "lead" : ""}`} key={teacher.slug}>
        <div className="faculty-card-top"><span className="faculty-avatar">{teacher.initials}</span><span className={`evidence-chip ${teacher.evidenceStatus === "official-archive-profile" ? "archive" : ""}`}>{teacher.evidenceStatus === "official-current-section" ? "есть на действующем сайте" : "архивный профиль"}</span></div>
        <h2>{teacher.name}</h2>
        <p className="faculty-subjects">{teacher.subjects.join(" · ")}</p>
        <div className="faculty-focus">{teacher.publicFocus.map((focus) => <span key={focus}>{focus}</span>)}</div>
        <p className="faculty-note">{teacher.evidenceNote}</p>
        <div className="faculty-foot"><span>{teacher.participation === "project-lead-by-brief" ? "Основной эксперт по заданию владельца" : "Участие не подтверждено"}</span><a href={teacher.sourceUrl} target="_blank" rel="noreferrer">Источник ↗</a></div>
      </article>)}
    </section>
    <section className="subjects-roadmap faculty-roadmap"><div><div className="section-kicker light">Следующие предметы</div><h2>Одна система — разные экспертные команды</h2></div><div className="subject-pills"><span className="active">Русский и литература</span><span>Математика</span><span>Иностранные языки</span><span>История и обществознание</span><span>Физика</span><span>Химия</span><span>Биология</span></div></section>
  </main>;
}
