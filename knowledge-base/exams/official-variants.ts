export type OfficialVariantSource = {
  subjectSlug: string;
  label: string;
  downloadUrl: string;
};

const FIPI_OPEN_VARIANTS = "https://fipi.ru/ege/otkrytyy-bank-zadaniy-ege/otkrytyye-varianty-kim-ege";
const FIPI_OPEN_BANK = "https://fipi.ru/ege/otkrytyy-bank-zadaniy-ege";
const DOC_BASE = "https://doc.fipi.ru/ege/otkrytyy-bank-zadaniy-ege/otkrytyye-varianty-kim-ege/2026";

const files: Record<string, string> = {
  russian: "Rus_1_ege2026.zip",
  math: "Mat_1_ege2026.zip",
  physics: "Fiz_1_ege2026.zip",
  chemistry: "Him_1_ege2026.zip",
  informatics: "Inf_1_ege2026.zip",
  biology: "Bio_1_ege2026.zip",
  history: "Ist_1_ege2026.zip",
  geography: "Geo_1_ege2026.zip",
  social: "Ob_1_ege2026.zip",
  literature: "Lit_1_ege2026.zip",
  english: "Angl_1_ege2026.zip",
  german: "Nem_1_ege2026.zip",
  french: "Fran_1_ege2026.zip",
  spanish: "Isp_1_ege2026.zip",
  chinese: "Kit_1_ege2026.zip",
};

export const officialVariantSources: OfficialVariantSource[] = Object.entries(files).map(([subjectSlug, file]) => ({
  subjectSlug,
  label: "Открытый вариант КИМ ЕГЭ-2026",
  downloadUrl: `${DOC_BASE}/${file}`,
}));

export const officialFipiLinks = {
  openVariants: FIPI_OPEN_VARIANTS,
  openBank: FIPI_OPEN_BANK,
  specifications: "https://fipi.ru/ege/demoversii-specifikacii-kodifikatory",
};

export function getOfficialVariantSource(subjectSlug: string) {
  return officialVariantSources.find((item) => item.subjectSlug === subjectSlug) ?? officialVariantSources[0];
}

type TopicRange = [lastTask: number, topic: string];

const topicBlueprints: Record<string, TopicRange[]> = {
  russian: [[3, "работа с текстом"], [8, "языковые нормы"], [15, "орфография"], [21, "пунктуация"], [26, "анализ текста"], [27, "сочинение"]],
  math: [[4, "практические задачи"], [8, "геометрия"], [12, "алгебра"], [16, "функции и вероятность"], [19, "задачи высокой сложности"]],
  informatics: [[5, "информация и кодирование"], [10, "логика"], [17, "алгоритмы"], [23, "моделирование"], [27, "программирование"]],
  physics: [[6, "механика"], [11, "молекулярная физика"], [17, "электродинамика"], [20, "квантовая физика"], [26, "задачи с развёрнутым ответом"]],
  chemistry: [[8, "строение вещества"], [16, "неорганическая химия"], [24, "органическая химия"], [28, "химические реакции"], [34, "расчёты и развёрнутые ответы"]],
  biology: [[6, "клетка и организм"], [12, "генетика"], [17, "эволюция"], [21, "экология"], [28, "развёрнутые биологические задачи"]],
  history: [[6, "хронология и факты"], [12, "исторические источники"], [16, "карты и культура"], [21, "аргументация и развёрнутый ответ"]],
  social: [[8, "человек и общество"], [13, "экономика"], [17, "социальные отношения"], [20, "политика"], [25, "право и развёрнутый ответ"]],
  geography: [[8, "географические источники"], [16, "природа и ресурсы"], [23, "население и хозяйство"], [29, "расчёты и развёрнутый ответ"]],
  literature: [[6, "анализ произведения"], [10, "сопоставительный анализ"], [11, "сочинение"]],
  english: [[9, "аудирование"], [18, "чтение"], [38, "грамматика и лексика"], [40, "письменная речь"], [42, "устная речь"]],
  german: [[9, "аудирование"], [18, "чтение"], [38, "грамматика и лексика"], [40, "письменная речь"], [42, "устная речь"]],
  french: [[9, "аудирование"], [18, "чтение"], [38, "грамматика и лексика"], [40, "письменная речь"], [42, "устная речь"]],
  spanish: [[9, "аудирование"], [18, "чтение"], [38, "грамматика и лексика"], [40, "письменная речь"], [42, "устная речь"]],
  chinese: [[9, "аудирование"], [18, "чтение"], [28, "иероглифика и лексика"], [30, "письменная речь"], [32, "устная речь"]],
};

export function getOfficialTaskTopic(subjectSlug: string, taskNumber: number) {
  const blueprint = topicBlueprints[subjectSlug] ?? topicBlueprints.russian;
  return blueprint.find(([lastTask]) => taskNumber <= lastTask)?.[1] ?? blueprint.at(-1)?.[1] ?? "общая подготовка";
}
