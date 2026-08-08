import type { ExamSubjectSlug } from "../exams/exam-subjects";

export const recentDemandWindow = "8 июля — 8 августа 2026 года";

export const recentDemandScanStats = {
  inspected: 148,
  matched: 75,
  source: "Публичная лента «Поиск учеников | Заявки репетиторам»",
  sourceUrl: "https://t.me/s/poisk_uchenikov",
  checkedAt: "8 августа 2026 года",
} as const;

export type DemandActionMode = "manager-first" | "reply-if-open" | "partner-application" | "observe-only";

export type RecentDemandSignal = {
  id: string;
  observedAt: string;
  subjectSlugs: ExamSubjectSlug[];
  title: string;
  requestSummary: string;
  fitReason: string;
  publicPostUrl: string;
  originalPostUrl?: string;
  sourceName: string;
  score: number;
  actionMode: DemandActionMode;
  actionLabel: string;
  managerUrl?: string;
  managerLabel?: string;
  safetyNote: string;
};

/**
 * Only public post URLs and published manager routes are stored here. We do not
 * collect requester usernames, phone numbers or participant lists.
 */
export const recentDemandSignals: RecentDemandSignal[] = [
  {
    id: "oge-math-10261",
    observedAt: "9 июля 2026",
    subjectSlugs: ["math"],
    title: "Математика ОГЭ",
    requestSummary: "Ищут репетитора для подготовки к ОГЭ по математике.",
    fitReason: "Экзамен и предмет совпадают; можно предложить диагностику одного номера до разговора о занятиях.",
    publicPostUrl: "https://t.me/poisk_uchenikov/10261",
    sourceName: "Поиск учеников",
    score: 14,
    actionMode: "manager-first",
    actionLabel: "Сначала спросить менеджера ленты",
    managerUrl: "https://t.me/shevchukvadim",
    managerLabel: "@shevchukvadim",
    safetyNote: "Не искать автора по участникам канала; уточнить у менеджера, актуальна ли заявка и как разрешено откликнуться.",
  },
  {
    id: "ege-physics-school-10253",
    observedAt: "9 июля 2026",
    subjectSlugs: ["physics"],
    title: "Преподаватель физики ЕГЭ для онлайн-школы",
    requestSummary: "Онлайн-школа ищет преподавателя для подготовки к ЕГЭ по физике.",
    fitReason: "Это B2B-заявка на преподавателя: подходит предметное портфолио и демо-разбор, а не родительская продажа.",
    publicPostUrl: "https://t.me/poisk_uchenikov/10253",
    sourceName: "Поиск учеников",
    score: 12,
    actionMode: "partner-application",
    actionLabel: "Откликнуться как преподаватель по правилам заявки",
    managerUrl: "https://t.me/shevchukvadim",
    managerLabel: "@shevchukvadim",
    safetyNote: "Сначала проверить актуальность вакансии; не обещать результаты учеников без подтверждённых кейсов.",
  },
  {
    id: "math-it-lyceum-10313",
    observedAt: "15 июля 2026",
    subjectSlugs: ["math"],
    title: "Математика для поступления в IT-лицей, 9 класс",
    requestSummary: "Родителю нужен преподаватель по математике для подготовки девятиклассника к вступительным испытаниям в IT-лицей.",
    fitReason: "Есть класс, цель и предмет; релевантна входная диагностика задач повышенного уровня.",
    publicPostUrl: "https://t.me/poisk_uchenikov/10313",
    originalPostUrl: "https://t.me/MMoscowski/197696",
    sourceName: "Мамы Москвы",
    score: 15,
    actionMode: "manager-first",
    actionLabel: "Писать менеджеру канала, не участнику",
    managerUrl: "https://t.me/ADM_MMSK",
    managerLabel: "@ADM_MMSK",
    safetyNote: "В канале ссылки, продвижение и реклама без согласования запрещены; сначала запросить разрешённый формат.",
  },
  {
    id: "oge-russian-literature-math-10354",
    observedAt: "20 июля 2026",
    subjectSlugs: ["russian", "literature", "math"],
    title: "Вводные занятия перед ОГЭ",
    requestSummary: "Публичный пост просит вводные занятия по русскому, литературе и математике перед ОГЭ.",
    fitReason: "Предмет и экзамен совпадают, но по формулировке автор может быть несовершеннолетним.",
    publicPostUrl: "https://t.me/poisk_uchenikov/10354",
    sourceName: "Поиск учеников",
    score: 8,
    actionMode: "observe-only",
    actionLabel: "Лично не писать",
    managerUrl: "https://t.me/shevchukvadim",
    managerLabel: "@shevchukvadim",
    safetyNote: "Не вступать в личный контакт. Максимум — уточнить у менеджера, принимает ли заявку взрослый представитель.",
  },
  {
    id: "french-arabic-10374",
    observedAt: "22 июля 2026",
    subjectSlugs: ["french"],
    title: "Французский язык",
    requestSummary: "Ищут преподавателя французского языка; в исходном запросе также упоминался арабский.",
    fitReason: "Есть прямое совпадение по французскому; начинать нужно с уточнения уровня и цели.",
    publicPostUrl: "https://t.me/poisk_uchenikov/10374",
    sourceName: "Поиск учеников",
    score: 10,
    actionMode: "manager-first",
    actionLabel: "Уточнить актуальность у менеджера",
    managerUrl: "https://t.me/shevchukvadim",
    managerLabel: "@shevchukvadim",
    safetyNote: "Не обещать подготовку к экзамену, пока взрослый не подтвердит цель и формат.",
  },
  {
    id: "spanish-c1-10367",
    observedAt: "21 июля 2026",
    subjectSlugs: ["spanish"],
    title: "Испанский B2 → C1",
    requestSummary: "Ищут преподавателя испанского для перехода с уровня B2 на C1.",
    fitReason: "Высокая предметная точность, но это языковая цель, а не ОГЭ/ЕГЭ — нужен отдельный оффер.",
    publicPostUrl: "https://t.me/poisk_uchenikov/10367",
    sourceName: "Поиск учеников",
    score: 11,
    actionMode: "manager-first",
    actionLabel: "Уточнить формат отклика",
    managerUrl: "https://t.me/shevchukvadim",
    managerLabel: "@shevchukvadim",
    safetyNote: "Честно отделить разговорный/сертификационный маршрут от экзаменационной подготовки платформы.",
  },
  {
    id: "oge-math-private-source-10390",
    observedAt: "24 июля 2026",
    subjectSlugs: ["math"],
    title: "Математика ОГЭ, закрытый первоисточник",
    requestSummary: "В агрегаторе опубликован запрос на подготовку к ОГЭ по математике, но исходная тема недоступна публично.",
    fitReason: "Предмет и экзамен совпадают; прямой переход к автору невозможен и не нужен.",
    publicPostUrl: "https://t.me/poisk_uchenikov/10390",
    sourceName: "Поиск учеников",
    score: 11,
    actionMode: "manager-first",
    actionLabel: "Только через менеджера агрегатора",
    managerUrl: "https://t.me/shevchukvadim",
    managerLabel: "@shevchukvadim",
    safetyNote: "Не пытаться открыть закрытую группу или искать автора; запросить официальный способ отклика.",
  },
  {
    id: "german-age-16-10405",
    observedAt: "25 июля 2026",
    subjectSlugs: ["german"],
    title: "Немецкий язык для ученика 16 лет",
    requestSummary: "Взрослый ищет преподавателя немецкого для подростка 16 лет.",
    fitReason: "Есть возраст и предмет; до предложения нужно выяснить уровень и экзаменационную цель.",
    publicPostUrl: "https://t.me/poisk_uchenikov/10405",
    sourceName: "Поиск учеников",
    score: 12,
    actionMode: "manager-first",
    actionLabel: "Получить разрешённый контакт взрослого",
    managerUrl: "https://t.me/shevchukvadim",
    managerLabel: "@shevchukvadim",
    safetyNote: "Общение и согласование оплаты — только со взрослым представителем.",
  },
  {
    id: "oge-english-10414",
    observedAt: "27 июля 2026",
    subjectSlugs: ["english"],
    title: "Английский ОГЭ",
    requestSummary: "В родительском локальном сообществе ищут преподавателя для подготовки к ОГЭ по английскому.",
    fitReason: "Высокое совпадение по предмету и экзамену; можно предложить короткую диагностику одного аудирования или письма.",
    publicPostUrl: "https://t.me/poisk_uchenikov/10414",
    originalPostUrl: "https://t.me/vseobovsemles/1045249",
    sourceName: "Всё обо всём",
    score: 15,
    actionMode: "reply-if-open",
    actionLabel: "Ответить публично, только если правила разрешают",
    safetyNote: "Сначала перечитать правила темы; ответ должен быть полезен без ссылки, связь с платформой раскрыть.",
  },
  {
    id: "ege-russian-10417",
    observedAt: "27 июля 2026",
    subjectSlugs: ["russian"],
    title: "Русский язык ЕГЭ",
    requestSummary: "Публичное объявление о поиске преподавателя для подготовки к ЕГЭ по русскому языку.",
    fitReason: "Полное совпадение по предмету и экзамену; сильный вход — бесплатная отработка одного сложного номера.",
    publicPostUrl: "https://t.me/poisk_uchenikov/10417",
    originalPostUrl: "https://t.me/ob_yava/891845",
    sourceName: "Объявления",
    score: 15,
    actionMode: "manager-first",
    actionLabel: "Согласовать отклик с рекламным менеджером",
    managerUrl: "https://t.me/Reklama_ob_yava",
    managerLabel: "@Reklama_ob_yava",
    safetyNote: "Не маскировать коммерческое предложение под рекомендацию; проверить правила объявления и актуальность.",
  },
  {
    id: "oge-biology-10419",
    observedAt: "27 июля 2026",
    subjectSlugs: ["biology"],
    title: "Биология ОГЭ",
    requestSummary: "Опубликован прямой запрос на преподавателя биологии для подготовки к ОГЭ.",
    fitReason: "Полное совпадение; диагностикой может быть одна схема с объяснением решающего признака.",
    publicPostUrl: "https://t.me/poisk_uchenikov/10419",
    sourceName: "Поиск учеников",
    score: 14,
    actionMode: "manager-first",
    actionLabel: "Уточнить способ отклика у менеджера",
    managerUrl: "https://t.me/shevchukvadim",
    managerLabel: "@shevchukvadim",
    safetyNote: "Не собирать контакты участников; получить подтверждение, что заявка активна.",
  },
  {
    id: "chem-bio-10457",
    observedAt: "3 августа 2026",
    subjectSlugs: ["chemistry", "biology"],
    title: "Сильный преподаватель химии и биологии",
    requestSummary: "Родитель ищет сильного преподавателя по химии и биологии для ребёнка.",
    fitReason: "Сразу два предмета платформы; можно раздельно показать диагностические мини-маршруты и преподавателей.",
    publicPostUrl: "https://t.me/poisk_uchenikov/10457",
    originalPostUrl: "https://t.me/vseobovsemles/1049696",
    sourceName: "Всё обо всём",
    score: 15,
    actionMode: "reply-if-open",
    actionLabel: "Проверить правила и дать открытый полезный ответ",
    safetyNote: "Не писать ребёнку. В ответе раскрыть связь с платформой и не обещать гарантированный балл.",
  },
  {
    id: "english-b2-10459",
    observedAt: "3 августа 2026",
    subjectSlugs: ["english"],
    title: "Английский B2 и вступительный экзамен",
    requestSummary: "Родитель ищет преподавателя для дочери: уровень B2 и подготовка к вступительному экзамену.",
    fitReason: "Есть взрослый заказчик, уровень и экзаменационная цель; нужен диагностический формат под конкретный экзамен.",
    publicPostUrl: "https://t.me/poisk_uchenikov/10459",
    sourceName: "Поиск учеников",
    score: 14,
    actionMode: "manager-first",
    actionLabel: "Проверить актуальность через менеджера",
    managerUrl: "https://t.me/shevchukvadim",
    managerLabel: "@shevchukvadim",
    safetyNote: "До оффера уточнить формат вступительного испытания и общаться только со взрослым заказчиком.",
  },
  {
    id: "ege-math-informatics-10467",
    observedAt: "4 августа 2026",
    subjectSlugs: ["math", "informatics"],
    title: "Математика и информатика ЕГЭ",
    requestSummary: "В московском родительском канале ищут преподавателей по математике и информатике для ЕГЭ.",
    fitReason: "Два точных предмета и понятная цель; полезно предложить раздельную диагностику, а не общий пакет.",
    publicPostUrl: "https://t.me/poisk_uchenikov/10467",
    originalPostUrl: "https://t.me/MMoscowski/198421",
    sourceName: "Мамы Москвы",
    score: 15,
    actionMode: "manager-first",
    actionLabel: "Сначала менеджеру Мам Москвы",
    managerUrl: "https://t.me/ADM_MMSK",
    managerLabel: "@ADM_MMSK",
    safetyNote: "Продвижение без разрешения в канале запрещено; запросить формат нативного ответа или размещения.",
  },
  {
    id: "math-10-11-offline-10469",
    observedAt: "4 августа 2026",
    subjectSlugs: ["math"],
    title: "Математика 10–11 класс, офлайн",
    requestSummary: "Ищут преподавателя математики для 10–11 класса с очным форматом в Минске.",
    fitReason: "Предмет и возраст подходят, но география ограничивает предложение.",
    publicPostUrl: "https://t.me/poisk_uchenikov/10469",
    sourceName: "Поиск учеников",
    score: 7,
    actionMode: "observe-only",
    actionLabel: "Не откликаться без совпадения по городу",
    safetyNote: "Онлайн-формат не подменяет явный запрос на офлайн; использовать только как сигнал боли рынка.",
  },
  {
    id: "physics-grade9-offline-10472",
    observedAt: "5 августа 2026",
    subjectSlugs: ["physics"],
    title: "Физика, 9 класс, офлайн",
    requestSummary: "Ищут очного преподавателя физики для ученика 9 класса в Минске.",
    fitReason: "Предмет и класс совпадают, но очная география не совпадает с онлайн-платформой.",
    publicPostUrl: "https://t.me/poisk_uchenikov/10472",
    sourceName: "Поиск учеников",
    score: 7,
    actionMode: "observe-only",
    actionLabel: "Не продавать онлайн вместо офлайн",
    safetyNote: "Не спорить с форматом запроса; оставить как материал для контента о выборе очного преподавателя.",
  },
  {
    id: "chem-bio-online-10490",
    observedAt: "6 августа 2026",
    subjectSlugs: ["chemistry", "biology"],
    title: "Химия и биология онлайн",
    requestSummary: "В публичной группе ищут онлайн-преподавателя по химии и биологии.",
    fitReason: "Совпадают два предмета и формат; это один из самых свежих и сильных сигналов.",
    publicPostUrl: "https://t.me/poisk_uchenikov/10490",
    originalPostUrl: "https://t.me/repetitori_uroki_studenti/80378",
    sourceName: "Репетиторы · уроки · студенты",
    score: 15,
    actionMode: "manager-first",
    actionLabel: "Уточнить правила у администратора группы",
    managerUrl: "https://t.me/HR_adminka",
    managerLabel: "@HR_adminka",
    safetyNote: "Сначала проверить правила группы и актуальность; отклик направляет взрослый преподаватель, не бот.",
  },
  {
    id: "english-russian-grade8-10495",
    observedAt: "7 августа 2026",
    subjectSlugs: ["english", "russian"],
    title: "Русский и английский, 8 класс",
    requestSummary: "Родитель ищет преподавателей русского и английского для восьмиклассника.",
    fitReason: "Два предмета и близкий к ОГЭ класс; можно предложить отдельные входные диагностики.",
    publicPostUrl: "https://t.me/poisk_uchenikov/10495",
    originalPostUrl: "https://t.me/vseobovsemles/1052270",
    sourceName: "Всё обо всём",
    score: 14,
    actionMode: "reply-if-open",
    actionLabel: "Ответить в теме, если разрешено правилами",
    safetyNote: "Отвечать взрослому публично; не запрашивать контакт ребёнка и не уводить в личку без приглашения.",
  },
  {
    id: "math-grade7-10503",
    observedAt: "8 августа 2026",
    subjectSlugs: ["math"],
    title: "Математика, 7 класс, офлайн",
    requestSummary: "Ищут очного преподавателя математики для семиклассника.",
    fitReason: "Свежий предметный сигнал, но запрос не про экзамен и требует очного совпадения.",
    publicPostUrl: "https://t.me/poisk_uchenikov/10503",
    originalPostUrl: "https://t.me/repetitori_uroki_studenti/80395",
    sourceName: "Репетиторы · уроки · студенты",
    score: 6,
    actionMode: "observe-only",
    actionLabel: "Не откликаться без точного совпадения",
    safetyNote: "Использовать как сигнал для будущего маршрута 5–8 классов, а не продавать неподходящую экзаменационную услугу.",
  },
  {
    id: "chinese-age18-10504",
    observedAt: "8 августа 2026",
    subjectSlugs: ["chinese"],
    title: "Китайский язык для ученика 18 лет",
    requestSummary: "Ищут преподавателя китайского для совершеннолетнего ученика.",
    fitReason: "Максимально свежий предметный запрос; перед предложением нужно уточнить цель и уровень.",
    publicPostUrl: "https://t.me/poisk_uchenikov/10504",
    originalPostUrl: "https://t.me/repetitori_uroki_studenti/80392",
    sourceName: "Репетиторы · уроки · студенты",
    score: 13,
    actionMode: "manager-first",
    actionLabel: "Уточнить актуальность у администратора",
    managerUrl: "https://t.me/HR_adminka",
    managerLabel: "@HR_adminka",
    safetyNote: "Не называть подготовкой к ЕГЭ, пока экзаменационная цель не подтверждена.",
  },
];

export type ClassTeacherPartnerRoute = {
  id: string;
  name: string;
  audience: string;
  sourceUrl: string;
  contactUrl: string;
  contactLabel: string;
  accessLabel: string;
  fitReason: string;
  script: string;
  rule: string;
};

const classTeacherChannels = [
  {
    id: "klassrukov-manager",
    name: "Классный руководитель | Школа",
    audience: "классные руководители и школьные педагоги",
    sourceUrl: "https://t.me/klassrukov",
    contactUrl: "https://t.me/school_teachers",
    contactLabel: "@school_teachers",
    accessLabel: "Опубликованный рекламный контакт",
    fitReason: "Прямой доступ к взрослой педагогической аудитории через администратора, без обхода правил канала.",
    rule: "Спросить формат, стоимость, маркировку и статистику. Не писать подписчикам канала.",
  },
  {
    id: "teacher35-manager",
    name: "Учительская | Педагоги РФ",
    audience: "учителя и классные руководители разных предметов",
    sourceUrl: "https://t.me/teacher_35",
    contactUrl: "https://t.me/school_teachers",
    contactLabel: "@school_teachers",
    accessLabel: "Опубликованный контакт по размещению",
    fitReason: "Можно тестировать один полезный предметный пилот и считать завершённые диагностики по отдельной ссылке.",
    rule: "Не обещать школе баллы и не просить контакты учеников; участие родителей добровольное.",
  },
  {
    id: "action-education-manager",
    name: "Действие | Образование",
    audience: "администрации школ, руководители и педагоги",
    sourceUrl: "https://t.me/action_obrazovanie",
    contactUrl: "https://t.me/polarightt",
    contactLabel: "@polarightt",
    accessLabel: "Опубликованный рекламный контакт",
    fitReason: "Подходит для предложения прозрачного школьного пилота через администрацию, а не личной комиссии педагогу.",
    rule: "Сначала отправить одностраничное описание пилота; коммерческие условия обсуждать только с уполномоченной стороной.",
  },
  {
    id: "vfkr-partnership",
    name: "Форум классных руководителей",
    audience: "региональные команды классных руководителей",
    sourceUrl: "https://t.me/vfkr_ru",
    contactUrl: "mailto:region.fkr@vfkr.ru",
    contactLabel: "region.fkr@vfkr.ru",
    accessLabel: "Официальный запрос о партнёрстве",
    fitReason: "Федеральная профессиональная площадка; возможен только методический или организационный диалог, не реклама в комментариях.",
    rule: "Не продавать участникам форума и не использовать имя проекта как одобрение. Запросить порядок рассмотрения образовательного пилота.",
  },
] as const;

type DemandProfile = {
  name: string;
  subjectSlug: ExamSubjectSlug;
  subjectName: string;
  leadMagnet: string;
};

export function buildTeacherDemandLeads(profile: Pick<DemandProfile, "subjectSlug">) {
  return recentDemandSignals
    .filter((signal) => signal.subjectSlugs.includes(profile.subjectSlug))
    .sort((a, b) => b.score - a.score || b.observedAt.localeCompare(a.observedAt))
    .slice(0, 6);
}

export function buildClassTeacherPartners(profile: DemandProfile): ClassTeacherPartnerRoute[] {
  return classTeacherChannels.map((channel) => ({
    ...channel,
    script: `Здравствуйте! Я представляю преподавателя ${profile.name}, предмет — ${profile.subjectName}. Не хочу писать участникам вашего канала в обход правил. Предлагаем бесплатный 20-минутный пилот для одного класса: «${profile.leadMagnet}». Родители подключаются добровольно по одной ссылке, контакты детей не передаются, классный руководитель получает только обезличенную сводку типовых затруднений. Скрытой комиссии педагогу нет; если пилот полезен, формат и коммерческое продолжение прозрачно согласуем с администрацией. Кому можно прислать одностраничное демо и какие у вас условия публикации или партнёрства?`,
  }));
}
