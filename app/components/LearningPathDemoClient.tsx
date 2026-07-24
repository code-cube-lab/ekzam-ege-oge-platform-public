"use client";

import Link from "next/link";
import { useState } from "react";

const options = [
  { label: "звОнит", correct: false, diagnosis: "Вы выбрали привычное разговорное ударение. В литературной норме ударение падает на окончание: звонИт." },
  { label: "звонИт", correct: true, diagnosis: "Верно: в личных формах глагола «звонить» ударение сохраняется на окончании — звонИт." },
  { label: "красивЕе", correct: false, diagnosis: "Сработала аналогия с окончанием. Нормативная форма сравнительной степени — красИвее." },
  { label: "бАловать", correct: false, diagnosis: "Ударение перенесено на первый слог. Норма — баловАть; полезно запомнить парой: баловАть — избаловАть." },
];

export function LearningPathDemoClient() {
  const [answer, setAnswer] = useState<number | null>(null);
  const selected = answer === null ? null : options[answer];

  return <main className="learning-demo">
    <header className="learning-demo-top">
      <Link className="brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
      <nav><Link href="/exam?subject=russian&level=ege&variant=1">12 вариантов</Link><Link href="/exam?subject=russian&level=ege&mode=mistakes">Мои ошибки</Link><Link href="/telegram">Telegram</Link></nav>
    </header>

    <section className="learning-demo-hero">
      <div>
        <span className="exam-label">Поклацайте сами · 2 минуты</span>
        <h1>Одна ошибка превращается <em>в следующий урок.</em></h1>
        <p>Пробный вариант не заканчивается процентом. Система определяет конкретное умение, объясняет сбой, даёт новую попытку и передаёт учителю только то, где нужен человек.</p>
      </div>
      <ol>
        <li className="active"><span>01</span><b>Ответ без подсказки</b></li>
        <li className={selected ? "active" : ""}><span>02</span><b>Точный диагноз</b></li>
        <li className={selected ? "active" : ""}><span>03</span><b>Похожая попытка</b></li>
        <li><span>04</span><b>Повторение завтра</b></li>
      </ol>
    </section>

    <section className="learning-demo-workspace">
      <article className="demo-question-card">
        <div><span>Русский язык · линия 4</span><b>1 из 27</b></div>
        <h2>В каком слове верно выделена буква, обозначающая ударный гласный?</h2>
        <div className="demo-answer-grid">
          {options.map((option, index) => <button key={option.label} className={answer === index ? option.correct ? "correct" : "incorrect" : ""} disabled={answer !== null} onClick={() => setAnswer(index)}>
            <span>{index + 1}</span>{option.label}
          </button>)}
        </div>
        {answer === null && <small>Можно специально выбрать неверный ответ — так виден весь разбор.</small>}
        {selected && <button className="button button-ghost" onClick={() => setAnswer(null)}>Ответить ещё раз</button>}
      </article>

      <aside className={`demo-feedback-card ${selected?.correct ? "correct" : selected ? "incorrect" : ""}`}>
        {!selected ? <>
          <span>ПОСЛЕ ОТВЕТА</span>
          <h2>Здесь появится не просто «ошибка»</h2>
          <p>Система покажет причину, правило, похожую задачу и дату повторения.</p>
        </> : <>
          <span>{selected.correct ? "ВЕРНО" : "НУЖНА ОТРАБОТКА"}</span>
          <h2>{selected.correct ? "Правило извлечено без подсказки" : "Диагноз: орфоэпическая норма"}</h2>
          <p>{selected.diagnosis}</p>
          <div className="demo-next-step"><b>Следующий шаг</b><p>{selected.correct ? "Ещё одно слово через 3 дня, затем переход к паронимам." : "Другое слово на то же правило сейчас, затем повторение завтра."}</p></div>
          <Link className="button button-dark" href="/exam?subject=russian&level=ege&family=stress">Открыть серию похожих →</Link>
        </>}
      </aside>
    </section>

    <section className="learning-roles">
      <div><span className="exam-label">Кто что делает</span><h2>Рутинное — системе. Ответственное — учителю.</h2></div>
      <div className="learning-role-grid">
        <article><span>01</span><h3>Автопроверка</h3><p>Проверяет тестовые и краткие ответы, сохраняет ошибку и пересчитывает освоение темы.</p><b>Работает уже сейчас</b></article>
        <article><span>02</span><h3>Нейросеть</h3><p>Разбирает свободное объяснение и ход мысли, когда на сервере подключён защищённый AI-ключ.</p><b>Не выдаём локальные правила за AI</b></article>
        <article><span>03</span><h3>Преподаватель</h3><p>Проверяет сочинение, спорную трактовку и ответы с низкой уверенностью, затем задаёт новый фокус.</p><b>Итог по критериям — человек</b></article>
      </div>
    </section>

    <section className="learning-demo-cta">
      <div><span className="exam-label light">Можно проверять</span><h2>12 вариантов русского по 27 линий</h2><p>Выберите любой вариант, специально допустите ошибку и откройте «Мои ошибки».</p></div>
      <div><Link className="button button-red" href="/exam?subject=russian&level=ege&variant=1">Начать вариант № 1</Link><Link className="button button-violet" href="/telegram">Открыть мобильный вид</Link></div>
    </section>
  </main>;
}
