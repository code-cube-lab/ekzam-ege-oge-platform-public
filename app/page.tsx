export default function Home() {
  return (
    <main className="landing-shell">
      <nav className="topbar" aria-label="Основная навигация">
        <a className="brand" href="#top" aria-label="Слово — на главную">
          <span className="brand-mark">С</span>
          <span>СЛОВО</span>
        </a>
        <div className="top-links">
          <a href="#method">Методика</a>
          <a href="#program">Программа</a>
          <a href="#plans">Тарифы</a>
        </div>
        <a className="button button-small button-ghost" href="/dashboard">
          Демо-кабинет
        </a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span /> Русский язык и литература</div>
          <h1>Понимать,<br />а не <em>угадывать.</em></h1>
          <p className="hero-lead">
            «Слово» находит пробелы, объясняет ошибки простым языком и собирает
            маршрут к вашему баллу — вместе с преподавателем, а не вместо него.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/dashboard" data-testid="hero-start">
              Пройти диагностику <span>↗</span>
            </a>
            <a className="text-link" href="#method">Как это работает <span>↓</span></a>
          </div>
          <div className="trust-row">
            <div><strong>12 мин</strong><span>на диагностику</span></div>
            <div><strong>5 шагов</strong><span>до личного плана</span></div>
            <div><strong>1 цель</strong><span>понятный прогресс</span></div>
          </div>
        </div>

        <div className="hero-board" aria-label="Пример персонального маршрута">
          <div className="board-top">
            <span className="mini-logo">С</span>
            <span className="board-chip">Ваш маршрут</span>
            <span className="board-dots">•••</span>
          </div>
          <div className="score-orbit">
            <div className="score-ring"><span>78</span><small>прогноз</small></div>
            <div className="orbit-note orbit-one">+12 баллов<br /><small>за 8 недель</small></div>
            <div className="orbit-note orbit-two">3 темы<br /><small>в фокусе</small></div>
          </div>
          <div className="today-card">
            <div className="today-meta"><span>Сегодня · 24 минуты</span><b>01</b></div>
            <h3>Запятые при обособленных определениях</h3>
            <div className="lesson-progress"><span /></div>
            <div className="today-footer"><span>Теория · 7 мин</span><span>Практика · 12 заданий</span></div>
          </div>
          <div className="coach-bubble"><span>AI</span><p>Разберём, почему здесь нужна запятая — без заучивания?</p></div>
        </div>
      </section>

      <section className="problem-strip" aria-label="Преимущества">
        <p>Не ещё один сборник тестов.</p>
        <div className="strip-points">
          <span>✦ Видит причину ошибки</span>
          <span>✦ Помнит ваш прогресс</span>
          <span>✦ Передаёт важное преподавателю</span>
        </div>
      </section>

      <section className="section method-section" id="method">
        <div className="section-kicker">01 — Методика</div>
        <div className="method-grid">
          <div>
            <h2>От ошибки —<br />к <span className="marker">пониманию</span></h2>
            <p className="section-intro">Каждая тема проходит один и тот же ясный цикл. Ученик не остаётся один на один с красной отметкой.</p>
          </div>
          <ol className="method-steps">
            <li><b>01</b><div><h3>Диагностика</h3><p>Определяем не только неверный ответ, но и тип затруднения.</p></div></li>
            <li><b>02</b><div><h3>Понятное правило</h3><p>Объяснение, исключения и пример в одном коротком уроке.</p></div></li>
            <li><b>03</b><div><h3>Осознанная практика</h3><p>Задания меняются по сложности и возвращают слабую тему вовремя.</p></div></li>
            <li><b>04</b><div><h3>Контроль преподавателя</h3><p>Педагог видит динамику и подключается там, где нужна экспертиза.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="section program-section" id="program">
        <div className="section-kicker light">02 — Что внутри</div>
        <div className="program-head">
          <h2>Один ритм.<br />Вся подготовка.</h2>
          <p>Русский и литература соединены в едином расписании: диагностика, уроки, сочинения и повторение.</p>
        </div>
        <div className="feature-grid">
          <article className="feature-card lime"><span className="feature-no">01</span><div className="feature-icon">↗</div><h3>Точный прогноз</h3><p>Баллы считаются по навыкам, а не по ощущению «вроде получается».</p></article>
          <article className="feature-card violet"><span className="feature-no">02</span><div className="feature-icon">AI</div><h3>Наставник рядом</h3><p>Объясняет ошибку и задаёт наводящий вопрос, сохраняя роль учителя.</p></article>
          <article className="feature-card paper"><span className="feature-no">03</span><div className="feature-icon">✓</div><h3>План на сегодня</h3><p>Короткий набор действий вместо бесконечного каталога уроков.</p></article>
          <article className="feature-card coral"><span className="feature-no">04</span><div className="feature-icon">◎</div><h3>Сочинение по шагам</h3><p>Тезис, аргумент, связь и речевая точность проверяются отдельно.</p></article>
        </div>
      </section>

      <section className="section expert-section">
        <div className="expert-card">
          <div className="expert-monogram" aria-hidden="true">ЕМ</div>
          <div>
            <div className="section-kicker">03 — Эксперт</div>
            <h2>Методика Елены<br />Николаевны Михайличенко</h2>
            <blockquote>«ИИ должен освобождать время учителя для главного — разговора, обратной связи и роста ученика».</blockquote>
            <p>В платформе преподаватель задаёт логику объяснений, критерии проверки и маршрут повторения. AI помогает применять эту систему каждый день.</p>
          </div>
        </div>
      </section>

      <section className="section plans-section" id="plans">
        <div className="section-kicker">04 — Тарифы</div>
        <div className="plans-head"><h2>Начните бесплатно.<br />Добавляйте поддержку, когда она нужна.</h2><p>Цены в прототипе — гипотеза для проверки, не публичная оферта.</p></div>
        <div className="plans-grid">
          <article className="plan-card"><div><span>СТАРТ</span><strong>0 ₽</strong><small>навсегда</small></div><ul><li>Диагностика знаний</li><li>Прогноз балла</li><li>3 пробных урока</li><li className="muted">AI: 5 запросов</li></ul><a href="/dashboard" className="button button-dark">Попробовать</a></article>
          <article className="plan-card featured"><div className="popular">Выбор для самостоятельной подготовки</div><div><span>МАРШРУТ</span><strong>1 990 ₽</strong><small>в месяц</small></div><ul><li>Полный курс</li><li>Персональный план</li><li>AI-наставник</li><li>Повторение слабых тем</li></ul><a href="/dashboard" className="button button-primary">Открыть демо</a></article>
          <article className="plan-card"><div><span>С УЧИТЕЛЕМ</span><strong>4 990 ₽</strong><small>в месяц</small></div><ul><li>Всё из «Маршрута»</li><li>Проверка сочинений</li><li>Групповые занятия</li><li>Личные рекомендации</li></ul><a href="/support" className="button button-dark">В лист ожидания</a></article>
        </div>
      </section>

      <section className="final-cta">
        <div><span className="section-kicker light">Начать сейчас</span><h2>Ваш следующий балл<br />начинается с <em>одного ответа.</em></h2></div>
        <a href="/dashboard" className="button button-primary">Пройти диагностику <span>↗</span></a>
      </section>

      <footer>
        <a className="brand brand-light" href="#top"><span className="brand-mark">С</span><span>СЛОВО</span></a>
        <p>Образовательный MVP. AI помогает преподавателю, но не заменяет его.</p>
        <div><a href="/terms">Условия</a><a href="/support">Поддержка</a><a href="/teacher">Преподавателю</a></div>
      </footer>
    </main>
  );
}
