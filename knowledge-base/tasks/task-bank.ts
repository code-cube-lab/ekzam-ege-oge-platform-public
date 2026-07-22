export type ExamTrack = "oge" | "ege";
export type SubjectTrack = "russian" | "literature";

export type DailyTask = {
  key: string;
  exam: ExamTrack;
  subject: SubjectTrack;
  examYear: number;
  topic: string;
  title: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  skillHint: string;
  estimatedMinutes: number;
};

export type TopicStat = {
  mastery: number;
  errorCount: number;
  streak: number;
  nextReviewAt: string | null;
};

export const taskBank: DailyTask[] = [
  {
    key: "ege_rus_accent_call",
    exam: "ege", subject: "russian", examYear: 2026,
    topic: "Орфоэпия",
    title: "Ударение за 60 секунд",
    question: "В каком варианте ударение поставлено верно?",
    options: ["звОнит", "звонИт", "звонит (без отметки)"],
    correctIndex: 1,
    explanation: "Верно: звонИт. Во всех личных формах ударение остаётся на окончании: звонИшь, звонИт, звонЯт.",
    skillHint: "Произнесите вслух цепочку: звонИшь — звонИт — звонЯт.",
    estimatedMinutes: 3,
  },
  {
    key: "ege_rus_ne_participle",
    exam: "ege", subject: "russian", examYear: 2026,
    topic: "Орфография: НЕ",
    title: "НЕ без сомнений",
    question: "Выберите нормативное написание.",
    options: ["непрочитанная мною книга", "не прочитанная мною книга", "не-прочитанная мною книга"],
    correctIndex: 1,
    explanation: "У причастия есть зависимое слово «мною», поэтому НЕ пишется раздельно: не прочитанная мною книга.",
    skillHint: "Сначала определите часть речи и найдите зависимые слова, затем выбирайте правило.",
    estimatedMinutes: 4,
  },
  {
    key: "ege_rus_comma_definition",
    exam: "ege", subject: "russian", examYear: 2026,
    topic: "Пунктуация",
    title: "Граница оборота",
    question: "В каком предложении знаки расставлены верно?",
    options: ["Уставший после дороги он уснул.", "Уставший после дороги, он уснул.", "Уставший, после дороги он уснул."],
    correctIndex: 1,
    explanation: "Распространённое согласованное определение перед личным местоимением обособляется: «Уставший после дороги, он уснул».",
    skillHint: "После определения стоит личное местоимение «он» — это сигнал проверить обособление.",
    estimatedMinutes: 5,
  },
  {
    key: "oge_rus_grammar_base",
    exam: "oge", subject: "russian", examYear: 2026,
    topic: "Грамматическая основа",
    title: "Найдите основу",
    question: "Какая грамматическая основа в предложении «По вечерам становилось прохладно»?",
    options: ["по вечерам", "становилось прохладно", "вечерам становилось"],
    correctIndex: 1,
    explanation: "Это безличное предложение. Его грамматическая основа — «становилось прохладно».",
    skillHint: "Не ищите подлежащее любой ценой: сначала проверьте, может ли предложение быть безличным.",
    estimatedMinutes: 4,
  },
  {
    key: "oge_rus_syntax_link",
    exam: "oge", subject: "russian", examYear: 2026,
    topic: "Словосочетание",
    title: "Тип связи",
    question: "Какой тип подчинительной связи в словосочетании «говорить тихо»?",
    options: ["согласование", "управление", "примыкание"],
    correctIndex: 2,
    explanation: "Наречие «тихо» — неизменяемое слово, оно присоединяется к глаголу по смыслу. Это примыкание.",
    skillHint: "Если зависимое слово неизменяемое, первым делом проверяйте примыкание.",
    estimatedMinutes: 3,
  },
  {
    key: "oge_rus_expression_metaphor",
    exam: "oge", subject: "russian", examYear: 2026,
    topic: "Средства выразительности",
    title: "Узнайте приём",
    question: "Какое средство выразительности использовано в сочетании «лес уснул»?",
    options: ["олицетворение", "литота", "градация"],
    correctIndex: 0,
    explanation: "Лесу приписано действие живого существа — способность уснуть. Это олицетворение.",
    skillHint: "Спросите: получил ли неживой предмет действие или качество человека/живого существа?",
    estimatedMinutes: 3,
  },
  {
    key: "ege_lit_antithesis",
    exam: "ege", subject: "literature", examYear: 2026,
    topic: "Теория литературы",
    title: "Термин дня",
    question: "Как называется резкое противопоставление образов или понятий?",
    options: ["антитеза", "градация", "инверсия"],
    correctIndex: 0,
    explanation: "Антитеза строится на контрасте: свет — тьма, свобода — неволя. Градация усиливает признак, инверсия меняет порядок слов.",
    skillHint: "Запомните через приставку анти- — «против».",
    estimatedMinutes: 3,
  },
  {
    key: "ege_lit_essay_bridge",
    exam: "ege", subject: "literature", examYear: 2026,
    topic: "Аргументация сочинения",
    title: "Связка для анализа",
    question: "Какая фраза действительно объясняет связь примера с тезисом?",
    options: ["Вот такой пример.", "Этот эпизод показывает, что выбор героя основан на чувстве долга.", "Автор рассказывает историю."],
    correctIndex: 1,
    explanation: "Хорошая связка не просто называет пример, а формулирует, что именно он доказывает.",
    skillHint: "Используйте модель: «Этот эпизод показывает, что…» — и завершите её конкретным выводом.",
    estimatedMinutes: 5,
  },
  {
    key: "ege_lit_genre_drama",
    exam: "ege", subject: "literature", examYear: 2026,
    topic: "Роды и жанры",
    title: "Драматический текст",
    question: "Какой признак прежде всего отличает пьесу от эпического произведения?",
    options: ["деление на строфы", "основа в диалогах и ремарках", "обязательный рассказчик"],
    correctIndex: 1,
    explanation: "Пьеса предназначена для сценического воплощения: действие раскрывается через реплики персонажей и авторские ремарки.",
    skillHint: "Ищите форму речи и способ показа действия, а не только тему произведения.",
    estimatedMinutes: 4,
  },
  {
    key: "oge_lit_epithet",
    exam: "oge", subject: "literature", examYear: 2026,
    topic: "Изобразительные средства",
    title: "Точное определение",
    question: "Какой термин обозначает образное художественное определение?",
    options: ["эпитет", "анафора", "оксюморон"],
    correctIndex: 0,
    explanation: "Эпитет — образное определение, которое выражает авторскую оценку и делает признак художественно значимым.",
    skillHint: "Не каждое прилагательное — эпитет: ищите образность и авторскую оценку.",
    estimatedMinutes: 3,
  },
  {
    key: "oge_lit_character_evidence",
    exam: "oge", subject: "literature", examYear: 2026,
    topic: "Анализ героя",
    title: "Аргумент о герое",
    question: "Какой ответ лучше доказывает черту характера героя?",
    options: ["Герой добрый, потому что он хороший.", "Герой проявляет сострадание: он отказывается от выгоды, чтобы помочь другому.", "Мне понравился этот герой."],
    correctIndex: 1,
    explanation: "Черта характера доказана конкретным поступком и объяснена, а не просто названа.",
    skillHint: "Формула: черта → поступок или деталь → вывод о герое.",
    estimatedMinutes: 5,
  },
  {
    key: "oge_lit_comparison",
    exam: "oge", subject: "literature", examYear: 2026,
    topic: "Сопоставление",
    title: "Основа сопоставления",
    question: "С чего начинается точное сопоставление двух произведений?",
    options: ["с пересказа обоих текстов", "с общего критерия и тезиса о сходстве или различии", "с перечисления фамилий авторов"],
    correctIndex: 1,
    explanation: "Сначала задают единое основание сравнения, затем подтверждают сходство или различие деталями обоих текстов.",
    skillHint: "Сформулируйте одну ось сравнения: тема, конфликт, герой, мотив или авторская позиция.",
    estimatedMinutes: 5,
  },
];

export function chooseDailyTask(
  weakTopics: string[],
  telegramId: string,
  exam: ExamTrack = "ege",
  subject: SubjectTrack = "russian",
  stats: Record<string, TopicStat> = {},
  excludeKey?: string,
) {
  const trackTasks = taskBank.filter((task) => task.exam === exam && task.subject === subject);
  const candidates = trackTasks.filter((task) => task.key !== excludeKey);
  const pool = candidates.length ? candidates : trackTasks;
  const today = new Date().toISOString().slice(0, 10);

  const scored = pool.map((task) => {
    const stat = stats[task.topic];
    const weak = weakTopics.includes(task.topic);
    const due = Boolean(stat?.nextReviewAt && stat.nextReviewAt <= today);
    const mastery = stat?.mastery ?? 0.5;
    const score = (weak ? 40 : 0) + (due ? 25 : 0) + (1 - mastery) * 20 + Math.min(stat?.errorCount ?? 0, 5) * 4;
    return { task, score };
  });
  const maxScore = Math.max(...scored.map((item) => item.score));
  const priority = scored.filter((item) => item.score === maxScore).map((item) => item.task);
  const day = Math.floor(Date.now() / 86400000);
  const salt = [...telegramId].reduce((total, char) => total + char.charCodeAt(0), 0);
  return priority[(day + salt) % priority.length] ?? trackTasks[0];
}

export function findTask(key: string) {
  return taskBank.find((task) => task.key === key) ?? null;
}

export function trackLabel(exam: ExamTrack, subject: SubjectTrack) {
  const subjectLabel = subject === "russian" ? "Русский язык" : "Литература";
  return `${exam.toUpperCase()} · ${subjectLabel}`;
}
