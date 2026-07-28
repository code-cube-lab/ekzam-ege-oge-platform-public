export const examSubjectSlugs = [
  "russian", "math", "informatics", "physics", "chemistry",
  "biology", "history", "social", "geography", "literature",
  "english", "german", "french", "spanish", "chinese",
] as const;

export type ExamSubjectSlug = (typeof examSubjectSlugs)[number];

export type ExamSubject = {
  slug: ExamSubjectSlug;
  name: string;
  shortName: string;
  exam: string;
  ogeAvailable: boolean;
  availability: string;
  fullTaskCount: number;
  durationMinutes: number;
  egePartCount: number;
  ogeTaskCount?: number;
  ogeDurationMinutes?: number;
  ogePartCount?: number;
  focus: string[];
  teacherSkillSlug?: string;
};

export const examSubjects: ExamSubject[] = [
  { slug: "russian", name: "Русский язык", shortName: "Русский", exam: "обязательный ЕГЭ и ОГЭ", ogeAvailable: true, availability: "27 заданий полного варианта", fullTaskCount: 27, durationMinutes: 210, egePartCount: 2, ogeTaskCount: 13, ogeDurationMinutes: 235, ogePartCount: 3, focus: ["орфография", "пунктуация", "сочинение"], teacherSkillSlug: "russian-ege-mikhaylichenko" },
  { slug: "math", name: "Математика", shortName: "Математика", exam: "профильный ЕГЭ", ogeAvailable: true, availability: "19 заданий полного варианта", fullTaskCount: 19, durationMinutes: 235, egePartCount: 2, ogeTaskCount: 25, ogeDurationMinutes: 235, ogePartCount: 2, focus: ["алгебра", "геометрия", "практические задачи"], teacherSkillSlug: "math-ege-dedov" },
  { slug: "informatics", name: "Информатика", shortName: "Информатика", exam: "компьютерный ЕГЭ", ogeAvailable: true, availability: "27 заданий полного варианта", fullTaskCount: 27, durationMinutes: 235, egePartCount: 3, ogeTaskCount: 16, ogeDurationMinutes: 150, ogePartCount: 2, focus: ["алгоритмы", "логика", "программирование"], teacherSkillSlug: "informatics-ege-khanov" },
  { slug: "physics", name: "Физика", shortName: "Физика", exam: "ЕГЭ по выбору", ogeAvailable: true, availability: "26 заданий полного варианта", fullTaskCount: 26, durationMinutes: 235, egePartCount: 2, ogeTaskCount: 22, ogeDurationMinutes: 180, ogePartCount: 2, focus: ["механика", "электричество", "квантовая физика"], teacherSkillSlug: "physics-ege-levinskaya" },
  { slug: "chemistry", name: "Химия", shortName: "Химия", exam: "ЕГЭ по выбору", ogeAvailable: true, availability: "34 задания полного варианта", fullTaskCount: 34, durationMinutes: 210, egePartCount: 2, ogeTaskCount: 23, ogeDurationMinutes: 180, ogePartCount: 2, focus: ["реакции", "расчёты", "органическая химия"], teacherSkillSlug: "chemistry-ege-kazanovskaya" },
  { slug: "biology", name: "Биология", shortName: "Биология", exam: "ЕГЭ по выбору", ogeAvailable: true, availability: "28 заданий полного варианта", fullTaskCount: 28, durationMinutes: 235, egePartCount: 2, ogeTaskCount: 26, ogeDurationMinutes: 150, ogePartCount: 2, focus: ["клетка", "генетика", "экология"], teacherSkillSlug: "biology-ege-nosenko" },
  { slug: "history", name: "История", shortName: "История", exam: "ЕГЭ по выбору", ogeAvailable: true, availability: "21 задание полного варианта", fullTaskCount: 21, durationMinutes: 210, egePartCount: 2, ogeTaskCount: 24, ogeDurationMinutes: 180, ogePartCount: 2, focus: ["хронология", "источники", "аргументация"], teacherSkillSlug: "history-ege-korolevskaya" },
  { slug: "social", name: "Обществознание", shortName: "Общество", exam: "ЕГЭ по выбору", ogeAvailable: true, availability: "25 заданий полного варианта", fullTaskCount: 25, durationMinutes: 210, egePartCount: 2, ogeTaskCount: 24, ogeDurationMinutes: 180, ogePartCount: 2, focus: ["право", "экономика", "общество"], teacherSkillSlug: "social-ege-belomestnaya" },
  { slug: "geography", name: "География", shortName: "География", exam: "ЕГЭ по выбору", ogeAvailable: true, availability: "29 заданий полного варианта", fullTaskCount: 29, durationMinutes: 180, egePartCount: 2, ogeTaskCount: 30, ogeDurationMinutes: 150, ogePartCount: 2, focus: ["карты", "население", "хозяйство"], teacherSkillSlug: "geography-ege-shcherbakova" },
  { slug: "literature", name: "Литература", shortName: "Литература", exam: "ЕГЭ по выбору", ogeAvailable: true, availability: "11 заданий полного варианта", fullTaskCount: 11, durationMinutes: 235, egePartCount: 3, ogeTaskCount: 12, ogeDurationMinutes: 235, ogePartCount: 2, focus: ["теория", "анализ текста", "сочинение"], teacherSkillSlug: "literature-ege-gorbunov" },
  { slug: "english", name: "Английский язык", shortName: "Английский", exam: "письменная и устная части", ogeAvailable: true, availability: "42 задания полного маршрута", fullTaskCount: 42, durationMinutes: 207, egePartCount: 5, ogeTaskCount: 38, ogeDurationMinutes: 135, ogePartCount: 5, focus: ["аудирование", "лексика", "говорение"], teacherSkillSlug: "english-ege-burova" },
  { slug: "german", name: "Немецкий язык", shortName: "Немецкий", exam: "письменная и устная части", ogeAvailable: true, availability: "42 задания полного маршрута", fullTaskCount: 42, durationMinutes: 207, egePartCount: 5, ogeTaskCount: 38, ogeDurationMinutes: 135, ogePartCount: 5, focus: ["чтение", "грамматика", "говорение"], teacherSkillSlug: "german-ege-voronina" },
  { slug: "french", name: "Французский язык", shortName: "Французский", exam: "письменная и устная части", ogeAvailable: true, availability: "42 задания полного маршрута", fullTaskCount: 42, durationMinutes: 207, egePartCount: 5, ogeTaskCount: 38, ogeDurationMinutes: 135, ogePartCount: 5, focus: ["чтение", "лексика", "говорение"] },
  { slug: "spanish", name: "Испанский язык", shortName: "Испанский", exam: "письменная и устная части", ogeAvailable: true, availability: "42 задания полного маршрута", fullTaskCount: 42, durationMinutes: 207, egePartCount: 5, ogeTaskCount: 38, ogeDurationMinutes: 135, ogePartCount: 5, focus: ["чтение", "лексика", "говорение"] },
  { slug: "chinese", name: "Китайский язык", shortName: "Китайский", exam: "письменная и устная части ЕГЭ", ogeAvailable: false, availability: "32 задания полного маршрута", fullTaskCount: 32, durationMinutes: 194, egePartCount: 5, focus: ["иероглифика", "чтение", "говорение"], teacherSkillSlug: "chinese-ege-morozova" },
];

export function getExamSubject(slug: string) {
  return examSubjects.find((subject) => subject.slug === slug) ?? examSubjects[0];
}

export function isExamSubject(value: string): value is ExamSubjectSlug {
  return examSubjectSlugs.includes(value as ExamSubjectSlug);
}

export function isSubjectAvailableForExam(exam: "oge" | "ege", slug: string) {
  const subject = examSubjects.find((item) => item.slug === slug);
  return Boolean(subject && (exam === "ege" || subject.ogeAvailable));
}
