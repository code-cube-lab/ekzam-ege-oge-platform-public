import Link from "next/link";

type AppNavProps = { active: "home" | "diagnostic" | "coach" | "teacher"; name?: string };

export function AppNav({ active, name = "Алексей" }: AppNavProps) {
  return (
    <aside className="side-nav">
      <Link className="brand brand-light" href="/">
        <span className="brand-mark">С</span><span>СЛОВО</span>
      </Link>
      <nav className="side-links" aria-label="Кабинет">
        <a className={`side-link ${active === "home" ? "active" : ""}`} href="/dashboard"><span>⌂</span>Главная</a>
        <a className={`side-link ${active === "diagnostic" ? "active" : ""}`} href="/dashboard#diagnostic"><span>◎</span>Диагностика</a>
        <a className={`side-link ${active === "coach" ? "active" : ""}`} href="/dashboard#coach"><span>✦</span>AI-помощник</a>
        <a className={`side-link ${active === "teacher" ? "active" : ""}`} href="/teacher"><span>▦</span>Учитель</a>
      </nav>
      <div className="side-bottom">
        <div className="user-mini"><span className="avatar">{name.slice(0, 1)}</span><div><p>{name}</p><small>Демо-профиль</small></div></div>
      </div>
    </aside>
  );
}
