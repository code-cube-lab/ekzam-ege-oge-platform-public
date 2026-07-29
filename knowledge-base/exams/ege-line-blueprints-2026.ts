import type { ExamSubjectSlug } from "./exam-subjects";

export type EgeResponseMode =
  | "short-number"
  | "short-text"
  | "matching"
  | "multiple"
  | "extended"
  | "file-answer"
  | "oral";

export type EgeResourceMode =
  | "none"
  | "text"
  | "table"
  | "diagram"
  | "image"
  | "map"
  | "audio"
  | "dataset"
  | "spreadsheet"
  | "document"
  | "code"
  | "literary-text";

export type EgeLineBlueprint = {
  line: number;
  section: string;
  skill: string;
  response: EgeResponseMode;
  resource: EgeResourceMode;
  maxScore: number;
  review: "automatic" | "teacher";
};

export type EgeSubjectBlueprint = {
  subject: ExamSubjectSlug;
  title: string;
  taskCount: number;
  durationMinutes: number;
  officialArchive: string;
  lines: EgeLineBlueprint[];
};

const sourceBase = "https://doc.fipi.ru/ege/demoversii-specifikacii-kodifikatory/2026";

function line(
  lineNumber: number,
  section: string,
  skill: string,
  response: EgeResponseMode,
  resource: EgeResourceMode,
  maxScore = 1,
): EgeLineBlueprint {
  return {
    line: lineNumber,
    section,
    skill,
    response,
    resource,
    maxScore,
    review: response === "extended" || response === "oral" ? "teacher" : "automatic",
  };
}

const russianLines: EgeLineBlueprint[] = [
  line(1, "Работа с текстом", "самостоятельный подбор средства связи", "short-text", "text"),
  line(2, "Работа с текстом", "лексическое значение слова в контексте", "multiple", "text"),
  line(3, "Работа с текстом", "стилистический анализ текста", "multiple", "text"),
  line(4, "Орфоэпия", "нормы постановки ударения", "multiple", "none"),
  line(5, "Лексические нормы", "употребление паронимов", "short-text", "text"),
  line(6, "Лексические нормы", "устранение речевой избыточности", "short-text", "text"),
  line(7, "Морфологические нормы", "исправление формы слова", "short-text", "text"),
  line(8, "Синтаксические нормы", "установление соответствия между ошибкой и предложением", "matching", "text", 3),
  line(9, "Орфография", "безударные и чередующиеся гласные корня", "multiple", "text"),
  line(10, "Орфография", "приставки и буквы после приставок", "multiple", "text"),
  line(11, "Орфография", "суффиксы разных частей речи", "multiple", "text"),
  line(12, "Орфография", "личные окончания глаголов и суффиксы причастий", "multiple", "text"),
  line(13, "Орфография", "слитное и раздельное написание НЕ", "multiple", "text"),
  line(14, "Орфография", "слитное, раздельное и дефисное написание", "multiple", "text"),
  line(15, "Орфография", "Н и НН", "multiple", "text"),
  line(16, "Пунктуация", "знаки в простом осложнённом и сложносочинённом предложении", "multiple", "text"),
  line(17, "Пунктуация", "обособленные определения и обстоятельства", "multiple", "text"),
  line(18, "Пунктуация", "вводные слова и обращения", "multiple", "text"),
  line(19, "Пунктуация", "сложноподчинённое предложение", "multiple", "text"),
  line(20, "Пунктуация", "сложное предложение с разными видами связи", "multiple", "text"),
  line(21, "Пунктуационный анализ", "одинаковое пунктуационное правило", "multiple", "text"),
  line(22, "Текст", "соответствие примеров и средств выразительности", "matching", "text", 3),
  line(23, "Текст", "содержание и фактическая информация", "multiple", "text"),
  line(24, "Текст", "типы речи и логика изложения", "multiple", "text"),
  line(25, "Лексика", "фразеологизм в исходном тексте", "short-text", "text"),
  line(26, "Связность текста", "средства связи предложений", "short-number", "text"),
  line(27, "Сочинение", "комментарий к позиции автора и собственное отношение", "extended", "text", 22),
];

const mathLines: EgeLineBlueprint[] = [
  line(1, "Часть 1", "планиметрия", "short-number", "diagram"),
  line(2, "Часть 1", "векторы", "short-number", "diagram"),
  line(3, "Часть 1", "стереометрия", "short-number", "diagram"),
  line(4, "Часть 1", "вероятность случайного события", "short-number", "none"),
  line(5, "Часть 1", "формулы вероятности", "short-number", "none"),
  line(6, "Часть 1", "уравнения", "short-number", "none"),
  line(7, "Часть 1", "преобразование выражений", "short-number", "none"),
  line(8, "Часть 1", "функции и производная", "short-number", "diagram"),
  line(9, "Часть 1", "прикладная задача по формуле", "short-number", "none"),
  line(10, "Часть 1", "текстовая задача", "short-number", "none"),
  line(11, "Часть 1", "графики и уравнения", "short-number", "diagram"),
  line(12, "Часть 1", "наибольшее и наименьшее значение функции", "short-number", "none"),
  line(13, "Часть 2", "уравнение и отбор корней", "extended", "none", 2),
  line(14, "Часть 2", "стереометрия с доказательством", "extended", "diagram", 3),
  line(15, "Часть 2", "неравенство", "extended", "none", 2),
  line(16, "Часть 2", "финансовая математика", "extended", "table", 2),
  line(17, "Часть 2", "планиметрия с доказательством", "extended", "diagram", 3),
  line(18, "Часть 2", "задача с параметром", "extended", "diagram", 4),
  line(19, "Часть 2", "теория чисел и доказательство", "extended", "none", 4),
];

const physicsSkills = [
  ["Механика", "кинематика", "short-number", "diagram", 1],
  ["Механика", "динамика", "short-number", "diagram", 1],
  ["Механика", "законы сохранения", "short-number", "diagram", 1],
  ["Механика", "механические колебания и волны", "short-number", "diagram", 1],
  ["Механика", "множественный выбор по механическому процессу", "multiple", "diagram", 2],
  ["Механика", "соответствие величин и их изменения", "matching", "diagram", 2],
  ["Молекулярная физика", "молекулярно-кинетическая теория", "short-number", "diagram", 1],
  ["Молекулярная физика", "термодинамика", "short-number", "diagram", 1],
  ["Молекулярная физика", "множественный выбор по тепловому процессу", "multiple", "diagram", 2],
  ["Молекулярная физика", "соответствие параметров процесса", "matching", "diagram", 2],
  ["Электродинамика", "электрическое поле", "short-number", "diagram", 1],
  ["Электродинамика", "постоянный ток", "short-number", "diagram", 1],
  ["Электродинамика", "магнитное поле и индукция", "short-number", "diagram", 1],
  ["Электродинамика", "множественный выбор по электромагнитному процессу", "multiple", "diagram", 2],
  ["Электродинамика", "соответствие формул и зависимостей", "matching", "diagram", 2],
  ["Оптика", "геометрическая и волновая оптика", "short-number", "diagram", 1],
  ["Оптика", "соответствие оптических величин", "matching", "diagram", 2],
  ["Квантовая физика", "фотоэффект и атомная физика", "multiple", "diagram", 2],
  ["Квантовая физика", "ядерные реакции", "short-number", "none", 1],
  ["Методы физики", "эксперимент и измерения", "multiple", "table", 1],
  ["Часть 2", "качественная задача", "extended", "diagram", 3],
  ["Часть 2", "расчётная задача по механике", "extended", "diagram", 2],
  ["Часть 2", "расчётная задача по молекулярной физике", "extended", "diagram", 2],
  ["Часть 2", "расчётная задача по электродинамике", "extended", "diagram", 3],
  ["Часть 2", "расчётная задача по оптике или квантовой физике", "extended", "diagram", 3],
  ["Часть 2", "планирование физического эксперимента", "extended", "table", 4],
] as const;

const chemistrySkills = [
  "строение атома и валентные электроны",
  "периодический закон и свойства элементов",
  "электроотрицательность и степень окисления",
  "химическая связь и кристаллическая решётка",
  "классификация и номенклатура неорганических веществ",
  "свойства неорганических веществ и качественные реакции",
  "свойства металлов и неметаллов",
  "неорганические превращения",
  "генетическая связь неорганических веществ",
  "классификация и номенклатура органических веществ",
  "строение и изомерия органических соединений",
  "свойства углеводородов и кислородсодержащих соединений",
  "биологически важные органические вещества",
  "свойства углеводородов и механизмы реакций",
  "свойства кислородсодержащих соединений",
  "генетическая связь органических веществ",
  "классификация химических реакций",
  "скорость реакции",
  "окислительно-восстановительные реакции",
  "электролиз",
  "гидролиз солей и pH",
  "химическое равновесие",
  "стехиометрия обратимых реакций",
  "идентификация веществ",
  "химия в жизни, промышленности и экологии",
  "массовая доля и молярная концентрация",
  "тепловой эффект реакции",
  "избыток, примеси и выход продукта",
  "ОВР с электронным балансом",
  "ионные реакции",
  "цепочка неорганических превращений",
  "цепочка органических превращений",
  "установление формулы органического вещества",
  "комбинированная расчётная задача",
];

const biologySkills = [
  ["Биология как наука", "работа с таблицей", "short-text", "table", 1],
  ["Методы биологии", "множественный выбор", "multiple", "text", 2],
  ["Общая биология", "биологическая расчётная задача", "short-number", "none", 1],
  ["Генетика", "моно- и дигибридное скрещивание", "short-number", "diagram", 1],
  ["Клетка и организм", "анализ рисунка", "short-text", "image", 1],
  ["Клетка и организм", "установление соответствия", "matching", "image", 2],
  ["Клетка и организм", "множественный выбор", "multiple", "image", 2],
  ["Клетка и организм", "установление последовательности", "matching", "none", 2],
  ["Многообразие организмов", "распознавание объекта", "short-text", "image", 1],
  ["Многообразие организмов", "установление соответствия", "matching", "image", 2],
  ["Многообразие организмов", "множественный выбор", "multiple", "image", 2],
  ["Систематика", "установление последовательности таксонов", "matching", "none", 2],
  ["Человек", "анализ рисунка", "short-text", "image", 1],
  ["Человек", "установление соответствия", "matching", "diagram", 2],
  ["Человек", "множественный выбор", "multiple", "text", 2],
  ["Человек", "установление последовательности", "matching", "none", 2],
  ["Эволюция", "множественный выбор по тексту", "multiple", "text", 2],
  ["Экология", "множественный выбор", "multiple", "diagram", 2],
  ["Эволюция и экология", "установление соответствия", "matching", "text", 2],
  ["Общебиологические закономерности", "работа с таблицей", "matching", "table", 2],
  ["Экспериментальные данные", "анализ таблицы или графика", "multiple", "table", 2],
  ["Часть 2", "методология эксперимента", "extended", "table", 3],
  ["Часть 2", "выводы и прогноз по эксперименту", "extended", "table", 3],
  ["Часть 2", "анализ биологического объекта", "extended", "image", 3],
  ["Часть 2", "человек и многообразие организмов", "extended", "text", 3],
  ["Часть 2", "общая биология в новой ситуации", "extended", "text", 3],
  ["Часть 2", "задача по цитологии и эволюции", "extended", "none", 3],
  ["Часть 2", "генетическая задача", "extended", "diagram", 3],
] as const;

const informaticsSkills = [
  ["Информационные модели", "схемы, карты, таблицы и графы", "short-number", "diagram", 1],
  ["Логика", "таблицы истинности", "short-text", "table", 1],
  ["Базы данных", "поиск в реляционной базе", "file-answer", "spreadsheet", 1],
  ["Кодирование", "кодирование и декодирование информации", "short-text", "table", 1],
  ["Алгоритмы", "формальный исполнитель", "short-number", "diagram", 1],
  ["Алгоритмы", "результат работы программы", "short-number", "code", 1],
  ["Информация", "объём графической и звуковой информации", "short-number", "none", 1],
  ["Информация", "измерение количества информации", "short-number", "none", 1],
  ["Электронные таблицы", "обработка числовых данных", "file-answer", "spreadsheet", 1],
  ["Текстовый процессор", "информационный поиск в документе", "file-answer", "document", 1],
  ["Информация", "информационный объём сообщения", "short-number", "none", 1],
  ["Исполнители", "алгоритм для исполнителя", "short-number", "diagram", 1],
  ["Сети", "маска подсети", "short-number", "none", 1],
  ["Системы счисления", "позиционные системы счисления", "short-number", "none", 1],
  ["Логика", "законы математической логики", "short-number", "none", 1],
  ["Алгоритмы", "рекуррентные выражения", "short-number", "code", 1],
  ["Программирование", "обработка числовой последовательности", "file-answer", "dataset", 1],
  ["Электронные таблицы", "обработка целочисленных данных", "file-answer", "spreadsheet", 1],
  ["Теория игр", "анализ логической игры", "short-number", "none", 1],
  ["Теория игр", "выигрышная стратегия", "short-number", "none", 1],
  ["Теория игр", "дерево игры", "short-number", "diagram", 1],
  ["Моделирование", "многопроцессорная обработка", "file-answer", "spreadsheet", 1],
  ["Алгоритмы", "анализ хода исполнения алгоритма", "short-number", "code", 1],
  ["Программирование", "обработка символьной информации", "file-answer", "dataset", 1],
  ["Программирование", "обработка целочисленной информации", "file-answer", "code", 1],
  ["Программирование", "сортировка и обработка данных", "file-answer", "dataset", 2],
  ["Анализ данных", "полный цикл обработки набора данных", "file-answer", "dataset", 2],
] as const;

const historySkills = [
  ["Часть 1", "соответствие событий и дат", "matching", "table", 2],
  ["Часть 1", "хронологическая последовательность", "matching", "table", 1],
  ["Часть 1", "соответствие процессов и фактов", "matching", "table", 2],
  ["Часть 1", "заполнение исторической таблицы", "matching", "table", 3],
  ["Часть 1", "исторические деятели", "matching", "table", 2],
  ["Часть 1", "письменный исторический источник", "multiple", "text", 2],
  ["Часть 1", "история культуры", "matching", "image", 2],
  ["Часть 1", "изображение о Великой Отечественной войне", "short-number", "image", 1],
  ["Часть 1", "атрибуция исторической карты", "short-text", "map", 1],
  ["Часть 1", "поиск объекта на исторической карте", "short-text", "map", 1],
  ["Часть 1", "соотнесение карты и текста", "short-text", "map", 1],
  ["Часть 1", "множественный выбор по карте", "multiple", "map", 2],
  ["Часть 2", "атрибуция письменного источника", "extended", "text", 2],
  ["Часть 2", "поиск информации в источнике", "extended", "text", 2],
  ["Часть 2", "атрибуция изображения", "extended", "image", 2],
  ["Часть 2", "контекст изображения", "extended", "image", 2],
  ["Часть 2", "источник о Великой Отечественной войне", "extended", "text", 3],
  ["Часть 2", "причинно-следственные связи", "extended", "text", 3],
  ["Часть 2", "историческое понятие и факт", "extended", "none", 2],
  ["Часть 2", "сравнение исторических процессов", "extended", "table", 3],
  ["Часть 2", "аргументация точки зрения", "extended", "text", 3],
] as const;

const geographySkills = [
  "карта как источник информации",
  "атмосфера и климат",
  "агроклиматические ресурсы",
  "гидросфера и рельеф",
  "природные комплексы и страны",
  "размещение населения России",
  "занятость населения и мировое хозяйство",
  "воспроизводство населения и качество жизни",
  "отрасли международной специализации",
  "население и хозяйство России",
  "климатическая карта",
  "демография, миграции и интеграция",
  "геологическая хронология",
  "определение пункта по карте",
  "ресурсообеспеченность",
  "динамика населения России",
  "страны мира и государственное устройство",
  "географические районы России",
  "городское и сельское расселение",
  "урбанизация",
  "анализ географического текста",
  "поиск информации в источнике",
  "географическое объяснение",
  "качество жизни населения",
  "сельское хозяйство мира",
  "причинно-следственные связи",
  "оценка последствий процесса",
  "построение профиля по карте",
  "комплексная географическая задача",
];

const socialSkills = [
  "термин по признакам",
  "человек и духовная культура: связи и классификация",
  "человек и общество: существенные признаки",
  "анализ социальной ситуации",
  "экономика: связи и классификация",
  "экономика: множественный выбор",
  "экономическая ситуация и финансовая грамотность",
  "социальные отношения",
  "анализ диаграммы",
  "политика: связи и классификация",
  "политическая ситуация",
  "Конституция Российской Федерации: права и обязанности",
  "органы государственной власти",
  "право: связи и классификация",
  "право: множественный выбор",
  "правовая ситуация",
  "поиск информации в обществоведческом тексте",
  "объяснение положения текста",
  "понятие, признаки и примеры",
  "теоретическое объяснение социальной проблемы",
  "финансовая грамотность: расчёт и объяснение",
  "определение понятия и предложения о его признаках",
  "Конституция и государственная власть",
  "сложный план",
  "мини-сочинение по составному заданию",
];

const literatureLines: EgeLineBlueprint[] = [
  line(1, "Эпос, лироэпос или драма", "литературоведческий термин", "short-text", "literary-text"),
  line(2, "Эпос, лироэпос или драма", "сюжет, герой или деталь", "short-text", "literary-text"),
  line(3, "Эпос, лироэпос или драма", "анализ фрагмента", "short-text", "literary-text"),
  line(4, "Эпос, лироэпос или драма", "развёрнутый анализ по одному из двух вопросов", "extended", "literary-text", 4),
  line(5, "Эпос, лироэпос или драма", "сопоставительный анализ", "extended", "literary-text", 7),
  line(6, "Лирика", "литературоведческий термин", "short-text", "literary-text"),
  line(7, "Лирика", "изобразительно-выразительное средство", "short-text", "literary-text"),
  line(8, "Лирика", "размер, рифмовка или композиция", "short-text", "literary-text"),
  line(9, "Лирика", "развёрнутый анализ по одному из двух вопросов", "extended", "literary-text", 4),
  line(10, "Лирика", "сопоставительный анализ", "extended", "literary-text", 7),
  line(11, "Сочинение", "сочинение по одной из пяти тем", "extended", "literary-text", 20),
];

function makeForeignLines(): EgeLineBlueprint[] {
  const result: EgeLineBlueprint[] = [
    line(1, "Аудирование", "понимание основного содержания", "matching", "audio", 2),
    line(2, "Аудирование", "поиск запрашиваемой информации", "matching", "audio", 3),
  ];
  for (let number = 3; number <= 9; number += 1) {
    result.push(line(number, "Аудирование", "полное понимание аудиотекста", "short-number", "audio"));
  }
  result.push(
    line(10, "Чтение", "понимание основного содержания текстов", "matching", "text", 3),
    line(11, "Чтение", "структурно-смысловые связи в тексте", "matching", "text", 2),
  );
  for (let number = 12; number <= 18; number += 1) {
    result.push(line(number, "Чтение", "полное понимание письменного текста", "short-number", "text"));
  }
  for (let number = 19; number <= 24; number += 1) {
    result.push(line(number, "Грамматика", "грамматическое преобразование слова", "short-text", "text"));
  }
  for (let number = 25; number <= 29; number += 1) {
    result.push(line(number, "Словообразование", "образование однокоренного слова", "short-text", "text"));
  }
  for (let number = 30; number <= 36; number += 1) {
    result.push(line(number, "Лексика и грамматика", "выбор слова по контексту", "short-number", "text"));
  }
  result.push(
    line(37, "Письменная речь", "личное электронное письмо 100–140 слов", "extended", "text", 6),
    line(38, "Письменная речь", "высказывание по таблице или диаграмме 200–250 слов", "extended", "table", 14),
    line(39, "Говорение", "чтение текста вслух", "oral", "text", 1),
    line(40, "Говорение", "условный диалог-расспрос", "oral", "image", 4),
    line(41, "Говорение", "интервью: развёрнутые ответы", "oral", "audio", 5),
    line(42, "Говорение", "монолог по фотографиям проекта", "oral", "image", 10),
  );
  return result;
}

const chineseLines: EgeLineBlueprint[] = [
  line(1, "Аудирование", "понимание основного содержания", "matching", "audio", 6),
  ...Array.from({ length: 8 }, (_, index) => line(index + 2, "Аудирование", "поиск запрашиваемой информации", "short-number", "audio")),
  line(10, "Чтение", "понимание основного содержания", "matching", "text", 6),
  line(11, "Чтение", "структурно-смысловые связи", "matching", "text", 4),
  ...Array.from({ length: 3 }, (_, index) => line(index + 12, "Чтение", "поиск запрашиваемой информации", "short-number", "text")),
  line(15, "Грамматика, лексика и иероглифика", "пиньинь и тональная система", "short-number", "text"),
  line(16, "Грамматика, лексика и иероглифика", "счётные слова", "short-number", "text"),
  line(17, "Грамматика, лексика и иероглифика", "лексическая сочетаемость", "short-number", "text"),
  line(18, "Грамматика, лексика и иероглифика", "предложные и сравнительные конструкции", "short-number", "text"),
  line(19, "Грамматика, лексика и иероглифика", "числительные", "short-number", "text"),
  line(20, "Грамматика, лексика и иероглифика", "аспектуальные суффиксы 了, 过, 着", "short-number", "text"),
  line(21, "Грамматика, лексика и иероглифика", "частицы 的, 得, 地", "short-number", "text"),
  line(22, "Грамматика, лексика и иероглифика", "наречия 还, 再, 又, 就, 才, 刚", "short-number", "text"),
  line(23, "Грамматика, лексика и иероглифика", "результативные морфемы", "short-number", "text"),
  line(24, "Грамматика, лексика и иероглифика", "дополнительный элемент возможности", "short-number", "text"),
  line(25, "Грамматика, лексика и иероглифика", "модификатор направления", "short-number", "text"),
  line(26, "Грамматика, лексика и иероглифика", "порядок слов и типы предложений", "short-number", "text"),
  line(27, "Грамматика, лексика и иероглифика", "сложные грамматические конструкции", "short-number", "text"),
  line(28, "Письменная речь", "личное электронное письмо", "extended", "text", 8),
  line(29, "Письменная речь", "высказывание «Моё мнение»", "extended", "text", 12),
  line(30, "Говорение", "условный диалог-расспрос", "oral", "image", 5),
  line(31, "Говорение", "описание выбранной фотографии", "oral", "image", 7),
  line(32, "Говорение", "обоснование выбора иллюстраций к проекту", "oral", "image", 8),
];

export const egeBlueprints2026: Record<ExamSubjectSlug, EgeSubjectBlueprint> = {
  russian: { subject: "russian", title: "Русский язык", taskCount: 27, durationMinutes: 210, officialArchive: `${sourceBase}/ru_11_2026.zip`, lines: russianLines },
  math: { subject: "math", title: "Математика, профильный уровень", taskCount: 19, durationMinutes: 235, officialArchive: `${sourceBase}/ma_11_2026.zip`, lines: mathLines },
  physics: { subject: "physics", title: "Физика", taskCount: 26, durationMinutes: 235, officialArchive: `${sourceBase}/fi_11_2026.zip`, lines: physicsSkills.map((item, index) => line(index + 1, item[0], item[1], item[2], item[3], item[4])) },
  chemistry: { subject: "chemistry", title: "Химия", taskCount: 34, durationMinutes: 210, officialArchive: `${sourceBase}/hi_11_2026.zip`, lines: chemistrySkills.map((skill, index) => line(index + 1, index < 28 ? "Часть 1" : "Часть 2", skill, index < 28 ? ([5, 6, 7, 13, 14, 21, 22, 23].includes(index) ? "matching" : "short-number") : "extended", index === 23 ? "table" : "none", index < 28 ? ([5, 6, 7, 13, 14, 21, 22, 23].includes(index) ? 2 : 1) : [2, 2, 4, 5, 3, 4][index - 28])) },
  informatics: { subject: "informatics", title: "Информатика", taskCount: 27, durationMinutes: 235, officialArchive: `${sourceBase}/inf_11_2026.zip`, lines: informaticsSkills.map((item, index) => line(index + 1, item[0], item[1], item[2], item[3], item[4])) },
  biology: { subject: "biology", title: "Биология", taskCount: 28, durationMinutes: 235, officialArchive: `${sourceBase}/bi_11_2026.zip`, lines: biologySkills.map((item, index) => line(index + 1, item[0], item[1], item[2], item[3], item[4])) },
  history: { subject: "history", title: "История", taskCount: 21, durationMinutes: 210, officialArchive: `${sourceBase}/is_11_2026.zip`, lines: historySkills.map((item, index) => line(index + 1, item[0], item[1], item[2], item[3], item[4])) },
  geography: { subject: "geography", title: "География", taskCount: 29, durationMinutes: 180, officialArchive: `${sourceBase}/gg_11_2026.zip`, lines: geographySkills.map((skill, index) => line(index + 1, index < 21 ? "Часть 1" : "Часть 2", skill, index < 21 ? ([4, 11].includes(index) ? "matching" : "short-number") : "extended", [0, 4, 10, 13, 27].includes(index) ? "map" : [6, 7, 8, 9, 11, 14, 15, 18, 19, 20, 21, 22, 23, 24].includes(index) ? "table" : "text", index < 21 ? ([4, 11].includes(index) ? 2 : 1) : index < 23 ? 1 : index === 28 ? 3 : 2)) },
  social: { subject: "social", title: "Обществознание", taskCount: 25, durationMinutes: 210, officialArchive: `${sourceBase}/ob_11_2026.zip`, lines: socialSkills.map((skill, index) => line(index + 1, index < 16 ? "Часть 1" : "Часть 2", skill, index < 16 ? (index === 0 || index === 8 || index === 11 ? "short-text" : "multiple") : "extended", index === 8 ? "table" : index >= 16 && index <= 20 ? "text" : "none", index < 16 ? [1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 2][index] : [2, 2, 3, 3, 3, 4, 3, 4, 6][index - 16])) },
  literature: { subject: "literature", title: "Литература", taskCount: 11, durationMinutes: 235, officialArchive: `${sourceBase}/li_11_2026.zip`, lines: literatureLines },
  english: { subject: "english", title: "Английский язык", taskCount: 42, durationMinutes: 207, officialArchive: `${sourceBase}/aya_11_2026.zip`, lines: makeForeignLines() },
  german: { subject: "german", title: "Немецкий язык", taskCount: 42, durationMinutes: 207, officialArchive: `${sourceBase}/nya_11_2026.zip`, lines: makeForeignLines() },
  french: { subject: "french", title: "Французский язык", taskCount: 42, durationMinutes: 207, officialArchive: `${sourceBase}/fya_11_2026.zip`, lines: makeForeignLines() },
  spanish: { subject: "spanish", title: "Испанский язык", taskCount: 42, durationMinutes: 207, officialArchive: `${sourceBase}/iya_11_2026.zip`, lines: makeForeignLines() },
  chinese: { subject: "chinese", title: "Китайский язык", taskCount: 32, durationMinutes: 194, officialArchive: `${sourceBase}/kya_11_2026.zip`, lines: chineseLines },
};

export function getEgeBlueprint2026(subject: ExamSubjectSlug) {
  return egeBlueprints2026[subject];
}
