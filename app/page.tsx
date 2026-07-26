import Link from "next/link";
import { ExamEntryClient } from "./components/ExamEntryClient";

const workflow = [
  {
    number: "01",
    title: "Выберите экзамен",
    text: "ОГЭ и ЕГЭ не смешиваются. У каждого режима своё количество заданий, время, части и правила ответа.",
    href: "#exam-start",
    action: "Выбрать формат",
  },
  {
    number: "02",
    title: "Решите полный вариант",
    text: "Задания идут по официальной структуре ФИПИ. Ответы вводятся как в бланке: слово, число или последовательность цифр.",
    href: "/exam",
    action: "Открыть тренажёр",
  },
  {
    number: "03",
    title: "Закройте слабые места",
    text: "После ошибки открываются правило, причина и новое авторское задание того же типа. Ошибка остаётся в личной тетради до верного повтора.",
    href: "/exam?mode=mistakes",
    action: "Посмотреть тетрадь",
  },
];

export default function Home() {
  return (
    <main className="exam-home" id="top">
      <a className="skip-nav" href="#exam-start">К выбору экзамена</a>
      <header className="exam-home-nav">
        <Link className="brand exam-brand" href="/" aria-label="ЭКЗАМ — на главную">
          <span className="brand-mark">Э</span>
          <span>ЭКЗАМ</span>
          <small>подготовка по форме ФИПИ</small>
        </Link>
        <nav aria-label="Основная навигация">
          <Link href="/exam">Задания</Link>
          <Link href="/for-teachers">Педагогам</Link>
          <Link href="/how-it-works">Как учит система</Link>
          <a href="#plans">Стоимость</a>
        </nav>
        <Link className="button button-dark button-small" href="/exam">Начать</Link>
      </header>

      <section className="exam-home-hero">
        <div className="exam-home-copy">
          <span className="exam-kicker">ОГЭ / ЕГЭ · авторская практика · ФИПИ-2026</span>
          <h1>Не угадывать.<br /><em>Решать как на экзамене.</em></h1>
          <p>Сначала ребёнок выбирает ОГЭ или ЕГЭ. Затем решает полный вариант прямо на сайте, получает разбор каждой ошибки и повторяет слабый тип на новом материале.</p>
        </div>
        <ExamEntryClient />
        <div className="exam-home-facts" aria-label="Факты о тренажёре">
          <div><strong>13</strong><span>заданий в русском ОГЭ</span></div>
          <div><strong>27</strong><span>заданий в русском ЕГЭ</span></div>
          <div><strong>12 × 2</strong><span>авторских вариантов для старта</span></div>
        </div>
      </section>

      <section className="exam-proof-strip" aria-label="Принципы платформы">
        <span>Полный вариант</span>
        <span>Ответ как в бланке</span>
        <span>Разбор после попытки</span>
        <span>Повтор слабого типа</span>
        <span>Отчёт родителю</span>
      </section>

      <section className="exam-home-section" id="method">
        <div className="exam-section-heading">
          <span className="exam-kicker">Понятный маршрут</span>
          <h2>Один экзамен.<br />Три шага до прогресса.</h2>
          <p>На первом экране нет учебников, классов и смешанных тестов. Только выбор экзамена и работа по его структуре.</p>
        </div>
        <div className="exam-workflow-grid">
          {workflow.map((item) => (
            <Link href={item.href} className="exam-workflow-card" key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <b>{item.action} →</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="exam-answer-demo" aria-labelledby="answer-demo-title">
        <div className="exam-answer-demo-copy">
          <span className="exam-kicker light">Форма задания</span>
          <h2 id="answer-demo-title">Варианты видны.<br />Ответ вводится цифрами.</h2>
          <p>Если инструкция говорит «запишите номера ответов», ученик не нажимает цветные карточки. Он сам вводит последовательность — именно это умение проверяет экзаменационный бланк.</p>
          <Link className="button button-signal" href="/exam?level=ege&subject=russian&mode=route">Попробовать русский ЕГЭ →</Link>
        </div>
        <div className="exam-sheet-demo" aria-label="Пример экзаменационного задания">
          <div className="exam-sheet-head"><span>Русский язык · ЕГЭ</span><b>Задание 4</b><em>краткий ответ</em></div>
          <h3>Укажите варианты ответов, в которых верно выделена буква, обозначающая ударный гласный звук.</h3>
          <ol>
            <li><span>1</span>баловАть</li>
            <li><span>2</span>дОговор</li>
            <li><span>3</span>облегчИть</li>
            <li><span>4</span>красИвее</li>
          </ol>
          <label><span>Ответ для бланка</span><input value="134" readOnly aria-label="Пример ответа" /></label>
          <small>Авторский пример формы. Не является заданием закрытого КИМ.</small>
        </div>
      </section>

      <section className="exam-role-section">
        <article>
          <span>УЧЕНИКУ</span>
          <h3>Понятно, что делать сегодня</h3>
          <p>Полный вариант, практика по номеру и тетрадь ошибок. За верный повтор слабое задание исчезает из списка.</p>
          <Link href="/exam">Начать бесплатно →</Link>
        </article>
        <article>
          <span>РОДИТЕЛЮ</span>
          <h3>Видно, за что платить</h3>
          <p>Не «часы у экрана», а выполненные задания, точность, слабые темы, повторные попытки и работы, которые проверил преподаватель.</p>
          <Link href="/dashboard">Открыть демо-отчёт →</Link>
        </article>
        <article>
          <span>ПЕДАГОГУ</span>
          <h3>Своя работа по ссылке</h3>
          <p>Выберите экзамен, предмет, тип и объём. Краткие ответы проверятся автоматически, а развёрнутые останутся учителю.</p>
          <Link href="/for-teachers">Собрать работу →</Link>
        </article>
      </section>

      <section className="exam-home-section exam-pricing" id="plans">
        <div className="exam-section-heading">
          <span className="exam-kicker">За что платит родитель</span>
          <h2>Тренажёр — бесплатно.<br />Сопровождение — по необходимости.</h2>
          <p>Оплата на сайте пока не включена. Платные форматы открываются только после заявки, подтверждения преподавателя и расписания.</p>
        </div>
        <div className="exam-plan-grid">
          <article><span>СТАРТ</span><strong>0 ₽</strong><p>Пробные варианты, автоматическая проверка кратких ответов и тетрадь ошибок на устройстве.</p><Link href="/exam">Решать бесплатно</Link></article>
          <article className="featured"><span>ПРАКТИКА</span><strong>1 490 ₽</strong><p>Персональный недельный план, расширенная статистика и ежедневные задания в Telegram после подключения.</p><Link href="/support">Оставить заявку</Link></article>
          <article><span>С ПЕДАГОГОМ</span><strong>4 490 ₽</strong><p>Еженедельная встреча, проверка развёрнутых работ и корректировка плана по результатам ученика.</p><Link href="/support">Уточнить расписание</Link></article>
        </div>
      </section>

      <footer className="exam-home-footer">
        <Link className="brand exam-brand brand-light" href="#top"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
        <p>Авторская платформа подготовки к ОГЭ и ЕГЭ. Структура сверяется по документам ФИПИ; формулировки заданий не копируют закрытые КИМ.</p>
        <nav aria-label="Правовая информация"><Link href="/offer">Оферта</Link><Link href="/privacy">Персональные данные</Link><Link href="/consent">Согласие</Link><Link href="/support">Поддержка</Link></nav>
      </footer>
    </main>
  );
}
