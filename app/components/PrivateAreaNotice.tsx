import Link from "next/link";

type Props = {
  role: "ученика" | "преподавателя" | "администратора";
};

export function PrivateAreaNotice({ role }: Props) {
  return <main className="private-area-page">
    <Link className="brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
    <section>
      <span className="exam-label">Закрытый раздел</span>
      <h1>Кабинет {role} не публикуется в открытом доступе.</h1>
      <p>Здесь нет демонстрационных учеников, финансовых показателей, списков клиентов или внутренних настроек. Личные кабинеты откроются только после серверной авторизации.</p>
      <div>
        <Link className="button button-dark" href="/practice">Отрабатывать одно задание</Link>
        <Link className="button button-ghost" href="/resume">Продолжить черновик</Link>
        <Link className="button button-ghost" href="/parent-report">Отчёт родителю</Link>
      </div>
    </section>
  </main>;
}
