import Link from "next/link";
import { TeacherPhoto } from "./components/TeacherPhoto";
import { examSubjects } from "../knowledge-base/exams/exam-subjects";
import { generatedTeacherVisuals, subjectLeads, verifiedTeacherPhotos } from "../knowledge-base/teachers/subject-leads";

const photographedTeachers = subjectLeads.filter((lead) => verifiedTeacherPhotos[lead.skillSlug] || generatedTeacherVisuals[lead.skillSlug]);

export default function Home() {
  return <main className="landing-shell exam-landing" id="top">
    <nav className="topbar exam-topbar" aria-label="Основная навигация">
      <a className="brand exam-brand" href="#top" aria-label="ЭКЗАМ — на главную"><span className="brand-mark">Э</span><span>ЭКЗАМ</span><small>школа высоких баллов</small></a>
      <div className="top-links"><Link href="/school">Школа 5–11</Link><Link href="/subjects">Предметы</Link><Link href="/teachers">Преподаватели</Link><Link href="/for-teachers">Для педагогов</Link><a href="#plans">Цены</a></div>
      <Link className="button button-small button-red" href="/exam">Бесплатная диагностика</Link>
    </nav>

    <section className="exam-hero">
      <div className="exam-hero-copy">
        <div className="exam-label"><span /> Подготовка к ЕГЭ-2027 · 15 предметов</div>
        <h1>Ребёнок готовится.<br /><em>Вы видите результат.</em></h1>
        <p>Выберите предмет и тип задания. Ребёнок решает серию на одно умение, а после каждой ошибки сразу получает правило, похожую задачу и объяснение. Полный открытый материал ФИПИ остаётся отдельной проверкой.</p>
        <div className="hero-actions"><Link className="button button-red" href="/school">Открыть школу 5–11 <span>→</span></Link><Link className="button button-ghost" href="/exam">Начать практику</Link></div>
        <div className="parent-proof"><div><strong>5–11</strong><span>единый школьный маршрут</span></div><div><strong>15</strong><span>предметов ЕГЭ</span></div><div><strong>105 + 140</strong><span>расширенный русский + стартовые банки</span></div></div>
      </div>
      <div className="exam-hero-board" aria-label="Пример родительского отчёта">
        <div className="paper-caption"><span>Личный маршрут · ЕГЭ</span><b>за неделю</b></div>
        <div className="target-line"><span>Текущий прогноз</span><strong>68</strong><em>цель 85+</em></div>
        <div className="score-scale"><i style={{ width: "68%" }} /></div>
        <div className="report-title"><span>Что изменилось</span><b>+4 балла к прогнозу</b></div>
        <div className="report-grid"><article><span>01</span><div><b>Пунктуация</b><small>2 ошибки разобраны</small></div><em className="risk">нужен повтор</em></article><article><span>02</span><div><b>Аргументация</b><small>тезис стал точнее</small></div><em className="ok">есть рост</em></article><article><span>03</span><div><b>Следующий шаг</b><small>мини-вариант в субботу</small></div><em>38 мин</em></article></div>
        <div className="parent-summary"><b>Что делать родителю?</b><p>Не становиться вторым учителем. Раз в неделю открыть отчёт и увидеть: что сделано, где нужна помощь и что будет дальше.</p></div>
      </div>
    </section>

    <section className="exam-ribbon" aria-label="Форматы экзамена"><span>Краткий ответ</span><span>Несколько правильных</span><span>Число</span><span>Соответствие</span><span>Развёрнутый ответ</span><Link href="/exam">Открыть тренажёр →</Link></section>

    <section className="school-entry">
      <div><span className="exam-label light">Теперь это школа 5–11</span><h2>Учебник, задания и дневник работают как один маршрут.</h2><p>Ученик получает ежедневный квест и отработку ошибок. Родитель видит не только оценку, но и причину пробела. Педагог получает программу урока и аналитику класса.</p></div>
      <div className="school-entry-actions"><Link className="button button-yellow" href="/school">Посмотреть школу →</Link><Link className="button button-ghost light-button" href="/teacher-academy">Академия педагога</Link></div>
    </section>

    <section className="section parent-start" id="start">
      <div className="simple-heading"><span className="exam-label">Три понятных шага</span><h2>Сначала находим слабый тип.<br />Потом отрабатываем его.</h2><p>Полный вариант нужен для диагностики, а рост дают серии заданий на конкретное проверяемое умение.</p></div>
      <div className="parent-steps">
        <Link className="parent-step" href="/subjects"><span>01</span><div><b>Выберите один из 15 предметов</b><p>У каждого предмета показан свой объём полного варианта и преподаватель направления.</p><em>Выбрать предмет →</em></div></Link>
        <Link className="parent-step featured" href="/exam"><span>02</span><div><b>Отработайте слабый тип</b><p>Для русского языка уже подключены 105 авторских заданий по 14 линиям и блокам ЕГЭ-2026.</p><em>Выбрать тип →</em></div></Link>
        <Link className="parent-step" href="/dashboard"><span>03</span><div><b>Получите вердикт и план</b><p>Уровень, слабые темы, задания на повторение и подходящий формат занятий.</p><em>Посмотреть кабинет →</em></div></Link>
      </div>
    </section>

    <section className="section subject-showcase">
      <div className="subject-head"><div><span className="exam-label light">Все предметы ЕГЭ</span><h2>Один кабинет.<br />Никакой мешанины.</h2></div><p>У каждого предмета свой полный вариант, своя карта тем и свой итоговый вердикт.</p></div>
      <div className="home-subject-grid all-exam-subjects">{examSubjects.map((subject, index) => <Link href={`/exam?subject=${subject.slug}`} key={subject.slug}><span>{String(index + 1).padStart(2, "0")}</span><h3>{subject.name}</h3><p>{subject.exam}</p><b>{subject.slug === "russian" ? "105 авторских заданий" : "10 стартовых на сайте"} →</b></Link>)}</div>
      <Link className="all-subjects-link" href="/subjects">Смотреть все предметы и преподавателей →</Link>
    </section>

    <section className="section exam-method">
      <div className="simple-heading"><span className="exam-label">Не тест из трёх кнопок</span><h2>Задания выглядят так,<br />как на экзамене.</h2><p>Один или несколько ответов, число, последовательность и развёрнутая работа. Объяснение появляется только после попытки.</p></div>
      <div className="method-board"><div className="method-tabs"><span className="active">Краткий ответ</span><span>Множественный выбор</span><span>Развёрнутая работа</span></div><div className="method-question"><small>Русский язык · орфография</small><h3>Выберите все слова, в которых на месте пропуска пишется НН.</h3><div><span>1</span>организова..ый</div><div><span>2</span>кожа..ый</div><div><span>3</span>време..ый</div><div><span>4</span>ветре..ый</div><div><span>5</span>стекля..ый</div></div><aside><span>После попытки</span><b>Правило и решение по шагам</b><p>Ученик видит не только правильный ответ, но и причину ошибки, правило и задание на повторение.</p><Link href="/exam">Решить самому →</Link></aside></div>
    </section>

    <section className="section teacher-system">
      <div className="teacher-system-copy"><span className="exam-label">Кто отвечает за обучение</span><h2>Родитель видит преподавателя и его роль.</h2><p>На платформе показаны предметные профили по официальным материалам СПКУ. Семь карточек используют подтверждённые фотографии, ещё шесть — живые AI-визуалы предметов с честной пометкой. Преподаватель проверяет сложные работы, система выдаёт практику и собирает прогресс.</p><Link className="button button-dark" href="/teachers">Посмотреть преподавателей</Link></div>
      <div className="home-teacher-grid">{photographedTeachers.map((lead) => <article key={lead.slug}><TeacherPhoto lead={lead} /><div><b>{lead.teacher}</b><span>{lead.subject}</span><small>профиль для запуска · участие уточняется</small></div></article>)}</div>
      <p className="teacher-source-note">AI-визуалы не изображают указанных преподавателей. Перед открытием платного потока школа отдельно подтверждает участие, расписание и согласие на коммерческое использование имени и реальной фотографии.</p>
    </section>

    <section className="teacher-entry">
      <div><span className="exam-label light">Отдельно для педагогов</span><h2>Соберите работу.<br />Получите карту ошибок класса.</h2><p>Выберите тип ЕГЭ, количество заданий и отправьте готовую ссылку ученикам. Краткие ответы проверяются автоматически, а после ошибки запускается отработка.</p></div>
      <div className="teacher-entry-actions"><Link className="button button-yellow" href="/teacher-academy">Открыть академию педагога →</Link><Link className="button button-ghost light-button" href="/for-teachers">Конструктор работ</Link></div>
    </section>

    <section className="section value-section" aria-labelledby="value-title">
      <div className="simple-heading"><span className="exam-label">За что платит родитель</span><h2 id="value-title">Не за доступ к видео.<br />За управляемую подготовку.</h2><p>Каждый платный формат должен давать измеримый результат и понятную ответственность.</p></div>
      <div className="value-grid"><article><span>01</span><b>Экзаменационная программа</b><p>Темы и задания собраны в маршрут к выбранной цели, а не в случайную библиотеку уроков.</p></article><article><span>02</span><b>Обратная связь</b><p>Преподаватель проверяет развёрнутые ответы, объясняет ошибки и корректирует план.</p></article><article><span>03</span><b>Регулярная практика</b><p>Короткие задания каждый день, повторение слабых тем и пробники по расписанию.</p></article><article><span>04</span><b>Отчёт родителю</b><p>Прогноз, динамика, пропуски, сделанное за неделю и следующий конкретный шаг.</p></article></div>
    </section>

    <section className="section plans-section exam-plans" id="plans">
      <div className="simple-heading"><span className="exam-label">Понятные форматы</span><h2>Родитель сразу видит,<br />за что платит.</h2><p>Бесплатно — полный вариант и вердикт. Платно — регулярная практика, проверка преподавателем или сопровождение. Цена указана за один предмет.</p></div>
      <div className="plans-grid four-plans">
        <article className="plan-card"><div><span>ДИАГНОСТИКА</span><strong>0 ₽</strong><small>без карты</small></div><ul><li>1 полный вариант</li><li>11–42 задания по предмету</li><li>Вердикт и слабые темы</li></ul><Link href="/exam" className="button button-dark">Пройти бесплатно</Link></article>
        <article className="plan-card"><div><span>ТРЕНАЖЁР</span><strong>1 490 ₽</strong><small>в месяц · 1 предмет</small></div><ul><li>Ежедневные задания</li><li>Полные решения после попытки</li><li>План повторения</li><li>Еженедельный отчёт</li></ul><Link href="/exam" className="button button-dark">Попробовать формат</Link></article>
        <article className="plan-card featured"><div className="popular">Оптимально для регулярной подготовки</div><div><span>ГРУППА</span><strong>4 490 ₽</strong><small>в месяц · 1 предмет</small></div><ul><li>Всё из тренажёра</li><li>Живой урок каждую неделю</li><li>Проверка письменных работ</li><li>До 12 учеников</li></ul><Link href="/support" className="button button-red">В лист ожидания</Link></article>
        <article className="plan-card"><div><span>МИНИ-ГРУППА + НАСТАВНИК</span><strong>7 990 ₽</strong><small>в месяц · 1 предмет</small></div><ul><li>Группа до 6 учеников</li><li>Личный маршрут</li><li>Две проверки работ в неделю</li><li>Связь и отчёт родителю</li></ul><Link href="/support" className="button button-dark">Оставить заявку</Link></article>
      </div>
      <div className="payment-explainer"><div><span>01</span><b>Сначала бесплатно</b><p>Полный вариант даёт основание выбрать формат, а не покупать вслепую.</p></div><div><span>02</span><b>Оплата только после выбора</b><p>В Telegram пилотный тренажёр оплачивается Stars. Доступ открывает только подтверждённый платёж.</p></div><div><span>03</span><b>Есть поддержка</b><p>Статус оплаты и срок доступа видны в Mini App; вопрос можно отправить через поддержку оплаты.</p></div></div>
      <div className="telegram-plan"><div><span className="exam-label">Telegram Mini App</span><h3>Тренажёр прямо в Telegram</h3><p>Полный бесплатный вариант, ежедневный маршрут и разовая оплата 199 ⭐ за 30 дней персональной практики.</p></div><Link href="/telegram" className="button button-violet">Открыть Mini App →</Link></div>
      <p className="pricing-note">Рублёвые тарифы с преподавателями включаются только после подтверждения команды, расписания и юридических реквизитов. Telegram Stars применяются только к цифровому тренажёру.</p>
    </section>

    <section className="final-exam-cta"><div><span className="exam-label light">Начните без оплаты</span><h2>Выберите предмет.<br />Решите полный вариант.</h2><p>15 предметов ЕГЭ, итоговый вердикт и объяснение после каждой попытки.</p></div><Link href="/exam" className="button button-yellow">Открыть диагностику →</Link></section>

    <footer className="exam-footer"><a className="brand exam-brand brand-light" href="#top"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></a><p>Многопредметная школа 5–11 классов с подготовкой к ОГЭ и ЕГЭ. AI помогает с ежедневной практикой, преподаватель отвечает за методику и проверку сложных работ.</p><div><Link href="/school">Школа 5–11</Link><Link href="/subjects">Предметы</Link><Link href="/teachers">Преподаватели</Link><Link href="/teacher-academy">Академия педагога</Link><Link href="/offer">Оферта</Link><Link href="/privacy">Данные</Link></div></footer>
  </main>;
}
