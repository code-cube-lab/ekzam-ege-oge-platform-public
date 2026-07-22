"use client";

import { useEffect, useState } from "react";

type Task = { key: string; topic: string; title: string; question: string; options: string[] };
type Result = { correct: boolean; explanation: string; skillHint: string };

declare global {
  interface Window {
    Telegram?: { WebApp?: { initData: string; ready(): void; expand(): void; close(): void; themeParams?: Record<string, string> } };
  }
}

export function TelegramMiniAppClient() {
  const [status, setStatus] = useState<"loading" | "preview" | "ready" | "error">("loading");
  const [firstName, setFirstName] = useState("Ученик");
  const [initData, setInitData] = useState("");
  const [task, setTask] = useState<Task | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      await Promise.resolve();
      const webApp = window.Telegram?.WebApp;
      if (!webApp?.initData) { if (active) setStatus("preview"); return; }
      webApp.ready(); webApp.expand();
      if (active) setInitData(webApp.initData);
      try {
        const authResponse = await fetch("/api/telegram/auth", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ initData: webApp.initData }) });
        const authData = await authResponse.json();
        if (!authResponse.ok) throw new Error(authData.error ?? "Не удалось проверить Telegram");
        if (!active) return;
        setFirstName(authData.student.firstName); setStatus("ready");
        const taskResponse = await fetch("/api/telegram/task", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ initData: webApp.initData }) });
        const taskData = await taskResponse.json();
        if (active) setTask(taskData.task);
      } catch (error) {
        if (!active) return;
        setMessage(error instanceof Error ? error.message : "Ошибка Telegram"); setStatus("error");
      }
    };
    let script = document.querySelector<HTMLScriptElement>('script[data-slovo-telegram="true"]');
    if (window.Telegram?.WebApp) {
      void initialize();
    } else {
      if (!script) {
        script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-web-app.js";
        script.async = true;
        script.dataset.slovoTelegram = "true";
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
    setBusy(true); setResult(null);
    const response = await fetch("/api/telegram/task", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ initData, taskKey: task.key, answerIndex: index }) });
    const data = await response.json();
    if (response.ok) setResult(data.result); else setMessage(data.error ?? "Не удалось сохранить ответ");
    setBusy(false);
  }

  async function nextTask() {
    setBusy(true); setResult(null);
    const response = await fetch("/api/telegram/task", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ initData }) });
    const data = await response.json(); setTask(data.task); setBusy(false);
  }

  if (status === "loading") return <main className="telegram-app"><div className="telegram-loader"><span>С</span><p>Проверяем Telegram…</p></div></main>;
  if (status === "preview") return <main className="telegram-app"><div className="telegram-preview"><span className="telegram-logo">С</span><h1>«Слово» готово к Telegram</h1><p>Откройте Mini App из реального бота: так сервер проверит вашу Telegram-сессию и подберёт личное задание.</p><a className="button button-primary" href="/dashboard">Посмотреть web-кабинет</a><small>Обычный браузер не получает mock-доступ Telegram.</small></div></main>;
  if (status === "error") return <main className="telegram-app"><div className="telegram-preview"><span className="telegram-logo error">!</span><h1>Не удалось войти</h1><p>{message}</p><button className="button button-dark" onClick={() => window.location.reload()}>Повторить</button></div></main>;

  return <main className="telegram-app">
    <header className="telegram-header"><div><span className="telegram-logo">С</span><div><b>СЛОВО</b><small>личный маршрут</small></div></div><span className="streak">🔥 4 дня</span></header>
    <section className="telegram-welcome"><span>Сегодня · 5 минут</span><h1>{firstName}, одно точное действие</h1><p>Задание выбрано по вашим последним ответам.</p></section>
    {task && <section className="telegram-task" data-testid="telegram-task"><div className="telegram-topic">{task.topic}</div><h2>{task.title}</h2><p>{task.question}</p><div className="telegram-options">{task.options.map((option, index) => <button key={option} disabled={busy || !!result} onClick={() => answer(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div></section>}
    {result && <section className={`telegram-result ${result.correct ? "correct" : "incorrect"}`}><span>{result.correct ? "✓" : "↗"}</span><div><h3>{result.correct ? "Верно" : "Разберём"}</h3><p>{result.explanation}</p><small>{result.skillHint}</small></div></section>}
    {result && <button className="button button-dark button-full" disabled={busy} onClick={nextTask}>Следующее задание</button>}
    <footer className="telegram-foot"><span>AI помогает преподавателю, но не заменяет его.</span><a href="/support">Поддержка</a></footer>
  </main>;
}
