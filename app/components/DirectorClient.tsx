"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppNav } from "./AppNav";

type Plan = { id: string; name: string; monthlyPrice: number; promise: string; updatedAt: string };
type Student = { id: string; name: string; state: string; score: number; weakTopics: string[]; updatedAt: string };
type Report = { metrics: { activeStudents: number; paidStudents: number; trialToPaid: number; averageScore: number; revenue: number }; plans: Plan[]; students: Student[]; generatedAt: string };

export function DirectorClient() {
  const [report, setReport] = useState<Report | null>(null);
  const [draft, setDraft] = useState<Record<string, number>>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState("");

  async function load() {
    const response = await fetch("/api/director", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) { setError(data.error ?? "Нужен доступ администратора"); return; }
    setReport(data); setDraft(Object.fromEntries(data.plans.map((plan: Plan) => [plan.id, plan.monthlyPrice]))); setError("");
  }

  async function openDemo() {
    await fetch("/api/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ state: "director" }) });
    await load();
  }

  async function savePrice(plan: Plan) {
    setSaving(plan.id);
    const response = await fetch("/api/director", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: plan.id, monthlyPrice: draft[plan.id] }) });
    const data = await response.json();
    if (!response.ok) setError(data.error ?? "Не удалось сохранить цену");
    else { setReport(data); setError(""); }
    setSaving("");
  }

  useEffect(() => {
    let cancelled = false;
    fetch("/api/director", { cache: "no-store" })
      .then(async (response) => ({ response, data: await response.json() }))
      .then(({ response, data }) => {
        if (cancelled) return;
        if (!response.ok) { setError(data.error ?? "Нужен доступ администратора"); return; }
        setReport(data);
        setDraft(Object.fromEntries(data.plans.map((plan: Plan) => [plan.id, plan.monthlyPrice])));
        setError("");
      })
      .catch(() => { if (!cancelled) setError("Не удалось загрузить отчёт школы"); });
    return () => { cancelled = true; };
  }, []);

  return <div className="app-shell director-shell">
    <AppNav active="director" name="Администратор" />
    <main className="app-main">
      <header className="app-top"><div><span className="exam-label">Служебный раздел</span><h1>Управление школой</h1><p>Ученики, предметы, преподаватели, цены и деньги — на одном экране.</p></div><div className="top-actions"><span className="status-pill">Администратор</span><Link className="button button-ghost button-small" href="/">На сайт</Link></div></header>
      {error && !report ? <section className="panel empty-state"><h2>Нужен административный доступ</h2><p>Демо-роль открывает отчёты и управление ценами без привязки к персональному имени.</p><button className="button button-red" onClick={openDemo}>Открыть демо управления</button></section> : report && <>
        <section className="director-metrics">
          <article><span>Активные ученики</span><strong>{report.metrics.activeStudents}</strong><small>в демо-базе</small></article>
          <article><span>Оплатили</span><strong>{report.metrics.paidStudents}</strong><small>подтверждённые состояния</small></article>
          <article><span>Из диагностики в оплату</span><strong>{report.metrics.trialToPaid}%</strong><small>воронка школы</small></article>
          <article><span>Средний прогноз</span><strong>{report.metrics.averageScore || "—"}</strong><small>по прошедшим диагностику</small></article>
          <article className="money"><span>Выручка месяца</span><strong>{report.metrics.revenue.toLocaleString("ru-RU")} ₽</strong><small>демонстрационный расчёт</small></article>
        </section>
        <section className="director-grid">
          <div className="panel price-manager"><div className="panel-head"><div><h2>Цены школы</h2><p>Вы меняете цену — она сохраняется в серверной базе.</p></div><span className="panel-tag">D1</span></div>
            <div className="director-plans">{report.plans.map((plan) => <article key={plan.id}><div><b>{plan.name}</b><p>{plan.promise}</p></div><label><span>₽ / месяц</span><input type="number" min="0" max="50000" value={draft[plan.id] ?? plan.monthlyPrice} onChange={(event) => setDraft((items) => ({ ...items, [plan.id]: Number(event.target.value) }))} /></label><button disabled={saving === plan.id} onClick={() => savePrice(plan)}>{saving === plan.id ? "Сохраняю…" : "Сохранить"}</button></article>)}</div>
            {error && <p className="error-note">{error}</p>}
          </div>
          <div className="panel subject-report"><div className="panel-head"><div><h2>Предметы запуска</h2><p>Статус программы и преподавателя по каждому направлению.</p></div><Link href="/subjects">15 предметов ↗</Link></div>
            {[['Русский язык','ЕМ','в работе'],['Математика','СД','подготовка'],['Информатика','АХ','подготовка'],['Физика','ЕЛ','подготовка'],['Химия','ЕК','подготовка'],['Биология','МН','подготовка']].map(([subject, initials, state]) => <div className="subject-row" key={subject}><span>{initials}</span><b>{subject}</b><small>{state}</small></div>)}
          </div>
          <div className="panel students-panel director-students"><div className="panel-head"><div><h2>Ученики</h2><p>Кому нужна помощь прямо сейчас</p></div><span className="panel-tag">{report.students.length}</span></div>
            {report.students.length ? <table className="students-table"><thead><tr><th>Ученик</th><th>Доступ</th><th>Прогноз</th><th>Слабая тема</th></tr></thead><tbody>{report.students.map((student) => <tr key={student.id}><td><b>{student.name}</b></td><td>{student.state}</td><td>{student.score || "—"}</td><td>{student.weakTopics[0] ?? "Нужна диагностика"}</td></tr>)}</tbody></table> : <div className="empty-state"><p>Пока нет учеников — пройдите диагностику в кабинете ученика.</p></div>}
          </div>
        </section>
      </>}
    </main>
  </div>;
}
