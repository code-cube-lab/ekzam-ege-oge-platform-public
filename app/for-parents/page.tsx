import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Родителям — как увидеть слабые задания ОГЭ и ЕГЭ",
  description: "Бесплатная тренировка, понятный разбор ошибки и отчёт родителю без обещаний гарантированного балла.",
};

const parentQuestions = [
  ["Это заменяет репетитора?", "Нет. Платформа берёт на себя повторяемую практику и историю попыток. Сочинения, спорные ответы и стратегию подготовки подтверждает преподаватель."],
  ["Почему сначала только один номер?", "Полный вариант показывает общий результат, но плохо объясняет причину. Серия одного типа быстрее отделяет незнание правила от невнимательности и нехватки времени."],
  ["Результат хранится на сервере?", "В открытой версии попытки хранятся только на этом устройстве. Синхронизация и персональный профиль появятся только вместе с защищённым входом и отдельным согласием."],
  ["Вы гарантируете балл?", "Нет. Мы показываем выполненные действия и слабые места, но не обещаем конкретный балл или поступление."],
];

export default function ForParentsPage() {
  const assetBase = process.env.EKZAM_STATIC_EXPORT === "1"
    ? process.env.EKZAM_GITHUB_PAGES_BASE ?? ""
    : "";

  return <main className="audience-page parent-sales-page">
    <header className="audience-topbar">
      <Link className="brand exam-brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link>
      <nav><Link href="/practice">Тренировка</Link><Link href="/parent-report">Отчёт</Link><Link href="/for-teachers">Репетиторам</Link></nav>
      <Link className="button button-red button-small" href="/practice">Попробовать бесплатно</Link>
    </header>

    <section className="audience-hero parent-hero">
      <div>
        <span className="exam-kicker">Родителям выпускников</span>
        <h1>Не спрашивать:<br /><em>«Ну сколько баллов?»</em></h1>
        <p>За одну короткую тренировку вы увидите конкретный номер задания, повторяющуюся ошибку и ближайшее действие ребёнка — без покупки курса и без карты.</p>
        <div className="sales-hero-actions"><Link className="button button-red" href="/practice">Начать с одного задания →</Link><Link className="button button-ghost" href="/parent-report">Посмотреть пример отчёта</Link></div>
        <ul className="audience-checks"><li>ответ вводится как на экзамене;</li><li>правильный ответ не показывается до попытки;</li><li>после ошибки — другое условие того же типа;</li><li>развёрнутые работы не получают ложную автоматическую оценку.</li></ul>
      </div>
      <figure><Image unoptimized src={`${assetBase}/marketing/parent-report.webp`} width="1200" height="1200" alt="Мама и подросток смотрят отчёт по подготовке" /><figcaption>Не контроль ребёнка, а понятный следующий шаг</figcaption></figure>
    </section>

    <section className="parent-first-result">
      <header><span className="exam-kicker">Первый результат за 10 минут</span><h2>Вот что происходит после нажатия «Начать»</h2></header>
      <ol>
        <li><span>01</span><div><b>Вы выбираете ОГЭ или ЕГЭ</b><p>Экзамены и правила ответа не смешиваются.</p></div></li>
        <li><span>02</span><div><b>Ребёнок решает один номер</b><p>Не пять случайных вопросов, а несколько разных условий одного типа.</p></div></li>
        <li><span>03</span><div><b>Система называет причину</b><p>Правило, место ошибки и новое задание для проверки переноса.</p></div></li>
        <li><span>04</span><div><b>Вы открываете отчёт</b><p>Попытки, точность, слабая тема и одно действие на следующую неделю.</p></div></li>
      </ol>
    </section>

    <section className="parent-value">
      <div className="parent-value-copy"><span className="exam-kicker light">За что платить позже</span><h2>Не за доступ к вопросам.</h2><p>Вопросы и материалы ФИПИ открыты. Платный продукт имеет смысл только там, где появляется персональная работа вокруг ответа ученика.</p></div>
      <div className="parent-value-grid">
        <article><span>БЕСПЛАТНО</span><h3>Попробовать механику</h3><p>Тренировка по номеру, разбор краткого ответа, локальная история и тетрадь ошибок.</p><strong>0 ₽</strong></article>
        <article><span>МАРШРУТ</span><h3>Не потерять слабые темы</h3><p>Недельный план, возврат к ошибкам и короткий родительский отчёт.</p><strong>ориентир 1 490 ₽/мес.</strong></article>
        <article><span>ПЕДАГОГ</span><h3>Получить человеческую проверку</h3><p>Развёрнутые работы, объяснение сложной темы и корректировка плана.</p><strong>ориентир от 4 490 ₽/мес.</strong></article>
      </div>
      <p className="audience-limit">Оплата пока не включена. Пилотный тариф станет доступен после подтверждения преподавателя, расписания, договора и реквизитов.</p>
    </section>

    <section className="audience-faq">
      <div><span className="exam-kicker">Честные ответы</span><h2>Что важно знать до начала</h2></div>
      <div>{parentQuestions.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
    </section>

    <section className="audience-final">
      <div><span className="exam-kicker light">Без оплаты и регистрации</span><h2>Откройте одно задание и посмотрите на разбор.</h2></div>
      <Link className="button button-yellow" href="/practice">Выбрать экзамен и номер →</Link>
    </section>
  </main>;
}
