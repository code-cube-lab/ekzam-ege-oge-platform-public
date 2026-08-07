import { examSubjects, getExamSubject, type ExamSubjectSlug } from "../exams/exam-subjects";
import { getOfficialTaskTopic } from "../exams/official-variants";

export type GrowthExam = "oge" | "ege";

export type TeacherCampaign = {
  exam: GrowthExam;
  subjectSlug: ExamSubjectSlug;
  subjectName: string;
  taskNumber: number;
  taskCount: number;
  angle: string;
  format: string;
  hooks: string[];
  shots: string[];
  caption: string;
  cta: string;
  practicePath: string;
  reviewGate: string;
};

export const growthEvidenceDate = "7 августа 2026 года";

export const viralEducationReferences = [
  {
    platform: "TikTok",
    author: "Алекс Люфт",
    title: "Ударение в слове «свёкла» через короткий мнемонический приём",
    result: "3,6 млн просмотров и более 400 тыс. отметок «Нравится» по данным официальной публикации TikTok",
    pattern: "Одно затруднение → запоминающийся образ → ответ за несколько секунд",
    url: "https://www.tiktok.com/@alex_luft/video/7018571432657423618",
    evidenceUrl: "https://newsroom.tiktok.com/tiktok-and-the-ministry-of-education-announce-winners-of-the-tiktok-teachers-contest?lang=ru-RU",
    evidenceLabel: "Официальная публикация TikTok",
  },
  {
    platform: "TikTok",
    author: "Ольга Super",
    title: "Иноязычные приставки в творческой форме",
    result: "Победитель учительского конкурса TikTok; конкурс собрал 3 770 роликов и более 222 млн просмотров хештега",
    pattern: "Сложное правило → знакомая бытовая сцена → короткая проверка зрителя",
    url: "https://vm.tiktok.com/ZSerxcPxd/",
    evidenceUrl: "https://newsroom.tiktok.com/tiktok-and-the-ministry-of-education-announce-winners-of-the-tiktok-teachers-contest?lang=ru-RU",
    evidenceLabel: "Официальная публикация TikTok",
  },
  {
    platform: "Instagram",
    author: "Maestro Víctor",
    title: "Роли учителя и ученика в короткой сценке",
    result: "Один из Reels автора получил несколько миллионов просмотров по данным профильной публикации",
    pattern: "Узнаваемая школьная ситуация → смена роли → педагогический вывод",
    url: "https://www.instagram.com/reel/CjdBdIIKk0e/",
    evidenceUrl: "https://yosoytuprofe.20minutos.es/2022/11/17/el-maestro-que-triunfa-con-los-reels-mas-reivindicativos-y-creativos-de-instagram/",
    evidenceLabel: "Профильная публикация 20minutos",
  },
  {
    platform: "TikTok",
    author: "Самкело Мхлопе",
    title: "Естественные науки на мотив популярной песни",
    result: "Два учебных видео набрали более 1,6 млн просмотров каждое по данным News24",
    pattern: "Популярный звук → учебная формула → повтор вместе с преподавателем",
    url: "https://www.tiktok.com/tag/samkelomhlophe",
    evidenceUrl: "https://www.news24.com/southafrica/news/watch-umlazi-teacher-goes-viral-for-using-trending-songs-to-help-pupils-learn-20230401",
    evidenceLabel: "Публикация News24",
  },
  {
    platform: "TikTok / Instagram",
    author: "Татьяна Ерухимова",
    title: "Физический опыт с видимым результатом",
    result: "Более 500 млн совокупных просмотров образовательных видео по данным Axios",
    pattern: "Неожиданный опыт → прогноз зрителя → объяснение физической причины",
    url: "https://www.instagram.com/tatianaerukhimova/",
    evidenceUrl: "https://www.axios.com/local/dallas/2023/11/07/texas-am-physics-professor-goes-viral",
    evidenceLabel: "Публикация Axios",
  },
  {
    platform: "TikTok",
    author: "Nancy Bullard",
    title: "Короткие безопасные научные эксперименты",
    result: "3,1 млн подписчиков на момент публикации Axios",
    pattern: "Вопрос → демонстрация → объяснение одним предложением → новая задача",
    url: "https://www.tiktok.com/@mrs.b.tv",
    evidenceUrl: "https://www.axios.com/local/charlotte/2023/03/27/viral-charlotte-elementary-teacher-joins-tiktok-to-defend-app-on-capitol-hill-324496",
    evidenceLabel: "Публикация Axios",
  },
] as const;

export const publicPartners = [
  { category: "teacher", name: "Лисья учительская", audience: "педагоги и авторы учебных материалов", channelUrl: "https://t.me/Uchitelskayalisy", contactUrl: "https://t.me/Katya_Uch", contactLabel: "@Katya_Uch", fit: "Обмен полезным инструментом для преподавателей и совместный разбор одного задания." },
  { category: "teacher", name: "Математика LIVE", audience: "ученики и преподаватели математики", channelUrl: "https://t.me/matematlive", contactUrl: "https://t.me/kristymath", contactLabel: "@kristymath", fit: "Пилот по одному номеру математики и авторский Reel преподавателя." },
  { category: "teacher", name: "ХИМИЯ | ОГЭ, ЕГЭ", audience: "готовящиеся к химии", channelUrl: "https://t.me/chem_prosto", contactUrl: "https://t.me/khn_vasilkova", contactLabel: "@khn_vasilkova", fit: "Бартер: бесплатная точечная тренировка в обмен на честный разбор результата." },
  { category: "teacher", name: "БиоЛогично жить", audience: "биология и экзаменационная подготовка", channelUrl: "https://t.me/yansubaevaip", contactUrl: "https://t.me/IrinaPavlovnaYansubaeva", contactLabel: "@IrinaPavlovnaYansubaeva", fit: "Совместный формат «предскажите результат — затем объяснение» для биологии." },
  { category: "exam", name: "Конспекты | Биология и Химия", audience: "старшеклассники ОГЭ/ЕГЭ", channelUrl: "https://t.me/konspekty_ege", contactUrl: "https://t.me/biologads", contactLabel: "@biologads", fit: "Тестовая нативная интеграция с меткой и одним бесплатным номером." },
  { category: "exam", name: "Гум_чат", audience: "гуманитарные предметы", channelUrl: "https://t.me/gumchat", contactUrl: "https://t.me/Julia_Fattakhova", contactLabel: "@Julia_Fattakhova", fit: "Кросс-промо по русскому, истории, обществознанию или литературе." },
  { category: "parent", name: "Школьный Дневник", audience: "родители школьников", channelUrl: "https://t.me/diary_school", contactUrl: "https://t.me/diaryads", contactLabel: "@diaryads", fit: "Полезный родительский материал: как отличить пробел в теме от невнимательности." },
  { category: "parent", name: "Отличница", audience: "школьники и родители", channelUrl: "https://t.me/otlichnica1", contactUrl: "https://t.me/sportydany", contactLabel: "@sportydany", fit: "Игровой челлендж одного номера с понятным отчётом родителю." },
  { category: "teacher", name: "ПЕДАГОГИ РОССИИ: ИННОВАЦИИ", audience: "педагоги и школы", channelUrl: "https://t.me/pedagogi_online", contactUrl: "https://t.me/AnastasiyaMishenko", contactLabel: "@AnastasiyaMishenko", fit: "Методический пилот: педагог проверяет корректность и получает готовую серию заданий." },
  { category: "teacher", name: "Active Teach English", audience: "преподаватели английского", channelUrl: "https://t.me/Active_Teach_English", contactUrl: "https://t.me/S_english_teacher", contactLabel: "@S_english_teacher", fit: "Совместный сценарий на аудирование, лексику или устную часть." },
  { category: "teacher", name: "УЧИТЕЛЬ ЛИТЕРАТУРЫ", audience: "учителя русского и литературы", channelUrl: "https://t.me/teacher_lit", contactUrl: "https://t.me/teacher_liter", contactLabel: "@teacher_liter", fit: "Педагогическая проверка критерия и Reel с разбором одного аргумента." },
  { category: "school", name: "EdTechHub", audience: "EdTech, школы и создатели продуктов", channelUrl: "https://t.me/edtechhub", contactUrl: "https://t.me/rusjus", contactLabel: "@rusjus", fit: "Партнёрский пилот или разбор продукта для профессиональной аудитории." },
] as const;

export const outreachTemplates = [
  {
    id: "barter",
    label: "Бартер администратору",
    title: "Не покупаем пост вслепую — предлагаем полезный пилот",
    text: "Здравствуйте! Я развиваю ЭКЗАМ — платформу точечной отработки ОГЭ/ЕГЭ. Предлагаю не обычный рекламный пост, а полезный материал для вашей аудитории: ваш преподаватель выбирает один номер, мы собираем бесплатную тренировку и совместный короткий разбор. С вашей стороны — честная обратная связь и, только если формат полезен, публикация с пометкой партнёрства. Можно прислать одностраничное демо без обязательств?",
  },
  {
    id: "details",
    label: "Если спросили «что именно?»",
    title: "Продолжение после интереса",
    text: "Предлагаю тест на 7 дней: 1 предмет, 1 номер экзамена, 3 авторских аналогичных задания и один Reel преподавателя. Ученик сначала отвечает сам, затем видит причину ошибки и повторяет навык. Мы передаём вам ссылку с отдельной меткой и итог по переходам. Никаких обещаний баллов и обязательной оплаты. Какой номер сейчас чаще всего вызывает вопросы у вашей аудитории?",
  },
  {
    id: "parent-admin",
    label: "Администратору родительского сообщества",
    title: "Запрос разрешения, а не скрытая реклама",
    text: "Здравствуйте! Вижу, что в сообществе часто спрашивают, как понять слабые темы ребёнка до оплаты большого курса. Мы подготовили бесплатную 10-минутную диагностику одного номера ОГЭ/ЕГЭ с понятным отчётом родителю. Подскажите, допустимо ли предложить участникам такой материал в отдельной полезной публикации? Сразу укажем, что это наш сервис, без скрытой рекламы и без личных сообщений участникам.",
  },
  {
    id: "forum",
    label: "Ответ в форуме без ссылки",
    title: "Сначала польза внутри беседы",
    text: "Я бы до покупки курса проверил не общий пробник, а 2–3 конкретных номера: дать ребёнку выполнить их без подсказки, записать время и отдельно посмотреть, повторяется ли одна причина ошибки. Если ошибся из-за правила — нужна короткая теория и похожее условие; если из-за чтения — полезнее тренировать разбор требования. Могу описать простой шаблон такой диагностики, если автору темы это актуально.",
  },
  {
    id: "teacher",
    label: "Преподавателю на платформу",
    title: "Не «разместите рекламу», а станьте автором линии",
    text: "Здравствуйте! Ищу преподавателя, который готов стать предметным автором одной линии ОГЭ/ЕГЭ. Задача: проверить формулировки, записать 6 коротких объяснений и провести пилот на своей группе. Мы собираем страницу, тренировку, аналитику и рекламные материалы; вы сохраняете свою методику, лицо и платную услугу. Начнём с одного номера и зафиксируем объём до работы. Можно показать прототип?",
  },
  {
    id: "school",
    label: "Школе / учебному центру",
    title: "Ограниченный методический пилот",
    text: "Здравствуйте! Предлагаем четырёхнедельный пилот: один класс, один предмет и одна линия заданий. Педагог утверждает содержание, ученики получают точечную практику, школа — сводку повторяющихся ошибок. Автоматическая проверка используется только для однозначных ответов; сочинения и спорные случаи остаются преподавателю. Готовы согласовать критерии успеха до запуска?",
  },
] as const;

export const forumRoutes = [
  { title: "ЕГЭ: как не потратить деньги зря", url: "https://u-mama.ru/forum/kids/schoolboy/1010667/", angle: "Ответить чек-листом диагностики до покупки курса." },
  { title: "Где найти репетитора", url: "https://u-mama.ru/forum/kids/schoolboy/1021289/", angle: "Объяснить, какие доказательства прогресса запросить у преподавателя." },
  { title: "Курсы или репетитор", url: "https://u-mama.ru/forum/kids/schoolboy/861786/", angle: "Разделить самостоятельную практику и случаи, где нужен человек." },
  { title: "Родители обсуждают подготовку к ЕГЭ", url: "https://www.babyblog.ru/community/shkola/post/3231628", angle: "Дать нейтральную схему выбора формата без ссылки на сервис." },
] as const;

export const paidGrowthLadder = [
  { step: "01", title: "Органика преподавателей", budget: "0–10 тыс. ₽", action: "Снять 3 разных хука на один номер и оставить только тот, который приводит к завершённой тренировке.", gate: "Есть переходы и хотя бы несколько завершений, а не только просмотры." },
  { step: "02", title: "Бартерные пилоты", budget: "производство + взаимная польза", action: "Проверить 2–3 небольших профильных канала с отдельной UTM-меткой.", gate: "Администратор и аудитория подтверждают пользу формата." },
  { step: "03", title: "Telegram-размещения", budget: "15–30 тыс. ₽ тест", action: "Купить не один большой пост, а три небольших размещения в разных сегментах.", gate: "Известна цена завершённой диагностики, не только клика." },
  { step: "04", title: "Яндекс / VK", budget: "30–50 тыс. ₽ тест", action: "Запускать поиск и лид-формы только после подключения аналитики и отдельной посадочной страницы.", gate: "Настроена цель: завершение задания или заявка." },
  { step: "05", title: "Школы и центры", budget: "ручные пилоты", action: "Продавать ограниченный методический пилот, а не обещание готовой цифровой школы.", gate: "Есть предметный редактор, договорённость по данным и критерии успеха." },
] as const;

export const offerHypotheses = [
  { name: "Запуск преподавателя", price: "14 900–29 900 ₽", includes: "1 предметная линия, страница, 6 съёмочных заданий и ручной запуск.", ready: "Можно продавать как ограниченный пилот после согласования содержания." },
  { name: "Авторский модуль", price: "79 000–149 000 ₽", includes: "Редактура линии, тренировочный маршрут, упаковка эксперта и рекламный комплект.", ready: "Только с предметной проверкой преподавателя и зафиксированным объёмом." },
  { name: "Пилот для школы", price: "от 90 000 ₽ / 4 недели", includes: "Один класс, предмет, линия и отчёт по согласованным показателям.", ready: "После серверной синхронизации и правил обработки данных." },
  { name: "Своя академия", price: "от 250 000 ₽ + поддержка", includes: "Бренд, роли, интеграции, кабинеты и серверная инфраструктура.", ready: "Не текущая статическая версия; отдельный проект после технического обследования." },
] as const;

const phaseFormats = [
  { until: 0.3, name: "Блиц с паузой", description: "Зритель выбирает ответ до объяснения." },
  { until: 0.65, name: "Ловушка в условии", description: "Преподаватель показывает типичную неверную логику." },
  { until: 0.85, name: "Разбор по шагам", description: "На экране остаётся один шаг и один критерий самопроверки." },
  { until: 1, name: "Экспертная проверка", description: "Показывается фрагмент ответа и граница автоматической оценки." },
] as const;

export function getTaskCount(exam: GrowthExam, subjectSlug: ExamSubjectSlug) {
  const subject = getExamSubject(subjectSlug);
  return exam === "oge" ? (subject.ogeTaskCount ?? 0) : subject.fullTaskCount;
}

export function buildTeacherCampaign(exam: GrowthExam, subjectSlug: ExamSubjectSlug, requestedTask: number): TeacherCampaign {
  const subject = getExamSubject(subjectSlug);
  const taskCount = getTaskCount(exam, subject.slug);
  if (taskCount < 1) throw new Error(`${subject.name} не входит в выбранный экзамен`);
  const taskNumber = Math.min(taskCount, Math.max(1, Math.trunc(requestedTask) || 1));
  const ratio = taskNumber / taskCount;
  const format = phaseFormats.find((item) => ratio <= item.until) ?? phaseFormats.at(-1)!;
  const angle = exam === "ege"
    ? getOfficialTaskTopic(subject.slug, taskNumber)
    : subject.focus[(taskNumber - 1) % subject.focus.length];
  const examLabel = exam.toUpperCase();
  const practicePath = `/exam?${new URLSearchParams({
    level: exam,
    subject: subject.slug,
    mode: "training",
    task: String(taskNumber),
    utm_source: "reels",
    utm_medium: "teacher",
    utm_campaign: `${exam}-${subject.slug}-${taskNumber}`,
  }).toString()}`;
  const reviewGate = ratio > 0.82
    ? "Развёрнутый или спорный ответ не оценивать обещанием балла: показать критерий и передать преподавателю."
    : "До публикации предметник сверяет формулировку, ответ и объяснение с актуальной демоверсией, спецификацией и кодификатором ФИПИ.";

  return {
    exam,
    subjectSlug: subject.slug,
    subjectName: subject.name,
    taskNumber,
    taskCount,
    angle,
    format: `${format.name}: ${format.description}`,
    hooks: [
      `Стоп: решите № ${taskNumber} ${examLabel} по предмету «${subject.shortName}» до объяснения.`,
      `Если в № ${taskNumber} вы выбираете ответ сразу — проверьте эту ловушку.`,
      `Один признак покажет, почему вы теряете результат в задании № ${taskNumber}.`,
    ],
    shots: [
      `0–2 с. Крупно показать номер ${taskNumber} и обещание одного действия, без обещания баллов.`,
      `2–7 с. Дать авторское аналогичное условие по ракурсу «${angle}» и паузу на ответ.`,
      "7–12 с. Показать типичный неверный ход или место, где ученик неверно читает требование.",
      "12–20 с. Объяснить одну причину и один критерий самопроверки простыми словами.",
      "20–27 с. Дать другое условие того же проверяемого умения, не повторяя исходный ответ.",
      `27–32 с. Показать CTA: «Отработать только № ${taskNumber}» и открыть точную ссылку.`,
    ],
    caption: `${examLabel} · ${subject.name} · задание № ${taskNumber}. Сначала попытка, затем причина ошибки и новое условие. Материал авторский и должен пройти предметную проверку до публикации.`,
    cta: `Отработать только задание № ${taskNumber}: три попытки, объяснение причины и новый пример.`,
    practicePath,
    reviewGate,
  };
}

export const growthSubjectCoverage = examSubjects.map((subject) => ({
  slug: subject.slug,
  name: subject.name,
  ege: subject.fullTaskCount,
  oge: subject.ogeTaskCount ?? 0,
  focus: subject.focus,
}));

