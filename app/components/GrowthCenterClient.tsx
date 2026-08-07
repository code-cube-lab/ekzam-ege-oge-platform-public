"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { examSubjects, type ExamSubjectSlug } from "../../knowledge-base/exams/exam-subjects";
import {
  buildTeacherCampaign,
  forumRoutes,
  growthEvidenceDate,
  growthSubjectCoverage,
  offerHypotheses,
  outreachTemplates,
  paidGrowthLadder,
  promotionCompliance,
  publicPartners,
  studentAcquisitionSprint,
  viralEducationReferences,
  type GrowthExam,
} from "../../knowledge-base/marketing/growth-center";
import {
  getTeacherGrowthProfile,
  teacherGrowthProfiles,
  type TeacherGrowthProfile,
} from "../../knowledge-base/marketing/teacher-growth";
import { telegramChannelPosts } from "../../knowledge-base/marketing/telegram-channel-posts";

type PartnerFilter = "all" | "teacher" | "exam" | "parent" | "school";

const partnerFilterLabels: Array<[PartnerFilter, string]> = [
  ["all", "Все партнёры"],
  ["parent", "Родители"],
  ["exam", "ОГЭ / ЕГЭ"],
  ["teacher", "Педагоги"],
  ["school", "EdTech / школы"],
];

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function fullCampaignText(campaign: ReturnType<typeof buildTeacherCampaign>, fullUrl: string) {
  return [
    `СЪЁМОЧНОЕ ЗАДАНИЕ · ${campaign.exam.toUpperCase()} · ${campaign.subjectName} · № ${campaign.taskNumber}`,
    `Творческий ракурс: ${campaign.angle}`,
    `Формат: ${campaign.format}`,
    "",
    "ХУКИ:",
    ...campaign.hooks.map((hook) => `— ${hook}`),
    "",
    "КАДРЫ:",
    ...campaign.shots.map((shot) => `— ${shot}`),
    "",
    `ПОДПИСЬ: ${campaign.caption}`,
    `CTA: ${campaign.cta}`,
    `ССЫЛКА: ${fullUrl}`,
    `ПРОВЕРКА: ${campaign.reviewGate}`,
  ].join("\n");
}

function fullTeacherPlanText(profile: TeacherGrowthProfile, campaign: ReturnType<typeof buildTeacherCampaign>, fullUrl: string) {
  return [
    `ПЕРСОНАЛЬНЫЙ ПИЛОТ · ${profile.name}`,
    `Предмет: ${profile.subjectName}`,
    `Статус: ${profile.participationLabel}`,
    "",
    `ПОЗИЦИОНИРОВАНИЕ: ${profile.positioning}`,
    "",
    "СЕРИЯ ИЗ ТРЁХ REELS:",
    ...profile.reelSeries.map((item) => `— ${item}`),
    "",
    `СЪЁМКА: ${profile.filmingBrief}`,
    "",
    "КОМУ ПРЕДЛОЖИТЬ:",
    ...profile.targetAudiences.map((item) => `— ${item}`),
    "",
    "ПЕРВОЕ СООБЩЕНИЕ:",
    profile.outreachMessage,
    "",
    `ПРАКТИКА: ${campaign.exam.toUpperCase()} · ${campaign.subjectName} · № ${campaign.taskNumber}`,
    `ССЫЛКА: ${fullUrl}`,
    `СТОП-ГЕЙТ: ${profile.proofRule}`,
  ].join("\n");
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const field = document.createElement("textarea");
    field.value = text;
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }
}

function currentAppUrl(path: string) {
  if (typeof window === "undefined") return path;
  const marker = window.location.pathname.indexOf("/growth");
  const basePath = marker >= 0 ? window.location.pathname.slice(0, marker) : "";
  return `${window.location.origin}${basePath}${path}`;
}

export function GrowthCenterClient() {
  const [exam, setExam] = useState<GrowthExam>("ege");
  const [subjectSlug, setSubjectSlug] = useState<ExamSubjectSlug>("russian");
  const [taskNumber, setTaskNumber] = useState(1);
  const [teacherId, setTeacherId] = useState(teacherGrowthProfiles[0].id);
  const [partnerFilter, setPartnerFilter] = useState<PartnerFilter>("all");
  const [copied, setCopied] = useState<string | null>(null);

  const subject = examSubjects.find((item) => item.slug === subjectSlug) ?? examSubjects[0];
  const examSubjectsAvailable = exam === "ege" ? examSubjects : examSubjects.filter((item) => item.ogeAvailable);
  const taskCount = exam === "ege" ? subject.fullTaskCount : (subject.ogeTaskCount ?? 0);
  const safeTaskNumber = Math.min(Math.max(1, taskNumber), Math.max(1, taskCount));
  const campaign = useMemo(
    () => buildTeacherCampaign(exam, subjectSlug, safeTaskNumber),
    [exam, safeTaskNumber, subjectSlug],
  );
  const teacherProfile = useMemo(() => getTeacherGrowthProfile(teacherId), [teacherId]);
  const visiblePartners = publicPartners.filter((item) => partnerFilter === "all" || item.category === partnerFilter);
  const egeCoverage = growthSubjectCoverage.reduce((total, item) => total + item.ege, 0);
  const ogeCoverage = growthSubjectCoverage.reduce((total, item) => total + item.oge, 0);

  function selectExam(nextExam: GrowthExam) {
    const current = examSubjects.find((item) => item.slug === subjectSlug) ?? examSubjects[0];
    setExam(nextExam);
    if (nextExam === "oge" && !current.ogeAvailable) setSubjectSlug("russian");
    setTaskNumber(1);
  }

  async function handleCopy(id: string, text: string) {
    await copyText(text);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1800);
  }

  function selectTeacher(id: string) {
    const profile = getTeacherGrowthProfile(id);
    setTeacherId(id);
    setSubjectSlug(profile.subjectSlug);
    setExam("ege");
    setTaskNumber(1);
  }

  const practiceUrl = currentAppUrl(campaign.practicePath);
  const teacherBrief = fullCampaignText(campaign, practiceUrl);
  const teacherPlan = fullTeacherPlanText(teacherProfile, campaign, practiceUrl);

  return <main className="growth-center" id="top">
    <header className="growth-nav">
      <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span><small>центр роста</small></Link>
      <nav aria-label="Навигация центра роста"><a href="#teachers">Преподаватели</a><a href="#constructor">Конструктор</a><a href="#partners">Партнёры</a><a href="#messages">Сообщения</a><a href="#channel">Канал</a><a href="#sprint">14 дней</a><a href="#media">Реклама</a></nav>
      <Link className="button button-dark button-small" href="/reels">Видеолаборатория</Link>
    </header>

    <section className="growth-hero">
      <div className="growth-hero-copy">
        <span className="exam-kicker">Рабочий путь поиска учеников · без массовых рассылок</span>
        <h1>Не рекламировать курс.<br /><em>Дать решить один номер.</em></h1>
        <p>Преподаватель снимает короткий интерактив, зритель делает попытку, платформа показывает причину ошибки и ведёт в точечную отработку. Родитель видит не обещание баллов, а понятный следующий шаг.</p>
        <div className="growth-actions"><a className="button button-red" href="#constructor">Собрать задание преподавателю →</a><a className="button button-ghost" href="#partners">Найти партнёра</a></div>
      </div>
      <aside className="growth-radar" aria-label="Маршрут от ролика до заявки">
        <div className="growth-radar-head"><span>МАРШРУТ</span><b>01 → 05</b></div>
        {["Reel с попыткой", "Переход на один номер", "Причина ошибки", "Три похожих задания", "Запрос родителя / учителя"].map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b></div>)}
      </aside>
      <div className="growth-hero-facts"><div><strong>27</strong><span>отдельных брифов преподавателей</span></div><div><strong>{egeCoverage + ogeCoverage}</strong><span>съёмочных комбинаций</span></div><div><strong>{publicPartners.length}</strong><span>публичных партнёров</span></div></div>
    </section>

    <section className="growth-funnel" aria-labelledby="growth-funnel-title">
      <div><span className="exam-kicker light">Модель из удачного проекта Таро — адаптирована к обучению</span><h2 id="growth-funnel-title">Бесплатный интерактив создаёт личный результат.<br />Платная услуга решает обнаруженную проблему.</h2></div>
      <ol>
        <li><b>01 · ЗАЦЕПИТЬ</b><span>Не лекция, а вопрос с паузой до ответа.</span></li>
        <li><b>02 · ДОКАЗАТЬ</b><span>Учитель называет конкретную причину ошибки.</span></li>
        <li><b>03 · ПЕРЕНЕСТИ</b><span>Ученик решает другое условие того же типа.</span></li>
        <li><b>04 · ПРОДАТЬ</b><span>Предлагается проверка, маршрут или сопровождение человека.</span></li>
      </ol>
    </section>

    <section className="growth-teachers" id="teachers">
      <header className="growth-section-head"><span className="exam-kicker">Не один общий шаблон</span><h2>Отдельная рекламная линия под каждого преподавателя.</h2><p>Выберите человека: сайт соберёт его позиционирование, три темы Reels, съёмочный бриф, подходящие аудитории и первое сообщение партнёру. Это черновик для согласования — публичный профиль не означает согласие работать на платформе.</p></header>
      <div className="teacher-growth-picker">
        <label><span>Преподаватель</span><select aria-label="Преподаватель для рекламного плана" value={teacherId} onChange={(event) => selectTeacher(event.target.value)}>{teacherGrowthProfiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name} — {profile.subjectName}</option>)}</select><small>{teacherGrowthProfiles.length} уникальных персональных брифов</small></label>
        <article className="teacher-growth-profile" data-testid="teacher-growth-profile">
          <div className="teacher-growth-identity"><span>{teacherProfile.initials}</span><div><small>{teacherProfile.subjectName}</small><h3>{teacherProfile.name}</h3><p>{teacherProfile.department}</p></div></div>
          <div className="teacher-growth-status"><b>Сначала согласовать</b><span>{teacherProfile.participationLabel}</span></div>
          <p className="teacher-growth-position">{teacherProfile.positioning}</p>
          <div className="teacher-growth-columns"><div><small>СЕРИЯ REELS</small><ol>{teacherProfile.reelSeries.map((item) => <li key={item}>{item}</li>)}</ol></div><div><small>КОМУ ПИСАТЬ</small><ul>{teacherProfile.targetAudiences.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
          <div className="teacher-growth-film"><small>СЪЁМОЧНОЕ ЗАДАНИЕ</small><p>{teacherProfile.filmingBrief}</p></div>
          <div className="teacher-growth-actions"><button type="button" className="button button-red" onClick={() => handleCopy("teacher-plan", teacherPlan)}>{copied === "teacher-plan" ? "План скопирован ✓" : "Скопировать весь план"}</button><button type="button" className="button button-ghost" onClick={() => handleCopy("teacher-message", teacherProfile.outreachMessage)}>{copied === "teacher-message" ? "Сообщение скопировано ✓" : "Скопировать сообщение"}</button><a href={teacherProfile.evidenceUrl} target="_blank" rel="noreferrer">Проверить публичный источник ↗</a></div>
          <p className="teacher-growth-proof">{teacherProfile.proofRule}</p>
        </article>
      </div>
    </section>

    <section className="growth-constructor" id="constructor">
      <header className="growth-section-head"><span className="exam-kicker">Для каждого предмета и каждого номера</span><h2>Съёмочное задание преподавателю за три выбора.</h2><p>Конструктор покрывает все номера из текущего каталога. Ракурс помогает придумать ролик, но не подменяет официальную структуру: точное условие, ответ и объяснение проверяет предметник.</p></header>
      <div className="growth-builder">
        <div className="growth-controls">
          <fieldset><legend>1. Экзамен</legend>{(["oge", "ege"] as GrowthExam[]).map((value) => <button type="button" className={exam === value ? "active" : ""} aria-pressed={exam === value} key={value} onClick={() => selectExam(value)}>{value.toUpperCase()}</button>)}</fieldset>
          <label><span>2. Предмет</span><select value={subjectSlug} onChange={(event) => { setSubjectSlug(event.target.value as ExamSubjectSlug); setTaskNumber(1); }}>{examSubjectsAvailable.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
          <label><span>3. Номер задания</span><select value={safeTaskNumber} onChange={(event) => setTaskNumber(Number(event.target.value))}>{Array.from({ length: taskCount }, (_, index) => index + 1).map((item) => <option value={item} key={item}>Задание № {item}</option>)}</select></label>
          <div className="growth-coverage-note"><strong>{exam.toUpperCase()} · {campaign.subjectName}</strong><span>Все номера: 1–{campaign.taskCount}</span><small>Текущий ракурс: {campaign.angle}</small></div>
        </div>

        <article className="teacher-campaign-card" data-testid="teacher-campaign">
          <div className="campaign-title"><span>{campaign.exam.toUpperCase()} / {campaign.subjectName}</span><b>№ {campaign.taskNumber}</b></div>
          <div className="campaign-format"><small>ФОРМАТ</small><strong>{campaign.format}</strong></div>
          <div className="campaign-hooks"><small>ТРИ ХУКА</small>{campaign.hooks.map((hook) => <p key={hook}>{hook}</p>)}</div>
          <div className="campaign-shots"><small>6 КАДРОВ</small><ol>{campaign.shots.map((shot) => <li key={shot}>{shot}</li>)}</ol></div>
          <div className="campaign-gate"><small>ПЕРЕД ПУБЛИКАЦИЕЙ</small><p>{campaign.reviewGate}</p></div>
          <div className="campaign-link"><code>{campaign.practicePath}</code><Link href={campaign.practicePath}>Открыть тренировку →</Link></div>
          <button type="button" className="button button-red" onClick={() => handleCopy("campaign", teacherBrief)}>{copied === "campaign" ? "Задание скопировано ✓" : "Скопировать задание преподавателю"}</button>
        </article>
      </div>

      <div className="growth-subject-matrix" aria-label="Покрытие предметов">
        {growthSubjectCoverage.map((item, index) => <button type="button" key={item.slug} onClick={() => { setSubjectSlug(item.slug); if (exam === "oge" && !item.oge) setExam("ege"); setTaskNumber(1); document.getElementById("constructor")?.scrollIntoView({ behavior: "smooth" }); }}>
          <span>{String(index + 1).padStart(2, "0")}</span><b>{item.name}</b><small>ЕГЭ {item.ege}{item.oge ? ` · ОГЭ ${item.oge}` : " · только ЕГЭ"}</small><em>{item.focus.join(" · ")}</em>
        </button>)}
      </div>
    </section>

    <section className="growth-references" id="references">
      <header className="growth-section-head inverted"><span className="exam-kicker light">Проверенные популярные механики</span><h2>Копировать не ролик.<br />Копировать принцип удержания.</h2><p>Ссылки ведут к оригиналам. Цифры взяты из публичных публикаций на {growthEvidenceDate}; они подтверждают популярность примера, но не гарантируют повтор результата.</p></header>
      <div className="growth-reference-grid">{viralEducationReferences.map((item, index) => <article key={item.url}>
        <div><span>{String(index + 1).padStart(2, "0")} · {item.platform}</span><b>{item.author}</b></div>
        <h3>{item.title}</h3><p>{item.result}</p><blockquote>{item.pattern}</blockquote>
        <footer><a href={item.url} target="_blank" rel="noreferrer">Открыть пример ↗</a><a href={item.evidenceUrl} target="_blank" rel="noreferrer">{item.evidenceLabel} ↗</a></footer>
      </article>)}</div>
    </section>

    <section className="growth-partners" id="partners">
      <header className="growth-section-head"><span className="exam-kicker">Кому писать по бартеру и партнёрству</span><h2>Только в указанный публичный контакт.</h2><p>Сначала изучите правила и последние публикации. Одно персональное предложение — без массовой рассылки, без сообщений участникам и без повторного давления после молчания.</p></header>
      <div className="growth-filter-row" role="group" aria-label="Фильтр партнёров">{partnerFilterLabels.map(([value, label]) => <button type="button" className={partnerFilter === value ? "active" : ""} aria-pressed={partnerFilter === value} key={value} onClick={() => setPartnerFilter(value)}>{label}</button>)}</div>
      <div className="partner-grid">{visiblePartners.map((item) => <article key={item.channelUrl}>
        <span>{item.audience}</span><h3>{item.name}</h3><p>{item.fit}</p><div><a href={item.channelUrl} target="_blank" rel="noreferrer">Посмотреть канал ↗</a><a href={item.contactUrl} target="_blank" rel="noreferrer">Контакт {item.contactLabel} ↗</a></div>
      </article>)}</div>
      <p className="growth-boundary">Это короткий публичный список для ручной работы. Внутренний реестр из 300 найденных страниц и приоритетная доска не публикуются на сайте.</p>
    </section>

    <section className="growth-messages" id="messages">
      <header className="growth-section-head"><span className="exam-kicker">Скопировать и адаптировать</span><h2>Сообщения, которые продолжают разговор.</h2><p>Перед отправкой добавьте одну настоящую деталь о канале или преподавателе. Шаблон не разрешает скрываться под видом родителя и не отменяет правила площадки.</p></header>
      <div className="message-grid">{outreachTemplates.map((item, index) => <article key={item.id}>
        <div><span>{String(index + 1).padStart(2, "0")}</span><small>{item.label}</small></div><h3>{item.title}</h3><p>{item.text}</p><button type="button" onClick={() => handleCopy(item.id, item.text)}>{copied === item.id ? "Скопировано ✓" : "Скопировать текст"}</button>
      </article>)}</div>
    </section>

    <section className="growth-channel" id="channel">
      <header className="growth-section-head inverted"><span className="exam-kicker light">Пять публикаций для нового читателя</span><h2>Канал сначала помогает.<br />Потом приглашает в продукт.</h2><p>Каждый пост решает одну задачу: объясняет метод, даёт полезный инструмент или ведёт к одному действию. Изображения созданы специально для ЭКЗАМ; обещаний баллов и вымышленных отзывов нет.</p></header>
      <div className="channel-post-grid">{telegramChannelPosts.map((post, index) => <article key={post.id}>
        <Image unoptimized src={`${publicBasePath}${post.image}`} alt={`Иллюстрация к публикации «${post.title}»`} width={1200} height={1200} loading="lazy" />
        <div><span>{String(index + 1).padStart(2, "0")} · {post.purpose}</span><h3>{post.title}</h3><p>{post.text}</p><small>КНОПКА · {post.buttonLabel}</small><button type="button" onClick={() => handleCopy(`channel-${post.id}`, `${post.text}\n\n${post.buttonLabel}: ${post.buttonUrl}`)}>{copied === `channel-${post.id}` ? "Пост скопирован ✓" : "Скопировать пост"}</button></div>
      </article>)}</div>
      <div className="channel-post-footer"><a className="button button-yellow" href="https://t.me/ekzam_oge_ege" target="_blank" rel="noreferrer">Открыть канал ЭКЗАМ ↗</a><p>Публикация в Telegram проверяется отдельно от наличия карточек на сайте.</p></div>
    </section>

    <section className="growth-forums">
      <div className="forum-copy"><span className="exam-kicker light">Родительские форумы — не рекламная база</span><h2>Вклиниться можно только пользой.</h2><ol><li>Прочитать правила и всю ветку.</li><li>Ответить на вопрос прямо в теме — без ссылки.</li><li>Честно обозначить свою связь с сервисом, если разговор дошёл до него.</li><li>Ссылку давать только после разрешения автора или администратора.</li><li>Никогда не писать участникам в личку без приглашения.</li></ol></div>
      <div className="forum-routes">{forumRoutes.map((item) => <a key={item.url} href={item.url} target="_blank" rel="noreferrer"><b>{item.title}</b><span>{item.angle}</span><em>Открыть обсуждение ↗</em></a>)}</div>
    </section>

    <section className="growth-sprint" id="sprint">
      <header className="growth-section-head"><span className="exam-kicker">Рабочий путь до первых учеников</span><h2>14 дней: от одного номера до платного продолжения.</h2><p>Это не массовая рассылка и не обещание вирусности. Каждый шаг оставляет проверяемый результат: ролик, завершённое задание, ответ партнёра или заявка.</p></header>
      <div className="growth-sprint-grid">{studentAcquisitionSprint.map((item, index) => <article key={item.period}>
        <span>{String(index + 1).padStart(2, "0")}</span><small>{item.period}</small><h3>{item.title}</h3><p>{item.action}</p>
      </article>)}</div>
      <button type="button" className="button button-dark" onClick={() => handleCopy("sprint", studentAcquisitionSprint.map((item) => `${item.period} · ${item.title}\n${item.action}`).join("\n\n"))}>{copied === "sprint" ? "План скопирован ✓" : "Скопировать план на 14 дней"}</button>
    </section>

    <section className="growth-media" id="media">
      <header className="growth-section-head"><span className="exam-kicker">Когда включать платную рекламу</span><h2>Не покупать охват, пока не работает переход в задание.</h2><p>Бюджеты ниже — рабочие гипотезы теста, а не обещание результата и не прайс площадок. На каждом этапе решение принимается по завершённой диагностике и заявке.</p></header>
      <div className="media-compliance">{promotionCompliance.map((item, index) => <article key={item.title}>
        <span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.text}</p><a href={item.url} target="_blank" rel="noreferrer">{item.label} ↗</a>
      </article>)}</div>
      <div className="media-ladder">{paidGrowthLadder.map((item) => <article key={item.step}><span>{item.step}</span><h3>{item.title}</h3><strong>{item.budget}</strong><p>{item.action}</p><small>ПЕРЕХОД ДАЛЬШЕ, ЕСЛИ</small><b>{item.gate}</b></article>)}</div>
      <div className="media-sources"><span>Проверить перед запуском:</span><a href="https://yandex.ru/support/direct/ru/quick-start/quick-start" target="_blank" rel="noreferrer">Яндекс Директ ↗</a><a href="https://yandex.ru/support/direct/en/moderation/ad-rules" target="_blank" rel="noreferrer">Правила модерации ↗</a><a href="https://telega.in/" target="_blank" rel="noreferrer">Каталог Telega.in ↗</a><a href="https://vk.company.ru/ru/press/releases/12231/" target="_blank" rel="noreferrer">VK Визитки ↗</a></div>
    </section>

    <section className="growth-offers">
      <header><span className="exam-kicker light">Как продать дороже — честно</span><h2>Цена растёт не от слова AI.<br />Она растёт от объёма ответственности.</h2><p>Ниже — коммерческие гипотезы для переговоров. Оплата на публичной статической версии не подключена.</p></header>
      <div>{offerHypotheses.map((item) => <article key={item.name}><span>{item.name}</span><strong>{item.price}</strong><p>{item.includes}</p><small>{item.ready}</small></article>)}</div>
      <footer><p>Ориентир рынка: CoreApp указывает тариф «Профи» от 1 990 ₽/мес., «Гуру» 19 990 ₽/мес. и онлайн-академию от 50 000 ₽/мес. Высокий чек платформы оправдан только при реальном брендинге, интеграциях, ролях и сопровождении.</p><a href="https://coreapp.ai/pricing" target="_blank" rel="noreferrer">Проверить тарифы CoreApp ↗</a></footer>
    </section>

    <section className="growth-final">
      <div><span className="exam-kicker light">Первое действие сегодня</span><h2>Выберите один предмет, один номер и одного преподавателя.</h2><p>Соберите задание, снимите три хука и предложите одному подходящему партнёру семидневный пилот. Платную рекламу подключайте после первого измеримого прохождения.</p></div>
      <div><a className="button button-yellow" href="#constructor">Собрать съёмочное задание →</a><Link className="button button-ghost light" href="/reels">Открыть сценарии Reels</Link></div>
    </section>
  </main>;
}
