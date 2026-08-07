"use client";

import { useEffect, useMemo, useState } from "react";

type Exam = "oge" | "ege";
type Tab = "today" | "practice" | "variant" | "mistakes" | "profile";
type Subject = { slug: string; name: string; shortName: string; ogeAvailable: boolean };
type Student = {
  firstName: string;
  exam: Exam;
  subject: string;
  weakTopics: string[];
  lastScore: number;
  remindersEnabled: boolean;
};
type Task = {
  key: string;
  exam: Exam;
  subject: string;
  topic: string;
  title: string;
  question: string;
  options: string[];
  estimatedMinutes: number;
};
type Result = { correct: boolean; explanation: string; skillHint: string };
type Access = { status: "free" | "invoice_pending" | "paid" | "expired"; expiresAt: string | null };
type Product = { code: string; title: string; amount: number; currency: "XTR"; accessDays: number };
type AuthData = { student: Student; subjects: Subject[]; access: Access; product: Product };
type TelegramWebApp = {
  initData: string;
  ready(): void;
  expand(): void;
  openInvoice(url: string, callback?: (status: string) => void): void;
};

declare global {
  interface Window { Telegram?: { WebApp?: TelegramWebApp } }
}

const tabLabels: Record<Tab, string> = {
  today: "Сегодня",
  practice: "Практика",
  variant: "Вариант",
  mistakes: "Ошибки",
  profile: "Профиль",
};

function miniAppHref(path: string) {
  if (typeof window === "undefined") return path;
  const marker = "/telegram";
  const markerIndex = window.location.pathname.indexOf(marker);
  const basePath = markerIndex >= 0 ? window.location.pathname.slice(0, markerIndex) : "";
  return `${basePath}${path}`;
}

export function TelegramMiniAppClient() {
  const [status, setStatus] = useState<"loading" | "preview" | "ready" | "error">("loading");
  const [tab, setTab] = useState<Tab>("today");
  const [student, setStudent] = useState<Student | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [initData, setInitData] = useState("");
  const [task, setTask] = useState<Task | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [access, setAccess] = useState<Access>({ status: "free", expiresAt: null });
  const [product, setProduct] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject.slug === student?.subject),
    [student?.subject, subjects],
  );
  const availableSubjects = useMemo(
    () => subjects.filter((subject) => student?.exam === "ege" || subject.ogeAvailable),
    [student?.exam, subjects],
  );

  async function readAuth(value: string) {
    const response = await fetch("/api/telegram/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ initData: value }),
    });
    const data = await response.json() as AuthData & { error?: string };
    if (!response.ok) throw new Error(data.error ?? "Не удалось проверить Telegram");
    setStudent(data.student);
    setSubjects(data.subjects);
    setAccess(data.access);
    setProduct(data.product);
    return data;
  }

  async function loadTask(value: string, excludeTaskKey?: string) {
    const response = await fetch("/api/telegram/task", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ initData: value, excludeTaskKey }),
    });
    const data = await response.json() as { task?: Task; error?: string };
    if (!response.ok) throw new Error(data.error ?? "Не удалось получить задание");
    setTask(data.task ?? null);
  }

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      await Promise.resolve();
      const requestedTab = new URLSearchParams(window.location.search).get("tab");
      if (requestedTab && requestedTab in tabLabels && active) setTab(requestedTab as Tab);
      const webApp = window.Telegram?.WebApp;
      if (!webApp?.initData) {
        if (active) setStatus("preview");
        return;
      }
      webApp.ready();
      webApp.expand();
      if (active) setInitData(webApp.initData);
      try {
        await readAuth(webApp.initData);
        await loadTask(webApp.initData);
        if (active) setStatus("ready");
      } catch {
        if (!active) return;
        setMessage("Открыт бесплатный режим Mini App. Персональный серверный профиль, напоминания и оплата пока не подключены.");
        setStatus("preview");
      }
    };
    let script = document.querySelector<HTMLScriptElement>('script[data-ekzam-telegram="true"]');
    if (window.Telegram?.WebApp) void initialize();
    else {
      if (!script) {
        script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-web-app.js";
        script.async = true;
        script.dataset.ekzamTelegram = "true";
        document.head.appendChild(script);
      }
      script.addEventListener("load", initialize, { once: true });
      script.addEventListener("error", initialize, { once: true });
    }
    return () => {
      active = false;
      script?.removeEventListener("load", initialize);
      script?.removeEventListener("error", initialize);
    };
  }, []);

  async function answer(index: number) {
    if (!task || !initData) return;
    setBusy(true);
    setResult(null);
    setMessage("");
    try {
      const response = await fetch("/api/telegram/task", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ initData, taskKey: task.key, answerIndex: index }),
      });
      const data = await response.json() as { result?: Result; weakTopics?: string[]; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Не удалось сохранить ответ");
      setResult(data.result ?? null);
      if (data.weakTopics) setStudent((current) => current ? { ...current, weakTopics: data.weakTopics! } : current);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось сохранить ответ");
    } finally {
      setBusy(false);
    }
  }

  async function nextTask() {
    if (!initData) return;
    setBusy(true);
    setResult(null);
    setMessage("");
    try {
      await loadTask(initData, task?.key);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось получить следующее задание");
    } finally {
      setBusy(false);
    }
  }

  async function changeTrack(exam: Exam, subject: string) {
    if (!initData || !student) return;
    setBusy(true);
    setResult(null);
    setMessage("");
    try {
      const response = await fetch("/api/telegram/track", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ initData, exam, subject }),
      });
      const data = await response.json() as { student?: Pick<Student, "exam" | "subject" | "weakTopics" | "lastScore">; error?: string };
      if (!response.ok || !data.student) throw new Error(data.error ?? "Не удалось изменить маршрут");
      setStudent((current) => current ? { ...current, ...data.student } : current);
      await loadTask(initData);
      setMessage("Маршрут сохранён. Задание обновлено.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось изменить маршрут");
    } finally {
      setBusy(false);
    }
  }

  async function chooseExam(exam: Exam) {
    if (!student) return;
    const currentAvailable = subjects.find((subject) => subject.slug === student.subject && (exam === "ege" || subject.ogeAvailable));
    await changeTrack(exam, currentAvailable?.slug ?? "russian");
  }

  async function buy() {
    if (!initData) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/telegram/payment/invoice", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ initData }),
      });
      const data = await response.json() as { status?: string; access?: Access; invoiceLink?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Не удалось создать счёт");
      if (data.status === "paid" && data.access) {
        setAccess(data.access);
        return;
      }
      const webApp = window.Telegram?.WebApp;
      if (!webApp || !data.invoiceLink) {
        setMessage("Счёт создан. Откройте приложение из Telegram, чтобы оплатить Stars.");
        return;
      }
      webApp.openInvoice(data.invoiceLink, async () => {
        setMessage("Проверяем подтверждение Telegram…");
        for (let attempt = 0; attempt < 5; attempt += 1) {
          await new Promise((resolve) => setTimeout(resolve, 1200));
          try {
            const auth = await readAuth(initData);
            if (auth.access.status === "paid") {
              setMessage("Оплата подтверждена. Персональная практика открыта.");
              break;
            }
          } catch { /* Telegram webhook may still be processing. */ }
        }
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось создать счёт");
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading") {
    return <main className="telegram-app"><div className="telegram-loader"><span>Э</span><p>Проверяем Telegram…</p></div></main>;
  }
  if (status === "preview") return <PreviewMiniApp notice={message} />;
  if (status === "error") {
    return <main className="telegram-app"><div className="telegram-preview"><span className="telegram-logo error">!</span><h1>Не удалось войти</h1><p>{message}</p><button className="button button-dark" onClick={() => window.location.reload()}>Повторить</button></div></main>;
  }
  if (!student) return null;

  const examUrl = miniAppHref(`/exam?${new URLSearchParams({ level: student.exam, subject: student.subject, variant: "1", source: "telegram" }).toString()}`);
  const practiceUrl = miniAppHref(`/exam?${new URLSearchParams({ level: student.exam, subject: student.subject, mode: "training", task: "1", source: "telegram" }).toString()}`);
  const mistakesUrl = miniAppHref(`/exam?${new URLSearchParams({ level: student.exam, subject: student.subject, mode: "mistakes", source: "telegram" }).toString()}`);

  return <main className="telegram-app">
    <header className="telegram-header">
      <div><span className="telegram-logo">Э</span><div><b>ЭКЗАМ</b><small>{student.exam.toUpperCase()} · {selectedSubject?.shortName ?? student.subject}</small></div></div>
      <span className={`access-badge ${access.status}`}>{access.status === "paid" ? "Доступ открыт" : access.status === "invoice_pending" ? "Счёт создан" : "Бесплатный старт"}</span>
    </header>

    <nav className="telegram-tabs" aria-label="Разделы Mini App">
      {(Object.keys(tabLabels) as Tab[]).map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{tabLabels[item]}</button>)}
    </nav>

    {tab === "today" && <>
      <section className="telegram-welcome">
        <span>Сегодня · {task?.estimatedMinutes ?? 4} минуты</span>
        <h1>{student.firstName}, отработаем одну слабую линию</h1>
        <p>Полный вариант даёт диагноз. Короткое задание закрепляет именно ту тему, где была ошибка.</p>
        <button className="telegram-text-link" onClick={() => setTab("variant")}>Сначала полный вариант →</button>
      </section>
      {task && <section className="telegram-task" data-testid="telegram-task">
        <div className="telegram-topic">{task.exam.toUpperCase()} · {selectedSubject?.shortName ?? task.subject} · {task.topic}</div>
        <h2>{task.title}</h2>
        <p>{task.question}</p>
        <div className="telegram-options">
          {task.options.map((option, index) => <button key={`${task.key}-${index}`} disabled={busy || !!result} onClick={() => answer(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}
        </div>
      </section>}
      {result && <section className={`telegram-result ${result.correct ? "correct" : "incorrect"}`}>
        <span>{result.correct ? "✓" : "↗"}</span>
        <div><h3>{result.correct ? "Верно" : "Разберём ошибку"}</h3><p>{result.explanation}</p><small><b>Следующий шаг:</b> {result.skillHint}</small><small><b>Проверка:</b> точный ответ — автоматически; развёрнутую работу проверяет преподаватель.</small></div>
      </section>}
      {result && <button className="button button-dark button-full" disabled={busy} onClick={nextTask}>{access.status === "paid" ? "Следующее задание" : "Следующее — в персональном плане"}</button>}
    </>}

    {tab === "practice" && <section className="telegram-section-card">
      <span className="telegram-kicker">ОДНА ЛИНИЯ ДО УВЕРЕННОСТИ</span>
      <h1>Три верных подряд</h1>
      <p>Выберите конкретный номер задания. После ошибки откроются правило, причина и новое условие того же экзаменационного типа.</p>
      <div className="telegram-variant-facts"><div><b>1</b><span>номер за раз</span></div><div><b>3×</b><span>верных подряд</span></div><div><b>XP</b><span>за каждую попытку</span></div></div>
      <a className="button button-primary button-full" href={practiceUrl}>Начать с задания № 1</a>
      <a className="button button-dark button-full telegram-secondary-action" href={miniAppHref("/practice")}>Выбрать другой номер</a>
      <div className="telegram-practice-links"><a href={miniAppHref("/resume")}>Продолжить сочинение</a><a href={miniAppHref("/parent-report")}>Отчёт родителю</a></div>
    </section>}

    {tab === "variant" && <section className="telegram-section-card">
      <span className="telegram-kicker">ЭКЗАМЕНАЦИОННЫЙ РЕЖИМ</span>
      <h1>{student.exam.toUpperCase()} · {selectedSubject?.name ?? student.subject}</h1>
      <p>Решайте задания по одному в порядке экзамена. После завершения система соберёт сильные темы, ошибки и маршрут повторения.</p>
      <div className="telegram-variant-facts"><div><b>12</b><span>авторских вариантов</span></div><div><b>1 → N</b><span>порядок заданий</span></div><div><b>после</b><span>разбор без подсказки до ответа</span></div></div>
      <a className="button button-primary button-full" href={examUrl}>Открыть вариант № 1</a>
      <small>Задания являются авторскими тренировочными аналогами экзаменационных типов, а не копиями закрытых КИМ.</small>
    </section>}

    {tab === "mistakes" && <section className="telegram-section-card">
      <span className="telegram-kicker">ТЕТРАДЬ ОШИБОК</span>
      <h1>{student.weakTopics.length ? `Нужно повторить: ${student.weakTopics.length}` : "Пока всё чисто"}</h1>
      {student.weakTopics.length
        ? <ol className="telegram-mistake-list">{student.weakTopics.map((topic) => <li key={topic}><span>↗</span><div><b>{topic}</b><small>Правило → похожее задание → повторение</small></div></li>)}</ol>
        : <p>Решите вариант или задание дня. Ошибочные темы появятся здесь автоматически.</p>}
      <a className="button button-dark button-full" href={mistakesUrl}>Открыть отработку на платформе</a>
      <a className="telegram-report-link" href={miniAppHref("/parent-report")}>Показать понятный отчёт родителю →</a>
    </section>}

    {tab === "profile" && <section className="telegram-section-card">
      <span className="telegram-kicker">МОЙ МАРШРУТ</span>
      <h1>Экзамен и предмет</h1>
      <div className="telegram-exam-switch" aria-label="Выбор экзамена">
        {(["oge", "ege"] as const).map((exam) => <button key={exam} className={student.exam === exam ? "active" : ""} disabled={busy} onClick={() => chooseExam(exam)}>{exam.toUpperCase()}</button>)}
      </div>
      <label className="telegram-subject-select"><span>Предмет</span><select value={student.subject} disabled={busy} onChange={(event) => changeTrack(student.exam, event.target.value)}>{availableSubjects.map((subject) => <option value={subject.slug} key={subject.slug}>{subject.name}</option>)}</select></label>
      <div className="telegram-profile-facts"><span>Напоминания: <b>{student.remindersEnabled ? "включены" : "выключены"}</b></span><span>Слабых тем: <b>{student.weakTopics.length}</b></span></div>
      {product && <section className={`telegram-payment-card ${access.status}`} id="telegram-payment">
        <div><span>{access.status === "paid" ? "ОПЛАЧЕНО" : access.status === "invoice_pending" ? "СЧЁТ ОЖИДАЕТ ОПЛАТЫ" : "ПЕРСОНАЛЬНАЯ ПРАКТИКА"}</span><h2>{access.status === "paid" ? "Доступ активен" : `${product.amount} ⭐ · ${product.accessDays} дней`}</h2><p>{access.status === "paid" ? `Ежедневные задания доступны до ${new Date(access.expiresAt!).toLocaleDateString("ru-RU")}.` : "Ежедневные задания по слабым темам, разбор ошибок и план повторения. Разовая оплата в Telegram Stars."}</p></div>
        {access.status !== "paid" && <button className="button button-violet button-full" disabled={busy} onClick={buy}>Оплатить {product.amount} ⭐</button>}
      </section>}
    </section>}

    {message && <p className="telegram-message" role="status">{message}</p>}
    <footer className="telegram-foot"><span>Доступ открывается только после подтверждения сервера.</span><a href={miniAppHref("/paysupport")}>Поддержка оплаты</a></footer>
  </main>;
}

function PreviewMiniApp({ notice = "" }: { notice?: string }) {
  const [exam, setExam] = useState<Exam>("ege");
  const [subject, setSubject] = useState("russian");
  return <main className="telegram-app">
    <div className="telegram-preview telegram-preview-demo">
      <span className="telegram-logo">Э</span>
      <p className="telegram-kicker">{notice ? "БЕСПЛАТНЫЙ РЕЖИМ MINI APP" : "ПРЕДПРОСМОТР MINI APP"}</p>
      <h1>ОГЭ или ЕГЭ — сначала выбор, потом вариант</h1>
      <p>{notice || "Поклацать разбор ошибки можно на сайте. Живой прогресс, бот и Stars работают только после запуска из реального бота."}</p>
      <div className="telegram-exam-switch">
        {(["oge", "ege"] as const).map((item) => <button key={item} className={exam === item ? "active" : ""} onClick={() => setExam(item)}>{item.toUpperCase()}</button>)}
      </div>
      <label className="telegram-subject-select"><span>Предмет</span><select value={subject} onChange={(event) => setSubject(event.target.value)}><option value="russian">Русский язык</option><option value="math">Математика</option><option value="social">Обществознание</option><option value="informatics">Информатика</option></select></label>
      <a className="button button-primary button-full" href={miniAppHref(`/exam?level=${exam}&subject=${subject}&variant=1&source=telegram-preview`)}>Открыть вариант № 1</a>
      <a className="button button-dark button-full" href={miniAppHref("/how-it-works")}>Поклацать разбор ошибки</a>
      <div className="telegram-public-links"><a href="https://t.me/EkzamOgeEgeBot" target="_blank" rel="noreferrer">Открыть бота</a><a href="https://t.me/ekzam_oge_ege" target="_blank" rel="noreferrer">Канал ЭКЗАМ</a></div>
      <small>Это безопасный предпросмотр без Telegram ID и без имитации оплаты.</small>
    </div>
  </main>;
}
