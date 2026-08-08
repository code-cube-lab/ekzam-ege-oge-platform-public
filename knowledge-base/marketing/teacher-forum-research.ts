import type { ExamSubjectSlug } from "../exams/exam-subjects";
import type { TeacherGrowthProfile } from "./teacher-growth";

export type ForumActionMode = "expert-reply" | "special-listing" | "research-only";
export type ForumFreshness = "2026" | "2025" | "evergreen";

export type ForumResearchTopic = {
  id: string;
  platform: "u-mama" | "BabyBlog" | "Reddit";
  title: string;
  url: string;
  subjectSlugs: Array<ExamSubjectSlug | "all">;
  freshness: ForumFreshness;
  actionMode: ForumActionMode;
  observedQuestion: string;
  painSignal: string;
  contribution: string;
  ruleUrl: string;
  ruleSummary: string;
};

export type TeacherForumRoute = ForumResearchTopic & {
  fitReason: string;
  publicReply: string;
  followupReply: string;
  beforePosting: string[];
};

export const forumResearchVerifiedAt = "8 августа 2026 года";

export const forumPlatformRules = [
  {
    platform: "u-mama",
    ruleUrl: "https://u-mama.ru/forum/rules",
    summary: "В обычных темах запрещены реклама сайтов, услуг и маркетинговые исследования. Коммерческие объявления допустимы только в специальных темах или разделе объявлений.",
  },
  {
    platform: "BabyBlog",
    ruleUrl: "https://www.babyblog.ru/community/shkola/rules-and-faq",
    summary: "В сообществе «Здравствуй, школа!» реклама запрещена; репетитору разрешён один пост о себе только в категории «Репетиторство». В обычной дискуссии — только ответ по теме без продажи и ссылки.",
  },
  {
    platform: "Reddit",
    ruleUrl: "https://support.reddithelp.com/hc/en-us/articles/205926439-Reddiquette",
    summary: "Сначала изучить правила конкретного сообщества. Не писать несовершеннолетним в личные сообщения и не превращать ответ в саморекламу.",
  },
] as const;

const uMamaRule = "https://u-mama.ru/forum/rules";
const babyBlogRule = "https://www.babyblog.ru/community/shkola/rules-and-faq";
const redditRule = "https://support.reddithelp.com/hc/en-us/articles/205926439-Reddiquette";

export const forumResearchTopics: ForumResearchTopic[] = [
  {
    id: "bb-preparation-2026",
    platform: "BabyBlog",
    title: "Подготовка к ЕГЭ: с 10-го или с 11-го класса",
    url: "https://www.babyblog.ru/community/shkola/post/3234380",
    subjectSlugs: ["all"],
    freshness: "2026",
    actionMode: "expert-reply",
    observedQuestion: "Родитель выбирает между самостоятельной подготовкой, онлайн-курсом и репетитором сразу по нескольким предметам.",
    painSignal: "Страх переплатить за четыре предмета и при этом поздно заметить реальные пробелы.",
    contribution: "Дать короткую схему диагностики: пробник → причины ошибок → решение о формате по каждому предмету отдельно.",
    ruleUrl: babyBlogRule,
    ruleSummary: "Только полезный ответ без ссылки, цены и предложения услуг; реклама в сообществе запрещена.",
  },
  {
    id: "bb-school-practice-2026",
    platform: "BabyBlog",
    title: "Практикумы ЕГЭ в школе или высвободить время",
    url: "https://www.babyblog.ru/community/shkola/post/3234384",
    subjectSlugs: ["all"],
    freshness: "2026",
    actionMode: "expert-reply",
    observedQuestion: "Родитель не понимает, дают ли школьные практикумы реальную подготовку и стоит ли менять учебный режим.",
    painSignal: "Много часов занято, а прозрачной динамики по заданиям и слабым темам нет.",
    contribution: "Предложить измерять пользу не часами, а повторным решением тех же линий через 7–10 дней.",
    ruleUrl: babyBlogRule,
    ruleSummary: "Ответ по существу без продвижения платформы; любые ссылки — только в разрешённой категории или после согласования с модератором.",
  },
  {
    id: "u-cost-of-ege",
    platform: "u-mama",
    title: "Напрасные траты на подготовку к ЕГЭ",
    url: "https://u-mama.ru/forum/kids/schoolboy/1010667/",
    subjectSlugs: ["all"],
    freshness: "2025",
    actionMode: "expert-reply",
    observedQuestion: "Семья считает стоимость нескольких репетиторов и сомневается, окупятся ли занятия баллами.",
    painSignal: "Нет доказательства прогресса и непонятно, за что платят каждую неделю.",
    contribution: "Показать три метрики: стартовый срез, повторяемая причина ошибки и доля заданий, решённых без подсказки.",
    ruleUrl: uMamaRule,
    ruleSummary: "Обычная тема: никакой рекламы, ссылки на сайт или призыва написать в личку.",
  },
  {
    id: "u-tutor-competence",
    platform: "u-mama",
    title: "Как понять компетенцию репетитора для ОГЭ",
    url: "https://u-mama.ru/forum/kids/schoolboy/1011047/",
    subjectSlugs: ["all"],
    freshness: "2025",
    actionMode: "expert-reply",
    observedQuestion: "Родителю нужен способ понять, помогает ли педагог, а не только перечень сертификатов.",
    painSignal: "Занятия идут, но критерии результата и формат обратной связи заранее не согласованы.",
    contribution: "Дать чек-лист пробного занятия: входной навык, объяснимая ошибка, аналогичная попытка и план контроля через две недели.",
    ruleUrl: uMamaRule,
    ruleSummary: "Ответить можно только как эксперт по вопросу; коммерческий CTA и внешняя ссылка запрещены.",
  },
  {
    id: "u-special-tutor-thread",
    platform: "u-mama",
    title: "Специальная тема: репетиторы и ученики",
    url: "https://u-mama.ru/forum/kids/schoolboy/817316/?page=189",
    subjectSlugs: ["all"],
    freshness: "2026",
    actionMode: "special-listing",
    observedQuestion: "В специальной теме родители публикуют конкретный запрос: предмет, класс, формат, район и цель.",
    painSignal: "Нужен педагог под конкретный профиль ребёнка, а не общий рекламный текст.",
    contribution: "Отвечать только на совпадающий запрос: назвать предметный фокус, формат первого среза, стоимость после подтверждения и честные ограничения.",
    ruleUrl: uMamaRule,
    ruleSummary: "Коммерческое сообщение допустимо только в специальной теме и строго по правилам её первого сообщения.",
  },
  {
    id: "bb-special-tutor-category",
    platform: "BabyBlog",
    title: "Разрешённая категория BabyBlog «Репетиторство»",
    url: "https://www.babyblog.ru/community/shkola/rules-and-faq",
    subjectSlugs: ["all"],
    freshness: "2026",
    actionMode: "special-listing",
    observedQuestion: "Правила сообщества разрешают репетитору один пост о себе только в соответствующей категории.",
    painSignal: "Общий рекламный комментарий удалят, поэтому предложение должно жить в разрешённом месте и отвечать на конкретный родительский запрос.",
    contribution: "Подготовить одну проверяемую карточку преподавателя: кому помогает, какой первый срез проводит, как измеряет прогресс и какие условия подтверждены.",
    ruleUrl: babyBlogRule,
    ruleSummary: "Разрешён один пост о себе в категории «Репетиторство»; в остальных обсуждениях реклама запрещена.",
  },
  {
    id: "bb-russian-oge-composition-2026",
    platform: "BabyBlog",
    title: "ОГЭ по русскому: как не потерять баллы за сочинение",
    url: "https://www.babyblog.ru/community/shkola/post/3233488",
    subjectSlugs: ["russian"],
    freshness: "2026",
    actionMode: "expert-reply",
    observedQuestion: "Родитель боится, что школьное сочинение и экзаменационная работа оцениваются по разным правилам.",
    painSignal: "Ребёнок пишет содержательно, но может потерять баллы на структуре, речи и критериях.",
    contribution: "Разделить смысл, композицию и грамотность; предложить проверять один критерий за попытку, а затем собирать полный текст.",
    ruleUrl: babyBlogRule,
    ruleSummary: "Без ссылки и предложения занятий; полезное пояснение от преподавателя допустимо только по теме обсуждения.",
  },
  {
    id: "bb-russian-ege-2026",
    platform: "BabyBlog",
    title: "ЕГЭ по русскому 2026: сложный текст и критерии",
    url: "https://www.babyblog.ru/community/shkola/post/3234106",
    subjectSlugs: ["russian"],
    freshness: "2026",
    actionMode: "research-only",
    observedQuestion: "После экзамена родители обсуждают сложность текста, аргументацию и проверку сочинения.",
    painSignal: "Тревога после экзамена и риск делать выводы по пересказам отдельных вариантов.",
    contribution: "Использовать только для исследования языка родителей; не разбирать утечки и не обещать прогноз баллов до официальных результатов.",
    ruleUrl: babyBlogRule,
    ruleSummary: "Не входить в послесдачную дискуссию с продажей. Источник — только для понимания боли и будущего образовательного контента.",
  },
  {
    id: "u-russian-progress",
    platform: "u-mama",
    title: "Русский язык, 9 класс: занятия идут, результата не видно",
    url: "https://u-mama.ru/forum/kids/schoolboy/972546/",
    subjectSlugs: ["russian"],
    freshness: "evergreen",
    actionMode: "expert-reply",
    observedQuestion: "Пять месяцев занятий не дали родителю понятной динамики по тесту, изложению и сочинению.",
    painSignal: "Педагог хвалит старание, но семья не видит измеряемого переноса навыка в пробник.",
    contribution: "Предложить журнал причин ошибок и отдельные контрольные точки по тесту, изложению и сочинению.",
    ruleUrl: uMamaRule,
    ruleSummary: "Только профессиональная рекомендация без ссылки, цены и предложения перейти в личку.",
  },
  {
    id: "bb-literature-structure-2026",
    platform: "BabyBlog",
    title: "Литература: школьное сочинение и экзаменационная структура",
    url: "https://www.babyblog.ru/community/shkola/post/3233178",
    subjectSlugs: ["russian"],
    freshness: "2026",
    actionMode: "expert-reply",
    observedQuestion: "Родители спорят, надо ли рано учить длинным сочинениям или экзаменационной схеме.",
    painSignal: "Смешиваются читательское развитие и конкретные критерии ОГЭ/ЕГЭ.",
    contribution: "Развести два режима: свободное чтение и короткая тренировка доказательства по критерию.",
    ruleUrl: babyBlogRule,
    ruleSummary: "Дать методический ответ без самопрезентации услуги и без внешней ссылки.",
  },
  {
    id: "bb-profile-math-2026",
    platform: "BabyBlog",
    title: "Репетитор по профильной математике: как оценить",
    url: "https://www.babyblog.ru/community/shkola/post/3233694",
    subjectSlugs: ["math"],
    freshness: "2026",
    actionMode: "expert-reply",
    observedQuestion: "Родитель сам решает задания второй части, но не понимает, как проверить качество педагога и темп подготовки.",
    painSignal: "Курс закрывает только первую часть, а длинные способы решения съедают экзаменационное время.",
    contribution: "Посоветовать входной срез по линиям, разбор выбора метода и повтор без подсказки через неделю.",
    ruleUrl: babyBlogRule,
    ruleSummary: "Никаких рекомендаций самого себя; только критерии выбора и измерения прогресса.",
  },
  {
    id: "u-physmath-strategy-2027",
    platform: "u-mama",
    title: "ЕГЭ-2027: стратегия по физике и профильной математике",
    url: "https://u-mama.ru/forum/kids/schoolboy/1023236/",
    subjectSlugs: ["math", "physics"],
    freshness: "2026",
    actionMode: "expert-reply",
    observedQuestion: "Сильная школьная нагрузка, репетиторов перебирают, системы и отчёта о слабых темах нет.",
    painSignal: "Родители получают квитанции, но не видят программу, контрольные точки и то, что подтянуть.",
    contribution: "Предложить двухнедельный цикл: диагностика линии, три вариации, повторный срез и короткий отчёт родителю.",
    ruleUrl: uMamaRule,
    ruleSummary: "Обычная тема запрещает рекламу; допустим только нейтральный экспертный ответ без ссылки.",
  },
  {
    id: "u-math-selection",
    platform: "u-mama",
    title: "Математика: критерии выбора репетитора",
    url: "https://u-mama.ru/forum/kids/schoolboy/1004516/",
    subjectSlugs: ["math"],
    freshness: "evergreen",
    actionMode: "expert-reply",
    observedQuestion: "Родитель выбирает между молодым педагогом и опытным школьным учителем и боится потерять время.",
    painSignal: "Не сформулирована цель: закрыть пробелы, автоматизировать навык или готовить высокий экзаменационный балл.",
    contribution: "Сначала определить цель и причину ошибки, затем выбирать методику, а не возраст преподавателя.",
    ruleUrl: uMamaRule,
    ruleSummary: "Никаких объявлений в обычной теме; предложение услуги переносится в специальную тему репетиторов.",
  },
  {
    id: "u-ege-informatics-language",
    platform: "u-mama",
    title: "ЕГЭ по информатике: Python или C++",
    url: "https://u-mama.ru/forum/kids/schoolboy/966285/",
    subjectSlugs: ["informatics"],
    freshness: "evergreen",
    actionMode: "expert-reply",
    observedQuestion: "Родитель связывает выбор языка программирования с успехом на экзамене.",
    painSignal: "Синтаксис подменяет алгоритмическое мышление и знание ограничений задачи.",
    contribution: "Объяснить, что сначала проверяются алгоритм, оценка сложности и отладка; язык выбирается под освоенный набор задач.",
    ruleUrl: uMamaRule,
    ruleSummary: "Ответ без рекламы курса и без приглашения в личные сообщения.",
  },
  {
    id: "u-oge-informatics",
    platform: "u-mama",
    title: "ОГЭ по информатике: курс, репетитор или самопроверка",
    url: "https://u-mama.ru/forum/kids/schoolboy/1015524/",
    subjectSlugs: ["informatics"],
    freshness: "2025",
    actionMode: "expert-reply",
    observedQuestion: "Родители сравнивают видеоразборы, пакеты заданий с самопроверкой и проверку последних сложных номеров человеком.",
    painSignal: "Автоматическая проверка не объясняет стратегию и не принимает часть развёрнутых решений.",
    contribution: "Разделить задания на автоматические и экспертные, а ошибки — на синтаксис, алгоритм и чтение условия.",
    ruleUrl: uMamaRule,
    ruleSummary: "Полезный ответ без ссылки; коммерческий формат — только в специальной теме.",
  },
  {
    id: "u-physics-tutor",
    platform: "u-mama",
    title: "Физика: основы потеряны, онлайн или очно",
    url: "https://u-mama.ru/forum/kids/schoolboy/1019712/",
    subjectSlugs: ["physics"],
    freshness: "2025",
    actionMode: "expert-reply",
    observedQuestion: "Родитель ищет формат, который восстановит основы и даст прогресс к ОГЭ/ЕГЭ.",
    painSignal: "Формулы учатся отдельно от модели явления, поэтому цепочка тем рассыпается.",
    contribution: "Начать с прогноза результата опыта или графика, затем только выбирать формулу и данные.",
    ruleUrl: uMamaRule,
    ruleSummary: "Не предлагать себя и не давать ссылку; ответить на вопрос о диагностике и формате.",
  },
  {
    id: "u-oge-chemistry-biology",
    platform: "u-mama",
    title: "ОГЭ по химии и биологии: с нулевой подготовки",
    url: "https://u-mama.ru/forum/kids/schoolboy/1002899/",
    subjectSlugs: ["chemistry", "biology"],
    freshness: "2025",
    actionMode: "expert-reply",
    observedQuestion: "Семья выбирает между курсами и репетитором, когда школьная база слабая, а цель — профильный класс.",
    painSignal: "Неясно, какой предмет проседает по базе, а какой — по умению работать с экзаменационным форматом.",
    contribution: "Предложить два коротких среза и план по темам, а не советовать одинаковый формат для химии и биологии.",
    ruleUrl: uMamaRule,
    ruleSummary: "Никаких контактов и ссылок в обычной дискуссии; только предметное объяснение.",
  },
  {
    id: "bb-physics-chemistry-2026",
    platform: "BabyBlog",
    title: "ЕГЭ по физике и химии: выбор профиля",
    url: "https://www.babyblog.ru/community/shkola/post/3234096",
    subjectSlugs: ["physics", "chemistry"],
    freshness: "2026",
    actionMode: "research-only",
    observedQuestion: "Семья связывает любимые предметы, будущую профессию и выбор экзаменов.",
    painSignal: "Решение о занятиях принимается до того, как проверен реальный экзаменационный уровень по каждому предмету.",
    contribution: "Использовать как основу для диагностического материала «предмет нравится — какой навык уже есть». Не продавать в дискуссии.",
    ruleUrl: babyBlogRule,
    ruleSummary: "Тема для исследования мотивации; не вмешиваться с коммерческим предложением.",
  },
  {
    id: "u-chem-bio-class-2026",
    platform: "u-mama",
    title: "Химико-биологический класс: что важно родителю",
    url: "https://u-mama.ru/forum/kids/schoolboy/1026967/",
    subjectSlugs: ["chemistry", "biology"],
    freshness: "2026",
    actionMode: "research-only",
    observedQuestion: "Родители ищут профиль с сильной предметной базой и бережным отношением к ребёнку.",
    painSignal: "Даже в профильном классе один из предметов может проседать, а высокая нагрузка снижает мотивацию.",
    contribution: "Исследовательская тема для оффера: прозрачная предметная диагностика без обещаний и без давления.",
    ruleUrl: uMamaRule,
    ruleSummary: "Не публиковать рекламу. Использовать только как подтверждение родительской боли.",
  },
  {
    id: "u-history-social",
    platform: "u-mama",
    title: "История и обществознание: ресурсы, курсы или репетитор",
    url: "https://u-mama.ru/forum/kids/schoolboy/936312/",
    subjectSlugs: ["history", "social"],
    freshness: "evergreen",
    actionMode: "expert-reply",
    observedQuestion: "Родители сравнивают источники и не знают, насколько пробники похожи на реальный экзамен.",
    painSignal: "Зубрёжка дат и терминов не переносится в работу с источником и развёрнутым ответом.",
    contribution: "Разделить знание факта, доказательство по источнику и оформление ответа по критерию.",
    ruleUrl: uMamaRule,
    ruleSummary: "Только предметный ответ без саморекламы и внешней ссылки.",
  },
  {
    id: "u-social-expert-check",
    platform: "u-mama",
    title: "Обществознание: кто проверит развёрнутые ответы",
    url: "https://u-mama.ru/forum/kids/schoolboy/987552/",
    subjectSlugs: ["social"],
    freshness: "evergreen",
    actionMode: "expert-reply",
    observedQuestion: "Самостоятельная подготовка упирается в проверку формулировок и развёрнутой части.",
    painSignal: "Ученик знает тему, но теряет баллы на обязательных признаках понятия и оформлении примера.",
    contribution: "Предложить рубрику самопроверки: понятие, два обязательных признака, нейтральный пример и связь с условием.",
    ruleUrl: uMamaRule,
    ruleSummary: "Не обещать балл и не рекламировать проверку; дать понятный алгоритм в самой теме.",
  },
  {
    id: "bb-geography-oge-2026",
    platform: "BabyBlog",
    title: "ОГЭ по географии 2026: атлас и невнимательные ошибки",
    url: "https://www.babyblog.ru/community/shkola/post/3234102",
    subjectSlugs: ["geography"],
    freshness: "2026",
    actionMode: "research-only",
    observedQuestion: "После экзамена родители обсуждают навигацию по атласу и «глупые» ошибки.",
    painSignal: "Ребёнок знает материал, но медленно ищет данные и не проверяет маршрут решения.",
    contribution: "Создать тренировку на выбор нужной карты и контрольную точку перед записью ответа. Не продавать после экзамена.",
    ruleUrl: babyBlogRule,
    ruleSummary: "Тема используется для исследования ошибок и будущего контента, не для коммерческого ответа.",
  },
  {
    id: "u-english-ege-self-study",
    platform: "u-mama",
    title: "ЕГЭ по английскому: что нельзя проверить самому",
    url: "https://u-mama.ru/forum/kids/schoolboy/940096/",
    subjectSlugs: ["english", "german", "chinese"],
    freshness: "evergreen",
    actionMode: "expert-reply",
    observedQuestion: "Высокий общий уровень языка не гарантирует самопроверку письменной и устной частей экзамена.",
    painSignal: "Аудирование, критерии письма и двухминутная речь требуют отдельной обратной связи.",
    contribution: "Предложить запись ответа, разметку пауз и проверку одного критерия за попытку.",
    ruleUrl: uMamaRule,
    ruleSummary: "Ответить методически, не предлагать курс и не оставлять ссылку.",
  },
  {
    id: "bb-language-school-vs-tutor",
    platform: "BabyBlog",
    title: "Языковая школа или репетитор: что даёт регулярность",
    url: "https://www.babyblog.ru/community/shkola/post/3213149",
    subjectSlugs: ["english", "german", "chinese"],
    freshness: "evergreen",
    actionMode: "expert-reply",
    observedQuestion: "Родители сравнивают количество уроков, формат группы и индивидуальную работу.",
    painSignal: "Оплата часов подменяет ежедневное использование языка и контроль конкретного навыка.",
    contribution: "Дать недельную схему: короткое аудирование, повторение вслух, письмо и один экспертный разбор.",
    ruleUrl: babyBlogRule,
    ruleSummary: "Без предложения своих услуг; один пост о репетиторе возможен только в разрешённой категории.",
  },
  {
    id: "bb-chinese-how-to-learn",
    platform: "BabyBlog",
    title: "Китайский: университетский подход или игровой формат",
    url: "https://www.babyblog.ru/community/shkola/post/3230952",
    subjectSlugs: ["chinese"],
    freshness: "2025",
    actionMode: "expert-reply",
    observedQuestion: "Родитель видит, что ребёнок быстро теряет мотивацию при взрослом академическом формате.",
    painSignal: "Иероглиф, звук и смысл учатся раздельно, а нагрузка не соответствует возрасту.",
    contribution: "Предложить короткий цикл: ключ иероглифа → звучание → смысл → новая реплика в игровом контексте.",
    ruleUrl: babyBlogRule,
    ruleSummary: "Только методический ответ; без приглашения на занятия и без ссылки.",
  },
  {
    id: "reddit-chinese-ege-2026",
    platform: "Reddit",
    title: "Ученический опыт подготовки к ЕГЭ по китайскому",
    url: "https://www.reddit.com/r/rusAskReddit/comments/1s5sdx2/",
    subjectSlugs: ["chinese"],
    freshness: "2026",
    actionMode: "research-only",
    observedQuestion: "Ученик описывает переход от базовых уровней HSK к экзаменационной лексике и выбору траектории.",
    painSignal: "Постановка цели запаздывает, а сложность абстрактной лексики становится заметна только на старших уровнях.",
    contribution: "Использовать для сценария диагностики цели и словаря. Не писать автору и не предлагать услугу несовершеннолетнему.",
    ruleUrl: redditRule,
    ruleSummary: "Только исследование публичного обсуждения; никаких личных сообщений несовершеннолетним.",
  },
  {
    id: "bb-online-language-2025",
    platform: "BabyBlog",
    title: "Онлайн-занятия: экзамен, повторение и возврат к старым темам",
    url: "https://www.babyblog.ru/community/shkola/post/3231982",
    subjectSlugs: ["english", "german"],
    freshness: "2025",
    actionMode: "expert-reply",
    observedQuestion: "Родитель сравнивает самостоятельную работу и занятия, когда школьная пятёрка не показывает готовность к экзамену.",
    painSignal: "Текущая тема усвоена, но старые навыки не возвращаются в перемешанной экзаменационной практике.",
    contribution: "Предложить спиральный план: новая тема плюс две короткие задачи из старых блоков каждую неделю.",
    ruleUrl: babyBlogRule,
    ruleSummary: "Полезный ответ без рекламы и ссылки на внешний сервис.",
  },
];

const subjectReplyGuides: Partial<Record<ExamSubjectSlug, { firstStep: string; checks: string[]; evidence: string }>> = {
  russian: {
    firstStep: "разделить ошибку на понимание текста, знание правила и оформление ответа",
    checks: ["выполнить один номер без подсказки", "объяснить правило своими словами", "решить новый пример того же типа через несколько дней"],
    evidence: "динамика по отдельным критериям теста, изложения или сочинения",
  },
  math: {
    firstStep: "попросить ребёнка проговорить выбор метода до вычислений",
    checks: ["правильно ли прочитано условие", "где выбран метод", "на каком переходе возникла ошибка"],
    evidence: "новая задача той же линии, решённая без подсказки и в разумное время",
  },
  informatics: {
    firstStep: "отделить алгоритмическую ошибку от синтаксиса и невнимательного чтения ограничения",
    checks: ["сделать прогноз результата", "проверить сложность алгоритма", "объяснить состояние переменных на контрольном шаге"],
    evidence: "тот же алгоритм на других данных без копирования шаблона",
  },
  physics: {
    firstStep: "сначала построить модель явления и предсказать направление изменения величины",
    checks: ["какая система рассматривается", "какой закон связывает величины", "соответствуют ли единицы и знак физическому смыслу"],
    evidence: "перенос модели на новое условие, а не повтор формулы по образцу",
  },
  chemistry: {
    firstStep: "разделить знание продукта реакции, условия процесса и расчётный шаг",
    checks: ["класс вещества", "условие реакции", "баланс и проверка результата"],
    evidence: "новая цепочка превращений с другими веществами и объяснённым условием",
  },
  biology: {
    firstStep: "проверить не узнавание картинки, а причинную связь между признаком и процессом",
    checks: ["назвать наблюдаемый признак", "объяснить механизм", "предсказать изменение при новом условии"],
    evidence: "распознавание того же процесса на незнакомой схеме",
  },
  history: {
    firstStep: "соединить факт с источником и причинно-следственной связью",
    checks: ["эпоха и контекст", "два доказательства из источника", "корректный вывод без лишнего утверждения"],
    evidence: "анализ нового документа, а не воспроизведение заученного ответа",
  },
  social: {
    firstStep: "проверить обязательные признаки понятия до подбора примера",
    checks: ["точный термин", "два обязательных признака", "нейтральный пример, связанный с условием"],
    evidence: "развёрнутый ответ по критериям на новой ситуации",
  },
  geography: {
    firstStep: "научить выбирать источник данных до поиска ответа",
    checks: ["какая карта или таблица нужна", "какой показатель сравнивается", "сделана ли проверка направления и масштаба"],
    evidence: "новый регион, найденный по тем же признакам без подсказки",
  },
  english: {
    firstStep: "отделить общий уровень языка от конкретного экзаменационного навыка",
    checks: ["понимание аудио", "соответствие письменного ответа критерию", "двухминутная речь без длинных пауз"],
    evidence: "повторная запись на новой теме с меньшим числом однотипных ошибок",
  },
  german: {
    firstStep: "отделить словарный запас от порядка слов, аудирования и экзаменационного тайминга",
    checks: ["понимание ключевого смысла", "естественный порядок слов", "устный ответ в заданное время"],
    evidence: "новая речевая ситуация без заученного дословного шаблона",
  },
  chinese: {
    firstStep: "связать иероглиф, звучание и значение в одной речевой ситуации",
    checks: ["узнавание ключа", "тон и произношение", "употребление слова в новой реплике"],
    evidence: "понимание и употребление лексики в новом контексте, а не только карточке",
  },
};

const defaultGuide = {
  firstStep: "разделить незнание темы, ошибку чтения условия и ошибку оформления",
  checks: ["входная попытка", "объяснение причины ошибки", "новая попытка того же типа"],
  evidence: "повторный результат без подсказки",
};

function buildPublicReply(profile: TeacherGrowthProfile) {
  const guide = subjectReplyGuides[profile.subjectSlug] ?? defaultGuide;
  return [
    `Я преподаватель направления «${profile.subjectName}». По описанию здесь важно сначала ${guide.firstStep}.`,
    `Я бы не выбирал формат только по цене, возрасту педагога или числу уроков. Проверьте три вещи: 1) ${guide.checks[0]}; 2) ${guide.checks[1]}; 3) ${guide.checks[2]}.`,
    `Для вашей ситуации полезным результатом будет ${guide.evidence}. Если этого не видно после заранее согласованного контрольного срока, стоит менять не ребёнка, а план диагностики и обратной связи.`,
    `Это именно методическая рекомендация по вопросу темы; я связан(а) с образовательной платформой, но ссылку и предложение услуг здесь не размещаю, потому что правила площадки запрещают рекламу.`,
  ].join("\n\n");
}

function buildSpecialListing(profile: TeacherGrowthProfile) {
  const guide = subjectReplyGuides[profile.subjectSlug] ?? defaultGuide;
  return [
    `Здравствуйте! Я ${profile.name}, преподаватель направления «${profile.subjectName}». Отвечаю в специальной теме репетиторов и только на совпадающий запрос.`,
    `Первый шаг — короткий срез: ${guide.firstStep}. После него родитель получает понятную фиксацию: ${guide.evidence}. Предметный акцент: ${profile.focus[0]}.`,
    `Формат, расписание, стоимость и право использовать моё имя должны быть подтверждены мной до публикации. Гарантий балла не даю; могу обещать только прозрачный план, проверку работ и контроль переноса навыка на новые задания.`,
  ].join("\n\n");
}

function buildFollowup(profile: TeacherGrowthProfile, topic: ForumResearchTopic) {
  if (topic.actionMode === "research-only") {
    return "Не отвечать и не писать автору. Зафиксировать формулировки боли и использовать их только для будущего полезного материала преподавателя.";
  }
  if (topic.actionMode === "special-listing") {
    return `Если родитель сам уточнит условия, ${profile.name} отвечает публично или в разрешённом площадкой формате: класс, цель, текущий результат, расписание, стоимость после подтверждения и один диагностический шаг. Не запрашивать контакты ребёнка.`;
  }
  return "Если участник попросит пример, дайте его прямо в теме без внешней ссылки. Если спросит об услуге, сначала проверьте правила: перенесите коммерческое предложение в специальную категорию или согласуйте его с модератором; не инициируйте личное сообщение.";
}

export function buildTeacherForumRoutes(profile: TeacherGrowthProfile): TeacherForumRoute[] {
  const specific = forumResearchTopics.filter((topic) => topic.subjectSlugs.includes(profile.subjectSlug));
  const common = forumResearchTopics.filter((topic) => topic.subjectSlugs.includes("all"));
  const specialListings = common.filter((topic) => topic.actionMode === "special-listing");
  const commonAdvice = common.filter((topic) => topic.actionMode !== "special-listing");
  const selected = [...specific.slice(0, 4), ...specialListings, ...commonAdvice].slice(0, 7);
  return selected.map((topic) => ({
    ...topic,
    fitReason: `${topic.contribution} Для ${profile.name} персональный акцент — «${profile.focus[0]}».`,
    publicReply: topic.actionMode === "special-listing" ? buildSpecialListing(profile) : buildPublicReply(profile),
    followupReply: buildFollowup(profile, topic),
    beforePosting: [
      "Открыть тему заново и убедиться, что она не закрыта и вопрос ещё актуален.",
      `Прочитать правила площадки: ${topic.ruleSummary}`,
      "Убрать имя, опыт, цену и любые утверждения, которые преподаватель лично не подтвердил.",
      topic.actionMode === "expert-reply" ? "Оставить ответ самодостаточным: без ссылки, CTA и просьбы написать в личку." : topic.actionMode === "special-listing" ? "Публиковать только после согласия преподавателя и по правилам специальной темы." : "Не публиковать ответ и не связываться с автором.",
    ],
  }));
}
