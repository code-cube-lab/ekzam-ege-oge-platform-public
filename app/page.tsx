import Link from "next/link";
import { TeacherPhoto } from "./components/TeacherPhoto";
import { examSubjects } from "../knowledge-base/exams/exam-subjects";
import { subjectLeads, verifiedTeacherPhotos } from "../knowledge-base/teachers/subject-leads";

const photographedTeachers = subjectLeads.filter((lead) => verifiedTeacherPhotos[lead.skillSlug]);

export default function Home() {
  return <main className="landing-shell exam-landing" id="top">
    <nav className="topbar exam-topbar" aria-label="Основная навигация">
      <a className="brand exam-brand" href="#top" aria-label="ЭКЗАМ — на главную"><span className="brand-mark">Э</span><span>ЭКЗАМ</span><small>школа высоких баллов</small></a>
      <div className="top-links"><a href="#start">Как начать</a><Link href="/subjects">Предметы</Link><Link href="/teachers">Преподаватели</Link><a href="#plans">Цены</a></div>
      <Link className="button button-small button-red" href="/exam">Бесплатная диагностика</Link>
    </nav>

    <section className="exam-hero">
      <div className="exam-hero-copy">
        <div className="exam-label"><span /> Подготовка к ЕГЭ-2027 · 15 предметов</div>
        <h1>Ребёнок готовится.<br /><em>Вы видите результат.</em></h1>
        <p>Выберите предмет, пройдите стартовый срез из 10 заданий и получите понятный план подготовки. Ребёнок решает задания в формате экзамена, преподаватель разбирает сложные работы, родитель раз в неделю видит прогресс и следующий шаг.</p>
        <div className="hero-actions"><Link className="button button-red" href="/exam">Выбрать предмет и начать <span>→</span></Link><Link className="button button-ghost" href="#plans">Посмотреть цены</Link></div>
        <div className="parent-proof"><div><strong>0 ₽</strong><span>стартовая диагностика</span></div><div><strong>15</strong><span>предметов ЕГЭ</span></div><div><strong>10 заданий</strong><span>по одному предмету</span></div></div>
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

    <section className="section parent-start" id="start">
      <div className="simple-heading"><span className="exam-label">Три понятных шага</span><h2>Сначала узнаём пробелы.<br />Потом платим за их устранение.</h2><p>Стартовый срез занимает 15–20 минут и не смешивает разные предметы. Это не полный пробник, а быстрый способ понять, с чего начать.</p></div>
      <div className="parent-steps">
        <article><span>01</span><div><b>Выберите один из 15 предметов</b><p>Русский, математика, информатика, языки и все остальные предметы из официального перечня ЕГЭ.</p></div></article>
        <article><span>02</span><div><b>Решите 10 заданий этого предмета</b><p>Задания сгруппированы по предмету и показывают разные типы ответа. После попытки открывается разбор.</p></div></article>
        <article><span>03</span><div><b>Получите план и формат занятий</b><p>Система показывает слабые темы, а вы выбираете: самостоятельная практика, группа или сопровождение преподавателя.</p></div></article>
      </div>
    </section>

    <section className="section subject-showcase">
      <div className="subject-head"><div><span className="exam-label light">Все предметы ЕГЭ</span><h2>Один кабинет.<br />Никакой мешанины.</h2></div><p>У каждого предмета свой набор из 10 стартовых заданий, своя карта тем и свой маршрут подготовки.</p></div>
      <div className="home-subject-grid all-exam-subjects">{examSubjects.map((subject, index) => <Link href={`/exam?subject=${subject.slug}`} key={subject.slug}><span>{String(index + 1).padStart(2, "0")}</span><h3>{subject.name}</h3><p>{subject.exam}</p><b>10 заданий</b></Link>)}</div>
      <Link className="all-subjects-link" href="/subjects">Смотреть все предметы и преподавателей →</Link>
    </section>

    <section className="section exam-method">
      <div className="simple-heading"><span className="exam-label">Не тест из трёх кнопок</span><h2>Задания выглядят так,<br />как на экзамене.</h2><p>Один или несколько ответов, число, последовательность и развёрнутая работа. Объяснение появляется только после попытки.</p></div>
      <div className="method-board"><div className="method-tabs"><span className="active">Краткий ответ</span><span>Множественный выбор</span><span>Развёрнутая работа</span></div><div className="method-question"><small>Русский язык · орфография</small><h3>Выберите все слова, в которых на месте пропуска пишется НН.</h3><div><span>1</span>организова..ый</div><div><span>2</span>кожа..ый</div><div><span>3</span>време..ый</div><div><span>4</span>ветре..ый</div><div><span>5</span>стекля..ый</div></div><aside><span>После попытки</span><b>Правило и решение по шагам</b><p>Ученик видит не только правильный ответ, но и причину ошибки, правило и задание на повторение.</p><Link href="/exam">Решить самому →</Link></aside></div>
    </section>

    <section className="section teacher-system">
      <div className="teacher-system-copy"><span className="exam-label">Кто отвечает за обучение</span><h2>Родитель видит преподавателя и его роль.</h2><p>На платформе показаны предметные профили по официальным материалам СПКУ. Преподаватель проверяет сложные работы и методику; система выдаёт практику и собирает прогресс. Для семи профилей уже найдены однозначно подписанные фотографии из официальных публикаций.</p><Link className="button button-dark" href="/teachers">Посмотреть преподавателей</Link></div>
      <div className="home-teacher-grid">{photographedTeachers.map((lead) => <article key={lead.slug}><TeacherPhoto lead={lead} /><div><b>{lead.teacher}</b><span>{lead.subject}</span><small>профиль для запуска · участие уточняется</small></div></article>)}</div>
      <p className="teacher-source-note">Перед открытием платного потока школа отдельно подтверждает участие преподавателя, расписание и согласие на коммерческое использование имени и фотографии.</p>
    </section>

    <section className="section value-section" aria-labelledby="value-title">
      <div className="simple-heading"><span className="exam-label">За что платит родитель</span><h2 id="value-title">Не за доступ к видео.<br />За управляемую подготовку.</h2><p>Каждый платный формат должен давать измеримый результат и понятную ответственность.</p></div>
      <div className="value-grid"><article><span>01</span><b>Экзаменационная программа</b><p>Темы и задания собраны в маршрут к выбранной цели, а не в случайную библиотеку уроков.</p></article><article><span>02</span><b>Обратная связь</b><p>Преподаватель проверяет развёрнутые ответы, объясняет ошибки и корректирует план.</p></article><article><span>03</span><b>Регулярная практика</b><p>Короткие задания каждый день, повторение слабых тем и пробники по расписанию.</p></article><article><span>04</span><b>Отчёт родителю</b><p>Прогноз, динамика, пропуски, сделанное за неделю и следующий конкретный шаг.</p></article></div>
    </section>

    <section className="section plans-section exam-plans" id="plans">
      <div className="simple-heading"><span className="exam-label">Цены после сравнения рынка</span><h2>Понятная цена<br />за один предмет в месяц.</h2><p>Мы сверили актуальные предложения крупных онлайн-школ и поставили пилотные цены ниже групповых программ рынка, но достаточно высоко для реальной проверки работ преподавателем.</p></div>
      <div className="plans-grid four-plans">
        <article className="plan-card"><div><span>ДИАГНОСТИКА</span><strong>0 ₽</strong><small>без карты</small></div><ul><li>1 предмет на выбор</li><li>10 стартовых заданий</li><li>Карта слабых тем</li></ul><Link href="/exam" className="button button-dark">Пройти бесплатно</Link></article>
        <article className="plan-card"><div><span>ТРЕНАЖЁР</span><strong>1 490 ₽</strong><small>в месяц · 1 предмет</small></div><ul><li>Ежедневные задания</li><li>Полные решения после попытки</li><li>План повторения</li><li>Еженедельный отчёт</li></ul><Link href="/exam" className="button button-dark">Попробовать формат</Link></article>
        <article className="plan-card featured"><div className="popular">Оптимально для регулярной подготовки</div><div><span>ГРУППА</span><strong>4 490 ₽</strong><small>в месяц · 1 предмет</small></div><ul><li>Всё из тренажёра</li><li>Живой урок каждую неделю</li><li>Проверка письменных работ</li><li>До 12 учеников</li></ul><Link href="/support" className="button button-red">В лист ожидания</Link></article>
        <article className="plan-card"><div><span>МИНИ-ГРУППА + НАСТАВНИК</span><strong>7 990 ₽</strong><small>в месяц · 1 предмет</small></div><ul><li>Группа до 6 учеников</li><li>Личный маршрут</li><li>Две проверки работ в неделю</li><li>Связь и отчёт родителю</li></ul><Link href="/support" className="button button-dark">Оставить заявку</Link></article>
      </div>
      <div className="market-benchmark"><div><b>Ориентир рынка · июль 2026</b><span>99 Баллов: 3 990–7 490 ₽/мес.</span><span>Maximum: 8 800–12 400 ₽/мес.</span><span>Foxford: репетитор от 1 350 ₽ за урок.</span></div><div><b>Почему ЭКЗАМ стоит так</b><span>1 490 ₽ — самостоятельная практика.</span><span>4 490 ₽ — еженедельный урок и проверка.</span><span>7 990 ₽ — малая группа и персональное сопровождение.</span></div></div>
      <p className="pricing-note">Источники: <a href="https://99ballov.ru/about" target="_blank" rel="noreferrer">99 Баллов ↗</a>, <a href="https://maximumtest.ru/ege" target="_blank" rel="noreferrer">Maximum ↗</a>, <a href="https://foxford.ru/ege/russkiy-yazyk" target="_blank" rel="noreferrer">Foxford ↗</a>. Цены конкурентов проверены 23 июля 2026 года и могут меняться. Оплата на ЭКЗАМ пока отключена до подтверждения преподавателей, расписания и юридических реквизитов.</p>
    </section>

    <section className="final-exam-cta"><div><span className="exam-label light">Начните без оплаты</span><h2>Выберите предмет.<br />Решите первые 10 заданий.</h2><p>15 предметов ЕГЭ, никакого смешивания и объяснение после каждой попытки.</p></div><Link href="/exam" className="button button-yellow">Открыть диагностику →</Link></section>

    <footer className="exam-footer"><a className="brand exam-brand brand-light" href="#top"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></a><p>Многопредметная платформа подготовки к ОГЭ и ЕГЭ. AI помогает с ежедневной практикой, преподаватель отвечает за методику и проверку сложных работ.</p><div><Link href="/subjects">Предметы</Link><Link href="/teachers">Преподаватели</Link><Link href="/offer">Оферта</Link><Link href="/privacy">Данные</Link><Link href="/support">Поддержка</Link></div></footer>
  </main>;
}
