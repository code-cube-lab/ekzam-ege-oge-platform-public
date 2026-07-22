export type SubjectLead = {
  slug: string;
  subject: string;
  exam: string;
  teacher: string;
  initials: string;
  department: string;
  publicEvidence: string;
  sourceUrl: string;
  status: "current-publication" | "archive-owner-brief";
  participation: "not-confirmed";
  skillSlug: string;
  photo?: string;
  photoSourceUrl?: string;
  photoAlt?: string;
};

const RUSSIAN = "https://www.stpku.ru/index.php/uchebnyj-protsess/otdelnye-distsipliny/od-russkij-yazyk-i-literatura";
const MATH = "https://www.stpku.ru/index.php/uchebnyj-protsess/otdelnye-distsipliny/od-matematika-informatika-i-ikt?start=40&types%5B0%5D=1";
const SCIENCE = "https://www.stpku.ru/index.php/uchebnyj-protsess/otdelnye-distsipliny/od-fizika-khimiya-biologiya/news-od-fizika";
const HUMANITIES = "https://www.stpku.ru/index.php/uchebnyj-protsess/otdelnye-distsipliny/od-istoriya-obshchestvoznanie-geografiya";
const LANGUAGES = "https://www.stpku.ru/index.php/uchebnyj-protsess/otdelnye-distsipliny/od-inostrannyj-yazyk";
const RUSSIAN_ARCHIVE = "https://arhive.stpku.ru/index.php?Itemid=257&id=888&option=com_content&view=article";

export const subjectLeads: SubjectLead[] = [
  { slug: "russian", subject: "Русский язык", exam: "обязательный ЕГЭ", teacher: "Елена Николаевна Михайличенко", initials: "ЕМ", department: "Русский язык и литература", publicEvidence: "Архивный профиль и публикации СПКУ подтверждают работу с лексикой, речью и текстом.", sourceUrl: RUSSIAN_ARCHIVE, status: "archive-owner-brief", participation: "not-confirmed", skillSlug: "russian-ege-mikhaylichenko" },
  { slug: "literature", subject: "Литература", exam: "ЕГЭ по выбору", teacher: "Роман Сергеевич Горбунов", initials: "РГ", department: "Русский язык и литература", publicEvidence: "Публичные материалы действующего сайта СПКУ о литературном лектории и исследовательской работе с текстом.", sourceUrl: RUSSIAN, status: "current-publication", participation: "not-confirmed", skillSlug: "literature-ege-gorbunov" },
  { slug: "math", subject: "Математика", exam: "база и профиль", teacher: "Сергей Геннадьевич Дедов", initials: "СД", department: "Математика, информатика и ИКТ", publicEvidence: "Руководитель дисциплины упомянут в действующих публикациях СПКУ о математической грамотности и подготовке.", sourceUrl: MATH, status: "current-publication", participation: "not-confirmed", skillSlug: "math-ege-dedov" },
  { slug: "informatics", subject: "Информатика", exam: "компьютерный ЕГЭ", teacher: "Александр Филиппович Ханов", initials: "АХ", department: "Математика, информатика и ИКТ", publicEvidence: "Действующая публикация СПКУ называет преподавателем информатики и автором открытых занятий.", sourceUrl: MATH, status: "current-publication", participation: "not-confirmed", skillSlug: "informatics-ege-khanov" },
  { slug: "physics", subject: "Физика", exam: "ЕГЭ по выбору", teacher: "Елена Константиновна Левинская", initials: "ЕЛ", department: "Физика, химия и биология", publicEvidence: "Публичная практика подготовки профильных классов к ЕГЭ по физике на действующем сайте СПКУ.", sourceUrl: SCIENCE, status: "current-publication", participation: "not-confirmed", skillSlug: "physics-ege-levinskaya" },
  { slug: "chemistry", subject: "Химия", exam: "ЕГЭ по выбору", teacher: "Елена Борисовна Казановская", initials: "ЕК", department: "Физика, химия и биология", publicEvidence: "Действующие публикации СПКУ подтверждают открытые уроки и работу с химико-биологическим профилем.", sourceUrl: SCIENCE, status: "current-publication", participation: "not-confirmed", skillSlug: "chemistry-ege-kazanovskaya" },
  { slug: "biology", subject: "Биология", exam: "ЕГЭ по выбору", teacher: "Мария Александровна Носенко", initials: "МН", department: "Физика, химия и биология", publicEvidence: "Действующая публикация 2026 года подтверждает исследовательские уроки биологии и фактчекинг.", sourceUrl: SCIENCE, status: "current-publication", participation: "not-confirmed", skillSlug: "biology-ege-nosenko" },
  { slug: "history", subject: "История", exam: "ЕГЭ по выбору", teacher: "Наталья Викторовна Королевская", initials: "НК", department: "История, обществознание и география", publicEvidence: "Действующие публикации СПКУ подтверждают преподавание истории и межпредметные занятия.", sourceUrl: HUMANITIES, status: "current-publication", participation: "not-confirmed", skillSlug: "history-ege-korolevskaya" },
  { slug: "social", subject: "Обществознание", exam: "ЕГЭ по выбору", teacher: "Лилия Александровна Беломестная", initials: "ЛБ", department: "История, обществознание и география", publicEvidence: "Действующий сайт СПКУ подтверждает уроки истории, обществознания и финансовой грамотности.", sourceUrl: HUMANITIES, status: "current-publication", participation: "not-confirmed", skillSlug: "social-ege-belomestnaya" },
  { slug: "geography", subject: "География", exam: "ЕГЭ по выбору", teacher: "Елена Витальевна Щербакова", initials: "ЕЩ", department: "История, обществознание и география", publicEvidence: "Руководитель дисциплины и преподаватель географии упоминается в действующих материалах СПКУ.", sourceUrl: HUMANITIES, status: "current-publication", participation: "not-confirmed", skillSlug: "geography-ege-shcherbakova" },
  { slug: "english", subject: "Английский язык", exam: "письменная и устная части", teacher: "Анна Григорьевна Бурова", initials: "АБ", department: "Иностранный язык", publicEvidence: "Действующие публикации СПКУ подтверждают интерактивные занятия и межпредметные викторины на английском.", sourceUrl: LANGUAGES, status: "current-publication", participation: "not-confirmed", skillSlug: "english-ege-burova" },
  { slug: "german", subject: "Немецкий язык", exam: "письменная и устная части", teacher: "Галина Ивановна Воронина", initials: "ГВ", department: "Иностранный язык", publicEvidence: "Публикации 2026 года подтверждают преподавание немецкого языка и научно-языковые мероприятия.", sourceUrl: LANGUAGES, status: "current-publication", participation: "not-confirmed", skillSlug: "german-ege-voronina" },
  { slug: "chinese", subject: "Китайский язык", exam: "письменная и устная части", teacher: "Анна Александровна Морозова", initials: "АМ", department: "Иностранный язык", publicEvidence: "Действующий сайт СПКУ называет преподавателем китайского языка и организатором межпредметных занятий.", sourceUrl: LANGUAGES, status: "current-publication", participation: "not-confirmed", skillSlug: "chinese-ege-morozova" },
];

export const verifiedTeacherPhotos: Record<string, { src: string; sourceUrl: string; alt: string }> = {
  "russian-ege-mikhaylichenko": {
    src: "/teachers/elena-mikhaylichenko-class.jpg",
    sourceUrl: "https://www.stpku.ru/index.php/news/novosti/svoi-i-chuzhie-iskonno-russkie-i-zaimstvovannye-slova-izuchali-kadety-spku",
    alt: "Елена Николаевна Михайличенко проводит занятие по русскому языку",
  },
  "math-ege-dedov": {
    src: "/teachers/sergey-dedov.jpg",
    sourceUrl: "https://www.stpku.ru/dedov",
    alt: "Сергей Геннадьевич Дедов проводит занятие по математике",
  },
  "chemistry-ege-kazanovskaya": {
    src: "/teachers/elena-kazanovskaya-class.jpg",
    sourceUrl: "https://stpku.ru/index.php/news/novosti/sedobnoe-nesedobnoe-integrirovannyj-urok-anglijskogo-yazyka-i-khimii-proshjol-u-vosmiklassnikov",
    alt: "Елена Борисовна Казановская на интегрированном уроке химии",
  },
  "biology-ege-nosenko": {
    src: "/teachers/maria-nosenko-class.jpg",
    sourceUrl: "https://stpku.ru/index.php/news/novosti/o-meditsinskoj-etike-rassuzhdali-kadety-khimiko-biologicheskogo-profilya-spku",
    alt: "Мария Александровна Носенко проводит занятие с кадетами",
  },
  "social-ege-belomestnaya": {
    src: "/teachers/lilia-belomestnaya-class.jpg",
    sourceUrl: "https://www.stpku.ru/index.php/news/novosti/vse-dorogi-vedut-v-rim-otkrytyj-urok-istorii-proshjol-u-pervokursnikov-spku",
    alt: "Лилия Александровна Беломестная проводит открытый урок",
  },
  "geography-ege-shcherbakova": {
    src: "/teachers/elena-shcherbakova.jpg",
    sourceUrl: "https://shcherbakova.stpku.ru/",
    alt: "Елена Витальевна Щербакова, преподаватель географии",
  },
  "chinese-ege-morozova": {
    src: "/teachers/anna-morozova.jpg",
    sourceUrl: "https://www.stpku.ru/index.php/news/novosti/urok-finansovoj-gramotnosti-po-kitajski",
    alt: "Анна Александровна Морозова проводит урок китайского языка",
  },
};
