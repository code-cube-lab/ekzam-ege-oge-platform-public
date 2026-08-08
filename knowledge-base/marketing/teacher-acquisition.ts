import type { ExamSubjectSlug } from "../exams/exam-subjects";
import { teacherGrowthProfiles, type TeacherGrowthProfile } from "./teacher-growth";
import { buildTeacherForumRoutes, type TeacherForumRoute } from "./teacher-forum-research";

export type AcquisitionSource = {
  id: string;
  name: string;
  segment: "class-teacher" | "parent" | "subject" | "forum";
  subjectSlugs: Array<ExamSubjectSlug | "all">;
  access: "public-contact" | "paid-catalog" | "reply-only" | "research-only";
  audience: string;
  sourceUrl: string;
  contactUrl?: string;
  contactLabel: string;
  offer: string;
  rule: string;
  verifiedAt?: string;
  evidence?: string;
};

export type ReelShot = {
  time: string;
  show: string;
  action: string;
  say: string;
  overlay: string;
};

export type DetailedReel = {
  id: string;
  title: string;
  audience: string;
  goal: string;
  duration: string;
  setup: string;
  hook: string;
  shots: ReelShot[];
  caption: string;
  cta: string;
  exampleUrl: string;
  exampleLabel: string;
  adaptationRule: string;
};

export type TeacherAcquisitionPlaybook = TeacherGrowthProfile & {
  slug: string;
  taskNumber: number;
  challengePrompt: string;
  studentPain: string;
  parentPain: string;
  classTeacherPain: string;
  leadMagnet: string;
  practicePath: string;
  referralPaths: Array<{ id: string; label: string; path: string }>;
  sources: AcquisitionSource[];
  forumRoutes: TeacherForumRoute[];
  messages: Array<{ id: string; label: string; title: string; text: string }>;
  reels: DetailedReel[];
  offers: Array<{ stage: string; name: string; price: string; result: string; gate: string }>;
  sprint: Array<{ day: string; action: string; evidence: string }>;
};

type SubjectStrategy = {
  taskNumber: number;
  challengePrompt: string;
  studentPain: string;
  parentPain: string;
  classTeacherPain: string;
  leadMagnet: string;
};

export const acquisitionEvidenceDate = "8 августа 2026 года";

export const parentPainEvidence = [
  {
    value: "33%",
    label: "родителей называют сложность поддержания мотивации недостатком онлайн-обучения",
    sourceUrl: "https://skillbox.ru/media/education/stalo-izvestno-kak-v-2025-godu-roditeli-shkolnikov-otnosyatsya-k-onlayn-obucheniyu-detey/",
    sourceLabel: "Опрос 1 351 родителя",
  },
  {
    value: "35%",
    label: "считают профессионализм преподавателя признаком качества",
    sourceUrl: "https://skillbox.ru/media/education/stalo-izvestno-kak-v-2025-godu-roditeli-shkolnikov-otnosyatsya-k-onlayn-obucheniyu-detey/",
    sourceLabel: "Результаты исследования",
  },
  {
    value: "33%",
    label: "хотят видеть результат занятий, а не только количество уроков",
    sourceUrl: "https://skillbox.ru/media/education/stalo-izvestno-kak-v-2025-godu-roditeli-shkolnikov-otnosyatsya-k-onlayn-obucheniyu-detey/",
    sourceLabel: "Результаты исследования",
  },
  {
    value: "49%",
    label: "родителей в исследовании Учи.ру и VK Видео используют видео, чтобы объяснять детям сложные темы",
    sourceUrl: "https://vk.company.ru/ru/press/releases/12334/",
    sourceLabel: "Исследование VK Видео",
  },
] as const;

export const teacherAcquisitionSources: AcquisitionSource[] = [
  {
    id: "class-forum",
    name: "Форум классных руководителей",
    segment: "class-teacher",
    subjectSlugs: ["all"],
    access: "research-only",
    audience: "классные руководители из разных регионов",
    sourceUrl: "https://t.me/vfkr_ru",
    contactLabel: "изучить проекты и правила",
    offer: "Не реклама. Предложить администрации открытый методический пилот или бесплатный классный час по подготовке к экзамену.",
    rule: "Не писать участникам и не публиковать коммерческое предложение в комментариях без разрешения организаторов.",
  },
  {
    id: "class-teacher-paid",
    name: "Классный руководитель | школа",
    segment: "class-teacher",
    subjectSlugs: ["all"],
    access: "paid-catalog",
    audience: "педагоги и классные руководители",
    sourceUrl: "https://telega.in/channels/klassrukov/card",
    contactLabel: "официальное размещение через Telega.in",
    offer: "Нативная карточка: бесплатная диагностика одного навыка для класса и готовый отчёт родителю.",
    rule: "Покупать тестовое размещение только после работающей заявки и с отдельной UTM-меткой.",
  },
  {
    id: "teachers-russia-paid",
    name: "Учителя школ России",
    segment: "class-teacher",
    subjectSlugs: ["all"],
    access: "paid-catalog",
    audience: "учителя основной и средней школы",
    sourceUrl: "https://telega.in/channels/Uchitel_Russia/card",
    contactLabel: "официальное размещение через Telega.in",
    offer: "Семидневный предметный пилот: один номер, три попытки, обезличенная карта ошибок класса.",
    rule: "Не обещать балл и не собирать контакты детей через педагога.",
  },
  {
    id: "parents-school",
    name: "Родители и школа",
    segment: "parent",
    subjectSlugs: ["all"],
    access: "public-contact",
    audience: "родители, педагоги и ученики",
    sourceUrl: "https://t.me/parents_and_school",
    contactUrl: "https://t.me/Svetlan_Ivanna",
    contactLabel: "@Svetlan_Ivanna — публичный контакт сотрудничества",
    offer: "Полезная публикация «Как за 10 минут отличить пробел в теме от невнимательности» с бесплатной практикой.",
    rule: "Одно персональное обращение администратору; не писать подписчикам.",
  },
  {
    id: "school-diary",
    name: "Школьный Дневник",
    segment: "parent",
    subjectSlugs: ["all"],
    access: "public-contact",
    audience: "родители школьников",
    sourceUrl: "https://t.me/diary_school",
    contactUrl: "https://t.me/diaryads",
    contactLabel: "@diaryads — рекламный контакт",
    offer: "Родительский чек-лист перед покупкой курса и один бесплатный диагностический номер.",
    rule: "Запросить формат, маркировку и статистику до оплаты.",
  },
  {
    id: "parent-pro",
    name: "Родитель pro",
    segment: "parent",
    subjectSlugs: ["all"],
    access: "paid-catalog",
    audience: "родители, педагоги и специалисты по развитию детей",
    sourceUrl: "https://telega.in/channels/%2B9Nl4FmTkGaY5Y2Ey/card",
    contactLabel: "официальное размещение через Telega.in",
    offer: "Не продавать урок с первого экрана: дать родителю отчёт о причине одной ошибки ребёнка.",
    rule: "Сравнивать цену завершённой диагностики, а не цену подписчика или просмотра.",
  },
  {
    id: "u-mama-ege",
    name: "u-mama: обсуждение подготовки к ЕГЭ",
    segment: "forum",
    subjectSlugs: ["all"],
    access: "reply-only",
    audience: "родители, выбирающие репетитора или курсы",
    sourceUrl: "https://u-mama.ru/forum/kids/schoolboy/1010667/",
    contactLabel: "только ответ по существу внутри открытой темы",
    offer: "Чек-лист: три вопроса преподавателю и маленькая диагностика до оплаты курса.",
    rule: "Сначала ответ без ссылки; связь с платформой обозначить честно; ссылку давать только по запросу.",
  },
  {
    id: "babyblog-school",
    name: "BabyBlog: сообщество «Школа»",
    segment: "forum",
    subjectSlugs: ["all"],
    access: "reply-only",
    audience: "родители школьников",
    sourceUrl: "https://www.babyblog.ru/community/shkola/post/3231628",
    contactLabel: "только релевантная публичная дискуссия",
    offer: "Нейтрально объяснить, когда ребёнку нужна практика, а когда — преподаватель.",
    rule: "Не маскироваться под родителя и не уводить участников в личку.",
  },
  {
    id: "teacher-literature",
    name: "УЧИТЕЛЬ ЛИТЕРАТУРЫ",
    segment: "subject",
    subjectSlugs: ["russian", "literature"],
    access: "public-contact",
    audience: "учителя русского языка и литературы",
    sourceUrl: "https://t.me/teacher_lit",
    contactUrl: "https://t.me/teacher_liter",
    contactLabel: "@teacher_liter",
    offer: "Совместный разбор критерия, читательская диагностика или открытая отработка одного номера.",
    rule: "Преподаватель утверждает формулировку и ответ до публикации.",
  },
  {
    id: "math-live",
    name: "Математика LIVE",
    segment: "subject",
    subjectSlugs: ["math", "informatics", "physics"],
    access: "public-contact",
    audience: "ученики и преподаватели точных предметов",
    sourceUrl: "https://t.me/matematlive",
    contactUrl: "https://t.me/kristymath",
    contactLabel: "@kristymath",
    offer: "Один номер с паузой на выбор пути решения и тремя аналогичными попытками.",
    rule: "Не публиковать чужое условие или решение без разрешения.",
  },
  {
    id: "chemistry-channel",
    name: "ХИМИЯ | ОГЭ, ЕГЭ",
    segment: "subject",
    subjectSlugs: ["chemistry"],
    access: "public-contact",
    audience: "готовящиеся к химии",
    sourceUrl: "https://t.me/chem_prosto",
    contactUrl: "https://t.me/khn_vasilkova",
    contactLabel: "@khn_vasilkova",
    offer: "Точечная тренировка цепочки превращений или расчётного номера.",
    rule: "Условия реакции и ключ проверяет предметник.",
  },
  {
    id: "biology-channel",
    name: "БиоЛогично жить",
    segment: "subject",
    subjectSlugs: ["biology", "chemistry"],
    access: "public-contact",
    audience: "биология, медицина и экзаменационная подготовка",
    sourceUrl: "https://t.me/yansubaevaip",
    contactUrl: "https://t.me/IrinaPavlovnaYansubaeva",
    contactLabel: "@IrinaPavlovnaYansubaeva",
    offer: "Совместный формат «предскажите результат — назовите признак — повторите на новой схеме».",
    rule: "Не использовать медицинские обещания и непроверенные научные факты.",
  },
  {
    id: "humanities-chat",
    name: "Гум_чат",
    segment: "subject",
    subjectSlugs: ["russian", "literature", "history", "social", "geography"],
    access: "public-contact",
    audience: "гуманитарные предметы ОГЭ и ЕГЭ",
    sourceUrl: "https://t.me/gumchat",
    contactUrl: "https://t.me/Julia_Fattakhova",
    contactLabel: "@Julia_Fattakhova",
    offer: "Кросс-промо одного авторского задания с разбором доказательства ответа.",
    rule: "Согласовать право на материал, рекламную маркировку и один CTA.",
  },
  {
    id: "active-english",
    name: "Active Teach English",
    segment: "subject",
    subjectSlugs: ["english", "german", "chinese"],
    access: "public-contact",
    audience: "преподаватели иностранных языков",
    sourceUrl: "https://t.me/Active_Teach_English",
    contactUrl: "https://t.me/S_english_teacher",
    contactLabel: "@S_english_teacher",
    offer: "Совместная микро-практика на аудирование, лексику или устную часть.",
    rule: "Проверить права на аудио и не использовать чужие экзаменационные записи.",
  },
  {
    id: "ege-100-all",
    name: "ЕГЭ 100БАЛЛОВ",
    segment: "subject",
    subjectSlugs: ["all"],
    access: "paid-catalog",
    audience: "выпускники, которые выбирают предметные материалы для ЕГЭ",
    sourceUrl: "https://t.me/egeoge100ballov",
    contactUrl: "https://telega.in/c/egeoge100ballov",
    contactLabel: "официальная карточка размещения",
    offer: "Тестовая нативная публикация: один сложный тип задания, самостоятельный ответ и бесплатный разбор без обещания балла.",
    rule: "До оплаты запросить свежие охваты, долю нужного возраста и правила маркировки; использовать отдельную ссылку.",
    verifiedAt: "8 августа 2026 года",
    evidence: "В описании канала опубликованы рекламный каталог и контакт по рекламе.",
  },
  {
    id: "ege-russian-100",
    name: "Русский язык ЕГЭ 100БАЛЛОВ",
    segment: "subject",
    subjectSlugs: ["russian", "literature"],
    access: "public-contact",
    audience: "ученики, готовящиеся к ЕГЭ по русскому языку",
    sourceUrl: "https://t.me/rus_ege100ballov",
    contactUrl: "https://t.me/stanislava_dombrovskaya",
    contactLabel: "@stanislava_dombrovskaya — контакт по рекламе",
    offer: "Размещение авторской ловушки одного номера с переходом на три новые попытки и разбор причины ошибки.",
    rule: "Согласовать рекламную маркировку, формат задания и право использовать имя преподавателя до публикации.",
    verifiedAt: "8 августа 2026 года",
    evidence: "Публичное описание канала содержит отдельный контакт по рекламе.",
  },
  {
    id: "russian-teachers-crosspromo",
    name: "Взаимореклама учителей",
    segment: "subject",
    subjectSlugs: ["russian", "literature"],
    access: "research-only",
    audience: "небольшие авторские каналы учителей русского языка и литературы",
    sourceUrl: "https://t.me/vzaimoreklama_teacher",
    contactLabel: "сначала проверить закреп и действующие правила",
    offer: "Найти один дополняющий, а не конкурирующий канал и предложить взаимный авторский разбор с раскрытием партнёрства.",
    rule: "Не писать участникам списка массово; выбрать один канал, изучить его контент и обратиться только по опубликованному контакту.",
    verifiedAt: "8 августа 2026 года",
    evidence: "Публичная лента содержит подборки каналов преподавателей русского языка.",
  },
  {
    id: "russian-study-together",
    name: "Русский язык. Учим вместе",
    segment: "subject",
    subjectSlugs: ["russian", "literature"],
    access: "public-contact",
    audience: "ученики и учителя, которые готовятся к ОГЭ и ЕГЭ",
    sourceUrl: "https://t.me/uchimvmeste100",
    contactUrl: "https://t.me/okhlopkovamarina",
    contactLabel: "@okhlopkovamarina — публичный контакт",
    offer: "Совместный мини-разбор критерия или взаимная предметная проверка одного авторского задания.",
    rule: "Не предлагать копировать материалы друг друга; заранее определить авторство, CTA и рекламную маркировку.",
    verifiedAt: "8 августа 2026 года",
    evidence: "В описании канала указан прямой контакт автора.",
  },
  {
    id: "russian-elena-aleksandrova",
    name: "Русский язык с Еленой Александровой",
    segment: "subject",
    subjectSlugs: ["russian", "literature"],
    access: "public-contact",
    audience: "ученики ОГЭ, ЕГЭ и итогового сочинения",
    sourceUrl: "https://t.me/ege_russ_elena_aleksandrova",
    contactUrl: "https://t.me/egeAleks",
    contactLabel: "@egeAleks — публичный контакт автора",
    offer: "Предложить взаимную экспертную проверку и совместный открытый разбор одной сложной формулировки.",
    rule: "Это коллега и возможный конкурент: писать только с конкретной профессиональной пользой, без переманивания аудитории.",
    verifiedAt: "8 августа 2026 года",
    evidence: "Публичное описание канала указывает автора и контакт для связи.",
  },
  {
    id: "chem-bio-boomstudy",
    name: "Химия | Биология от BoomStudy",
    segment: "subject",
    subjectSlugs: ["chemistry", "biology"],
    access: "public-contact",
    audience: "ученики ОГЭ и ЕГЭ по химии и биологии",
    sourceUrl: "https://t.me/boomstudy",
    contactUrl: "https://t.me/boomstudyhelp",
    contactLabel: "@boomstudyhelp — служба заботы",
    offer: "Предложить только прозрачное рекламное размещение или взаимную предметную проверку авторского тренажёра.",
    rule: "Не выдавать обращение за дружескую рекомендацию и не использовать задания канала без письменного разрешения.",
    verifiedAt: "8 августа 2026 года",
    evidence: "Канал публикует экзаменационные разборы и официальный контакт службы заботы.",
  },
  {
    id: "informatics-public",
    name: "Информатика ЕГЭ | ОГЭ",
    segment: "subject",
    subjectSlugs: ["informatics"],
    access: "research-only",
    audience: "ученики, которые решают задачи экзамена на Python",
    sourceUrl: "https://t.me/egeinformatiks",
    contactLabel: "изучить формат и найти разрешённый контакт в закрепе",
    offer: "Предложить автору взаимную проверку одного алгоритмического тренажёра, только если открыт контакт сотрудничества.",
    rule: "Не использовать бот канала как рекламный контакт и не копировать опубликованные задачи.",
    verifiedAt: "8 августа 2026 года",
    evidence: "Публичное описание подтверждает специализацию на задачах ЕГЭ и ОГЭ по информатике.",
  },
  {
    id: "german-alles-klar",
    name: "Немецкий с Ксенией Ш.",
    segment: "subject",
    subjectSlugs: ["german"],
    access: "public-contact",
    audience: "изучающие немецкий и готовящиеся к языковым экзаменам",
    sourceUrl: "https://t.me/alles_klar",
    contactUrl: "https://t.me/ksu_shashkova",
    contactLabel: "@ksu_shashkova — публичный контакт автора",
    offer: "Совместный мини-диалог: естественная реплика, экзаменационный критерий и новая ситуация для ответа.",
    rule: "Обозначить коммерческую связь и не обещать соответствие ЕГЭ до предметной сверки формата.",
    verifiedAt: "8 августа 2026 года",
    evidence: "Автор указывает опыт экзаменационной подготовки и прямой контакт.",
  },
  {
    id: "language-teacher-listings",
    name: "Репетиторы английского и других языков",
    segment: "subject",
    subjectSlugs: ["english", "german", "chinese"],
    access: "research-only",
    audience: "взрослые, которые ищут преподавателя английского, немецкого или китайского",
    sourceUrl: "https://t.me/englishteachersboard",
    contactLabel: "проверить правила размещения в закреплённом сообщении",
    offer: "Подготовить честную карточку преподавателя с экзаменом, форматом, ценой и ссылкой на бесплатное демо.",
    rule: "Публиковать только через разрешённую форму канала; не собирать телефоны из чужих объявлений.",
    verifiedAt: "8 августа 2026 года",
    evidence: "Публичная лента регулярно размещает объявления преподавателей языков.",
  },
  {
    id: "vpr-ege-paid",
    name: "ВПР · ОГЭ · ЕГЭ · родители и учителя",
    segment: "parent",
    subjectSlugs: ["all"],
    access: "paid-catalog",
    audience: "родители и учителя 4–11 классов",
    sourceUrl: "https://telega.in/channels/2Wx8Z6WL3fy1-jrJ_GbfXP_jXwXW7Ee2MjXFA48vMWE/card_max",
    contactLabel: "официальное размещение через Telega.in",
    offer: "Проверить нативный пост с бесплатной диагностикой одного экзаменационного навыка.",
    rule: "Сначала запросить актуальные охваты и купить одно тестовое размещение с отдельной меткой.",
    verifiedAt: "8 августа 2026 года",
    evidence: "В рекламном каталоге площадка описана как аудитория родителей и учителей 4–11 классов.",
  },
  {
    id: "cradle-to-exams-paid",
    name: "От колыбели до экзаменов",
    segment: "parent",
    subjectSlugs: ["all"],
    access: "paid-catalog",
    audience: "родители школьников, включая семьи выпускников ОГЭ и ЕГЭ",
    sourceUrl: "https://telega.in/channels/%2BrD0_-sIGyMU4MjJi/card",
    contactLabel: "официальное размещение через Telega.in",
    offer: "Родительский кейс без выдуманного отзыва: ошибка, причина, самостоятельная повторная попытка.",
    rule: "Не покупать размещение без подтверждённого пути заявки и измерения завершённых диагностик.",
    verifiedAt: "8 августа 2026 года",
    evidence: "Карточка рекламного каталога прямо указывает подготовку к экзаменам в интересах аудитории.",
  },
  {
    id: "school-channel-paid",
    name: "Школьный канал",
    segment: "parent",
    subjectSlugs: ["all"],
    access: "paid-catalog",
    audience: "родители и взрослые, следящие за школьной повесткой",
    sourceUrl: "https://telega.in/channels/%2BOLWCjJ8ZgJI5ZTc6/card",
    contactLabel: "официальное размещение через Telega.in",
    offer: "Полезный материал к экзаменационной новости: как проверить один навык без покупки большого курса.",
    rule: "Проверить совпадение реальной аудитории с 9–11 классами; не ориентироваться только на число подписчиков.",
    verifiedAt: "8 августа 2026 года",
    evidence: "Публичная карточка каталога показывает школьную тематику и рекламный формат.",
  },
];

export const partnershipSafety = {
  title: "Процент классному руководителю — только прозрачно",
  text: "Личная материальная выгода педагога, способная повлиять на рекомендации ученикам и родителям, может образовать конфликт интересов. Поэтому скрытая выплата за каждого ребёнка выключена из сценария.",
  allowed: [
    "Бесплатный полезный материал для класса после согласия школы и родителей.",
    "Официальное партнёрство со школой или сообществом по договору и с раскрытием рекламы.",
    "Оплата педагогу за реальную отдельную работу: вебинар, проверку материалов или методическое авторство — по договору.",
    "Публичная партнёрская ссылка взрослому администратору, если правила площадки и работодатель это разрешают.",
  ],
  blocked: [
    "Скрытый процент классному руководителю за своих учеников.",
    "Передача телефонов детей или родителей без отдельного согласия.",
    "Давление на родителей через обязательный школьный чат.",
  ],
  lawUrl: "https://www.consultant.ru/document/cons_doc_LAW_140174/b819c620a8c698de35861ad4c9d9696ee0c3ee7a/",
  lawLabel: "273-ФЗ: конфликт интересов педагога",
} as const;

const defaultStrategy: SubjectStrategy = {
  taskNumber: 1,
  challengePrompt: "Прочитайте условие и назовите один признак, на котором держится ответ.",
  studentPain: "Знает тему, но теряется в формулировке и выбирает ответ без доказательства.",
  parentPain: "Непонятно, ребёнок не знает материал или просто невнимательно читает условие.",
  classTeacherPain: "Нужно помочь классу, но нельзя превращать классный час в рекламу и добавлять педагогу проверку десятков работ.",
  leadMagnet: "Бесплатная диагностика одного экзаменационного умения с тремя похожими попытками.",
};

const subjectStrategies: Partial<Record<ExamSubjectSlug, SubjectStrategy>> = {
  russian: {
    taskNumber: 5,
    challengePrompt: "Как правильно: оплатить проезд или оплатить за проезд? Объясните выбор одним правилом.",
    studentPain: "Ученик узнаёт правило после подсказки, но повторяет ту же лексическую или грамматическую ошибку в новом контексте.",
    parentPain: "Оценки плавают, а родителю не видно, какая конкретная причина ошибки повторяется и что уже отработано.",
    classTeacherPain: "Перед ОГЭ и ЕГЭ родители просят совет, но классному руководителю нужен нейтральный диагностический материал, а не реклама одного репетитора.",
    leadMagnet: "10 минут: задание №5, объяснение причины ошибки и три новых контекста для закрепления.",
  },
  math: {
    taskNumber: 8,
    challengePrompt: "В решении изменился знак только у одного слагаемого. На каком переходе появилась ошибка?",
    studentPain: "Ученик помнит формулу, но выбирает неверный путь или теряет знак на промежуточном шаге.",
    parentPain: "Результат пробника низкий, но непонятно, проблема в теме, вычислениях или стратегии решения.",
    classTeacherPain: "Классу нужна быстрая карта типовых ошибок без дополнительной проверки тетрадей.",
    leadMagnet: "Один номер профильной математики с разбором пути и тремя вариантами того же навыка.",
  },
  informatics: {
    taskNumber: 6,
    challengePrompt: "Что выведет программа и какая строка меняет результат? Сначала прогноз — затем запуск.",
    studentPain: "Ученик читает код построчно, но не удерживает состояние переменных и ошибается в прогнозе.",
    parentPain: "Ребёнок много времени проводит за компьютером, но прогресс по КЕГЭ не измеряется.",
    classTeacherPain: "Нужен безопасный цифровой практикум, который запускается без установки сложной среды.",
    leadMagnet: "Короткий прогноз выполнения алгоритма, запуск и три аналогичных фрагмента кода.",
  },
  physics: {
    taskNumber: 8,
    challengePrompt: "Предскажите, как изменится величина, прежде чем подставлять числа в формулу.",
    studentPain: "Формулы выучены, но ученик не видит физическую модель и выбирает лишние данные.",
    parentPain: "Домашние задачи решаются по образцу, а на новом условии ребёнок останавливается.",
    classTeacherPain: "Нужна короткая и безопасная демонстрация, после которой можно увидеть понимание, а не память.",
    leadMagnet: "Физический прогноз, схема решения и три новых условия того же типа.",
  },
  chemistry: {
    taskNumber: 8,
    challengePrompt: "Какое условие реакции забыто и почему без него цепочка не работает?",
    studentPain: "Ученик запоминает продукты реакции, но пропускает условие и теряет логику превращения.",
    parentPain: "Конспект заполнен, но пробные задания с новыми веществами не решаются.",
    classTeacherPain: "Нужен предметный материал с заранее проверенными условиями и безопасной демонстрацией.",
    leadMagnet: "Одна цепочка превращений, объяснение условия и три новых вещества для переноса навыка.",
  },
  biology: {
    taskNumber: 9,
    challengePrompt: "Назовите процесс по трём признакам и объясните, какой признак решающий.",
    studentPain: "Термин узнаётся по картинке, но причинная связь и перенос на новую схему не работают.",
    parentPain: "Ребёнок много учит, однако ошибки повторяются в заданиях с незнакомыми изображениями.",
    classTeacherPain: "Нужна понятная диагностика умения рассуждать, а не ещё один тест на запоминание.",
    leadMagnet: "Одна схема, три признака и серия новых изображений на тот же биологический процесс.",
  },
  history: {
    taskNumber: 12,
    challengePrompt: "Определите эпоху по двум деталям источника и докажите вывод.",
    studentPain: "Даты выучены отдельно, но источник, карта и причинно-следственная связь не соединяются.",
    parentPain: "Большой объём прочитан, а балл не растёт из-за слабого доказательства ответа.",
    classTeacherPain: "Нужен материал, который развивает аргументацию и подходит для гуманитарного класса.",
    leadMagnet: "Фрагмент источника, два доказательства и три новых документа для самостоятельного анализа.",
  },
  social: {
    taskNumber: 18,
    challengePrompt: "Какое понятие описано в ситуации и какие два признака это доказывают?",
    studentPain: "Ученик пишет близкий термин, но не подтверждает обязательные признаки понятия.",
    parentPain: "Ответ выглядит умным, однако эксперт не засчитывает его из-за неточности.",
    classTeacherPain: "Нужна нейтральная практика без политической агитации и спорных обещаний.",
    leadMagnet: "Одна жизненная ситуация, точное понятие и три контрастных примера.",
  },
  geography: {
    taskNumber: 22,
    challengePrompt: "Какой регион скрыт в таблице и какой показатель исключает остальные варианты?",
    studentPain: "Ученик угадывает регион по одному признаку и игнорирует таблицу или карту целиком.",
    parentPain: "Знаний много, но работа с данными и временем на экзамене остаётся слабой.",
    classTeacherPain: "Нужен межпредметный материал, который можно дать классу без длинной лекции.",
    leadMagnet: "Одна таблица, решающий показатель и три новых региона для сравнения.",
  },
  literature: {
    taskNumber: 5,
    challengePrompt: "Выберите одну деталь текста, которая действительно доказывает тезис, а не пересказывает сюжет.",
    studentPain: "Ученик знает произведение, но заменяет анализ пересказом и теряет критерий.",
    parentPain: "Сочинений много, но нет понятной карты: какой критерий уже освоен, а какой повторно провален.",
    classTeacherPain: "Нужен короткий литературный формат, который вовлекает класс и не требует проверять большое сочинение сразу.",
    leadMagnet: "Один критерий анализа, точная деталь текста и три коротких тезиса для проверки.",
  },
  english: {
    taskNumber: 12,
    challengePrompt: "Какое слово в аудио меняет смысл ответа? Услышьте его до повтора.",
    studentPain: "Ученик переводит каждое слово, но пропускает контекстный маркер и теряет общий смысл.",
    parentPain: "Разговорные занятия нравятся, однако связь с экзаменационными умениями не видна.",
    classTeacherPain: "Нужна короткая языковая активность с понятным результатом для всего класса.",
    leadMagnet: "Короткая реплика, выбор смысла и три новых контекста с тем же маркером.",
  },
  german: {
    taskNumber: 19,
    challengePrompt: "Соберите естественную реплику и объясните, почему глагол стоит именно здесь.",
    studentPain: "Правило порядка слов известно, но в живой реплике конструкция распадается.",
    parentPain: "Учебник пройден, а устный ответ и экзаменационная скорость не появляются.",
    classTeacherPain: "Нужен живой языковой мини-формат, который не превращается в контрольную.",
    leadMagnet: "Одна реплика, объяснение позиции глагола и три новые ситуации.",
  },
  chinese: {
    taskNumber: 15,
    challengePrompt: "Какой ключ помогает понять иероглиф и какой тон меняет значение слова?",
    studentPain: "Знак, произношение и значение запоминаются отдельно и не собираются в речевое действие.",
    parentPain: "Прогресс трудно оценить: ребёнок узнаёт карточки, но не строит ответ.",
    classTeacherPain: "Нужен зрелищный межкультурный формат с одним проверяемым учебным результатом.",
    leadMagnet: "Иероглиф, ключ, произношение и три короткие реплики для переноса навыка.",
  },
};

const videoReferenceBySubject: Partial<Record<ExamSubjectSlug, { url: string; label: string; rule: string }>> = {
  russian: {
    url: "https://www.tiktok.com/@alex_luft/video/7018571432657423618",
    label: "Алекс Люфт: одно затруднение и мнемонический образ",
    rule: "Берём механику «одно слово — один образ — проверка», но не копируем текст, шутку или графику.",
  },
  physics: {
    url: "https://www.instagram.com/tatianaerukhimova/",
    label: "Татьяна Ерухимова: прогноз перед опытом",
    rule: "Берём паузу на прогноз и видимый результат; опыт должен быть безопасным и предметно проверенным.",
  },
  chemistry: {
    url: "https://www.tiktok.com/@mrs.b.tv",
    label: "Nancy Bullard: вопрос, демонстрация, объяснение",
    rule: "Берём структуру удержания, но создаём собственную безопасную демонстрацию.",
  },
  biology: {
    url: "https://www.tiktok.com/@mrs.b.tv",
    label: "Nancy Bullard: сначала наблюдение, затем термин",
    rule: "Не показываем ответ в первом кадре; просим назвать признак до объяснения.",
  },
};

const defaultVideoReference = {
  url: "https://www.alvernia.edu/news/2025/05/alvernia-video-goes-viral-viewed-millions-instagram-tiktok",
  label: "Alvernia University: узнаваемая боль за первые секунды",
  rule: "Берём короткий POV и узнаваемую ситуацию, но снимаем оригинальный материал преподавателя.",
};

function firstName(name: string) {
  return name.split(" ")[0] ?? name;
}

function buildPracticePath(profile: TeacherGrowthProfile, taskNumber: number, source = "teacher_page") {
  const params = new URLSearchParams({
    level: "ege",
    subject: profile.subjectSlug,
    mode: "training",
    variant: "1",
    task: String(taskNumber),
    utm_source: source,
    utm_medium: "teacher_ecosystem",
    utm_campaign: profile.id,
  });
  return `/exam?${params.toString()}`;
}

function buildMessages(profile: TeacherGrowthProfile, strategy: SubjectStrategy) {
  const teacher = profile.name;
  return [
    {
      id: "class-teacher",
      label: "Классному руководителю",
      title: "Не процент за ребёнка, а полезный пилот для класса",
      text: `Здравствуйте! Я представляю преподавателя ${teacher} и платформу точечной подготовки к ОГЭ/ЕГЭ. Предлагаем не рекламу в родительском чате, а бесплатный 20-минутный пилот по предмету «${profile.subjectName}»: один экзаменационный навык, три попытки и обезличенная сводка типовых ошибок. Контакты учеников нам передавать не нужно — родители сами открывают ссылку. Если формат покажется полезным, коммерческое продолжение обсуждается отдельно и прозрачно с администрацией. Можно прислать демо и правила проведения?`,
    },
    {
      id: "parent-admin",
      label: "Администратору родительского канала",
      title: "Материал решает одну родительскую боль",
      text: `Здравствуйте! У вас родители обсуждают подготовку и выбор репетиторов. Мы сделали бесплатный материал с преподавателем ${teacher}: «${strategy.leadMagnet}». Родитель получает не обещание балла, а понятный ответ — какая причина ошибки повторяется и что делать дальше. Можно прислать вам страницу для предварительной проверки? Если подойдёт, согласуем нативную публикацию, маркировку и отдельную ссылку без сообщений участникам в личку.`,
    },
    {
      id: "current-parent",
      label: "Текущему родителю",
      title: "Рекомендация без давления",
      text: `Здравствуйте! Мы открыли у ${teacher} бесплатную точечную диагностику по теме «${profile.focus[0]}». Если в вашем классе есть родитель, которому сейчас сложно понять причину ошибок ребёнка, можете переслать ему ссылку. Это не обязательная покупка: сначала ученик выполняет задание и получает разбор, а консультацию выбирает сам родитель.`,
    },
    {
      id: "after-diagnostic",
      label: "После прохождения",
      title: "Продажа через найденную проблему",
      text: `По результату видна не общая отметка по предмету «${profile.subjectName}», а конкретная повторяющаяся причина: ${strategy.studentPain.toLowerCase()} Следующий безопасный шаг — 14 дней практики по одному навыку или короткая консультация. Преподаватель — ${teacher}. Могу показать программу и объём проверки до оплаты.`,
    },
  ];
}

function buildReels(profile: TeacherGrowthProfile, strategy: SubjectStrategy): DetailedReel[] {
  const reference = videoReferenceBySubject[profile.subjectSlug] ?? defaultVideoReference;
  const teacherShort = firstName(profile.name);
  const practicePath = buildPracticePath(profile, strategy.taskNumber, "reel");
  return [
    {
      id: "student-challenge",
      title: "Ответьте раньше разбора: один экзаменационный навык",
      audience: "ученик 9–11 класса",
      goal: "Получить не просмотр, а переход в конкретную бесплатную тренировку.",
      duration: "30–35 секунд",
      setup: "Телефон вертикально 9:16, преподаватель у светлой доски. Отдельно записать экран платформы крупным планом. Субтитры обязательны.",
      hook: strategy.challengePrompt,
      shots: [
        { time: "0–3 с", show: "Крупно условие на карточке; лицо преподавателя занимает треть экрана.", action: "Показать пальцем на место выбора и замереть.", say: strategy.challengePrompt, overlay: "ОТВЕТЬТЕ ДО РАЗБОРА" },
        { time: "3–7 с", show: "Таймер 4 секунды и два возможных пути ответа.", action: "Молчать, смотреть в камеру, не подсказывать мимикой.", say: "Четыре секунды. Не угадывайте — назовите признак.", overlay: "4 · 3 · 2 · 1" },
        { time: "7–13 с", show: "Доска: неверный путь зачёркнут одной линией.", action: "Показать точку, где появляется ошибка.", say: `Чаще всего ошибаются не из-за незнания темы. ${strategy.studentPain}`, overlay: "ВОТ ГДЕ ЛОМAЕТСЯ РЕШЕНИЕ" },
        { time: "13–20 с", show: "Одно правило или схема — максимум семь слов в строке.", action: "Записать опорный признак и сразу применить его.", say: `Смотрите на один признак: ${profile.focus[0]}. Он должен объяснить выбор, а не просто совпасть с ответом.`, overlay: profile.focus[0].toUpperCase() },
        { time: "20–27 с", show: "Экран платформы: новое похожее условие, затем карточка причины ошибки.", action: "Нажать «проверить», показать разбор и следующую попытку.", say: "Теперь другое условие. Если правило работает — ответ получится без моей подсказки.", overlay: "НОВОЕ УСЛОВИЕ · ТОТ ЖЕ НАВЫК" },
        { time: "27–35 с", show: "QR или короткая подпись ссылки; преподаватель снова в кадре.", action: "Указать вниз на ссылку, не обещать балл.", say: "Откройте задание под роликом. Три верных подряд — и навык действительно начал закрепляться.", overlay: "БЕСПЛАТНОЕ ЗАДАНИЕ № " + strategy.taskNumber },
      ],
      caption: `${profile.name} разбирает один навык по теме «${profile.focus[0]}». Сначала ответьте самостоятельно, затем пройдите три новые попытки. Материал авторский; результат экзамена не гарантируется.`,
      cta: `Открыть тренировку: ${practicePath}`,
      exampleUrl: reference.url,
      exampleLabel: reference.label,
      adaptationRule: reference.rule,
    },
    {
      id: "parent-proof",
      title: "Родителю: почему ещё один пробник не показывает причину",
      audience: "мама или папа выпускника",
      goal: "Показать ценность отчёта и привести к самостоятельной диагностике ребёнка.",
      duration: "35–40 секунд",
      setup: "Стол, распечатка условного результата без имени ребёнка, планшет с экраном отчёта. Никаких вымышленных отзывов и баллов.",
      hook: strategy.parentPain,
      shots: [
        { time: "0–4 с", show: "Лист с крупной надписью «18 ошибок» перечёркивается.", action: "Убрать лист и положить рядом три карточки причин.", say: "Количество ошибок ещё не говорит, что именно нужно учить ребёнку.", overlay: "НЕ 18 ОШИБОК. А 3 ПРИЧИНЫ" },
        { time: "4–10 с", show: "Три карточки: правило, чтение условия, невнимательность.", action: "Разложить карточки по одной.", say: "Одна ошибка — не знает правило. Вторая — неверно читает требование. Третья — спешит.", overlay: "ПРАВИЛО · УСЛОВИЕ · ТЕМП" },
        { time: "10–17 с", show: "Фрагмент задания и первая попытка ученика.", action: "Подчеркнуть только одно место решения.", say: `По предмету «${profile.subjectName}» мы сначала проверяем один навык: ${profile.focus[0]}.`, overlay: "ОДИН НАВЫК ЗА РАЗ" },
        { time: "17–25 с", show: "Карточка объяснения и новое условие.", action: "Переключить на похожее задание.", say: "После ошибки ребёнок видит причину и сразу применяет правило на другом условии.", overlay: "ОШИБКА → РАЗБОР → ПОВТОР" },
        { time: "25–32 с", show: "Обезличенный отчёт: сильная сторона, слабая тема, следующий шаг.", action: "Показать три строки отчёта без персональных данных.", say: "Родитель получает короткий отчёт: что получается, что повторяется и где уже нужен человек.", overlay: "ПОНЯТНО, ЗА ЧТО ПЛАТИТЬ" },
        { time: "32–40 с", show: "Преподаватель в кадре, рядом QR диагностики.", action: "Спокойно пригласить без срочности.", say: `Сначала пройдите бесплатную диагностику. Если проблема подтвердится, ${teacherShort} предложит точный маршрут, а не большой курс вслепую.`, overlay: "СНАЧАЛА ДИАГНОСТИКА" },
      ],
      caption: `Родителю не нужен ещё один общий процент. Нужна причина повторяющейся ошибки и следующий понятный шаг. Бесплатная диагностика по методике преподавателя: ${profile.name}.`,
      cta: `Проверить один навык: ${buildPracticePath(profile, strategy.taskNumber, "parent_reel")}`,
      exampleUrl: "https://vk.company.ru/ru/press/releases/12334/",
      exampleLabel: "Исследование Учи.ру и VK Видео о роли видео в объяснении сложных тем",
      adaptationRule: "Видео должно закончиться действием ребёнка на платформе, а не абстрактным «подпишитесь».",
    },
    {
      id: "class-teacher-pilot",
      title: "Классному руководителю: материал, который не надо проверять вручную",
      audience: "классный руководитель 9–11 класса",
      goal: "Получить разрешение на пилот для класса или родительского собрания.",
      duration: "40–45 секунд",
      setup: "Преподаватель у экрана. На экране — путь из четырёх шагов и обезличенная сводка. Не снимать реальный класс без согласий.",
      hook: strategy.classTeacherPain,
      shots: [
        { time: "0–5 с", show: "Преподаватель держит стопку условных работ и убирает её со стола.", action: "Показать пустые руки.", say: "Чтобы помочь выпускному классу, вам не нужно проверять ещё тридцать работ.", overlay: "БЕЗ НОВОЙ СТОПКИ ТЕТРАДЕЙ" },
        { time: "5–12 с", show: "Схема: ссылка → задание → три попытки → сводка.", action: "Последовательно подсветить четыре шага.", say: "Вы передаёте родителям одну добровольную ссылку. Контакты детей нам не нужны.", overlay: "ДОБРОВОЛЬНО · БЕЗ ПЕРЕДАЧИ КОНТАКТОВ" },
        { time: "12–20 с", show: "Экран конкретного задания № и таймер 10 минут.", action: "Открыть задание и показать формат ответа.", say: `Пилот проверяет только один навык по предмету «${profile.subjectName}»: ${profile.focus[0]}.`, overlay: `ЗАДАНИЕ № ${strategy.taskNumber}` },
        { time: "20–29 с", show: "Обезличенные три группы ошибок.", action: "Показать агрегированную сводку без фамилий.", say: "В результате видно, какая причина повторяется в классе и какой материал стоит дать дальше.", overlay: "КАРТА ПРИЧИН, НЕ РЕЙТИНГ ДЕТЕЙ" },
        { time: "29–37 с", show: "Карточка «бесплатный пилот / коммерческое продолжение отдельно».", action: "Развести две карточки по сторонам.", say: "Пилот бесплатный. Любое платное продолжение обсуждается отдельно, прозрачно и не через скрытый процент за ученика.", overlay: "БЕЗ СКРЫТОЙ КОМИССИИ" },
        { time: "37–45 с", show: "Кнопка «Запросить демо для класса» и имя преподавателя.", action: "Указать на кнопку.", say: `Если хотите проверить материал до родительского собрания, откройте страницу преподавателя и запросите демо. Преподаватель — ${profile.name}.`, overlay: "СНАЧАЛА ДЕМО ДЛЯ ПЕДАГОГА" },
      ],
      caption: `Методический пилот: один класс, один навык, добровольное участие и обезличенный результат. Преподаватель — ${profile.name}. Коммерческие условия не скрываются от школы и родителей.`,
      cta: `Посмотреть демо ученика: ${buildPracticePath(profile, strategy.taskNumber, "class_teacher")}`,
      exampleUrl: "https://t.me/vfkr_ru/471",
      exampleLabel: "Форум классных руководителей: совместные полезные проекты классов",
      adaptationRule: "Показывать пользу для класса и снижение нагрузки педагога; не превращать официальный педагогический канал в скрытую рекламу.",
    },
  ];
}

function buildOffers(profile: TeacherGrowthProfile, strategy: SubjectStrategy) {
  return [
    { stage: "01", name: "Диагностика", price: "0 ₽", result: strategy.leadMagnet, gate: "Родитель видит причину ошибки и сам выбирает продолжение." },
    { stage: "02", name: "Тренировка одного навыка", price: "1 490 ₽ · гипотеза", result: "14 дней короткой практики, повтор ошибок и итоговая сводка.", gate: "Открывать после предметной проверки материалов преподавателем." },
    { stage: "03", name: `Малая группа · ${profile.name}`, price: "от 4 490 ₽/мес. · гипотеза", result: "Еженедельное занятие, проверка сложных ответов и персональный следующий шаг.", gate: "Цена, расписание и объём проверки подтверждаются преподавателем до рекламы." },
    { stage: "04", name: "Индивидуальное сопровождение", price: "по согласованию", result: "Диагностика, персональный маршрут и ответственность преподавателя за обратную связь.", gate: "Только при реальном свободном месте и согласованных условиях." },
  ];
}

function buildSprint(profile: TeacherGrowthProfile, strategy: SubjectStrategy) {
  return [
    { day: "День 1", action: `Преподаватель проверяет условие задания №${strategy.taskNumber}, ключ и три похожие попытки.`, evidence: "Подписанный предметный чек-лист." },
    { day: "День 2", action: "Записать первый подробный ролик по покадровому сценарию без монтажа сложнее субтитров.", evidence: "Оригинал 9:16 и версия до 35 секунд." },
    { day: "День 3", action: "Опубликовать ролик в собственных VK Клипах, Shorts или Telegram с отдельной ссылкой.", evidence: "Просмотры, переходы и завершённые задания." },
    { day: "День 4", action: "Выбрать двух классных руководителей или администраторов, с которыми уже есть профессиональный контакт.", evidence: "Две персональные причины, почему материал подходит их аудитории." },
    { day: "День 5", action: "Отправить по одному сообщению с просьбой сначала проверить демо. Не просить передать контакты родителей.", evidence: "Ответ, отказ или отсутствие ответа — без повторного давления." },
    { day: "Дни 6–7", action: "Провести добровольный бесплатный пилот одного навыка.", evidence: "Количество открытий, завершений и повторяющихся причин ошибок." },
    { day: "День 8", action: "Записать родительский ролик на основе обезличенной структуры ошибки, а не выдуманного кейса.", evidence: "Ролик и ссылка с меткой parent_reel." },
    { day: "Дни 9–10", action: "Предложить администратору одного релевантного родительского или предметного канала полезную публикацию.", evidence: "Согласованный формат, цена/бартер и правила маркировки." },
    { day: "Дни 11–12", action: "Ответить по существу в одной свежей публичной дискуссии, если вопрос точно совпадает с проблемой.", evidence: "Полезный ответ без ссылки или ссылка только по запросу." },
    { day: "Дни 13–14", action: `Предложить продолжение только тем взрослым, кто завершил диагностику и сам запросил консультацию. Преподаватель — ${profile.name}.`, evidence: "Запрос консультации, а не список просмотревших." },
  ];
}

function stableTeacherOffset(value: string) {
  return Array.from(value).reduce((sum, character) => sum + character.codePointAt(0)!, 0);
}

function rotateSelection<T>(items: T[], count: number, offset: number) {
  if (items.length <= count) return items;
  return Array.from({ length: count }, (_, index) => items[(offset + index) % items.length]);
}

function buildPersonalSources(profile: TeacherGrowthProfile) {
  const offset = stableTeacherOffset(profile.id);
  const common = teacherAcquisitionSources.filter((source) => source.subjectSlugs.includes("all"));
  const exact = teacherAcquisitionSources.filter((source) => source.subjectSlugs.includes(profile.subjectSlug) && !source.subjectSlugs.includes("all"));
  const selected = [
    ...common.filter((source) => source.segment === "class-teacher"),
    ...rotateSelection(common.filter((source) => source.segment === "parent"), 2, offset),
    ...rotateSelection(common.filter((source) => source.segment === "forum"), 1, offset + 2),
    ...rotateSelection(common.filter((source) => source.segment === "subject"), 1, offset + 4),
    ...exact,
  ];
  const unique = Array.from(new Map(selected.map((source) => [source.id, source])).values());
  return unique.map((source, index) => ({
    ...source,
    offer: `${profile.name}: ${source.offer}`,
    evidence: source.evidence ?? `Маршрут №${index + 1} отобран под предмет «${profile.subjectName}» и аудиторию «${profile.targetAudiences[index % profile.targetAudiences.length]}».`,
  }));
}

export function buildTeacherAcquisitionPlaybook(profile: TeacherGrowthProfile): TeacherAcquisitionPlaybook {
  const strategy = subjectStrategies[profile.subjectSlug] ?? defaultStrategy;
  const sources = buildPersonalSources(profile);
  const practicePath = buildPracticePath(profile, strategy.taskNumber);
  return {
    ...profile,
    slug: profile.id,
    taskNumber: strategy.taskNumber,
    challengePrompt: strategy.challengePrompt,
    studentPain: strategy.studentPain,
    parentPain: strategy.parentPain,
    classTeacherPain: strategy.classTeacherPain,
    leadMagnet: strategy.leadMagnet,
    practicePath,
    referralPaths: [
      { id: "reel", label: "Ссылка под роликом", path: buildPracticePath(profile, strategy.taskNumber, "reel") },
      { id: "class", label: "Классному руководителю", path: buildPracticePath(profile, strategy.taskNumber, "class_teacher") },
      { id: "parent", label: "Родительскому каналу", path: buildPracticePath(profile, strategy.taskNumber, "parent_channel") },
      { id: "referral", label: "Рекомендация родителя", path: buildPracticePath(profile, strategy.taskNumber, "parent_referral") },
    ],
    sources,
    forumRoutes: buildTeacherForumRoutes(profile),
    messages: buildMessages(profile, strategy),
    reels: buildReels(profile, strategy),
    offers: buildOffers(profile, strategy),
    sprint: buildSprint(profile, strategy),
  };
}

export const teacherAcquisitionPlaybooks = teacherGrowthProfiles.map(buildTeacherAcquisitionPlaybook);

export function getTeacherAcquisitionPlaybook(id: string) {
  return teacherAcquisitionPlaybooks.find((profile) => profile.id === id) ?? teacherAcquisitionPlaybooks[0];
}
