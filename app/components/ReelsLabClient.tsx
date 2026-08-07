"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  audienceLabels,
  reelIdeas,
  reelPublishingPlan,
  reelReferences,
  reelScripts,
  reelsEvidence,
  type ReelAudience,
  type ReelScript,
} from "../../knowledge-base/marketing/reels-lab";

type AudienceFilter = "all" | ReelAudience;

const filterLabels: Array<[AudienceFilter, string]> = [
  ["all", "Все идеи"],
  ["student", "Ученику"],
  ["parent", "Родителю"],
  ["teacher", "Репетитору"],
  ["school", "Школе"],
];

function scriptAsText(script: ReelScript) {
  const shots = script.shots.map((shot) => `${shot.id} · ${shot.time} сек.\nКадр: ${shot.frame}. ${shot.action}.\nРеплика: ${shot.voice}\nТитр: ${shot.text}`).join("\n\n");
  return `${script.title}\n${script.duration}\n\n${script.logline}\n\nХуки:\n${script.hooks.map((hook) => `— ${hook}`).join("\n")}\n\n${shots}\n\nCTA: ${script.cta}`;
}

export function ReelsLabClient() {
  const [audience, setAudience] = useState<AudienceFilter>("all");
  const [copied, setCopied] = useState<string | null>(null);
  const visibleIdeas = useMemo(
    () => audience === "all" ? reelIdeas : reelIdeas.filter((idea) => idea.audience === audience),
    [audience],
  );

  async function copyScript(script: ReelScript) {
    const text = scriptAsText(script);
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
    setCopied(script.id);
    window.setTimeout(() => setCopied(null), 1800);
  }

  return <main className="reels-lab" id="top">
    <header className="reels-nav">
      <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span><small>видеолаборатория</small></Link>
      <nav aria-label="Навигация видеолаборатории"><a href="#ideas">Идеи</a><a href="#scripts">Сценарии</a><a href="#references">Примеры</a><a href="#plan">План 14 дней</a></nav>
      <Link className="button button-dark button-small" href="/for-teachers">Инструменты педагога</Link>
    </header>

    <section className="reels-hero">
      <div>
        <span className="exam-kicker">Reels / Shorts / VK Клипы · для преподавателей ЭКЗАМ</span>
        <h1>Снимите не рекламу.<br /><em>Снимите момент понимания.</em></h1>
        <p>Каждый ролик даёт зрителю маленькое действие: остановить, решить, заметить ошибку и перейти прямо к практике этого номера. Не обещаем баллы — показываем методику в работе.</p>
        <div className="reels-hero-actions"><a className="button button-red" href="#scripts">Взять готовый сценарий →</a><a className="button button-ghost" href="#references">Посмотреть примеры</a></div>
      </div>
      <aside className="reels-phone" aria-label="Схема короткого ролика">
        <div className="phone-status"><span>0:00</span><b>ЭКЗАМ</b><span>9:16</span></div>
        <div className="phone-hook">СТОП.<br />РЕШИ № 5</div>
        <div className="phone-timer">05</div>
        <div className="phone-flow"><span>ПОПЫТКА</span><i>→</i><span>ПРИЧИНА</span><i>→</i><span>НОВОЕ</span></div>
        <div className="phone-cta">ТРИ ПОХОЖИХ ЗАДАНИЯ — БЕСПЛАТНО</div>
      </aside>
      <div className="reels-facts"><div><strong>{reelIdeas.length}</strong><span>готовых идей</span></div><div><strong>{reelScripts.length}</strong><span>сценария с кадрами</span></div><div><strong>{reelReferences.length}</strong><span>проверенных примеров</span></div></div>
    </section>

    <section className="reels-funnel" aria-labelledby="funnel-title">
      <div><span className="exam-kicker light">Как ролик приводит на платформу</span><h2 id="funnel-title">Не «ссылка в профиле».<br />Конкретный следующий шаг.</h2></div>
      <ol>
        <li><span>01</span><b>Интерактив</b><p>Зритель отвечает до объяснения.</p></li>
        <li><span>02</span><b>Разрыв</b><p>Учитель показывает ловушку или причину.</p></li>
        <li><span>03</span><b>Перенос</b><p>Ссылка открывает тот же номер с новым условием.</p></li>
        <li><span>04</span><b>Человек</b><p>Родитель видит отчёт, преподаватель — запрос на помощь.</p></li>
      </ol>
    </section>

    <section className="reels-ideas" id="ideas">
      <div className="reels-section-head"><span className="exam-kicker">Что снимать преподавателям</span><h2>Один ролик — одна проблема — один CTA.</h2><p>Фильтр меняет не предмет, а покупателя. Предметное условие педагог подставляет своё.</p></div>
      <div className="reels-filters" role="group" aria-label="Фильтр идей по аудитории">
        {filterLabels.map(([value, label]) => <button type="button" className={audience === value ? "active" : ""} aria-pressed={audience === value} key={value} onClick={() => setAudience(value)}>{label}</button>)}
      </div>
      <div className="reels-idea-grid">
        {visibleIdeas.map((idea, index) => <article key={idea.id}>
          <header><span>{audienceLabels[idea.audience]}</span><b>{idea.label}</b><i>{String(index + 1).padStart(2, "0")}</i></header>
          <h3>«{idea.hook}»</h3>
          <div className="reels-meta"><span>{idea.duration}</span><span>{idea.format}</span></div>
          <ol>{idea.beats.map((beat) => <li key={beat}>{beat}</li>)}</ol>
          <footer><p><b>CTA:</b> {idea.cta}</p><p><b>Для рекламы:</b> {idea.platformChange}</p></footer>
        </article>)}
      </div>
    </section>

    <section className="reels-scripts" id="scripts">
      <div className="reels-section-head light"><span className="exam-kicker light">Можно снимать сегодня</span><h2>Три сценария с таймингом и кадрами.</h2><p>Вертикальный мастер 1080×1920. Лицо, условие и главный титр держите в центральной безопасной зоне.</p></div>
      <div className="reels-script-list">
        {reelScripts.map((script) => <article key={script.id}>
          <header><div><span>{audienceLabels[script.audience]} · {script.duration}</span><h3>{script.title}</h3><p>{script.logline}</p></div><button type="button" onClick={() => copyScript(script)}>{copied === script.id ? "Скопировано ✓" : "Скопировать сценарий"}</button></header>
          <div className="script-hooks"><b>Три варианта начала</b>{script.hooks.map((hook) => <blockquote key={hook}>{hook}</blockquote>)}</div>
          <div className="shot-table" role="table" aria-label={`Раскадровка: ${script.title}`}>
            {script.shots.map((shot) => <div role="row" key={shot.id}>
              <span role="cell"><b>{shot.id}</b><small>{shot.time} сек.</small></span>
              <p role="cell"><b>{shot.frame}</b><small>{shot.action}</small></p>
              <p role="cell"><b>Реплика</b><small>{shot.voice}</small></p>
              <p role="cell"><b>Титр</b><small>{shot.text}</small></p>
            </div>)}
          </div>
          <footer><b>Финальный CTA</b><p>{script.cta}</p></footer>
        </article>)}
      </div>
    </section>

    <section className="reels-references" id="references">
      <div className="reels-section-head"><span className="exam-kicker">Публичные примеры</span><h2>Что уже удерживало внимание в экзаменационной нише.</h2><p>{reelsEvidence.note}</p></div>
      <div className="reference-grid">
        {reelReferences.map((item, index) => <a href={item.url} target="_blank" rel="noreferrer" key={item.url}>
          <header><span>REF {String(index + 1).padStart(2, "0")}</span><b>{item.views} просмотров</b></header>
          <h3>{item.title}</h3><p>{item.creator}</p>
          <div><span>{item.published}</span><span>{item.likes} отметок</span></div>
          <section><b>Открытая механика</b><p>{item.pattern}</p><b>Адаптация для ЭКЗАМ</b><p>{item.adaptation}</p></section>
          <footer>Открыть видео ↗</footer>
        </a>)}
      </div>
      <p className="reels-evidence-date">Снимок метаданных: {reelsEvidence.checkedAt}. Референсы используются для анализа механики, а не для покадрового копирования.</p>
    </section>

    <section className="reels-adapt" aria-labelledby="adapt-title">
      <div><span className="exam-kicker light">Как изменить ролик для рекламы платформы</span><h2 id="adapt-title">Один исходник.<br />Четыре версии.</h2></div>
      <div>
        <article><span>УЧЕНИК</span><h3>Задание раньше бренда</h3><p>Первые две секунды — условие или челлендж. Логотип появляется после попытки. CTA ведёт на конкретный номер.</p></article>
        <article><span>РОДИТЕЛЬ</span><h3>Не балл, а следующий шаг</h3><p>Начать с тревоги «почему ошибка повторяется», показать отчёт и честно назвать границу автоматической проверки.</p></article>
        <article><span>РЕПЕТИТОР</span><h3>Рутина уходит, экспертиза остаётся</h3><p>Показать конструктор, автопроверку кратких ответов и отдельную ручную проверку сочинения. CTA — три ученика в пилот.</p></article>
        <article><span>ШКОЛА</span><h3>Маленький проверяемый пилот</h3><p>Не обещать внедрение «под ключ». Один класс, один предмет, одна линия и заранее согласованные показатели.</p></article>
      </div>
    </section>

    <section className="reels-plan" id="plan">
      <div className="reels-section-head"><span className="exam-kicker">План съёмки и публикации</span><h2>14 дней без ежедневного придумывания.</h2><p>Снимайте пакетами: за одну двухчасовую сессию — четыре предметных ролика и два общих.</p></div>
      <div className="publishing-table">
        {reelPublishingPlan.map(([day, type, hook, goal]) => <article key={day}><span>{day}</span><b>{type}</b><p>{hook}</p><small>{goal}</small></article>)}
      </div>
    </section>

    <section className="reels-specs">
      <article><span className="exam-kicker">Технический минимум</span><h2>Телефон, петличка, окно.</h2><p>{reelsEvidence.production}</p><ul><li>Субтитры обязательны: многие увидят первые секунды без понимания контекста.</li><li>Не ставить главный текст вплотную к краям и кнопкам интерфейса.</li><li>Не использовать чужую музыку и фрагменты без прав; оригинальный голос безопаснее и усиливает экспертность.</li></ul></article>
      <article><span className="exam-kicker">Перед платным размещением</span><h2>Реклама должна быть маркирована.</h2><p>Для размещений, подпадающих под российские требования к интернет-рекламе, нужны пометка «реклама», сведения о рекламодателе и идентификатор через ОРД. Конкретную схему подтверждают до публикации.</p><div><a href="https://www.consultant.ru/document/cons_doc_LAW_58968/2c4537e4796f6ff8b2736ed1b0d4fef08e14458e/" target="_blank" rel="noreferrer">Статья 18.1 ↗</a><a href="https://www.facebook.com/business/ads/facebook-instagram-reels-ads" target="_blank" rel="noreferrer">Рекомендации Meta 9:16 ↗</a><a href="https://support.google.com/youtube/answer/15424877" target="_blank" rel="noreferrer">Правила YouTube Shorts ↗</a></div></article>
    </section>

    <section className="reels-final"><div><span className="exam-kicker light">Первый тест</span><h2>Снимите три хука.<br />Поменяйте только начало.</h2><p>Оставьте одинаковыми условие, доказательство и CTA. Сравнивайте досмотр до 3 секунд, переход в практику и завершение первого задания.</p></div><div><Link className="button button-yellow" href="/practice">Открыть практику для CTA</Link><Link className="button button-ghost light" href="/for-teachers#builder">Собрать ссылку</Link></div></section>
  </main>;
}
