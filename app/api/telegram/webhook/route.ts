import {
  deleteTelegramStudent,
  findTelegramTask,
  getTelegramStudent,
  miniAppUrl,
  recordTelegramAnswer,
  recordTelegramConsent,
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
  return Response.json({ ok: true, service: "ekzam-telegram-webhook" });
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
  const command = (message.text ?? "").split(/\s+/)[0].split("@")[0].toLowerCase();
  const appUrl = miniAppUrl(requestUrl);
  const existing = await getTelegramStudent(String(message.from.id));

  if (command === "/start") {
    if (!existing?.consentedAt) {
      await sendConsentPrompt(String(message.chat.id), requestUrl);
      return;
    }
    const student = await upsertTelegramStudent(message.from, String(message.chat.id));
    if (!student) return;
    await telegramApi("sendMessage", {
      chat_id: student.chatId,
      text: `Здравствуйте, ${student.firstName}! Я бот школы «ЭКЗАМ». Каждый день дам одно короткое задание, разберу ответ и подберу следующий шаг.\n\nСначала выберите свой экзамен и предмет:`,
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
  if (command === "/terms" && !existing?.consentedAt) {
    await telegramApi("sendMessage", { chat_id: String(message.chat.id), text: `Условия использования: ${new URL("/terms", requestUrl).toString()}` });
    return;
  }
  if ((command === "/support" || command === "/paysupport") && !existing?.consentedAt) {
    const path = command === "/paysupport" ? "/paysupport" : "/support";
    await telegramApi("sendMessage", { chat_id: String(message.chat.id), text: `Поддержка: ${new URL(path, requestUrl).toString()}` });
    return;
  }
  if (!existing?.consentedAt) {
    await sendConsentPrompt(String(message.chat.id), requestUrl);
    return;
  }
  const student = await upsertTelegramStudent(message.from, String(message.chat.id));
  if (!student) return;
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
  if (command === "/delete_data") {
    await telegramApi("sendMessage", {
      chat_id: student.chatId,
      text: "Удалить профиль, ответы, прогресс и расписание повторений? Это действие нельзя отменить.",
      reply_markup: { inline_keyboard: [[{ text: "Да, удалить мои данные", callback_data: "delete:confirm" }], [{ text: "Отмена", callback_data: "delete:cancel" }]] },
    });
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

async function sendConsentPrompt(chatId: string, requestUrl: string) {
  await telegramApi("sendMessage", {
    chat_id: chatId,
    text: "Перед созданием личного маршрута нужно отдельное согласие на обработку минимальных данных: Telegram ID и имя, ответы, ошибки и прогресс.\n\nЕсли ученику меньше 18 лет, согласие даёт родитель или законный представитель. Выбор кнопки ниже означает согласие по опубликованному тексту.",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Я родитель / представитель", callback_data: "consent:parent" }],
        [{ text: "Мне 18 лет или больше", callback_data: "consent:adult_student" }],
        [{ text: "Текст согласия", url: new URL("/consent", requestUrl).toString() }, { text: "Политика", url: new URL("/privacy", requestUrl).toString() }],
      ],
    },
  });
}

async function handleCallback(callback: Callback) {
  const chatId = callback.message?.chat.id ?? callback.from.id;
  const consentMatch = callback.data?.match(/^consent:(parent|adult_student)$/);
  if (consentMatch) {
    const created = await upsertTelegramStudent(callback.from, String(chatId));
    if (!created) return;
    const student = await recordTelegramConsent(created.telegramId, consentMatch[1] as "parent" | "adult_student");
    await telegramApi("answerCallbackQuery", { callback_query_id: callback.id, text: "Согласие сохранено" });
    if (student) await telegramApi("sendMessage", { chat_id: student.chatId, text: `Спасибо, ${student.firstName}. Теперь выберите экзамен и предмет:`, reply_markup: trackKeyboard() });
    return;
  }
  const student = await getTelegramStudent(String(callback.from.id));
  if (!student?.consentedAt) {
    await telegramApi("answerCallbackQuery", { callback_query_id: callback.id, text: "Сначала подтвердите согласие через /start", show_alert: true });
    return;
  }
  if (callback.data === "delete:cancel") {
    await telegramApi("answerCallbackQuery", { callback_query_id: callback.id, text: "Удаление отменено" });
    return;
  }
  if (callback.data === "delete:confirm") {
    await telegramApi("answerCallbackQuery", { callback_query_id: callback.id, text: "Данные удалены" });
    await deleteTelegramStudent(student.telegramId);
    await telegramApi("sendMessage", { chat_id: student.chatId, text: "Ваш профиль, ответы и прогресс удалены. Открытые материалы остаются доступны. Чтобы начать заново, отправьте /start." });
    return;
  }
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
