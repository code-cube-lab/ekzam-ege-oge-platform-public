"use client";

import { useEffect, useState } from "react";

type Task = { key: string; exam: "oge" | "ege"; subject: "russian" | "literature"; topic: string; title: string; question: string; options: string[]; estimatedMinutes: number };
type Result = { correct: boolean; explanation: string; skillHint: string };
type Access = { status: "free" | "invoice_pending" | "paid" | "expired"; expiresAt: string | null };
type Product = { code: string; title: string; amount: number; currency: "XTR"; accessDays: number };
type TelegramWebApp = { initData: string; ready(): void; expand(): void; close(): void; openInvoice(url: string, callback?: (status: string) => void): void; themeParams?: Record<string, string> };

declare global {
  interface Window { Telegram?: { WebApp?: TelegramWebApp } }
}

export function TelegramMiniAppClient() {
  const [status, setStatus] = useState<"loading" | "preview" | "ready" | "error">("loading");
  const [firstName, setFirstName] = useState("Ученик");
  const [subject, setSubject] = useState("russian");
  const [initData, setInitData] = useState("");
  const [task, setTask] = useState<Task | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [access, setAccess] = useState<Access>({ status: "free", expiresAt: null });
  const [product, setProduct] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function readAuth(value: string) {
    const response = await fetch("/api/telegram/auth", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ initData: value }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Не удалось проверить Telegram");
    setFirstName(data.student.firstName);
    setSubject(data.student.subject);
    setAccess(data.access);
    setProduct(data.product);
    return data;
  }

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      await Promise.resolve();
      const webApp = window.Telegram?.WebApp;
      if (!webApp?.initData) { if (active) setStatus("preview"); return; }
      webApp.ready(); webApp.expand();
      if (active) setInitData(webApp.initData);
      try {
        await readAuth(webApp.initData);
        if (!active) return;
        setStatus("ready");
        const taskResponse = await fetch("/api/telegram/task", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ initData: webApp.initData }) });
        const taskData = await taskResponse.json();
        if (!taskResponse.ok) throw new Error(taskData.error ?? "Не удалось получить задание");
        if (active) setTask(taskData.task);
      } catch (error) {
        if (!active) return;
        setMessage(error instanceof Error ? error.message : "Ошибка Telegram"); setStatus("error");
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
    return () => { active = false; script?.removeEventListener("load", initialize); script?.removeEventListener("error", initialize); };
  }, []);

  async function answer(index: number) {
    if (!task || !initData) return;
    setBusy(true); setResult(null); setMessage("");
    const response = await fetch("/api/telegram/task", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ initData, taskKey: task.key, answerIndex: index }) });
    const data = await response.json();
    if (response.ok) setResult(data.result); else setMessage(data.error ?? "Не удалось сохранить ответ");
    setBusy(false);
  }

  async function nextTask() {
    setBusy(true); setResult(null); setMessage("");
    const response = await fetch("/api/telegram/task", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ initData, excludeTaskKey: task?.key }) });
    const data = await response.json();
    if (response.ok) setTask(data.task); else setMessage(data.error ?? "Не удалось получить следующее задание");
    setBusy(false);
  }

  async function buy() {
    if (!initData) return;
    setBusy(true); setMessage("");
    const response = await fetch("/api/telegram/payment/invoice", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ initData }) });
    const data = await response.json();
    if (!response.ok) { setMessage(data.error ?? "Не удалось создать счёт"); setBusy(false); return; }
    if (data.status === "paid") { setAccess(data.access); setBusy(false); return; }
    const webApp = window.Telegram?.WebApp;
    if (!webApp || !data.invoiceLink) { setMessage("Счёт создан. Откройте приложение из Telegram, чтобы оплатить Stars."); setBusy(false); return; }
    webApp.openInvoice(data.invoiceLink, async () => {
      setMessage("Проверяем подтверждение Telegram…");
      for (let attempt = 0; attempt < 5; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        try {
          const auth = await readAuth(initData);
          if (auth.access.status === "paid") { setMessage("Оплата подтверждена. Персональная практика открыта."); break; }
        } catch { /* webhook may still be processing */ }
      }
      setBusy(false);
    });
  }

  if (status === "loading") return <main className="telegram-app"><div className="telegram-loader"><span>Э</span><p>Проверяем Telegram…</p></div></main>;
  if (status === "preview") return <main className="telegram-app"><div className="telegram-preview"><span className="telegram-logo">Э</span><h1>Мобильный «ЭКЗАМ»</h1><p>В Telegram ученик получает одно короткое задание по своей слабой теме. На сайте можно поклацать тот же цикл без входа в бота.</p><a className="button button-primary" href="/how-it-works">Поклацать разбор ошибки</a><a className="button button-dark" href="/exam?subject=russian&level=ege&variant=1">Открыть вариант № 1</a><a className="telegram-exam-link" href="/exam?subject=russian&level=ege&mode=mistakes">Мои ошибки →</a><small>Живые задания и Stars доступны только после запуска через реального бота и серверной проверки Telegram.</small></div></main>;
  if (status === "error") return <main className="telegram-app"><div className="telegram-preview"><span className="telegram-logo error">!</span><h1>Не удалось войти</h1><p>{message}</p><button className="button button-dark" onClick={() => window.location.reload()}>Повторить</button></div></main>;

  return <main className="telegram-app">
    <header className="telegram-header"><div><span className="telegram-logo">Э</span><div><b>ЭКЗАМ</b><small>личный маршрут</small></div></div><span className={`access-badge ${access.status}`}>{access.status === "paid" ? "Доступ открыт" : "Бесплатный старт"}</span></header>
    <section className="telegram-welcome"><span>Сегодня · {task?.estimatedMinutes ?? 5} минут</span><h1>{firstName}, одно точное действие</h1><p>Сначала — полный вариант по предмету. Затем — ежедневная практика по ошибкам.</p><a className="telegram-exam-link" href={`/exam?subject=${subject}&source=telegram`}>Пройти полный вариант →</a></section>
    {task && <section className="telegram-task" data-testid="telegram-task"><div className="telegram-topic">{task.exam.toUpperCase()} · {task.subject === "russian" ? "Русский" : "Литература"} · {task.topic}</div><h2>{task.title}</h2><p>{task.question}</p><div className="telegram-options">{task.options.map((option, index) => <button key={option} disabled={busy || !!result} onClick={() => answer(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div></section>}
    {result && <section className={`telegram-result ${result.correct ? "correct" : "incorrect"}`}><span>{result.correct ? "✓" : "↗"}</span><div><h3>{result.correct ? "Верно" : "Разберём"}</h3><p>{result.explanation}</p><small><b>Следующий шаг:</b> {result.skillHint}</small><small><b>Кто проверил:</b> точный ответ — автопроверка; сочинение и спорные места передаются преподавателю.</small></div></section>}
    {result && <button className="button button-dark button-full" disabled={busy} onClick={nextTask}>{access.status === "paid" ? "Следующее задание" : "Следующее — в персональном плане"}</button>}
    {product && <section className={`telegram-payment-card ${access.status}`} id="telegram-payment"><div><span>{access.status === "paid" ? "ОПЛАЧЕНО" : "ПЕРСОНАЛЬНАЯ ПРАКТИКА"}</span><h2>{access.status === "paid" ? "Доступ активен" : `${product.amount} ⭐ · ${product.accessDays} дней`}</h2><p>{access.status === "paid" ? `Ежедневные задания доступны до ${new Date(access.expiresAt!).toLocaleDateString("ru-RU")}.` : "Ежедневные задания по слабым темам, разбор ошибок и план повторения. Разовая оплата, без банковской карты внутри приложения."}</p></div>{access.status !== "paid" && <button className="button button-violet button-full" disabled={busy} onClick={buy}>Оплатить {product.amount} ⭐</button>}</section>}
    {message && <p className="telegram-message" role="status">{message}</p>}
    <footer className="telegram-foot"><span>Доступ открывается только после подтверждения сервера.</span><a href="/paysupport">Поддержка оплаты</a></footer>
  </main>;
}
