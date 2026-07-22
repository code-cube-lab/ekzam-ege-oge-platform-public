import {
  findTelegramTask,
  getTelegramStudent,
  miniAppUrl,
  recordTelegramAnswer,
  sendTaskMessage,
  setReminders,
  setStudentTrack,
  studentTrackLabel,
  telegramApi,
  upsertTelegramStudent,
  webhookSecret,
} from "../../../lib/telegram";

type Message = { chat: { id: number }; from?: { id: number; first_name?: string; username?: string }; text?: string };
type Callback = { id: string; from: { id: number; first_name?: string; username?: string }; message?: { chat: { id: number } }; data?: string };
type Update = { message?: Message; callback_query?: Callback };

function trackKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "ЕГЭ · Русский", callback_data: "track:ege:russian" }, { text: "ЕГЭ · Литература", callback_data: "track:ege:literature" }],
      [{ text: "ОГЭ · Русский", callback_data: "track:oge:russian" }, { text: "ОГЭ · Литература", callback_data: "track:oge:literature" }],
    ],
  };
}

export async function GET() {
  return Response.json({ ok: true, service: "slovo-telegram-webhook" });
}

export async function POST(request: Request) {
  const expected = webhookSecret();
  const received = request.headers.get("x-telegram-bot-api-secret-token") ?? "";
  if (!expected || received !== expected) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const update = (await request.json()) as Update;
  if (update.message) await handleMessage(update.message, request.url);
  if (update.callback_query) await handleCallback(update.callback_query);
  return Response.json({ ok: true });
}

async function handleMessage(message: Message, requestUrl: string) {
  if (!message.from) return;
  const student = await upsertTelegramStudent(message.from, String(message.chat.id));
  if (!student) return;
  const command = (message.text ?? "").split(/\s+/)[0].split("@")[0].toLowerCase();
  const appUrl = miniAppUrl(requestUrl);

  if (command === "/start") {
    await telegramApi("sendMessage", {
      chat_id: student.chatId,
      text: `Здравствуйте, ${student.firstName}! Я бот платформы «Слово». Каждый день дам одно короткое задание, разберу ответ и подберу следующий шаг.\n\nСначала выберите свой экзамен и предмет:`,
      reply_markup: trackKeyboard(),
    });
    await telegramApi("sendMessage", {
      chat_id: student.chatId,
      text: "В Mini App можно видеть личное задание и объяснение преподавателя.",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Открыть личный маршрут", web_app: { url: appUrl } }],
          [{ text: "Задание на сегодня", callback_data: "today" }],
        ],
      },
    });
    return;
  }
  if (command === "/track") {
    await telegramApi("sendMessage", { chat_id: student.chatId, text: `Сейчас выбрано: ${studentTrackLabel(student)}. Можно изменить:`, reply_markup: trackKeyboard() });
    return;
  }
  if (command === "/today") { await sendTaskMessage(student); return; }
  if (command === "/remind_on") {
    await setReminders(student.telegramId, true);
    await telegramApi("sendMessage", { chat_id: student.chatId, text: "🔔 Ежедневные задания включены. Плановое время — 10:00 по Москве." });
    return;
  }
  if (command === "/remind_off") {
    await setReminders(student.telegramId, false);
    await telegramApi("sendMessage", { chat_id: student.chatId, text: "Напоминания выключены. Вернуть их можно командой /remind_on." });
    return;
  }
  if (command === "/terms") {
    await telegramApi("sendMessage", { chat_id: student.chatId, text: `Условия использования: ${new URL("/terms", requestUrl).toString()}` });
    return;
  }
  if (command === "/support" || command === "/paysupport") {
    const path = command === "/paysupport" ? "/paysupport" : "/support";
    await telegramApi("sendMessage", { chat_id: student.chatId, text: `Поддержка: ${new URL(path, requestUrl).toString()}` });
    return;
  }
  await telegramApi("sendMessage", {
    chat_id: student.chatId,
    text: "Команды: /today — задание, /track — экзамен и предмет, /remind_on — включить ежедневную отправку, /remind_off — выключить, /help — помощь.",
    reply_markup: { inline_keyboard: [[{ text: "Открыть платформу", web_app: { url: appUrl } }]] },
  });
}

async function handleCallback(callback: Callback) {
  const chatId = callback.message?.chat.id ?? callback.from.id;
  const student = (await getTelegramStudent(String(callback.from.id))) ?? (await upsertTelegramStudent(callback.from, String(chatId)));
  if (!student) return;
  const trackMatch = callback.data?.match(/^track:(oge|ege):(russian|literature)$/);
  if (trackMatch) {
    const updated = await setStudentTrack(student.telegramId, trackMatch[1] as "oge" | "ege", trackMatch[2] as "russian" | "literature");
    await telegramApi("answerCallbackQuery", { callback_query_id: callback.id, text: "Маршрут сохранён" });
    if (updated) {
      await telegramApi("sendMessage", { chat_id: updated.chatId, text: `✅ Выбрано: ${studentTrackLabel(updated)}. Начинаем с короткой диагностики.` });
      await sendTaskMessage(updated);
    }
    return;
  }
  if (callback.data === "today") {
    await telegramApi("answerCallbackQuery", { callback_query_id: callback.id });
    await sendTaskMessage(student);
    return;
  }
  const nextMatch = callback.data?.match(/^next:([^:]+)$/);
  if (nextMatch) {
    await telegramApi("answerCallbackQuery", { callback_query_id: callback.id });
    await sendTaskMessage(student, undefined, nextMatch[1]);
    return;
  }
  const match = callback.data?.match(/^a:([^:]+):(\d+)$/);
  if (!match) return;
  const task = findTelegramTask(match[1]);
  if (!task) return;
  const result = await recordTelegramAnswer(student, task, Number(match[2]));
  await telegramApi("answerCallbackQuery", { callback_query_id: callback.id, text: result.correct ? "Верно!" : "Разберём ответ" });
  await telegramApi("sendMessage", {
    chat_id: student.chatId,
    text: `${result.correct ? "✅ Верно" : "🧩 Пока нет"}\n\nДиагноз: ${task.topic}.\n${task.explanation}\n\nСледующий шаг: ${task.skillHint}\n\nОсвоение темы: ${Math.round(result.mastery * 100)}%. Повторение запланировано на ${result.nextReviewAt}.`,
    reply_markup: { inline_keyboard: [[{ text: "Ещё одно короткое задание", callback_data: `next:${task.key}` }]] },
  });
}
