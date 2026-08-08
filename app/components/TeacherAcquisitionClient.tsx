"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { AcquisitionSource, TeacherAcquisitionPlaybook } from "../../knowledge-base/marketing/teacher-acquisition";
import { parentPainEvidence, partnershipSafety } from "../../knowledge-base/marketing/teacher-acquisition";

type Props = { playbook: TeacherAcquisitionPlaybook };
type CabinetPage = "today" | "channels" | "messages" | "reels" | "strategy" | "money";

const cabinetPages: Array<{ id: CabinetPage; number: string; label: string; short: string }> = [
  { id: "today", number: "01", label: "Сегодня", short: "Сегодня" },
  { id: "channels", number: "02", label: "Точные каналы", short: "Каналы" },
  { id: "messages", number: "03", label: "Что написать", short: "Тексты" },
  { id: "reels", number: "04", label: "Reels", short: "Reels" },
  { id: "strategy", number: "05", label: "План 14 дней", short: "План" },
  { id: "money", number: "06", label: "Предложение", short: "Цена" },
];

function sourceStatus(source: AcquisitionSource) {
  if (source.access === "public-contact") return "ОПУБЛИКОВАННЫЙ КОНТАКТ";
  if (source.access === "paid-catalog") return "ОФИЦИАЛЬНОЕ РАЗМЕЩЕНИЕ";
  if (source.access === "reply-only") return "ТОЛЬКО ОТВЕТ В ТЕМЕ";
  return "СНАЧАЛА ИЗУЧИТЬ";
}

export function TeacherAcquisitionClient({ playbook }: Props) {
  const [activePage, setActivePage] = useState<CabinetPage>("today");
  const [copied, setCopied] = useState("");
  const [activeReel, setActiveReel] = useState(playbook.reels[0].id);
  const [sourceFilter, setSourceFilter] = useState("all");
  const [forumFilter, setForumFilter] = useState("all");
  const [completed, setCompleted] = useState<string[]>([]);
  const storageKey = `ekzam-acquisition-${playbook.id}`;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const requested = new URLSearchParams(window.location.search).get("page") as CabinetPage | null;
      if (requested && cabinetPages.some((page) => page.id === requested)) setActivePage(requested);
      try { setCompleted(JSON.parse(localStorage.getItem(storageKey) ?? "[]")); } catch { setCompleted([]); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [storageKey]);

  async function copy(id: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(id);
    window.setTimeout(() => setCopied(""), 1800);
  }

  function openPage(page: CabinetPage) {
    setActivePage(page);
    const url = new URL(window.location.href);
    url.searchParams.set("page", page);
    window.history.replaceState({}, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  function draftForSource(source: AcquisitionSource) {
    return `Здравствуйте! Перед отправкой этого черновика я изучу конкретную публикацию вашей площадки и добавлю здесь настоящую причину обращения. Представляю преподавателя ${playbook.name}, направление — ${playbook.subjectName}. У нас есть бесплатная практика «${playbook.leadMagnet}»: ученик выполняет задание, видит причину ошибки и повторяет навык на новом условии. Предлагаем ${source.offer.replace(`${playbook.name}: `, "").toLowerCase()} Можно сначала прислать демо для проверки без обязательств? Контакты подписчиков и детей нам не нужны; формат, маркировку и условия согласуем заранее.`;
  }

  const selectedReel = playbook.reels.find((item) => item.id === activeReel) ?? playbook.reels[0];
  const sources = useMemo(() => playbook.sources.filter((item) => sourceFilter === "all" || item.segment === sourceFilter), [playbook.sources, sourceFilter]);
  const forumRoutes = useMemo(() => playbook.forumRoutes.filter((item) => forumFilter === "all" || item.actionMode === forumFilter), [playbook.forumRoutes, forumFilter]);
  const prioritySources = playbook.sources.filter((source) => source.access !== "research-only").slice(0, 3);
  const fullBrief = [
    `${playbook.name} — ${playbook.subjectName}`,
    `Позиционирование: ${playbook.positioning}`,
    `Лид-магнит: ${playbook.leadMagnet}`,
    "",
    "КАНАЛЫ",
    ...playbook.sources.map((source) => `${source.name}: ${source.sourceUrl}\n${source.offer}\nПравило: ${source.rule}`),
    "",
    "СООБЩЕНИЯ",
    ...playbook.messages.map((message) => `${message.label}\n${message.text}`),
    "",
    "REELS",
    ...playbook.reels.map((reel) => `${reel.title}\n${reel.shots.map((shot) => `${shot.time}: показать ${shot.show}; сказать «${shot.say}»`).join("\n")}`),
  ].join("\n\n");

  return <main className={`teacher-acquisition-page teacher-growth-cabinet subject-${playbook.subjectSlug}`}>
    <header className="teacher-cabinet-topbar">
      <Link className="teacher-cabinet-brand" href="/growth/teachers"><span>{playbook.initials}</span><div><b>{playbook.name}</b><small>{playbook.subjectName} · кабинет привлечения</small></div></Link>
      <div className="teacher-cabinet-progress"><strong>{completed.length}</strong> из {playbook.sprint.length} шагов</div>
    </header>

    <div className="teacher-cabinet-layout">
      <aside className="teacher-cabinet-sidebar">
        <nav aria-label="Страницы кабинета преподавателя">
          {cabinetPages.map((page) => <button key={page.id} type="button" className={activePage === page.id ? "active" : ""} aria-current={activePage === page.id ? "page" : undefined} onClick={() => openPage(page.id)}><span>{page.number}</span>{page.label}</button>)}
        </nav>
        <div className="teacher-cabinet-note"><b>Цель</b><p>Не набрать просмотры, а привести родителя или взрослого ученика в одну полезную диагностику.</p></div>
        <div className="teacher-cabinet-stop"><b>Стоп</b><p>Не писать детям, не выгружать участников каналов, не маскировать рекламу под отзыв.</p></div>
        <Link href="/growth/teachers">← Все преподаватели</Link>
      </aside>

      <div className="teacher-cabinet-content">
        <section className="teacher-cabinet-page" data-cabinet-page="today" hidden={activePage !== "today"}>
          <div className="teacher-cabinet-hero">
            <span className="exam-kicker">ПЕРСОНАЛЬНЫЙ МАРШРУТ · {playbook.subjectName}</span>
            <h1>{playbook.name}</h1><strong className="teacher-cabinet-promise">Найти своих учеников.</strong>
            <p>{playbook.positioning}</p>
            <div className="teacher-cabinet-actions"><button type="button" onClick={() => openPage("strategy")}>Начать рабочий день →</button><Link href={playbook.practicePath}>Проверить путь ученика ↗</Link><button type="button" className="secondary" onClick={() => copy("brief", fullBrief)}>{copied === "brief" ? "План скопирован ✓" : "Скопировать весь план"}</button></div>
            <div className="teacher-cabinet-stats"><article><strong>{playbook.sources.length}</strong><span>точных каналов</span></article><article><strong>{playbook.forumRoutes.length}</strong><span>тем с правилами</span></article><article><strong>0</strong><span>сообщений детям</span></article></div>
          </div>

          <section className="teacher-acquisition-status"><b>Статус профиля</b><p>{playbook.participationLabel}. До набора учеников преподаватель подтверждает программу, расписание, цену и право использовать имя.</p><a href={playbook.evidenceUrl} target="_blank" rel="noreferrer">Публичный источник ↗</a></section>

          <section className="teacher-today-section">
            <header><div><span className="exam-kicker">ПЛАН НА СЕГОДНЯ</span><h2>Пять действий до первого проверяемого отклика</h2></div><p>Идите по порядку. Отметки сохраняются только на этом устройстве.</p></header>
            <div className="teacher-today-actions">{playbook.sprint.slice(0, 5).map((item, index) => <label key={item.day} className={completed.includes(item.day) ? "done" : ""}><input type="checkbox" checked={completed.includes(item.day)} onChange={() => toggleSprint(item.day)} /><span>0{index + 1}</span><div><b>{item.action}</b><small>{item.evidence}</small></div><button type="button" onClick={(event) => { event.preventDefault(); openPage(index < 2 ? "reels" : index === 2 ? "channels" : "messages"); }}>{index < 2 ? "Открыть Reels" : index === 2 ? "Открыть каналы" : "Открыть тексты"}</button></label>)}</div>
          </section>

          <section className="teacher-priority-section"><span className="exam-kicker">ПЕРВЫЕ ТРИ КАНАЛА</span><h2>Начать не со всех, а с наиболее понятных входов</h2><div>{prioritySources.map((source, index) => <article key={source.id}><span>0{index + 1}</span><h3>{source.name}</h3><p>{source.audience}</p><a href={source.sourceUrl} target="_blank" rel="noreferrer">Открыть площадку ↗</a></article>)}</div><button type="button" onClick={() => openPage("channels")}>Посмотреть все точные каналы →</button></section>

          <section className="teacher-pain-section">
            <header><span className="exam-kicker">Не абстрактная целевая аудитория</span><h2>Три человека — три разные боли</h2></header>
            <div className="teacher-pain-grid"><article><span>УЧЕНИК</span><h3>«Я вроде знаю, но снова ошибся»</h3><p>{playbook.studentPain}</p></article><article><span>РОДИТЕЛЬ</span><h3>«Я не понимаю, за что платить»</h3><p>{playbook.parentPain}</p></article><article><span>КЛАССНЫЙ РУКОВОДИТЕЛЬ</span><h3>«Мне нужна польза без новой нагрузки»</h3><p>{playbook.classTeacherPain}</p></article></div>
            <div className="teacher-evidence-row">{parentPainEvidence.map((item) => <a key={`${item.value}-${item.label}`} href={item.sourceUrl} target="_blank" rel="noreferrer"><strong>{item.value}</strong><span>{item.label}</span><small>{item.sourceLabel} ↗</small></a>)}</div>
          </section>
        </section>

        <section className="teacher-cabinet-page" data-cabinet-page="channels" hidden={activePage !== "channels"}>
          <section className="teacher-sources-section">
            <header><div><span className="exam-kicker">Проверено 8 августа 2026 года</span><h2>Точные площадки для {playbook.name}</h2><p>Каждый маршрут объясняет, кому он подходит, что предложить и каким способом допустимо связаться. Участники каналов не являются списком лидов.</p></div><div className="teacher-source-filters">{[["all", "Все"], ["class-teacher", "Классные руководители"], ["parent", "Родители"], ["subject", "Предметные"], ["forum", "Форумы"]].map(([value, label]) => <button key={value} type="button" className={sourceFilter === value ? "active" : ""} onClick={() => setSourceFilter(value)}>{label}</button>)}</div></header>
            <div className="teacher-source-grid">{sources.map((source, index) => <article key={source.id}><div><span>{String(index + 1).padStart(2, "0")}</span><small>{sourceStatus(source)}</small></div><h3>{source.name}</h3><p>{source.audience}</p><strong>Почему отобрано</strong><p>{source.evidence}</p><strong>Что предложить</strong><p>{source.offer}</p><em>{source.rule}</em><footer><a href={source.sourceUrl} target="_blank" rel="noreferrer">Открыть канал / источник ↗</a>{source.contactUrl ? <a href={source.contactUrl} target="_blank" rel="noreferrer">{source.contactLabel} ↗</a> : <span>{source.contactLabel}</span>}<button type="button" onClick={() => copy(`source-${source.id}`, draftForSource(source))}>{copied === `source-${source.id}` ? "Черновик скопирован ✓" : "Скопировать обращение"}</button></footer></article>)}</div>
          </section>

          <section className="teacher-forum-section">
            <header><div><span className="exam-kicker light">Исследовано 8 августа 2026 года</span><h2>Не «форумы вообще», а конкретные темы и безопасный ответ</h2><p>Для {playbook.name} отобраны семь маршрутов. Это черновики: ни один ответ не опубликован автоматически.</p></div><div className="teacher-forum-filters">{[["all", "Все 7"], ["expert-reply", "Можно помочь"], ["special-listing", "Спецтема"], ["research-only", "Только изучить"]].map(([value, label]) => <button key={value} type="button" className={forumFilter === value ? "active" : ""} onClick={() => setForumFilter(value)}>{label}</button>)}</div></header>
            <div className="teacher-forum-principle"><strong>Стоп скрытой рекламе</strong><p>Обычный ответ должен быть полезен без ссылки. Коммерческий текст — только в специальной категории или после разрешения модератора.</p><div><span>0 личных сообщений детям</span><span>0 массовых комментариев</span><span>0 выдуманных отзывов</span></div></div>
            <div className="teacher-forum-grid">{forumRoutes.map((route, index) => {
              const status = route.actionMode === "expert-reply" ? "ПОМОЧЬ БЕЗ РЕКЛАМЫ" : route.actionMode === "special-listing" ? "РАЗРЕШЁННАЯ СПЕЦТЕМА" : "ТОЛЬКО ИССЛЕДОВАТЬ";
              return <article key={route.id} className={`forum-route forum-route-${route.actionMode}`}><div className="forum-route-top"><span>{String(index + 1).padStart(2, "0")}</span><div><small>{route.platform} · {route.freshness === "evergreen" ? "типовая боль" : route.freshness}</small><b>{status}</b></div></div><h3>{route.title}</h3><div className="forum-route-evidence"><strong>Что спрашивают</strong><p>{route.observedQuestion}</p><strong>Боль</strong><p>{route.painSignal}</p><strong>Почему подходит</strong><p>{route.fitReason}</p></div><aside><b>ПРАВИЛО ПЛОЩАДКИ</b><p>{route.ruleSummary}</p><a href={route.ruleUrl} target="_blank" rel="noreferrer">Проверить правило ↗</a></aside><details open={route.actionMode === "expert-reply"}><summary>{route.actionMode === "research-only" ? "Почему не отвечать" : "Готовый честный ответ"}</summary>{route.actionMode === "research-only" ? <p className="forum-no-reply">{route.followupReply}</p> : <><pre>{route.publicReply}</pre><button type="button" onClick={() => copy(`forum-${route.id}`, route.publicReply)}>{copied === `forum-${route.id}` ? "Ответ скопирован ✓" : "Скопировать ответ"}</button></>}</details><details><summary>Что делать, если разговор продолжили</summary><p>{route.followupReply}</p></details><details><summary>Проверка перед публикацией</summary><ol>{route.beforePosting.map((item) => <li key={item}>{item}</li>)}</ol></details><footer><a href={route.url} target="_blank" rel="noreferrer">Открыть исследованную тему ↗</a><span>Перепроверить актуальность</span></footer></article>;
            })}</div>
          </section>

          <section className="teacher-partnership-safety"><div><span className="exam-kicker light">Чувствительный канал</span><h2>{partnershipSafety.title}</h2><p>{partnershipSafety.text}</p><a href={partnershipSafety.lawUrl} target="_blank" rel="noreferrer">{partnershipSafety.lawLabel} ↗</a></div><div className="teacher-safety-columns"><article><b>МОЖНО ПРОЕКТИРОВАТЬ</b><ul>{partnershipSafety.allowed.map((item) => <li key={item}>{item}</li>)}</ul></article><article><b>НЕ ИСПОЛЬЗОВАТЬ</b><ul>{partnershipSafety.blocked.map((item) => <li key={item}>{item}</li>)}</ul></article></div></section>
        </section>

        <section className="teacher-cabinet-page" data-cabinet-page="messages" hidden={activePage !== "messages"}>
          <section className="teacher-messages-section"><header><span className="exam-kicker">Готово к персонализации</span><h2>Что написать — без скрытой продажи</h2><p>Перед отправкой добавьте одну настоящую деталь о получателе. Это черновики для взрослых администраторов и родителей, а не автоматическая рассылка.</p></header><div className="teacher-message-grid">{playbook.messages.map((message, index) => <article key={message.id}><span>{String(index + 1).padStart(2, "0")} · {message.label}</span><h3>{message.title}</h3><p>{message.text}</p><button type="button" onClick={() => copy(`message-${message.id}`, message.text)}>{copied === `message-${message.id}` ? "Текст скопирован ✓" : "Скопировать сообщение"}</button></article>)}</div></section>
          <section className="teacher-message-rules"><h2>Как продолжить разговор</h2><div><article><span>01</span><h3>Сначала разрешение</h3><p>«Можно прислать демо на проверку?» — без файла, голосового сообщения и длинной презентации в первом касании.</p></article><article><span>02</span><h3>Потом польза</h3><p>Одна задача, один навык, понятная причина ошибки. Не обещать результат экзамена.</p></article><article><span>03</span><h3>Один повтор</h3><p>Если ответа нет, одно вежливое уточнение через 5–7 дней. Затем остановиться.</p></article></div></section>
        </section>

        <section className="teacher-cabinet-page" data-cabinet-page="reels" hidden={activePage !== "reels"}>
          <section className="teacher-reels-section"><header><div><span className="exam-kicker light">Съёмочное задание для {playbook.name}</span><h2>Что показать, сделать и сказать</h2><p>Механика референса адаптирована под предмет; текст, задача и визуал должны быть оригинальными.</p></div><div className="teacher-reel-tabs">{playbook.reels.map((reel, index) => <button type="button" key={reel.id} className={activeReel === reel.id ? "active" : ""} onClick={() => setActiveReel(reel.id)}><span>0{index + 1}</span>{reel.audience}</button>)}</div></header><article className="teacher-reel-brief"><div className="teacher-reel-summary"><span>{selectedReel.duration} · {selectedReel.audience}</span><h3>{selectedReel.title}</h3><p><b>Цель:</b> {selectedReel.goal}</p><p><b>Подготовить:</b> {selectedReel.setup}</p><blockquote>{selectedReel.hook}</blockquote></div><div className="teacher-reel-timeline">{selectedReel.shots.map((shot, index) => <article key={`${selectedReel.id}-${shot.time}`}><span>{shot.time}</span><div><small>ЧТО ПОКАЗАТЬ</small><p>{shot.show}</p><small>ЧТО СДЕЛАТЬ</small><p>{shot.action}</p><small>ЧТО СКАЗАТЬ ДОСЛОВНО</small><blockquote>«{shot.say}»</blockquote><em>ТЕКСТ НА ЭКРАНЕ · {shot.overlay}</em></div><b>{String(index + 1).padStart(2, "0")}</b></article>)}</div><footer><div><span>ПОДПИСЬ</span><p>{selectedReel.caption}</p><code>{selectedReel.cta}</code></div><div><span>ПРИМЕР МЕХАНИКИ</span><a href={selectedReel.exampleUrl} target="_blank" rel="noreferrer">{selectedReel.exampleLabel} ↗</a><p>{selectedReel.adaptationRule}</p></div><button type="button" onClick={() => copy(`reel-${selectedReel.id}`, `${selectedReel.title}\n\n${selectedReel.shots.map((shot) => `${shot.time}\nПоказать: ${shot.show}\nСделать: ${shot.action}\nСказать: ${shot.say}\nТекст: ${shot.overlay}`).join("\n\n")}\n\nПодпись: ${selectedReel.caption}\n${selectedReel.cta}`)}>{copied === `reel-${selectedReel.id}` ? "Сценарий скопирован ✓" : "Скопировать полный сценарий"}</button></footer></article></section>
        </section>

        <section className="teacher-cabinet-page" data-cabinet-page="strategy" hidden={activePage !== "strategy"}>
          <section className="teacher-funnel-section"><header><span className="exam-kicker light">Путь одного ученика</span><h2>Контент → действие → доказательство → заказ</h2><p>Каждый источник получает отдельную ссылку. Оцениваем завершённые задания и запросы взрослых, а не только просмотры.</p></header><div className="teacher-funnel-steps"><article><span>01</span><h3>Крючок</h3><p>{playbook.challengePrompt}</p></article><article><span>02</span><h3>Практика</h3><p>{playbook.leadMagnet}</p></article><article><span>03</span><h3>Разбор</h3><p>Причина ошибки и новое условие того же типа.</p></article><article><span>04</span><h3>Отчёт</h3><p>Что получается и где нужен преподаватель.</p></article><article><span>05</span><h3>Заказ</h3><p>Только взрослый сам запрашивает продолжение.</p></article></div><div className="teacher-referral-links">{playbook.referralPaths.map((item) => <article key={item.id}><span>{item.label}</span><code>{item.path}</code><div><Link href={item.path}>Проверить →</Link><button type="button" onClick={() => copy(`path-${item.id}`, absoluteAppUrl(item.path))}>{copied === `path-${item.id}` ? "Скопировано ✓" : "Скопировать ссылку"}</button></div></article>)}</div></section>
          <section className="teacher-sprint-section"><header><div><span className="exam-kicker light">Рабочий спринт</span><h2>14 дней до первой проверенной связки</h2><p>Состояние хранится только на этом устройстве: публичная GitHub Pages-версия не является CRM.</p></div><strong>{completed.length}/{playbook.sprint.length}</strong></header><div>{playbook.sprint.map((item) => <label key={item.day} className={completed.includes(item.day) ? "done" : ""}><input type="checkbox" checked={completed.includes(item.day)} onChange={() => toggleSprint(item.day)} /><span>{item.day}</span><div><p>{item.action}</p><small>ДОКАЗАТЕЛЬСТВО · {item.evidence}</small></div></label>)}</div></section>
        </section>

        <section className="teacher-cabinet-page" data-cabinet-page="money" hidden={activePage !== "money"}>
          <section className="teacher-offers-section"><header><span className="exam-kicker">Монетизация после пользы</span><h2>За что платит родитель</h2><p>Цены — гипотезы для теста. Реальный прайс, расписание и объём проверки публикуются только после подтверждения преподавателем.</p></header><div>{playbook.offers.map((offer) => <article key={offer.stage}><span>{offer.stage}</span><h3>{offer.name}</h3><strong>{offer.price}</strong><p>{offer.result}</p><small>{offer.gate}</small></article>)}</div></section>
          <section className="teacher-acquisition-final"><div><span className="exam-kicker light">Первое доказательство ценности</span><h2>Сначала ученик решает. Потом взрослый принимает решение.</h2><p>Демо должно открыть конкретное задание, показать разбор после ответа и только затем предложить помощь {playbook.name}.</p></div><div><Link className="button button-yellow" href={playbook.practicePath}>Пройти задание № {playbook.taskNumber} →</Link><button type="button" className="button button-ghost light" onClick={() => openPage("channels")}>Открыть каналы</button></div></section>
        </section>
      </div>
    </div>

    <nav className="teacher-cabinet-mobile-nav" aria-label="Мобильные страницы кабинета">{cabinetPages.map((page) => <button key={page.id} type="button" className={activePage === page.id ? "active" : ""} onClick={() => openPage(page.id)}><span>{page.number}</span>{page.short}</button>)}</nav>
  </main>;
}
