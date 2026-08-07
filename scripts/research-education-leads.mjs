import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const researchDir = path.join(projectRoot, "research");
const checkedAt = new Date().toISOString();
const sourcePages = [
  "https://tgstat.org/top100/2599/education/",
  "https://tgstat.org/top100/1735/education/",
  "https://tgstat.org/top100/2743/education/",
  "https://tgstat.org/top100/2647/education/",
  "https://t.me/s/vzaimoreklama_teacher",
  ...[100, 200, 300, 355, 450, 550, 650, 750, 850, 950].map((before) => `https://t.me/s/vzaimoreklama_teacher?before=${before}`),
];

const reserved = new Set(["share", "iv", "s", "joinchat", "proxy", "addstickers", "login", "blog", "faq"]);
const unsafePattern = /(ответы?\s*(егэ|огэ|202)|слив|реальные\s*ким|гдз|решебник|списать|шпор|dark\s*mate|pandaex|keyoge|fast.exam|otveti|spisal)/i;

function decodeHtml(value = "") {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/\s+/g, " ")
    .trim();
}

function meta(html, property) {
  const variants = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${property}["']`, "i"),
  ];
  for (const pattern of variants) {
    const match = html.match(pattern);
    if (match) return decodeHtml(match[1]);
  }
  return "";
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 Codex education partnership research" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

function extractUsernames(html) {
  const names = new Set();
  for (const match of html.matchAll(/https?:\/\/t\.me\/(?:s\/)?([A-Za-z0-9_]{5,})/g)) {
    const username = match[1];
    if (!reserved.has(username.toLowerCase())) names.add(username);
  }
  for (const match of html.matchAll(/@([A-Za-z][A-Za-z0-9_]{4,})/g)) {
    if (!reserved.has(match[1].toLowerCase())) names.add(match[1]);
  }
  return names;
}

function classify(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  if (/(родител|мам|семейн|дети|школьник)/.test(text)) return "родители и семейное образование";
  if (/(репетитор|учител|педагог|методист|преподават)/.test(text)) return "педагоги и репетиторы";
  if (/(егэ|огэ|экзамен|русск|математ|физик|хими|биолог|истори|обществ|информат|литератур|англий)/.test(text)) return "подготовка к ОГЭ и ЕГЭ";
  if (/(школ|образован|обучен|study|университет)/.test(text)) return "образовательные медиа и школы";
  return "образовательное сообщество";
}

function offerFor(niche) {
  if (niche === "педагоги и репетиторы") return "бесплатный пилот кабинета педагога и совместный авторский тренажёр по одному номеру";
  if (niche === "родители и семейное образование") return "бесплатная игровая диагностика и понятный отчёт родителю в обмен на честную обратную связь";
  if (niche === "подготовка к ОГЭ и ЕГЭ") return "бартерный пробник: полезный тренажёр для аудитории и отдельная ссылка с результатами переходов";
  return "партнёрский пилот подготовки к ОГЭ/ЕГЭ с бесплатным доступом для небольшой группы";
}

function draftFor(title, niche) {
  const name = title.replace(/\s*[–—|-]\s*Telegram.*$/i, "").slice(0, 80);
  const offer = offerFor(niche);
  return `Здравствуйте! Изучил публичный канал «${name}». Мы сделали «ЭКЗАМ»: ребёнок выбирает конкретный номер ОГЭ/ЕГЭ, решает серию заданий в экзаменационной форме, после ошибки получает правило и повтор, а родитель — понятный отчёт по слабым темам. Предлагаю ${offer}. Сначала пришлю открытую демо-ссылку без обязательств; если формат не подходит аудитории, ничего размещать не нужно. Кому можно показать короткое демо?`;
}

const usernameSources = new Map();
for (const sourceUrl of sourcePages) {
  try {
    const html = await fetchText(sourceUrl);
    for (const username of extractUsernames(html)) {
      const sources = usernameSources.get(username.toLowerCase()) ?? { username, sources: [] };
      sources.sources.push(sourceUrl);
      usernameSources.set(username.toLowerCase(), sources);
    }
  } catch (error) {
    process.stderr.write(`SOURCE_WARNING ${error.message}\n`);
  }
}

const usernames = [...usernameSources.values()];
const profiles = [];
const skipped = [];
let cursor = 0;
const workers = Array.from({ length: 10 }, async () => {
  while (cursor < usernames.length) {
    const current = usernames[cursor++];
    const sourceUrl = `https://t.me/${current.username}`;
    try {
      const html = await fetchText(sourceUrl);
      const title = meta(html, "og:title") || current.username;
      const description = meta(html, "og:description");
      if (unsafePattern.test(`${title} ${description}`)) {
        skipped.push({ username: current.username, title, sourceUrl, reason: "Риск продвижения списывания, утечек или готовых ответов." });
        continue;
      }
      const niche = classify(title, description);
      const mentions = [...description.matchAll(/@([A-Za-z][A-Za-z0-9_]{4,})/g)]
        .map((match) => match[1])
        .filter((name) => name.toLowerCase() !== current.username.toLowerCase());
      const contactUsername = mentions[0];
      profiles.push({
        id: `edu-${current.username.toLowerCase()}`,
        kind: "generic",
        category: "found",
        status: contactUsername ? "ready" : "check",
        title,
        summary: description || "Публичная страница образовательного Telegram-канала или группы.",
        pain: niche === "педагоги и репетиторы" ? "Нужны удобная выдача практики, автопроверка и понятный результат ученика." : "Аудитории нужен безопасный и понятный способ отрабатывать слабые номера экзамена.",
        profile_check: `Публичная Telegram-страница открылась ${checkedAt.slice(0, 10)}.${contactUsername ? ` В описании найден публичный контакт @${contactUsername}.` : " Отдельный контакт администратора в описании не подтверждён — перед обращением проверить закреп и описание."}`,
        decision: contactUsername ? "Можно отправить одно персональное предложение по публичному контакту; без повторов при отсутствии ответа." : "Сначала вручную найти раздел рекламы/сотрудничества. Не писать участникам или подписчикам.",
        tags: [niche, contactUsername ? "контакт подтверждён" : "проверить контакт", "Telegram"],
        public_reply: draftFor(title, niche),
        dm_reply: contactUsername ? draftFor(title, niche) : "",
        dm_condition: contactUsername ? "Только один раз по публично указанному деловому контакту; прекратить при отказе или отсутствии интереса." : "",
        source_url: sourceUrl,
        official_url: sourceUrl,
        contact_url: contactUsername ? `https://t.me/${contactUsername}` : "",
        niche,
        source_registry: current.sources[0],
        verified_at: checkedAt,
      });
    } catch (error) {
      process.stderr.write(`PROFILE_WARNING ${current.username}: ${error.message}\n`);
    }
  }
});
await Promise.all(workers);

profiles.sort((left, right) => Number(right.status === "ready") - Number(left.status === "ready") || left.title.localeCompare(right.title, "ru"));
const selected = profiles.slice(0, 300);
if (selected.length < 300) throw new Error(`Only ${selected.length} verified safe candidates found; 300 required.`);

const templates = [
  {
    id: "template-tutor-pilot", kind: "generic", category: "template", status: "template", title: "Педагогу: бесплатный пилот", summary: "Первый контакт без продажи подписки.", pain: "Учителю нужно быстро выдать практику и увидеть ошибки.", profile_check: "Шаблон — получатель не выбран.", decision: "Использовать только после изучения конкретного канала.", tags: ["педагог", "пилот"], public_reply: "Здравствуйте! Посмотрел ваши материалы по подготовке к экзаменам. Предлагаю бесплатно собрать для вашей группы тренажёр одного номера ОГЭ/ЕГЭ: разные условия, автопроверка, разбор ошибки и отчёт по слабым темам. Вы оцените методику на небольшой группе, а мы исправим то, что неудобно учителю. Можно прислать демо?", niche: "педагоги и репетиторы",
  },
  {
    id: "template-parent-channel", kind: "generic", category: "template", status: "template", title: "Родительскому каналу: полезный тест", summary: "Бартер через полезный материал.", pain: "Родителю непонятно, что именно не получается у ребёнка.", profile_check: "Шаблон — получатель не выбран.", decision: "Предлагать администратору, не участникам.", tags: ["родители", "бартер"], public_reply: "Здравствуйте! Для вашей аудитории можем бесплатно дать короткую игровую диагностику ОГЭ/ЕГЭ: ребёнок отрабатывает один номер до трёх верных подряд, а родитель получает список слабых тем и следующий шаг. Предлагаю сначала проверить демо самим; если полезно — обсудим бартерный пост без обещаний баллов. Куда прислать ссылку?", niche: "родители и семейное образование",
  },
  {
    id: "template-ad-buy", kind: "generic", category: "template", status: "template", title: "Запрос цены на нативное размещение", summary: "Сначала запросить условия и статистику.", pain: "Нужно оценить соответствие аудитории и цену до оплаты.", profile_check: "Шаблон — получатель не выбран.", decision: "Запросить медиакит, охваты и маркировку рекламы.", tags: ["реклама", "медиакит"], public_reply: "Здравствуйте! Рассматриваем нативное размещение образовательного тренажёра ОГЭ/ЕГЭ. Пришлите, пожалуйста, медиакит: средний охват за 24/48 часов, долю аудитории 30+ и 14–18, форматы, цену, требования к маркировке и примеры последних интеграций. После этого предложим один полезный тестовый материал под вашу аудиторию.", niche: "образовательные медиа",
  },
];

const skipItems = skipped.slice(0, 40).map((item, index) => ({
  id: `skip-${index + 1}`, kind: "generic", category: "skip", status: "skip", title: item.title, summary: item.reason, pain: "Репутационный и правовой риск.", profile_check: `Публичная страница проверена ${checkedAt.slice(0, 10)}.`, decision: "Не писать и не размещаться.", tags: ["не писать", "готовые ответы"], public_reply: "", source_url: item.sourceUrl, niche: "исключено",
}));

const raw = { generated_at: checkedAt, sources: sourcePages, total_discovered: usernames.length, verified_safe: profiles.length, selected: selected.length, skipped: skipped.length, leads: selected };
const board = {
  title: "ЭКЗАМ · 300 публичных точек входа",
  subtitle: "Каналы, группы и педагоги для ручного партнёрского контакта. Никаких сообщений подписчикам и родителям в личку.",
  updated_at: checkedAt,
  sections: [
    { id: "verified", title: `300 проверенных публичных страниц`, description: "Ready — в описании найден публичный контакт. Check — сначала открыть канал и найти правила рекламы или сотрудничества.", items: selected },
    { id: "templates", title: "Шаблоны первого сообщения", description: "Адаптировать после просмотра последних публикаций. Одно сообщение, без повторного давления.", items: templates },
    { id: "skip", title: "Не писать", description: "Исключённые страницы с риском списывания, утечек или готовых ответов.", items: skipItems },
  ],
};

await mkdir(researchDir, { recursive: true });
await writeFile(path.join(researchDir, "education-public-leads.json"), `${JSON.stringify(raw, null, 2)}\n`, "utf8");
await writeFile(path.join(researchDir, "education-lead-board-input.json"), `${JSON.stringify(board, null, 2)}\n`, "utf8");
process.stdout.write(`${JSON.stringify({ ok: true, discovered: usernames.length, verifiedSafe: profiles.length, selected: selected.length, readyContacts: selected.filter((item) => item.status === "ready").length, skipped: skipped.length }, null, 2)}\n`);
