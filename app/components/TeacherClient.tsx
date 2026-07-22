"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppNav } from "./AppNav";

type Student = { id: string; name: string; state: string; score: number; weakTopics: string[]; updatedAt: string };

export function TeacherClient() {
  const [students, setStudents] = useState<Student[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  async function loadStudents() {
    const response = await fetch("/api/teacher", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) { setError(data.error ?? "Нужна роль преподавателя"); setReady(true); return; }
    setStudents(data.students); setError(""); setReady(true);
  }

  async function openTeacherDemo() {
    setReady(false);
    await fetch("/api/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ state: "admin" }) });
    await loadStudents();
  }

  useEffect(() => {
    let active = true;
    fetch("/api/teacher", { cache: "no-store" })
      .then((response) => Promise.all([response.ok, response.json()]))
      .then(([ok, data]) => {
        if (!active) return;
        if (!ok) setError(data.error ?? "Нужна роль преподавателя");
        else setStudents(data.students);
        setReady(true);
      });
    return () => { active = false; };
  }, []);
  const scored = students.filter((student) => student.score > 0);
  const average = scored.length ? Math.round(scored.reduce((sum, item) => sum + item.score, 0) / scored.length) : 0;

  return (
    <div className="app-shell">
      <AppNav active="teacher" name="Елена Николаевна" />
      <main className="app-main">
        <header className="app-top"><div><h1>Кабинет преподавателя</h1><p>Класс · русский язык и литература</p></div><div className="top-actions"><span className="status-pill">Демо</span><Link className="button button-ghost button-small" href="/">На сайт</Link></div></header>
        {error ? <section className="panel empty-state"><h2>Откройте режим преподавателя</h2><p>Кабинет и список учеников защищены серверной ролью.</p><button className="button button-primary" onClick={openTeacherDemo}>Войти в демо-кабинет</button></section> : (
          <div className="teacher-grid">
            <section className="panel stat-card"><span>Ученики в демо</span><strong>{students.length}</strong><p>Активные серверные профили</p></section>
            <section className="panel stat-card"><span>Средний прогноз</span><strong>{average || "—"}</strong><p>После завершённых диагностик</p></section>
            <section className="panel stat-card"><span>Нужна помощь</span><strong>{students.filter((student) => student.score > 0 && student.score < 70).length}</strong><p>Прогноз ниже 70 баллов</p></section>
            <section className="panel students-panel"><div className="panel-head"><div><h2>Ученики и точки внимания</h2><p>Обновлено из серверного хранилища</p></div><span className="panel-tag">{ready ? "актуально" : "загрузка"}</span></div>
              {students.length ? <table className="students-table"><thead><tr><th>Ученик</th><th>Статус</th><th>Прогноз</th><th>Слабые темы</th><th>Активность</th></tr></thead><tbody>{students.map((student) => <tr key={student.id}><td><b>{student.name}</b></td><td>{student.state}</td><td>{student.score || "—"}</td><td>{student.weakTopics.slice(0,2).join(", ") || "Диагностика не пройдена"}</td><td>{new Date(student.updatedAt).toLocaleDateString("ru-RU")}</td></tr>)}</tbody></table> : <div className="empty-state"><p>Пока нет учеников. Откройте кабинет ученика и пройдите диагностику — запись появится здесь.</p></div>}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
