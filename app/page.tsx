import Link from "next/link";
import Image from "next/image";
import { examSubjects } from "../knowledge-base/exams/exam-subjects";
import { ExamEntryClient } from "./components/ExamEntryClient";

const audiences = [
  {
    tag: "РОДИТЕЛЮ",
    title: "За 10 минут увидеть, что именно не получается",
    text: "Ребёнок проходит короткую тренировку, а вы видите не общий «плохой балл», а номер задания, причину ошибки и следующий шаг.",
    href: "/for-parents",
    action: "Посмотреть путь родителя",
  },
  {
    tag: "РЕПЕТИТОРУ",
    title: "Дать практику по одному номеру и не проверять всё вручную",
    text: "Соберите ссылку на серию заданий, оставьте автоматике краткие ответы, а себе — объяснение и развёрнутые работы.",
    href: "/for-teachers",
    action: "Открыть инструменты",
  },
  {
    tag: "ШКОЛЕ И ЦЕНТРУ",
    title: "Проверить формат на одном классе без большой закупки",
    text: "Пилот начинается с одного предмета, одной линии и понятного отчёта. Масштабирование — только после результата пилота.",
    href: "/for-schools",
    action: "Посмотреть пилот",
  },
];

const workflow = [
  {
    number: "01",
    title: "Одна попытка",
    text: "Ученик решает задание в экзаменационной форме без подсказки и сохраняет реальный ответ.",
  },
  {
    number: "02",
    title: "Точная причина",
    text: "После ошибки система показывает правило и объясняет не только ключ, но и место, где сломалась логика.",
  },
  {
    number: "03",
    title: "Перенос навыка",
    text: "Сразу открывается другое авторское условие того же типа. Линия считается закреплённой после трёх верных ответов подряд.",
  },
  {
    number: "04",
    title: "Отчёт человеку",
    text: "Родитель видит ближайший шаг, а преподаватель получает развёрнутые работы и спорные ответы на проверку.",
  },
];

export default function Home() {
  const assetBase = process.env.EKZAM_STATIC_EXPORT === "1"
    ? process.env.EKZAM_GITHUB_PAGES_BASE ?? ""
    : "";

  return (
    <main className="exam-home sales-home" id="top">
      <a className="skip-nav" href="#exam-start">К бесплатной тренировке</a>
      <header className="exam-home-nav">
        <Link className="brand exam-brand" href="/" aria-label="ЭКЗАМ — на главную">
          <span className="brand-mark">Э</span>
          <span>ЭКЗАМ</span>
          <small>подготовка по слабым заданиям</small>
        </Link>
        <nav aria-label="Основная навигация">
          <Link href="/for-parents">Родителям</Link>
          <Link href="/for-teachers">Репетиторам</Link>
          <Link href="/for-schools">Школам</Link>
          <Link href="/practice">По номеру</Link>
          <a href="#plans">Стоимость</a>
        </nav>
        <Link className="button button-dark button-small" href="/practice">Попробовать бесплатно</Link>
      </header>

      <section className="exam-home-hero sales-hero">
        <div className="exam-home-copy">
          <span className="exam-kicker">ОГЭ / ЕГЭ · первая тренировка бесплатно · без карты</span>
          <h1>Не ещё один пробник.<br /><em>Следующий шаг после ошибки.</em></h1>
          <p>Ребёнок выбирает конкретный номер, решает разные задания одного типа и получает разбор. Родитель видит слабое место. Репетитор решает, что объяснить лично.</p>
          <div className="sales-hero-actions">
            <Link className="button button-red" href="/practice">Найти слабое задание →</Link>
            <Link className="button button-ghost" href="/for-parents">Сначала понять, как это работает</Link>
          </div>
          <small className="sales-trust-line">Сейчас открыт проверяемый пилот по русскому языку. Остальные предметы подключаются только после предметной редакторской проверки.</small>
        </div>
        <ExamEntryClient />
        <div className="exam-home-facts" aria-label="Факты о первом результате">
          <div><strong>0 ₽</strong><span>первая тренировка без карты</span></div>
          <div><strong>10 мин</strong><span>до первого полезного результата</span></div>
          <div><strong>3×</strong><span>верных подряд для закрепления линии</span></div>
        </div>
      </section>

      <section className="exam-proof-strip" aria-label="Принципы платформы">
        <span>Ответ как в бланке</span>
        <span>Разбор после попытки</span>
        <span>Другое похожее условие</span>
        <span>Проверка преподавателем</span>
        <span>Отчёт родителю</span>
      </section>

      <section className="sales-audience" aria-labelledby="audience-title">
        <div className="sales-section-head">
          <span className="exam-kicker">Выберите свою роль</span>
          <h2 id="audience-title">Один продукт.<br />Три понятные пользы.</h2>
          <p>Мы не предлагаем родителю кабинет учителя, а преподавателю — рекламный текст для мам. У каждого свой первый шаг и свой результат.</p>
        </div>
        <div className="sales-audience-grid">
          {audiences.map((item, index) => (
            <Link className={`sales-audience-card role-${index + 1}`} href={item.href} key={item.tag}>
              <span>{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <b>{item.action} →</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="sales-story" aria-labelledby="sales-story-title">
        <div className="sales-story-copy">
          <span className="exam-kicker light">Что продаёт платформа</span>
          <h2 id="sales-story-title">Не доступ к тестам.<br />Управляемое обучение.</h2>
          <p>Открытые задания уже есть в интернете. Ценность «ЭКЗАМ» появляется после ответа: сохранить попытку, назвать причину, дать другое условие, вернуть тему позже и показать человеку доказательства прогресса.</p>
          <ol>
            <li><b>Автоматика</b><span>проверяет однозначные краткие ответы и собирает историю попыток.</span></li>
            <li><b>Методика</b><span>связывает ошибку с правилом, новой попыткой и интервальным повтором.</span></li>
            <li><b>Преподаватель</b><span>проверяет сочинения, спорные ответы и корректирует маршрут.</span></li>
          </ol>
          <Link className="button button-yellow" href="/how-it-works">Посмотреть методику →</Link>
        </div>
        <div className="sales-story-visuals" aria-label="Визуальные примеры для ученика, родителя и репетитора">
          <figure className="visual-main"><Image unoptimized src={`${assetBase}/marketing/mistake-loop.webp`} alt="Ошибка переходит в разбор и новое задание" width="1200" height="1200" /><figcaption>УЧЕНИКУ · ПОВТОР</figcaption></figure>
          <figure><Image unoptimized src={`${assetBase}/marketing/parent-report.webp`} alt="Родитель и ученик смотрят понятный отчёт" width="1200" height="1200" /><figcaption>РОДИТЕЛЮ · СЛЕДУЮЩИЙ ШАГ</figcaption></figure>
          <figure><Image unoptimized src={`${assetBase}/marketing/tutor-practice.webp`} alt="Репетитор собирает практику по номеру" width="1200" height="1200" /><figcaption>РЕПЕТИТОРУ · ПРАКТИКА</figcaption></figure>
        </div>
      </section>

      <section className="exam-home-section sales-method" id="method">
        <div className="exam-section-heading">
          <span className="exam-kicker">Методика внутри платформы</span>
          <h2>Ошибка — это не вердикт.<br />Это маршрут урока.</h2>
          <p>Каждый предметный модуль обязан хранить экзаменационный год, источник, проверяемый ответ или рубрику и правило следующего шага.</p>
        </div>
        <div className="sales-method-grid">
          {workflow.map((item) => (
            <article key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <div className="sales-method-links"><Link href="/teacher-academy">Открыть методики по предметам →</Link><Link href="/teachers">Посмотреть предметные профили →</Link></div>
      </section>

      <section className="exam-subject-showcase" id="subjects" aria-labelledby="subjects-title">
        <div>
          <span className="exam-kicker">Архитектура на все экзамены</span>
          <h2 id="subjects-title">15 предметных направлений.</h2>
          <p>Русский язык открыт как публичный проверяемый пилот. Карточки остальных предметов показывают будущую структуру и не выдают непроверенный банк за готовый курс.</p>
        </div>
        <div className="exam-subject-links">
          {examSubjects.map((subject, index) => (
            <Link href={`/exam?subject=${subject.slug}`} key={subject.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{subject.name}</b>
              <small>{subject.slug === "russian" ? "публичный пилот" : "предметная проверка"}</small>
            </Link>
          ))}
        </div>
        <Link className="exam-subject-cta" href="/subjects">Посмотреть статус каждого предмета →</Link>
      </section>

      <section className="exam-home-section exam-pricing sales-pricing" id="plans">
        <div className="exam-section-heading">
          <span className="exam-kicker">За что платит родитель</span>
          <h2>Сначала полезный результат.<br />Потом предложение.</h2>
          <p>Тренировка остаётся бесплатной. Платные форматы — это маршрут, проверка и человеческая ответственность. Оплата на сайте пока не включена: перед запуском нужны подтверждённые преподаватели, расписание и реквизиты.</p>
        </div>
        <div className="exam-plan-grid">
          <article><span>ПОПРОБОВАТЬ</span><strong>0 ₽</strong><p>Практика по номеру, разбор краткого ответа и локальная тетрадь ошибок.</p><Link href="/practice">Начать без карты</Link></article>
          <article className="featured"><span>ЛИЧНЫЙ МАРШРУТ</span><strong>1 490 ₽</strong><small>ориентир в месяц после пилота</small><p>Недельный план, повтор слабых тем, история прогресса и короткий отчёт родителю.</p><Link href="/support">Встать в пилот</Link></article>
          <article><span>С ПЕДАГОГОМ</span><strong>от 4 490 ₽</strong><small>ориентир в месяц</small><p>Еженедельный разбор, проверка развёрнутых работ и корректировка маршрута.</p><Link href="/support">Уточнить предмет</Link></article>
        </div>
        <p className="sales-price-note">Для сравнения на 7 августа 2026 года: массовые онлайн-курсы заявляют примерно от 3 990 ₽ в месяц, групповые программы с преподавателем — около 8 477 ₽ в месяц, индивидуальные занятия по русскому в Москве — от 800 ₽ за час. Это ориентиры рынка, а не обещание качества.</p>
      </section>

      <section className="sales-final-cta">
        <div><span className="exam-kicker light">Первый шаг без оплаты</span><h2>Выберите один номер.<br />Получите первый честный результат.</h2></div>
        <div><Link className="button button-yellow" href="/practice">Начать тренировку →</Link><a className="button button-ghost light" href="https://t.me/EkzamOgeEgeBot" target="_blank" rel="noreferrer">Открыть в Telegram</a></div>
      </section>

      <footer className="exam-home-footer">
        <Link className="brand exam-brand brand-light" href="#top"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
        <p>Авторская платформа подготовки к ОГЭ и ЕГЭ. Структура сверяется по документам ФИПИ; непроверенные предметные банки остаются закрытыми.</p>
        <nav aria-label="Правовая информация"><a href="https://t.me/EkzamOgeEgeBot" target="_blank" rel="noreferrer">Telegram-бот</a><a href="https://t.me/ekzam_oge_ege" target="_blank" rel="noreferrer">Канал</a><Link href="/offer">Оферта</Link><Link href="/privacy">Персональные данные</Link><Link href="/support">Поддержка</Link></nav>
      </footer>
    </main>
  );
}
