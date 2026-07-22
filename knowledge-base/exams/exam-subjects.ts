export type ExamSubject = {
  slug: string;
  name: string;
  shortName: string;
  exam: string;
  availability: string;
  focus: string[];
  teacherSkillSlug?: string;
};

export const examSubjects: ExamSubject[] = [
  { slug: "russian", name: "Русский язык", shortName: "Русский", exam: "обязательный ЕГЭ и ОГЭ", availability: "10 заданий в стартовой диагностике", focus: ["орфография", "пунктуация", "сочинение"], teacherSkillSlug: "russian-ege-mikhaylichenko" },
  { slug: "math", name: "Математика", shortName: "Математика", exam: "база, профиль и ОГЭ", availability: "10 заданий в стартовой диагностике", focus: ["алгебра", "геометрия", "практические задачи"], teacherSkillSlug: "math-ege-dedov" },
  { slug: "informatics", name: "Информатика", shortName: "Информатика", exam: "компьютерный ЕГЭ и ОГЭ", availability: "10 заданий в стартовой диагностике", focus: ["алгоритмы", "логика", "программирование"], teacherSkillSlug: "informatics-ege-khanov" },
  { slug: "physics", name: "Физика", shortName: "Физика", exam: "ЕГЭ и ОГЭ по выбору", availability: "10 заданий в стартовой диагностике", focus: ["механика", "электричество", "квантовая физика"], teacherSkillSlug: "physics-ege-levinskaya" },
  { slug: "chemistry", name: "Химия", shortName: "Химия", exam: "ЕГЭ и ОГЭ по выбору", availability: "10 заданий в стартовой диагностике", focus: ["реакции", "расчёты", "органическая химия"], teacherSkillSlug: "chemistry-ege-kazanovskaya" },
  { slug: "biology", name: "Биология", shortName: "Биология", exam: "ЕГЭ и ОГЭ по выбору", availability: "10 заданий в стартовой диагностике", focus: ["клетка", "генетика", "экология"], teacherSkillSlug: "biology-ege-nosenko" },
  { slug: "history", name: "История", shortName: "История", exam: "ЕГЭ и ОГЭ по выбору", availability: "10 заданий в стартовой диагностике", focus: ["хронология", "источники", "аргументация"], teacherSkillSlug: "history-ege-korolevskaya" },
  { slug: "social", name: "Обществознание", shortName: "Общество", exam: "ЕГЭ и ОГЭ по выбору", availability: "10 заданий в стартовой диагностике", focus: ["право", "экономика", "общество"], teacherSkillSlug: "social-ege-belomestnaya" },
  { slug: "geography", name: "География", shortName: "География", exam: "ЕГЭ и ОГЭ по выбору", availability: "10 заданий в стартовой диагностике", focus: ["карты", "население", "хозяйство"], teacherSkillSlug: "geography-ege-shcherbakova" },
  { slug: "literature", name: "Литература", shortName: "Литература", exam: "ЕГЭ и ОГЭ по выбору", availability: "10 заданий в стартовой диагностике", focus: ["теория", "анализ текста", "сочинение"], teacherSkillSlug: "literature-ege-gorbunov" },
  { slug: "english", name: "Английский язык", shortName: "Английский", exam: "письменная и устная части", availability: "10 заданий в стартовой диагностике", focus: ["аудирование", "лексика", "говорение"], teacherSkillSlug: "english-ege-burova" },
  { slug: "german", name: "Немецкий язык", shortName: "Немецкий", exam: "письменная и устная части", availability: "10 заданий в стартовой диагностике", focus: ["чтение", "грамматика", "говорение"], teacherSkillSlug: "german-ege-voronina" },
  { slug: "french", name: "Французский язык", shortName: "Французский", exam: "письменная и устная части", availability: "10 заданий в стартовой диагностике", focus: ["чтение", "лексика", "говорение"] },
  { slug: "spanish", name: "Испанский язык", shortName: "Испанский", exam: "письменная и устная части", availability: "10 заданий в стартовой диагностике", focus: ["чтение", "лексика", "говорение"] },
  { slug: "chinese", name: "Китайский язык", shortName: "Китайский", exam: "письменная и устная части ЕГЭ", availability: "10 заданий в стартовой диагностике", focus: ["иероглифика", "чтение", "говорение"], teacherSkillSlug: "chinese-ege-morozova" },
];

export function getExamSubject(slug: string) {
  return examSubjects.find((subject) => subject.slug === slug) ?? examSubjects[0];
}
