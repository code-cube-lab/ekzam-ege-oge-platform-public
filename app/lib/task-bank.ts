export type DailyTask = {
  key: string;
  topic: string;
  title: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  skillHint: string;
};

export const taskBank: DailyTask[] = [
  {
    key: "accent_call",
    topic: "Орфоэпия",
    title: "Ударение за 60 секунд",
    question: "В каком варианте ударение поставлено верно?",
    options: ["звОнит", "звонИт", "звонит́"],
    correctIndex: 1,
    explanation: "Верно: звонИт. Во всех личных формах глагола ударение сохраняется на окончании: звонИшь, звонИт, звонЯт.",
    skillHint: "Произнесите вслух три формы: звонИшь — звонИт — звонЯт.",
  },
  {
    key: "ne_participle",
    topic: "Слитное и раздельное написание НЕ",
    title: "НЕ без сомнений",
    question: "Выберите нормативное написание.",
    options: ["непрочитанная мною книга", "не прочитанная мною книга", "не-прочитанная мною книга"],
    correctIndex: 1,
    explanation: "При причастии есть зависимое слово «мною», поэтому НЕ пишется раздельно: не прочитанная мною книга.",
    skillHint: "Сначала ищите зависимое слово, затем выбирайте правило.",
  },
  {
    key: "comma_definition",
    topic: "Пунктуация",
    title: "Одна запятая",
    question: "В каком предложении знаки расставлены верно?",
    options: ["Уставший после дороги он уснул.", "Уставший после дороги, он уснул.", "Уставший, после дороги он уснул."],
    correctIndex: 1,
    explanation: "Распространённое согласованное определение перед личным местоимением обособляется: «Уставший после дороги, он уснул».",
    skillHint: "Увидели личное местоимение после определения — проверьте обособление.",
  },
  {
    key: "literature_antithesis",
    topic: "Теория литературы",
    title: "Термин дня",
    question: "Как называется резкое противопоставление образов или понятий?",
    options: ["Антитеза", "Градация", "Инверсия"],
    correctIndex: 0,
    explanation: "Антитеза строится на контрасте: свет — тьма, свобода — неволя. Градация усиливает признак, инверсия меняет порядок слов.",
    skillHint: "Запомните через корень: анти- означает «против».",
  },
  {
    key: "essay_bridge",
    topic: "Аргументация сочинения",
    title: "Связка для сочинения",
    question: "Какая фраза объясняет связь примера с тезисом?",
    options: ["Вот такой пример.", "Этот эпизод показывает, что выбор героя основан на чувстве долга.", "Автор рассказывает историю."],
    correctIndex: 1,
    explanation: "Хорошая связка не просто называет пример, а формулирует, что именно он доказывает.",
    skillHint: "Используйте конструкцию: «Этот пример показывает, что…».",
  },
];

export function chooseDailyTask(weakTopics: string[], telegramId: string, date = new Date()) {
  const priority = taskBank.filter((task) => weakTopics.includes(task.topic));
  const pool = priority.length ? priority : taskBank;
  const day = Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86400000);
  const userSalt = [...telegramId].reduce((total, char) => total + char.charCodeAt(0), 0);
  return pool[(day + userSalt) % pool.length];
}

export function findTask(key: string) {
  return taskBank.find((task) => task.key === key) ?? null;
}
