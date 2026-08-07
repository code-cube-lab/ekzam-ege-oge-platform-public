import type { ExamSubjectSlug } from "../exams/exam-subjects";
import { subjectLeads } from "../teachers/subject-leads";
import { russianTeachers } from "../teachers/teacher-registry";

export type TeacherGrowthProfile = {
  id: string;
  name: string;
  initials: string;
  subjectSlug: ExamSubjectSlug;
  subjectName: string;
  department: string;
  focus: string[];
  evidenceNote: string;
  evidenceUrl: string;
  participationLabel: string;
  positioning: string;
  reelSeries: string[];
  filmingBrief: string;
  targetAudiences: string[];
  outreachMessage: string;
  proofRule: string;
};

const subjectPlaybooks: Partial<Record<ExamSubjectSlug, {
  positioning: string;
  series: string[];
  audiences: string[];
  filming: string;
}>> = {
  math: {
    positioning: "Показывать не формулу, а момент, в котором ученик выбирает неверный путь решения.",
    series: ["Где потерян знак?", "Решение за 40 секунд", "Два способа — один надёжнее"],
    audiences: ["родители 9–11 классов", "каналы профильной математики", "школы с инженерными классами"],
    filming: "Доска, крупный план одного перехода и пауза до ответа. В финале — другое условие того же типа.",
  },
  informatics: {
    positioning: "Разбирать алгоритм и типичную ошибку в коде, не обещая результата без практики.",
    series: ["Найдите ошибку в трёх строках", "Что выведет программа?", "Один алгоритм — три задачи"],
    audiences: ["ученики компьютерного ЕГЭ", "IT-классы и кружки", "каналы преподавателей информатики"],
    filming: "Запись экрана плюс лицо преподавателя. Сначала прогноз, затем запуск и короткое объяснение.",
  },
  physics: {
    positioning: "Связывать экзаменационную модель с наблюдаемым физическим эффектом.",
    series: ["Сначала предскажите опыт", "Какая сила забыта?", "График без зубрёжки"],
    audiences: ["инженерные классы", "каналы физики и олимпиад", "родители учеников 10–11 классов"],
    filming: "Безопасный опыт или схема, один прогноз зрителя и перенос результата в номер экзамена.",
  },
  chemistry: {
    positioning: "Делать видимой логику превращений и проверять каждое условие реакции.",
    series: ["Какой реактив лишний?", "Цепочка превращений", "Ошибка в коэффициенте"],
    audiences: ["химико-биологические классы", "каналы ОГЭ/ЕГЭ по химии", "абитуриенты медвузов"],
    filming: "Схема или безопасная демонстрация, пауза на прогноз и обязательная проверка условий реакции.",
  },
  biology: {
    positioning: "Учить распознавать признак и объяснять причинную связь, а не угадывать термин.",
    series: ["Узнайте процесс по признаку", "Что изменится первым?", "Лишний биологический факт"],
    audiences: ["абитуриенты медвузов", "биологические кружки", "родители учеников 9–11 классов"],
    filming: "Один рисунок или процесс, три наблюдаемых признака и новый пример после разбора.",
  },
  history: {
    positioning: "Строить причинно-следственные цепочки и работать с источником, а не с набором дат.",
    series: ["Источник без подписи", "Что было причиной?", "Одна дата — три связи"],
    audiences: ["гуманитарные классы", "каналы истории и культуры", "родители выпускников"],
    filming: "Покажите фрагмент источника или карту, дайте 7 секунд на вывод и подтвердите его двумя признаками.",
  },
  social: {
    positioning: "Переводить понятия обществознания в точные признаки и реальные, но нейтральные ситуации.",
    series: ["Какое понятие скрыто?", "Пример или не пример?", "Ловушка в формулировке"],
    audiences: ["гуманитарные классы", "каналы права и обществознания", "родители выпускников"],
    filming: "Одна бытовая ситуация, выбор понятия и разбор обязательных признаков без политической агитации.",
  },
  geography: {
    positioning: "Учить читать карту, таблицу и закономерность до выбора ответа.",
    series: ["Угадайте регион по трём данным", "Карта говорит больше текста", "Где ошибка в маршруте?"],
    audiences: ["туристические и географические сообщества", "школьные экоклубы", "ученики ОГЭ/ЕГЭ"],
    filming: "Крупный план карты или таблицы, выделение одного признака и перенос на новую территорию.",
  },
  english: {
    positioning: "Показывать экзаменационную стратегию через живую речь и контекст.",
    series: ["Услышите ключевое слово?", "Ложный друг переводчика", "Ответ за 40 секунд"],
    audiences: ["языковые школы", "каналы преподавателей английского", "родители учеников 8–11 классов"],
    filming: "Два дубля одной реплики, пауза на выбор и объяснение контекстного маркера.",
  },
  german: {
    positioning: "Снимать короткие речевые ситуации и сразу связывать их с форматом экзамена.",
    series: ["Выберите естественную реплику", "Порядок слов без зубрёжки", "Устный ответ за минуту"],
    audiences: ["языковые центры", "немецкие культурные сообщества", "ученики языкового ЕГЭ"],
    filming: "Мини-диалог, остановка перед ответом и повтор с другим обстоятельством.",
  },
  chinese: {
    positioning: "Соединять иероглиф, звучание и смысл в одном коротком экзаменационном действии.",
    series: ["Узнайте значение по ключу", "Какой тон меняет смысл?", "Соберите реплику"],
    audiences: ["центры китайского языка", "востоковедческие сообщества", "ученики языкового ЕГЭ"],
    filming: "Иероглиф крупно, произношение, пауза на значение и новая реплика для самостоятельного ответа.",
  },
};

const humanitiesDefault = {
  positioning: "Показывать ход чтения и доказательства ответа, а не выдавать готовую формулировку.",
  series: ["Найдите опору в тексте", "Почему ответ почти верный?", "Один критерий — три попытки"],
  audiences: ["родители учеников 8–11 классов", "каналы русского языка и литературы", "школьные библиотеки и гуманитарные классы"],
  filming: "Фрагмент текста на экране, пауза на ответ и разбор одного точного признака. Затем — новый фрагмент.",
};

function teacherMessage(name: string, subject: string, focus: string, audiences: string[]) {
  return `Здравствуйте! Готовим отдельный семидневный пилот по направлению «${subject}» для преподавателя ${name}. Основа — публично описанный профессиональный фокус «${focus}»: один короткий разбор, одно экзаменационное задание и три похожие попытки на платформе. Для вашей аудитории (${audiences[0]}) это будет бесплатный полезный материал с честной пометкой партнёрства. Участие преподавателя пока согласовывается; можно сначала прислать персональный бриф без обязательств?`;
}

const russianProfiles: TeacherGrowthProfile[] = russianTeachers.map((teacher) => {
  const playbook = humanitiesDefault;
  const focus = teacher.publicFocus;
  return {
    id: `philology-${teacher.slug}`,
    name: teacher.name,
    initials: teacher.initials,
    subjectSlug: "russian",
    subjectName: "Русский язык и литература",
    department: "Филологическое направление",
    focus,
    evidenceNote: teacher.evidenceNote,
    evidenceUrl: teacher.sourceUrl,
    participationLabel: teacher.participation === "project-lead-by-brief"
      ? "Роль задана владельцем проекта; публичное согласие преподавателя не зафиксировано"
      : "Участие в платформе не подтверждено",
    positioning: `${playbook.positioning} Персональный акцент: ${focus[0]}.`,
    reelSeries: [
      `${playbook.series[0]} · ${focus[0]}`,
      `${playbook.series[1]} · ${focus[1]}`,
      `${playbook.series[2]} · ${focus[2]}`,
    ],
    filmingBrief: `${playbook.filming} Первый выпуск посвятить теме «${focus[0]}».`,
    targetAudiences: playbook.audiences,
    outreachMessage: teacherMessage(teacher.name, "русский язык и литература", focus[0], playbook.audiences),
    proofRule: "До публикации преподаватель лично подтверждает условие, ответ, объяснение и право использовать своё имя.",
  };
});

const otherSubjectProfiles: TeacherGrowthProfile[] = subjectLeads
  .filter((lead) => !["russian", "literature"].includes(lead.slug))
  .map((lead) => {
    const subjectSlug = lead.slug as ExamSubjectSlug;
    const playbook = subjectPlaybooks[subjectSlug] ?? humanitiesDefault;
    const focus = [lead.publicEvidence, lead.exam, lead.department];
    return {
      id: `subject-${lead.slug}`,
      name: lead.teacher,
      initials: lead.initials,
      subjectSlug,
      subjectName: lead.subject,
      department: lead.department,
      focus,
      evidenceNote: lead.publicEvidence,
      evidenceUrl: lead.sourceUrl,
      participationLabel: "Участие в платформе не подтверждено",
      positioning: playbook.positioning,
      reelSeries: playbook.series,
      filmingBrief: playbook.filming,
      targetAudiences: playbook.audiences,
      outreachMessage: teacherMessage(lead.teacher, lead.subject.toLowerCase(), lead.publicEvidence, playbook.audiences),
      proofRule: "До публикации преподаватель лично подтверждает условие, ответ, объяснение и право использовать своё имя.",
    };
  });

export const teacherGrowthProfiles: TeacherGrowthProfile[] = [...russianProfiles, ...otherSubjectProfiles];

export function getTeacherGrowthProfile(id: string) {
  return teacherGrowthProfiles.find((profile) => profile.id === id) ?? teacherGrowthProfiles[0];
}
