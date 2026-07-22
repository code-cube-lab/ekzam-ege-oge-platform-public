"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppNav } from "./AppNav";

type State = "anonymous" | "free" | "invoice_pending" | "paid" | "expired_or_refunded" | "admin";
type Session = { name: string; state: State; role: string; diagnosticScore: number; weakTopics: string[] };
type Result = { score: number; correct: number; total: number; weakTopics: string[]; nextLesson: string };

const questions = [
  { label: "Орфоэпия", question: "В каком слове верно выделено ударение?", options: ["звОнит", "красИвее", "тОрты"] },
  { label: "Орфография", question: "Выберите верное написание", options: ["не прочитанная мною книга", "непрочитанная книга лежала", "не прочитанная книга лежала"] },
  { label: "Пунктуация", question: "Где нужна запятая?", options: ["Уставший после дороги, он уснул сразу.", "Уставший, после дороги он уснул сразу.", "Уставший после дороги он, уснул сразу."] },
  { label: "Литература", question: "Как называется противопоставление образов?", options: ["Градация", "Антитеза", "Инверсия"] },
  { label: "Сочинение", question: "Какая фраза лучше связывает пример с тезисом?", options: ["Вот такой пример.", "Автор написал об этом.", "Этот эпизод показывает, что выбор героя основан на чувстве долга."] },
];

const stateLabels: Record<State, string> = {
  anonymous: "Гость",
  free: "Free",
  invoice_pending: "Ожидает оплаты",
  paid: "Маршрут открыт",
  expired_or_refunded: "Доступ завершён",
  admin: "Преподаватель",
};

export function DashboardClient() {
  const [session, setSession] = useState<Session>({ name: "Гость", state: "anonymous", role: "student", diagnosticScore: 0, weakTopics: [] });
  const [loading, setLoading] = useState(true);
  const [quizOpen, setQuizOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [coachText, setCoachText] = useState("Я считаю, что верность принципам помогает человеку сохранить уважение к себе, потому что именно убеждения определяют его выбор.");
  const [coach, setCoach] = useState<{ strength: string; issue: string; nextStep: string; note: string } | null>(null);
  const [coachLoading, setCoachLoading] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (!active) return;
        setSession(data.session);
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  async function switchState(state: Exclude<State, "anonymous">) {
    setLoading(true); setError(""); setCoach(null);
    const response = await fetch("/api/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ state }) });
    const data = await response.json();
    setSession(data.session);
    setLoading(false);
  }

  async function beginDiagnostic() {
    if (session.state === "anonymous") await switchState("free");
    setQuizOpen(true); setStep(0); setAnswers([]); setResult(null); setError("");
    window.location.hash = "diagnostic";
  }

  async function finishDiagnostic() {
    setLoading(true); setError("");
    const response = await fetch("/api/diagnostic", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ answers }) });
    const data = await response.json();
    if (!response.ok) setError(data.error ?? "Не удалось сохранить результат");
    else { setResult(data); setSession((current) => ({ ...current, diagnosticScore: data.score, weakTopics: data.weakTopics })); }
    setLoading(false);
  }

  async function askCoach() {
    setCoachLoading(true); setError(""); setCoach(null);
    const response = await fetch("/api/coach", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: coachText }) });
    const data = await response.json();
    if (!response.ok) setError(data.error ?? "Наставник пока недоступен"); else setCoach(data);
    setCoachLoading(false);
  }

  const score = result?.score || session.diagnosticScore || 66;
  const today = useMemo(() => new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "numeric", month: "long" }).format(new Date()), []);

  if (quizOpen) {
    const current = questions[step];
    return (
      <div className="app-shell">
        <AppNav active="diagnostic" name={session.name} />
        <main className="app-main">
          <div className="app-top"><div><h1>Диагностика</h1><p>5 вопросов · около 4 минут</p></div><button className="button button-ghost button-small" onClick={() => setQuizOpen(false)}>Закрыть</button></div>
          <section className="diagnostic-shell" id="diagnostic">
            {!result ? (
              <div className="panel question-card">
                <div className="quiz-progress">{questions.map((_, index) => <span className={index <= step ? "done" : ""} key={index} />)}</div>
                <div className="section-kicker">{current.label} · {step + 1} из {questions.length}</div>
                <h2>{current.question}</h2>
                <div className="answer-list">
                  {current.options.map((option, index) => (
                    <button className={`answer ${answers[step] === index ? "selected" : ""}`} key={option} onClick={() => setAnswers((items) => { const next = [...items]; next[step] = index; return next; })}>{String.fromCharCode(65 + index)}. {option}</button>
                  ))}
                </div>
                {error && <p className="error-note">{error}</p>}
                <div className="quiz-actions">
                  <button className="button button-ghost" disabled={step === 0} onClick={() => setStep((value) => value - 1)}>Назад</button>
                  {step < questions.length - 1 ? <button className="button button-dark" disabled={answers[step] === undefined} onClick={() => setStep((value) => value + 1)}>Дальше</button> : <button className="button button-primary" disabled={answers[step] === undefined || loading} onClick={finishDiagnostic}>{loading ? "Считаем…" : "Узнать результат"}</button>}
                </div>
              </div>
            ) : (
              <div className="panel result-card" data-testid="diagnostic-result">
                <div className="result-score"><strong>{result.score}</strong><span>прогноз балла</span></div>
                <h2>{result.correct} из {result.total} — хорошая точка старта</h2>
                <p>Мы нашли темы, которые дадут самый быстрый прирост:</p>
                <div className="weak-list">{result.weakTopics.length ? result.weakTopics.map((topic) => <span key={topic}>{topic}</span>) : <span>Усложнённая практика</span>}</div>
                <p><b>Первый урок:</b> {result.nextLesson}</p>
                <button className="button button-primary" onClick={() => setQuizOpen(false)}>Перейти к плану ↗</button>
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AppNav active="home" name={session.name} />
      <main className="app-main">
        <header className="app-top">
          <div><h1>{session.state === "anonymous" ? "Добро пожаловать" : `Добрый вечер, ${session.name}`}</h1><p>{today} · следующий шаг уже выбран</p></div>
          <div className="top-actions"><span className="status-pill" data-testid="session-state">{loading ? "Проверяем…" : stateLabels[session.state]}</span><Link className="button button-ghost button-small" href="/">На сайт</Link></div>
        </header>

        <div className="app-grid">
          <section className="panel journey-panel">
            <div className="panel-head"><div><h2>Траектория к цели</h2><p>Прогноз обновляется после каждого блока</p></div><span className="panel-tag">ОГЭ / ЕГЭ</span></div>
            <div className="journey-score"><div className="mini-ring"><strong>{score}</strong></div><div className="journey-copy"><h3>Цель: 85+ баллов</h3><p>До цели — {Math.max(0, 85 - score)} баллов. Фокус недели: пунктуация и аргументация.</p><div className="tiny-progress"><span style={{ width: `${Math.min(100, score)}%` }} /></div></div></div>
          </section>

          <section className="panel">
            <div className="panel-head"><div><h2>Ритм недели</h2><p>4 дня подряд — уверенный темп</p></div><span className="panel-tag">+40 XP</span></div>
            <div className="week-row">{["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map((day,index) => <div className={`day-dot ${index < 3 ? "done" : index === 3 ? "today" : ""}`} key={day}>{day}<span>{index < 3 ? "✓" : index + 22}</span></div>)}</div>
          </section>

          <section className="panel">
            <div className="panel-head"><div><h2>План на сегодня</h2><p>47 минут · можно пройти частями</p></div><button className="button button-dark button-small" onClick={beginDiagnostic}>Диагностика</button></div>
            <Link href="/learn" className="next-lesson"><span className="lesson-icon">01</span><div><h3>Гласные в корне</h3><p>Видео + объяснение + задание + разбор</p></div><span className="lesson-time">12 мин</span></Link>
            <div className="next-lesson"><span className="lesson-icon">02</span><div><h3>Связь примера с тезисом</h3><p>Практикум по сочинению</p></div><span className="lesson-time">21 мин</span></div>
            <div className="next-lesson"><span className="lesson-icon">03</span><div><h3>Повторение: ударения</h3><p>Интервальная тренировка</p></div><span className="lesson-time">8 мин</span></div>
          </section>

          <section className="panel coach-panel" id="coach">
            <div className="panel-head"><div><h2>AI-помощник преподавателя</h2><p>Разбор по базе знаний и методике Елены Николаевны</p></div><span className="panel-tag">DEMO</span></div>
            {session.state === "paid" || session.state === "admin" ? (
              <div className="coach-form"><textarea aria-label="Фрагмент сочинения" value={coachText} onChange={(event) => setCoachText(event.target.value)} /><button className="button button-violet button-full" disabled={coachLoading} onClick={askCoach}>{coachLoading ? "Разбираю…" : "Разобрать фрагмент"}</button>{coach && <div className="coach-response" data-testid="coach-response"><p><b>Сильная сторона:</b> {coach.strength}</p><p><b>Что улучшить:</b> {coach.issue}</p><p><b>Следующий шаг:</b> {coach.nextStep}</p><small>{coach.note}</small></div>}</div>
            ) : (
              <div className="coach-lock"><div className="lock-icon">AI</div><h3>{session.state === "expired_or_refunded" ? "Доступ завершён" : session.state === "invoice_pending" ? "Проверяем оплату" : "Наставник в тарифе «Маршрут»"}</h3><p>{session.state === "invoice_pending" ? "Платный режим откроется только после серверного подтверждения." : "Показывает причину ошибки и предлагает один следующий шаг."}</p><button className="button button-violet button-full" onClick={() => switchState(session.state === "invoice_pending" ? "paid" : "invoice_pending")}>{session.state === "invoice_pending" ? "Подтвердить в демо" : "Открыть демо оплаты"}</button></div>
            )}
            {error && <p className="error-note">{error}</p>}
          </section>

          <section className="panel demo-switcher">
            <div className="panel-head"><div><h2>Проверка состояний владельцем</h2><p>Локальный демо-контур. Источник состояния — серверная запись, не браузерное хранилище.</p></div><span className="panel-tag">mock/local</span></div>
            <div className="state-buttons">
              {(["free","invoice_pending","paid","expired_or_refunded","admin"] as const).map((state) => <button className={`state-button ${session.state === state ? "active" : ""}`} data-testid={`state-${state}`} key={state} onClick={() => switchState(state)}>{stateLabels[state]}</button>)}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
