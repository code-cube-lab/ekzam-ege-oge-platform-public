import {
  findTelegramTask,
  getTelegramStudent,
  miniAppUrl,
  recordTelegramAnswer,
  sendTaskMessage,
  setReminders,
  telegramApi,
  upsertTelegramStudent,
  webhookSecret,
} from "../../../lib/telegram";

type Message = { chat: { id: number }; from?: { id: number; first_name?: string; username?: string }; text?: string };
type Callback = { id: string; from: { id: number; first_name?: string; username?: string }; message?: { chat: { id: number } }; data?: string };
type Update = { message?: Message; callback_query?: Callback };

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
      text: `Здравствуйте, ${student.firstName}! Я бот платформы «Слово». Каждый день дам одно короткое задание и подберу следующее по вашим ответам.`,
      reply_markup: {
        inline_keyboard: [
          [{ text: "Открыть личный маршрут", web_app: { url: appUrl } }],
          [{ text: "Задание на сегодня", callback_data: "today" }],
        ],
      },
    });
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
    text: "Команды: /today — задание, /remind_on — включить ежедневную отправку, /remind_off — выключить, /help — помощь.",
    reply_markup: { inline_keyboard: [[{ text: "Открыть платформу", web_app: { url: appUrl } }]] },
  });
}

async function handleCallback(callback: Callback) {
  const chatId = callback.message?.chat.id ?? callback.from.id;
  const student = (await getTelegramStudent(String(callback.from.id))) ?? (await upsertTelegramStudent(callback.from, String(chatId)));
  if (!student) return;
  if (callback.data === "today") {
    await telegramApi("answerCallbackQuery", { callback_query_id: callback.id });
    await sendTaskMessage(student);
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
    text: `${result.correct ? "✅ Верно" : "🧩 Пока нет"}\n\n${task.explanation}\n\n💡 ${task.skillHint}\n\nСледующее задание учтёт этот результат.`,
    reply_markup: { inline_keyboard: [[{ text: "Ещё одно короткое задание", callback_data: "today" }]] },
  });
}
