import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Школам и учебным центрам — пилот ЭКЗАМ",
  description: "Проверяемый пилот подготовки к ОГЭ и ЕГЭ: один класс, один предмет, одна линия и понятные критерии результата.",
};

const pilotSteps = [
  ["Неделя 0", "Выбор линии", "Предметный эксперт выбирает одно проверяемое умение и подтверждает задания, ответы и разборы."],
  ["Неделя 1", "Стартовая попытка", "Ученики получают одну ссылку и выполняют короткую серию без подсказки."],
  ["Неделя 2", "Отработка", "После ошибки открывается правило и другое условие того же экзаменационного типа."],
  ["Неделя 3", "Повтор без подсказки", "Система возвращает слабую линию и фиксирует перенос навыка."],
  ["Неделя 4", "Решение о масштабе", "Школа получает обезличенную сводку и решает, нужен ли следующий предмет или класс."],
];

export default function ForSchoolsPage() {
  return <main className="audience-page school-sales-page">
    <header className="audience-topbar">
      <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
      <nav><Link href="/for-parents">Родителям</Link><Link href="/for-teachers">Педагогам</Link><Link href="/teacher-academy">Методики</Link></nav>
      <Link className="button button-dark button-small" href="/support">Обсудить пилот</Link>
    </header>

    <section className="audience-hero school-hero">
      <div>
        <span className="exam-kicker">Для школы и учебного центра</span>
        <h1>Не покупать платформу.<br /><em>Сначала проверить один навык.</em></h1>
        <p>Пилот ограничен одним предметом, одним классом и одной экзаменационной линией. До масштабирования школа видит, начали ли ученики работу, где повторяются ошибки и помогла ли повторная серия.</p>
        <div className="sales-hero-actions"><Link className="button button-red" href="/for-teachers#builder">Собрать демо-работу →</Link><Link className="button button-ghost" href="/teacher-academy">Проверить методику</Link></div>
      </div>
      <aside className="school-pilot-card"><span>ПИЛОТ · 4 НЕДЕЛИ</span><strong>1 класс<br />1 предмет<br />1 линия</strong><p>Критерий продолжения — не просмотры, а завершённые попытки, повтор ошибок и решение предметного эксперта.</p></aside>
    </section>

    <section className="school-benefits">
      <article><span>01</span><h2>Учителю</h2><p>Ссылка на работу, автоматическая проверка кратких ответов и очередь развёрнутых работ.</p></article>
      <article><span>02</span><h2>Руководителю</h2><p>Обезличенная сводка по завершению, слабым линиям и повторным попыткам.</p></article>
      <article><span>03</span><h2>Родителю</h2><p>Понятный следующий шаг ребёнка без сравнения с классом и публичного рейтинга.</p></article>
    </section>

    <section className="school-pilot-plan">
      <header><span className="exam-kicker">Как проходит пилот</span><h2>Пять контрольных точек вместо большой презентации</h2></header>
      <div>{pilotSteps.map(([time, title, text]) => <article key={time}><span>{time}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
    </section>

    <section className="school-boundaries">
      <div><span className="exam-kicker light">Границы ответственности</span><h2>Автоматика не подменяет предметную комиссию</h2></div>
      <ul><li><b>Краткий однозначный ответ</b><span>может проверяться автоматически по утверждённому ключу.</span></li><li><b>Сочинение и спорный ответ</b><span>передаются преподавателю вместе с сырой попыткой ученика.</span></li><li><b>Низкая уверенность</b><span>не превращается в окончательную оценку.</span></li><li><b>Новый предмет</b><span>не открывается без источников, экзаменационного года, рубрик и человеческой выборочной проверки.</span></li></ul>
    </section>

    <section className="audience-final">
      <div><span className="exam-kicker light">Начало без интеграции</span><h2>Сначала откройте демо как ученик и проверьте одну линию.</h2></div>
      <div><Link className="button button-yellow" href="/practice">Открыть практику →</Link><Link className="button button-ghost light" href="/for-teachers">Инструменты педагога</Link></div>
    </section>
  </main>;
}
