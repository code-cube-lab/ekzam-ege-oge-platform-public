"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { TeacherAcquisitionPlaybook } from "../../knowledge-base/marketing/teacher-acquisition";
import { parentPainEvidence, partnershipSafety } from "../../knowledge-base/marketing/teacher-acquisition";

type Props = { playbook: TeacherAcquisitionPlaybook };

export function TeacherAcquisitionClient({ playbook }: Props) {
  const [copied, setCopied] = useState("");
  const [activeReel, setActiveReel] = useState(playbook.reels[0].id);
  const [sourceFilter, setSourceFilter] = useState("all");
  const [completed, setCompleted] = useState<string[]>([]);
  const storageKey = `ekzam-acquisition-${playbook.id}`;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try { setCompleted(JSON.parse(localStorage.getItem(storageKey) ?? "[]")); } catch { setCompleted([]); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [storageKey]);

  async function copy(id: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    window.setTimeout(() => setCopied(""), 1800);
  }

  function absoluteAppUrl(path: string) {
    const routeMarker = "/growth/teachers";
    const markerIndex = window.location.pathname.indexOf(routeMarker);
    const basePath = markerIndex >= 0 ? window.location.pathname.slice(0, markerIndex) : "";
    return new URL(`${basePath}${path}`, window.location.origin).toString();
  }

  function toggleSprint(day: string) {
    const next = completed.includes(day) ? completed.filter((item) => item !== day) : [...completed, day];
    setCompleted(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  const selectedReel = playbook.reels.find((item) => item.id === activeReel) ?? playbook.reels[0];
  const sources = useMemo(() => playbook.sources.filter((item) => sourceFilter === "all" || item.segment === sourceFilter), [playbook.sources, sourceFilter]);
  const fullBrief = [
    `${playbook.name} — ${playbook.subjectName}`,
    `Позиционирование: ${playbook.positioning}`,
    `Боль ученика: ${playbook.studentPain}`,
    `Боль родителя: ${playbook.parentPain}`,
    `Лид-магнит: ${playbook.leadMagnet}`,
    "",
    ...playbook.messages.map((item) => `${item.label}\n${item.text}`),
    "",
    ...playbook.reels.map((reel) => `${reel.title}\n${reel.shots.map((shot) => `${shot.time}: показать ${shot.show}; сказать: «${shot.say}»`).join("\n")}`),
  ].join("\n\n");

  return <main className="teacher-acquisition-page">
    <header className="teacher-acquisition-top">
      <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
      <nav><Link href="/growth/teachers">Все преподаватели</Link><Link href="/growth">Центр роста</Link><Link className="button button-red button-small" href={playbook.practicePath}>Открыть задание</Link></nav>
    </header>

    <section className="teacher-acquisition-hero">
      <div className="teacher-acquisition-identity"><span>{playbook.initials}</span><small>{playbook.subjectName}</small><h1>{playbook.name}</h1><p>{playbook.positioning}</p><div>{playbook.focus.map((focus) => <b key={focus}>{focus}</b>)}</div></div>
      <aside><span>ЦЕЛЬ СТРАНИЦЫ</span><h2>Привести ученика не «на сайт», а в первый полезный результат.</h2><ol><li>Увидел ролик или рекомендацию</li><li>Решил конкретное задание</li><li>Понял причину ошибки</li><li>Запросил помощь преподавателя</li></ol><button type="button" onClick={() => copy("brief", fullBrief)}>{copied === "brief" ? "Весь план скопирован ✓" : "Скопировать весь план"}</button></aside>
    </section>

    <section className="teacher-acquisition-status"><b>Статус публичного профиля</b><p>{playbook.participationLabel}. До набора учеников преподаватель подтверждает программу, расписание, цену и право использовать имя в рекламе.</p><a href={playbook.evidenceUrl} target="_blank" rel="noreferrer">Проверить публичный источник ↗</a></section>

    <nav className="teacher-acquisition-nav" aria-label="Разделы маршрута"><a href="#pain">Боли</a><a href="#funnel">Путь ученика</a><a href="#sources">Кому писать</a><a href="#messages">Сообщения</a><a href="#reels">Reels подробно</a><a href="#offers">Предложение</a><a href="#sprint">14 дней</a></nav>

    <section className="teacher-pain-section" id="pain">
      <header><span className="exam-kicker">Не абстрактная целевая аудитория</span><h2>Три человека — три разные боли</h2></header>
      <div className="teacher-pain-grid"><article><span>УЧЕНИК</span><h3>«Я вроде знаю, но снова ошибся»</h3><p>{playbook.studentPain}</p></article><article><span>РОДИТЕЛЬ</span><h3>«Я не понимаю, за что платить»</h3><p>{playbook.parentPain}</p></article><article><span>КЛАССНЫЙ РУКОВОДИТЕЛЬ</span><h3>«Мне нужна польза без новой нагрузки»</h3><p>{playbook.classTeacherPain}</p></article></div>
      <div className="teacher-evidence-row">{parentPainEvidence.map((item) => <a key={`${item.value}-${item.label}`} href={item.sourceUrl} target="_blank" rel="noreferrer"><strong>{item.value}</strong><span>{item.label}</span><small>{item.sourceLabel} ↗</small></a>)}</div>
    </section>

    <section className="teacher-funnel-section" id="funnel">
      <header><span className="exam-kicker light">Вертикальный путь одного ученика</span><h2>Контент → действие → доказательство → заказ</h2><p>Каждый источник получает отдельную ссылку. Поэтому можно увидеть не только просмотры, но и завершённые задания.</p></header>
      <div className="teacher-funnel-steps"><article><span>01</span><h3>Крючок</h3><p>{playbook.challengePrompt}</p></article><article><span>02</span><h3>Лид-магнит</h3><p>{playbook.leadMagnet}</p></article><article><span>03</span><h3>Разбор</h3><p>Причина ошибки и новое условие того же типа.</p></article><article><span>04</span><h3>Отчёт</h3><p>Что получилось, что повторяется и где нужен преподаватель.</p></article><article><span>05</span><h3>Заказ</h3><p>Только взрослый сам запрашивает консультацию или программу.</p></article></div>
      <div className="teacher-referral-links">{playbook.referralPaths.map((item) => <article key={item.id}><span>{item.label}</span><code>{item.path}</code><div><Link href={item.path}>Проверить →</Link><button type="button" onClick={() => copy(`path-${item.id}`, absoluteAppUrl(item.path))}>{copied === `path-${item.id}` ? "Скопировано ✓" : "Скопировать ссылку"}</button></div></article>)}</div>
    </section>

    <section className="teacher-sources-section" id="sources">
      <header><div><span className="exam-kicker">Публичные точки входа</span><h2>Кому писать и что предлагать</h2><p>Это не список участников для рассылки. Писать можно только в опубликованный контакт, через рекламный каталог или полезным ответом по правилам форума.</p></div><div className="teacher-source-filters">{[["all", "Все"], ["class-teacher", "Классные руководители"], ["parent", "Родители"], ["subject", "Предметные"], ["forum", "Форумы"]].map(([value, label]) => <button key={value} type="button" className={sourceFilter === value ? "active" : ""} onClick={() => setSourceFilter(value)}>{label}</button>)}</div></header>
      <div className="teacher-source-grid">{sources.map((source, index) => <article key={source.id}><div><span>{String(index + 1).padStart(2, "0")}</span><small>{source.access === "public-contact" ? "ПУБЛИЧНЫЙ КОНТАКТ" : source.access === "paid-catalog" ? "ПЛАТНОЕ РАЗМЕЩЕНИЕ" : source.access === "reply-only" ? "ТОЛЬКО ОТВЕТ В ТЕМЕ" : "ТОЛЬКО ИССЛЕДОВАНИЕ"}</small></div><h3>{source.name}</h3><p>{source.audience}</p><strong>Предложить</strong><p>{source.offer}</p><em>{source.rule}</em><footer><a href={source.sourceUrl} target="_blank" rel="noreferrer">Открыть источник ↗</a>{source.contactUrl ? <a href={source.contactUrl} target="_blank" rel="noreferrer">{source.contactLabel} ↗</a> : <span>{source.contactLabel}</span>}</footer></article>)}</div>
    </section>

    <section className="teacher-partnership-safety">
      <div><span className="exam-kicker light">Классные руководители — сильный, но чувствительный канал</span><h2>{partnershipSafety.title}</h2><p>{partnershipSafety.text}</p><a href={partnershipSafety.lawUrl} target="_blank" rel="noreferrer">{partnershipSafety.lawLabel} ↗</a></div>
      <div className="teacher-safety-columns"><article><b>МОЖНО ПРОЕКТИРОВАТЬ</b><ul>{partnershipSafety.allowed.map((item) => <li key={item}>{item}</li>)}</ul></article><article><b>НЕ ИСПОЛЬЗОВАТЬ</b><ul>{partnershipSafety.blocked.map((item) => <li key={item}>{item}</li>)}</ul></article></div>
    </section>

    <section className="teacher-messages-section" id="messages">
      <header><span className="exam-kicker">Готово к персонализации</span><h2>Что написать — без скрытой продажи</h2><p>Перед отправкой добавить одну настоящую деталь о получателе и убрать всё, что не подтверждено преподавателем.</p></header>
      <div className="teacher-message-grid">{playbook.messages.map((message, index) => <article key={message.id}><span>{String(index + 1).padStart(2, "0")} · {message.label}</span><h3>{message.title}</h3><p>{message.text}</p><button type="button" onClick={() => copy(`message-${message.id}`, message.text)}>{copied === `message-${message.id}` ? "Текст скопирован ✓" : "Скопировать сообщение"}</button></article>)}</div>
    </section>

    <section className="teacher-reels-section" id="reels">
      <header><div><span className="exam-kicker light">Не «идея ролика», а съёмочное задание</span><h2>Что показать, что сказать и куда вести</h2></div><div className="teacher-reel-tabs">{playbook.reels.map((reel, index) => <button type="button" key={reel.id} className={activeReel === reel.id ? "active" : ""} onClick={() => setActiveReel(reel.id)}><span>0{index + 1}</span>{reel.audience}</button>)}</div></header>
      <article className="teacher-reel-brief"><div className="teacher-reel-summary"><span>{selectedReel.duration} · {selectedReel.audience}</span><h3>{selectedReel.title}</h3><p><b>Цель:</b> {selectedReel.goal}</p><p><b>Подготовить:</b> {selectedReel.setup}</p><blockquote>{selectedReel.hook}</blockquote></div>
        <div className="teacher-reel-timeline">{selectedReel.shots.map((shot, index) => <article key={`${selectedReel.id}-${shot.time}`}><span>{shot.time}</span><div><small>ЧТО ПОКАЗАТЬ</small><p>{shot.show}</p><small>ЧТО СДЕЛАТЬ</small><p>{shot.action}</p><small>ЧТО СКАЗАТЬ ДОСЛОВНО</small><blockquote>«{shot.say}»</blockquote><em>ТЕКСТ НА ЭКРАНЕ · {shot.overlay}</em></div><b>{String(index + 1).padStart(2, "0")}</b></article>)}</div>
        <footer><div><span>ПОДПИСЬ</span><p>{selectedReel.caption}</p><code>{selectedReel.cta}</code></div><div><span>ПРИМЕР МЕХАНИКИ</span><a href={selectedReel.exampleUrl} target="_blank" rel="noreferrer">{selectedReel.exampleLabel} ↗</a><p>{selectedReel.adaptationRule}</p></div><button type="button" onClick={() => copy(`reel-${selectedReel.id}`, `${selectedReel.title}\n\n${selectedReel.shots.map((shot) => `${shot.time}\nПоказать: ${shot.show}\nСделать: ${shot.action}\nСказать: ${shot.say}\nТекст: ${shot.overlay}`).join("\n\n")}\n\nПодпись: ${selectedReel.caption}\n${selectedReel.cta}`)}>{copied === `reel-${selectedReel.id}` ? "Сценарий скопирован ✓" : "Скопировать полный сценарий"}</button></footer>
      </article>
    </section>

    <section className="teacher-offers-section" id="offers">
      <header><span className="exam-kicker">Монетизация после пользы</span><h2>Не продавать большой курс вслепую</h2><p>Цены — гипотезы для теста. Реальный прайс публикуется только после подтверждения преподавателем.</p></header>
      <div>{playbook.offers.map((offer) => <article key={offer.stage}><span>{offer.stage}</span><h3>{offer.name}</h3><strong>{offer.price}</strong><p>{offer.result}</p><small>{offer.gate}</small></article>)}</div>
    </section>

    <section className="teacher-sprint-section" id="sprint">
      <header><div><span className="exam-kicker light">Рабочий спринт</span><h2>14 дней до первой проверенной связки</h2><p>Отмечайте выполненное. Состояние хранится только на этом устройстве: публичная GitHub Pages-версия не является CRM.</p></div><strong>{completed.length}/{playbook.sprint.length}</strong></header>
      <div>{playbook.sprint.map((item) => <label key={item.day} className={completed.includes(item.day) ? "done" : ""}><input type="checkbox" checked={completed.includes(item.day)} onChange={() => toggleSprint(item.day)} /><span>{item.day}</span><div><p>{item.action}</p><small>ДОКАЗАТЕЛЬСТВО · {item.evidence}</small></div></label>)}</div>
    </section>

    <section className="teacher-acquisition-final"><div><span className="exam-kicker light">Первое действие</span><h2>Проверьте путь глазами ученика.</h2><p>Ссылка должна открыть конкретное задание, показать разбор после ответа и только потом предложить помощь {playbook.name}.</p></div><div><Link className="button button-yellow" href={playbook.practicePath}>Пройти задание № {playbook.taskNumber} →</Link><Link className="button button-ghost light" href="/growth/teachers">Другой преподаватель</Link></div></section>
  </main>;
}
