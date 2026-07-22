export default function Home() {
  return (
    <main className="landing-shell">
      <nav className="topbar" aria-label="Основная навигация">
        <a className="brand" href="#top" aria-label="Слово — на главную">
          <span className="brand-mark">С</span>
          <span>СЛОВО</span>
        </a>
        <div className="top-links">
          <a href="#parents">Родителям</a>
          <a href="#method">Как работает</a>
          <a href="/teachers">Преподаватели</a>
          <a href="#plans">Стоимость</a>
        </div>
        <a className="button button-small button-ghost" href="/dashboard">
          Демо-кабинет
        </a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span /> Подготовка к ОГЭ и ЕГЭ без ежедневных споров</div>
          <h1>Маме — спокойно.<br />Ребёнку — <em>понятно.</em></h1>
          <p className="hero-lead">
            «Слово» показывает, где ребёнок теряет баллы, даёт короткий план на день и разбирает ошибки простым языком.
            В основе — материалы и контроль преподавателя Елены Николаевны Михайличенко; AI только помогает применять их каждый день.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/dashboard" data-testid="hero-start">
              Узнать пробелы ребёнка <span>↗</span>
            </a>
            <a className="text-link" href="#method">Как это работает <span>↓</span></a>
            <a className="text-link" href="/learn">Открытый видеоурок <span>↗</span></a>
          </div>
          <div className="trust-row">
            <div><strong>1 шаг в день</strong><span>без перегруза</span></div>
            <div><strong>Виден прогресс</strong><span>по темам и ошибкам</span></div>
            <div><strong>Учитель в контуре</strong><span>AI не решает сам</span></div>
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
            <div className="orbit-note orbit-one">−1 пробел<br /><small>после разбора</small></div>
            <div className="orbit-note orbit-two">Повтор<br /><small>назначен завтра</small></div>
          </div>
          <div className="today-card">
            <div className="today-meta"><span>Сегодня · 12 минут</span><b>01</b></div>
            <h3>Одно объяснение и три задания по слабой теме</h3>
            <div className="lesson-progress"><span /></div>
            <div className="today-footer"><span>Объяснение · 4 мин</span><span>Практика · 3 задания</span></div>
          </div>
          <div className="coach-bubble"><span>ЕМ</span><p>Родитель видит не часы в приложении, а тему, ошибку и следующий шаг ребёнка.</p></div>
        </div>
      </section>

      <section className="problem-strip" aria-label="Преимущества">
        <p>Не нужно каждый вечер выяснять, что учить.</p>
        <div className="strip-points">
          <span>✦ Ребёнок получает один ясный шаг</span>
          <span>✦ Мама видит реальный прогресс</span>
          <span>✦ Сложные случаи уходят преподавателю</span>
        </div>
      </section>

      <section className="section method-section" id="method">
        <div className="section-kicker">01 — Методика</div>
        <div className="method-grid">
          <div>
            <h2>От ошибки —<br />к <span className="marker">пониманию</span></h2>
            <p className="section-intro">Каждая тема проходит ясный цикл. Ребёнок понимает причину ошибки, а родитель видит, что будет сделано дальше.</p>
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
          <p>Русский и литература — первый модуль будущей платформы по всем школьным предметам: диагностика, уроки, сочинения и повторение.</p>
        </div>
        <div className="feature-grid">
          <article className="feature-card lime"><span className="feature-no">01</span><div className="feature-icon">↗</div><h3>Точный прогноз</h3><p>Баллы считаются по навыкам, а не по ощущению «вроде получается».</p></article>
          <article className="feature-card violet"><span className="feature-no">02</span><div className="feature-icon">AI</div><h3>AI + преподаватель</h3><p>AI объясняет по утверждённой базе, а учитель контролирует критерии и спорные ответы.</p></article>
          <article className="feature-card paper"><span className="feature-no">03</span><div className="feature-icon">✓</div><h3>Четыре уровня</h3><p>Стартовый, базовый, экзаменационный и высокий — сложность меняется по ответам.</p></article>
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
            <p><a className="text-link" href="/teachers">Открыть реестр преподавателей <span>↗</span></a></p>
          </div>
        </div>
      </section>

      <section className="section parent-section" id="parents">
        <div className="section-kicker">04 — Что получает семья</div>
        <div className="parent-head">
          <h2>Платите не за доступ<br />к ещё одному <span className="marker">тесту.</span></h2>
          <p>Оплата — за организованный учебный процесс: понятный план, своевременное повторение, объяснение ошибок и контроль преподавателя там, где алгоритма недостаточно.</p>
        </div>
        <div className="parent-grid">
          <article className="parent-card"><span>Для ребёнка</span><h3>Не «учи всё», а один выполнимый шаг</h3><p>Короткое объяснение, задание сразу после него и разбор ответа без стыда и перегруза.</p></article>
          <article className="parent-card"><span>Для мамы</span><h3>Прогресс, который можно увидеть</h3><p>Какие темы проседают, что уже закреплено, сколько сделано и какой следующий шаг выбран.</p></article>
          <article className="parent-card"><span>Для результата</span><h3>Повторение по ошибкам, а не по календарю</h3><p>Слабая тема возвращается вовремя; уверенно освоенное не отнимает лишние часы.</p></article>
        </div>
      </section>

      <section className="section plans-section" id="plans">
        <div className="section-kicker">05 — Стоимость и ценность</div>
        <div className="plans-head"><h2>Сначала посмотрите пробелы.<br />Платите только за нужный уровень поддержки.</h2><p>Оплата в демонстрационной версии пока не принимается. Состав и цены показаны, чтобы родителю было понятно, что входит в каждый месяц.</p></div>
        <div className="plans-grid">
          <article className="plan-card"><div><span>ПОНЯТЬ СТАРТ</span><strong>0 ₽</strong><small>до решения об оплате</small></div><ul><li>Диагностика по навыкам</li><li>Карта сильных и слабых тем</li><li>Открытый видеоурок с заданием</li><li className="muted">Можно оценить подход без карты</li></ul><a href="/dashboard" className="button button-dark">Проверить бесплатно</a></article>
          <article className="plan-card featured"><div className="popular">Если ребёнок занимается самостоятельно</div><div><span>ЛИЧНЫЙ МАРШРУТ</span><strong>1 990 ₽</strong><small>за 30 дней доступа</small></div><ul><li>Ежедневный план на 10–25 минут</li><li>Объяснение сразу после ошибки</li><li>AI-помощник по базе преподавателя</li><li>Повторение слабых тем и отчёт прогресса</li></ul><a href="/dashboard" className="button button-primary">Посмотреть демо</a></article>
          <article className="plan-card"><div><span>С ПРЕПОДАВАТЕЛЕМ</span><strong>4 990 ₽</strong><small>за 30 дней поддержки</small></div><ul><li>Всё из «Личного маршрута»</li><li>Проверка сочинений человеком</li><li>Групповые занятия по расписанию</li><li>Личные рекомендации родителю и ученику</li></ul><a href="/support" className="button button-dark">В лист ожидания</a></article>
        </div>
        <p className="plans-legal">До подключения оплаты предложения являются предварительными. Условия будущей покупки описаны в <a href="/offer">проекте оферты</a>.</p>
      </section>

      <section className="final-cta">
        <div><span className="section-kicker light">Начать без оплаты</span><h2>Сначала узнайте,<br />где ребёнку нужна <em>помощь.</em></h2></div>
        <a href="/dashboard" className="button button-primary">Узнать пробелы <span>↗</span></a>
      </section>

      <footer>
        <a className="brand brand-light" href="#top"><span className="brand-mark">С</span><span>СЛОВО</span></a>
        <p>Образовательный MVP. Преподаватель задаёт методику; AI помогает применять её и не заменяет учителя.</p>
        <div><a href="/teachers">Преподаватели</a><a href="/offer">Оферта</a><a href="/privacy">Политика данных</a><a href="/consent">Согласие</a><a href="/terms">Условия</a><a href="/support">Поддержка</a></div>
      </footer>
    </main>
  );
}
