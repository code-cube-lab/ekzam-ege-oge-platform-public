import Link from "next/link";
import { subjectLeads } from "../knowledge-base/teachers/subject-leads";

const launchSubjects = subjectLeads.slice(0, 10);

export default function Home() {
  return <main className="landing-shell exam-landing" id="top">
    <nav className="topbar exam-topbar" aria-label="Основная навигация">
      <a className="brand exam-brand" href="#top" aria-label="ЭКЗАМ — на главную"><span className="brand-mark">Э</span><span>ЭКЗАМ</span><small>школа высоких баллов</small></a>
      <div className="top-links"><a href="#start">Как начать</a><Link href="/subjects">Предметы</Link><Link href="/teachers">Преподаватели</Link><a href="#plans">Цены</a></div>
      <Link className="button button-small button-ghost" href="/director">Кабинет директора</Link>
    </nav>

    <section className="exam-hero">
      <div className="exam-hero-copy">
        <div className="exam-label"><span /> Подготовка к ЕГЭ-2027 · все основные предметы</div>
        <h1>Ребёнок готовится.<br /><em>Вы видите, к чему.</em></h1>
        <p>За 3 минуты покажем стартовый уровень, слабые темы и план до нужного балла. Ребёнок решает задания в формате экзамена, родитель получает короткий отчёт без педагогических терминов.</p>
        <div className="hero-actions"><Link className="button button-red" href="/exam">Попробовать формат ЕГЭ <span>→</span></Link><Link className="button button-ghost" href="/dashboard">Узнать стартовый балл</Link></div>
        <div className="parent-proof"><div><strong>0 ₽</strong><span>первая диагностика</span></div><div><strong>13</strong><span>предметных направлений</span></div><div><strong>1 отчёт</strong><span>родителю каждую неделю</span></div></div>
      </div>
      <div className="exam-hero-board" aria-label="Пример родительского отчёта">
        <div className="paper-caption"><span>Личный маршрут · ЕГЭ</span><b>23.07.2026</b></div>
        <div className="target-line"><span>Текущий прогноз</span><strong>68</strong><em>цель 85+</em></div>
        <div className="score-scale"><i style={{ width: "68%" }} /></div>
        <div className="report-title"><span>На этой неделе</span><b>+4 балла к прогнозу</b></div>
        <div className="report-grid"><article><span>01</span><div><b>Пунктуация</b><small>2 ошибки разобраны</small></div><em className="risk">нужен повтор</em></article><article><span>02</span><div><b>Аргументация</b><small>тезис стал точнее</small></div><em className="ok">есть рост</em></article><article><span>03</span><div><b>Следующий шаг</b><small>мини-вариант в субботу</small></div><em>38 мин</em></article></div>
        <div className="parent-summary"><b>Что делать родителю?</b><p>Ничего объяснять не нужно. В воскресенье спросите: «Покажешь, какие две ошибки ты уже исправил?»</p></div>
      </div>
    </section>

    <section className="exam-ribbon" aria-label="Форматы экзамена"><span>Краткий ответ</span><span>Несколько правильных</span><span>Число</span><span>Соответствие</span><span>Развёрнутый ответ</span><Link href="/exam">Открыть тренажёр →</Link></section>

    <section className="section parent-start" id="start">
      <div className="simple-heading"><span className="exam-label">Понятно с первого экрана</span><h2>Родителю не нужно разбираться<br />в кодификаторах и номерах заданий.</h2><p>Три простых шага — и вы понимаете, что происходит с подготовкой ребёнка.</p></div>
      <div className="parent-steps">
        <article><span>01</span><div><b>Назовите предметы и цель</b><p>Например: русский, профильная математика, информатика; цель — поступление на бюджет.</p></div></article>
        <article><span>02</span><div><b>Ребёнок проходит диагностику</b><p>Не школьная контрольная, а короткий срез разных форматов ЕГЭ с полными решениями.</p></div></article>
        <article><span>03</span><div><b>Получаете человеческий отчёт</b><p>Текущий прогноз, что проседает, что сделано за неделю и где должен подключиться преподаватель.</p></div></article>
      </div>
    </section>

    <section className="section subject-showcase">
      <div className="subject-head"><div><span className="exam-label light">Предметная школа</span><h2>Один ребёнок.<br />Один план. Все предметы.</h2></div><p>Система общая, но задания, критерии и преподавательские профили разделены по предметам.</p></div>
      <div className="home-subject-grid">{launchSubjects.map((lead, index) => <Link href="/subjects" key={lead.slug}><span>{String(index + 1).padStart(2, "0")}</span><h3>{lead.subject}</h3><p>{lead.exam}</p><b>{lead.initials}</b></Link>)}</div>
      <Link className="all-subjects-link" href="/subjects">Все 13 направлений и преподаватели →</Link>
    </section>

    <section className="section exam-method">
      <div className="simple-heading"><span className="exam-label">Не тест из трёх кнопок</span><h2>Решения выглядят так,<br />как требует экзамен.</h2><p>Мы перестроили тренажёр вокруг реальных форматов ответа, а не вокруг удобства интерфейса.</p></div>
      <div className="method-board"><div className="method-tabs"><span className="active">Краткий ответ</span><span>Множественный выбор</span><span>Развёрнутая работа</span></div><div className="method-question"><small>Русский язык · задание 15</small><h3>Выберите все варианты, в которых пишется НН.</h3><div><span>1</span>организова..ый</div><div><span>2</span>кожа..ый</div><div><span>3</span>време..ый</div><div><span>4</span>ветре..ый</div><div><span>5</span>стекля..ый</div></div><aside><span>После попытки</span><b>Полное решение по шагам</b><p>Почему правильны 1, 3 и 5; какое правило применить; какое повторение назначено.</p><Link href="/exam">Решить самому →</Link></aside></div>
    </section>

    <section className="section teacher-system">
      <div className="teacher-system-copy"><span className="exam-label">Преподаватели СПКУ</span><h2>По одному предметному лидеру — для запуска каждого направления.</h2><p>Мы нашли публичные профили по материалам Ставропольского президентского кадетского училища. Перед реальным курсом каждого педагога нужно пригласить, получить согласие и перенести его методику в систему.</p><Link className="button button-dark" href="/teachers">Посмотреть педагогическую команду</Link></div>
      <div className="teacher-stack">{subjectLeads.slice(0, 5).map((lead, index) => <article style={{ transform: `translateY(${index * 8}px)` }} key={lead.slug}><span>{lead.initials}</span><div><b>{lead.teacher}</b><small>{lead.subject}</small></div><em>кандидат</em></article>)}</div>
    </section>

    <section className="section director-callout">
      <div><span className="exam-label light">Ваш уровень доступа</span><h2>Олег — директор школы,<br />а не просто владелец сайта.</h2><p>В отдельном кабинете видны ученики, конверсия, прогнозы, предметы, выручка и цены. Тарифы можно менять — они сохраняются на сервере.</p><Link className="button button-yellow" href="/director">Открыть кабинет директора →</Link></div>
      <div className="director-mini"><div><span>Выручка месяца</span><strong>12 900 ₽</strong></div><div><span>Диагностика → оплата</span><strong>24%</strong></div><div><span>Нужна помощь</span><strong>7 учеников</strong></div></div>
    </section>

    <section className="section plans-section exam-plans" id="plans">
      <div className="simple-heading"><span className="exam-label">Пилотные цены</span><h2>Дешёвый вход.<br />Преподаватель — там, где он нужен.</h2><p>Рынок групповых онлайн-курсов начинается примерно от 4 000 ₽ в месяц, а репетиторы — от 800 ₽ за час. В пилоте цена ниже, потому что ежедневную практику берёт на себя платформа.</p></div>
      <div className="plans-grid four-plans">
        <article className="plan-card"><div><span>ДИАГНОСТИКА</span><strong>0 ₽</strong><small>без карты</small></div><ul><li>Срез по форматам ЕГЭ</li><li>Стартовый прогноз</li><li>Три слабые темы</li></ul><Link href="/dashboard" className="button button-dark">Начать</Link></article>
        <article className="plan-card featured"><div className="popular">Самый простой старт</div><div><span>ТРЕНАЖЁР</span><strong>390 ₽</strong><small>в месяц · 1 предмет</small></div><ul><li>Ежедневные задания</li><li>Полные решения</li><li>План повторения</li><li>Отчёт родителю</li></ul><Link href="/exam" className="button button-red">Попробовать</Link></article>
        <article className="plan-card"><div><span>ГРУППА</span><strong>1 290 ₽</strong><small>в месяц · 1 предмет</small></div><ul><li>Всё из тренажёра</li><li>Урок раз в неделю</li><li>Проверка письменных работ</li><li>До 12 учеников</li></ul><Link href="/support" className="button button-dark">В лист ожидания</Link></article>
        <article className="plan-card"><div><span>С ПРЕПОДАВАТЕЛЕМ</span><strong>2 490 ₽</strong><small>в месяц · пилот</small></div><ul><li>Личный маршрут</li><li>Две проверки работ</li><li>Связь с родителем</li><li>Разбор пробника</li></ul><Link href="/support" className="button button-dark">Оставить заявку</Link></article>
      </div>
      <div className="single-session-note"><b>Разовый разбор пробника — от 590 ₽ / 20 минут</b><span>Только после подтверждения преподавателей и расписания. Оплата на сайте пока отключена.</span></div>
    </section>

    <section className="final-exam-cta"><div><span className="exam-label light">Начните без оплаты</span><h2>Сначала посмотрите,<br />как ребёнок решает.</h2><p>Пять разных форматов и полные решения — без регистрации.</p></div><Link href="/exam" className="button button-yellow">Открыть мини-вариант →</Link></section>

    <footer className="exam-footer"><a className="brand exam-brand brand-light" href="#top"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></a><p>Многопредметная платформа подготовки к ОГЭ и ЕГЭ. AI помогает, преподаватель отвечает за методику и проверку сложных работ.</p><div><Link href="/subjects">Предметы</Link><Link href="/teachers">Преподаватели</Link><Link href="/director">Директор</Link><Link href="/offer">Оферта</Link><Link href="/privacy">Данные</Link><Link href="/support">Поддержка</Link></div></footer>
  </main>;
}
