"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { examSubjects } from "../../knowledge-base/exams/exam-subjects";
import { russianTaskFamilies } from "../../knowledge-base/tasks/variant-engine.js";

const tutorSkills = [
  ["Диагностировать", "Отделить незнание правила от неверного чтения условия, спешки и нехватки времени."],
  ["Выбрать одно умение", "Не смешивать пять тем в одной отработке и объяснить ученику, почему назначен этот номер."],
  ["Дать попытку без подсказки", "Сохранить исходный ответ, время и использованные подсказки до показа решения."],
  ["Объяснить причину", "Показать место ошибки и короткое правило, а не просто правильную цифру."],
  ["Проверить перенос", "Сразу дать другое авторское условие того же типа и затем смешанную задачу."],
  ["Вернуть тему позже", "Назначить повтор без подсказки после паузы, а не считать один успех освоением."],
  ["Разделить проверку", "Автоматике оставить однозначные ответы, учителю — сочинения и спорные случаи."],
  ["Показать доказательства", "Родителю — следующий шаг, педагогу — сырые попытки и динамику по умению."],
];

export function TeacherProductClient() {
  const [subject, setSubject] = useState("russian");
  const [family, setFamily] = useState("stress");
  const [count, setCount] = useState(5);
  const [copied, setCopied] = useState(false);
  const currentSubject = examSubjects.find((item) => item.slug === subject) ?? examSubjects[0];
  const currentFamily = russianTaskFamilies.find((item) => item.id === family) ?? russianTaskFamilies[0];
  const path = useMemo(() => {
    const query = new URLSearchParams({ subject, count: String(count) });
    if (subject === "russian") query.set("family", family);
    query.set("teacher", "pilot");
    return `/exam?${query.toString()}`;
  }, [count, family, subject]);

  async function copyAssignment() {
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const field = document.createElement("textarea");
      field.value = url;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return <main className="teacher-product">
    <nav className="teacher-product-nav">
      <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
      <div><a href="#methodology">Навыки репетитора</a><Link href="/teacher-academy">Методики 15 предметов</Link><Link href="/reels">Reels и Shorts</Link><Link href="/growth">Поиск учеников</Link><a href="#builder">Собрать работу</a><a href="#teacher-plans">Тарифы</a></div>
      <Link className="button button-small button-red" href="#builder">Попробовать бесплатно</Link>
    </nav>

    <section className="teacher-product-hero">
      <div>
        <span className="exam-label">Платформа для учителя ЕГЭ</span>
        <h1>Не искать задания.<br /><em>Видеть, чему научился класс.</em></h1>
        <p>Выберите проверяемое умение, соберите ссылку на работу и отправьте ученикам. Платформа проверит краткие ответы, после каждой ошибки даст правило и похожее задание, а учителю покажет слабые темы.</p>
        <div className="hero-actions"><Link className="button button-red" href="#builder">Собрать первую работу →</Link><Link className="button button-ghost" href="/teacher">Открыть демо-кабинет</Link></div>
        <div className="teacher-proof"><div><strong>105</strong><span>авторских заданий по русскому</span></div><div><strong>14</strong><span>типов ЕГЭ-2026</span></div><div><strong>0 ₽</strong><span>пилот без карты</span></div></div>
      </div>
      <aside className="teacher-product-report">
        <div><span>Работа 7Б · задание 15</span><b>Н и НН</b></div>
        <section><strong>24</strong><span>ученика получили ссылку</span></section>
        <section><strong>17</strong><span>выполнили работу</span></section>
        <section className="risk"><strong>6</strong><span>нужна повторная отработка</span></section>
        <footer><span>Следующее действие</span><b>Назначить серию из 5 похожих заданий →</b></footer>
      </aside>
    </section>

    <section className="teacher-benefits" id="tools">
      <header><span className="exam-label light">Польза для педагога</span><h2>Меньше ручной проверки.<br />Больше управляемой практики.</h2></header>
      <div>
        <article><span>01</span><b>Банк по типам, а не случайные варианты</b><p>Задания сгруппированы по проверяемому умению. Можно дать пять задач на одну ошибку, а не пересобирать целый вариант.</p></article>
        <article><span>02</span><b>Отработка запускается автоматически</b><p>После неверного ответа ученик получает короткую теорию, причину ошибки и другое задание того же типа.</p></article>
        <article><span>03</span><b>Сводка по классу</b><p>Учитель видит, кто не приступил, где повторяются ошибки и какую тему вынести на следующий урок.</p></article>
        <article><span>04</span><b>Своя методика поверх платформы</b><p>Педагог выбирает типы, объём и срок работы; развёрнутые ответы остаются на экспертной проверке учителя.</p></article>
      </div>
    </section>

    <section className="teacher-skill-stack" id="methodology">
      <header>
        <span className="exam-label">Навыки сильного репетитора внутри системы</span>
        <h2>Платформа не заменяет методику.<br />Она заставляет её работать каждый раз.</h2>
        <p>Каждый предметный модуль проходит один и тот же учебный цикл. Преподаватель может менять формулировки и порядок, но не теряет доказательства попытки и следующий шаг.</p>
      </header>
      <div>{tutorSkills.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      <footer><Link href="/teacher-academy">Открыть методики по 15 предметам →</Link><Link href="/teachers">Посмотреть предметные профили →</Link><Link href="/reels">Сценарии Reels для преподавателя →</Link><Link href="/growth">План поиска учеников →</Link></footer>
    </section>

    <section className="assignment-builder" id="builder">
      <div className="builder-copy"><span className="exam-label">Рабочий конструктор</span><h2>Соберите ссылку на задание за минуту.</h2><p>Ссылка уже открывает выбранный предмет, тип и нужное количество заданий. Для русского языка подключён расширенный авторский банк; другие предметы пока работают в стартовом режиме и подключаются предметными редакторами.</p></div>
      <div className="builder-panel">
        <label><span>1. Предмет</span><select value={subject} onChange={(event) => setSubject(event.target.value)}>{examSubjects.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label>
        {subject === "russian" ? <label><span>2. Тип задания</span><select value={family} onChange={(event) => setFamily(event.target.value)}>{russianTaskFamilies.map((item) => <option value={item.id} key={item.id}>№ {item.egeNumber} · {item.title} ({item.count})</option>)}</select></label> : <div className="builder-readonly"><span>2. Режим</span><b>Стартовый набор · {currentSubject.focus.join(", ")}</b></div>}
        <fieldset><legend>3. Объём работы</legend>{[5, 8, 10].map((item) => <button type="button" key={item} className={count === item ? "active" : ""} onClick={() => setCount(item)}>{item} заданий</button>)}</fieldset>
        <div className="assignment-preview"><span>Готовая работа</span><b>{currentSubject.name}{subject === "russian" ? ` · № ${currentFamily.egeNumber} ${currentFamily.title}` : ""}</b><small>{Math.min(count, subject === "russian" ? currentFamily.count : 10)} заданий · разбор после попытки · повтор ошибок</small><code>{path}</code></div>
        <div className="builder-actions"><Link className="button button-red" href={path}>Открыть как ученик →</Link><button className="button button-dark" onClick={copyAssignment}>{copied ? "Ссылка скопирована ✓" : "Скопировать ссылку"}</button></div>
      </div>
    </section>

    <section className="teacher-service-model">
      <div className="teacher-service-copy"><span className="exam-label light">Как репетитору зарабатывать через платформу</span><h2>Бесплатная практика приводит к вашей платной экспертизе.</h2><p>Не продавайте ученику ещё один доступ к тестам. Дайте короткую открытую тренировку, покажите конкретную проблему и предложите тот формат, где действительно нужен человек.</p></div>
      <div className="teacher-service-steps">
        <article><span>01 · ПРИВЛЕЧЕНИЕ</span><h3>Один номер бесплатно</h3><p>Отправьте ссылку на 3–5 заданий по теме, о которой ученик уже спрашивал.</p><b>Цель: ученик завершил серию</b></article>
        <article><span>02 · ДИАГНОЗ</span><h3>Короткий разбор</h3><p>Покажите повторяющуюся ошибку и объясните, что можно закрыть самостоятельно, а где нужна встреча.</p><b>Цель: понятна причина</b></article>
        <article><span>03 · УСЛУГА</span><h3>Ваше сопровождение</h3><p>Проверка сочинений, еженедельный урок, индивидуальный маршрут или малая группа — с вашей ценой и расписанием.</p><b>Цель: оплачивается работа педагога</b></article>
      </div>
      <p className="teacher-service-limit">В текущем публичном пилоте профиль, оплата и запись ещё не подключены. Сначала преподаватель подтверждает участие, программу, стоимость и юридический формат.</p>
    </section>

    <section className="teacher-pricing" id="teacher-plans">
      <header><span className="exam-label">Пилотные тарифы для педагогов</span><h2>Цена ниже часа ручной проверки.</h2><p>Сначала бесплатный пилот. Оплата на сайте пока не включена: платный доступ оформляется только после подтверждения юридических реквизитов и условий сервиса.</p></header>
      <div className="teacher-price-grid">
        <article><span>СТАРТ</span><strong>0 ₽</strong><small>без карты</small><ul><li>1 группа до 10 учеников</li><li>3 работы в месяц</li><li>Автопроверка кратких ответов</li><li>Отработка ошибок</li></ul><Link href="#builder" className="button button-dark">Начать пилот</Link></article>
        <article className="featured"><em>Для репетитора</em><span>УЧИТЕЛЬ</span><strong>990 ₽</strong><small>в месяц</small><ul><li>До 40 учеников</li><li>Работы без лимита</li><li>Аналитика слабых тем</li><li>Повторные серии одним кликом</li></ul><Link href="/support" className="button button-red">Оставить заявку</Link></article>
        <article><span>КОМАНДА</span><strong>4 990 ₽</strong><small>в месяц</small><ul><li>До 5 педагогов</li><li>До 200 учеников</li><li>Общие классы и отчёты</li><li>Подключение своего банка</li></ul><Link href="/support" className="button button-dark">Обсудить пилот</Link></article>
      </div>
      <p className="market-note">Рыночные ориентиры проверены 23 июля 2026 года: <a href="https://www.didak.ru/" target="_blank" rel="noreferrer">DIDAK — 560 ₽/мес.</a>, <a href="https://coreapp.ai/pricing" target="_blank" rel="noreferrer">CoreApp Профи — от 1 990 ₽/мес.</a> Наш тариф 990 ₽ занимает середину и включает именно предметную аналитику ЕГЭ.</p>
    </section>

    <section className="teacher-product-final"><div><span className="exam-label light">Начните с реального класса</span><h2>Один тип. Пять заданий. Один понятный отчёт.</h2></div><Link className="button button-yellow" href="#builder">Собрать работу →</Link></section>
  </main>;
}
