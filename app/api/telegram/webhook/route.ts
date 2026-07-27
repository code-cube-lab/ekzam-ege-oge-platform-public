import {
  answerTelegramPreCheckout,
  createTelegramStarsInvoice,
  deleteTelegramStudent,
  findTelegramTask,
  getTelegramAccess,
  getTelegramStudent,
  getTelegramTrackCatalog,
  hasPaidTelegramAccess,
  isExamTrack,
  isSubjectTrack,
  isTrackAvailable,
  miniAppUrl,
  recordSuccessfulTelegramPayment,
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

type SuccessfulPayment = { currency: string; total_amount: number; invoice_payload: string; telegram_payment_charge_id: string };
type Message = { chat: { id: number }; from?: { id: number; first_name?: string; username?: string }; text?: string; successful_payment?: SuccessfulPayment };
type Callback = { id: string; from: { id: number; first_name?: string; username?: string }; message?: { chat: { id: number } }; data?: string };
type PreCheckout = { id: string; from: { id: number }; currency: string; total_amount: number; invoice_payload: string };
type Update = { message?: Message; callback_query?: Callback; pre_checkout_query?: PreCheckout };

function examKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "ОГЭ · 9 класс", callback_data: "track:exam:oge" }],
      [{ text: "ЕГЭ · 11 класс", callback_data: "track:exam:ege" }],
    ],
  };
}

function subjectKeyboard(exam: "oge" | "ege") {
  const buttons = getTelegramTrackCatalog()
    .filter((subject) => exam === "ege" || subject.ogeAvailable)
    .map((subject) => ({ text: subject.shortName, callback_data: `track:subject:${subject.slug}` }));
  return {
    inline_keyboard: Array.from({ length: Math.ceil(buttons.length / 2) }, (_, index) => buttons.slice(index * 2, index * 2 + 2)),
  };
}

function appLink(appUrl: string, tab = "today") {
  const url = new URL(appUrl);
  url.searchParams.set("tab", tab);
  return url.toString();
}

export async function GET() {
  return Response.json({ ok: true, service: "ekzam-telegram-webhook", flow: "exam-first" });
}

export async function POST(request: Request) {
  const expected = webhookSecret();
  const received = request.headers.get("x-telegram-bot-api-secret-token") ?? "";
  if (!expected || received !== expected) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const update = (await request.json()) as Update;
  if (update.pre_checkout_query) await answerTelegramPreCheckout(update.pre_checkout_query);
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
      text: `Здравствуйте, ${student.firstName}! Это мобильный маршрут «ЭКЗАМ».\n\n1. Выберите ОГЭ или ЕГЭ.\n2. Выберите предмет.\n3. Решите полный вариант.\n4. Получайте короткие задания по своим ошибкам.`,
      reply_markup: examKeyboard(),
    });
    await telegramApi("sendMessage", {
      chat_id: student.chatId,
      text: "Mini App хранит маршрут, ошибки и ежедневную практику в одном окне.",
      reply_markup: { inline_keyboard: [[{ text: "Открыть Mini App", web_app: { url: appLink(appUrl) } }]] },
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
  if (message.successful_payment) {
    const access = await recordSuccessfulTelegramPayment(student.telegramId, message.successful_payment);
    const accessUntil = access.expiresAt
      ? new Date(access.expiresAt).toLocaleDateString("ru-RU")
      : "окончания оплаченного периода";
    await telegramApi("sendMessage", {
      chat_id: student.chatId,
      text: `✅ Оплата подтверждена Telegram. Персональная практика открыта до ${accessUntil}.`,
      reply_markup: {
        inline_keyboard: [
          [{ text: "Открыть Mini App", web_app: { url: appLink(appUrl) } }],
          [{ text: "Поддержка оплаты", url: new URL("/paysupport", requestUrl).toString() }],
        ],
      },
    });
    return;
  }

  if (command === "/track") {
    await telegramApi("sendMessage", {
      chat_id: student.chatId,
      text: `Сейчас выбрано: ${studentTrackLabel(student)}.\n\nСначала выберите экзамен:`,
      reply_markup: examKeyboard(),
    });
    return;
  }
  if (command === "/exam") {
    await telegramApi("sendMessage", {
      chat_id: student.chatId,
      text: `${studentTrackLabel(student)}. Откройте полный вариант и решайте задания по одному:`,
      reply_markup: { inline_keyboard: [[{ text: "Открыть полный вариант", web_app: { url: appLink(appUrl, "variant") } }]] },
    });
    return;
  }
  if (command === "/today") {
    await sendTaskMessage(student);
    return;
  }
  if (command === "/mistakes") {
    const weak = student.weakTopics.length
      ? student.weakTopics.map((topic, index) => `${index + 1}. ${topic}`).join("\n")
      : "Ошибок для отработки пока нет. Сначала решите полный вариант или задание дня.";
    await telegramApi("sendMessage", {
      chat_id: student.chatId,
      text: `🧩 Темы для повторения\n\n${weak}`,
      reply_markup: { inline_keyboard: [[{ text: "Открыть тетрадь ошибок", web_app: { url: appLink(appUrl, "mistakes") } }]] },
    });
    return;
  }
  if (command === "/buy") {
    const invoice = await createTelegramStarsInvoice(student);
    if (invoice.status === "paid") {
      await telegramApi("sendMessage", { chat_id: student.chatId, text: "Доступ уже активен. Откройте Mini App командой /start." });
    } else {
      await telegramApi("sendMessage", {
        chat_id: student.chatId,
        text: "Персональная практика на 30 дней — 199 ⭐. Доступ появится только после подтверждения Telegram.",
        reply_markup: { inline_keyboard: [[{ text: "Оплатить 199 ⭐", url: invoice.invoiceLink }]] },
      });
    }
    return;
  }
  if (command === "/status") {
    const access = await getTelegramAccess(student.telegramId);
    await telegramApi("sendMessage", {
      chat_id: student.chatId,
      text: access.status === "paid"
        ? `Доступ активен до ${new Date(access.expiresAt!).toLocaleDateString("ru-RU")}.`
        : "Платный доступ не активен. Оформить: /buy",
    });
    return;
  }
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
      reply_markup: {
        inline_keyboard: [
          [{ text: "Да, удалить мои данные", callback_data: "delete:confirm" }],
          [{ text: "Отмена", callback_data: "delete:cancel" }],
        ],
      },
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
    text: [
      "Команды:",
      "/exam — полный ОГЭ/ЕГЭ-вариант",
      "/today — короткое задание по маршруту",
      "/mistakes — темы для повторения",
      "/track — сменить экзамен и предмет",
      "/buy — оплатить практику Stars",
      "/status — проверить доступ",
      "/remind_on и /remind_off — напоминания",
      "/terms, /support, /paysupport — документы и помощь",
    ].join("\n"),
    reply_markup: { inline_keyboard: [[{ text: "Открыть Mini App", web_app: { url: appLink(appUrl) } }]] },
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
    if (student) {
      await telegramApi("sendMessage", {
        chat_id: student.chatId,
        text: `Спасибо, ${student.firstName}. Сначала выберите ОГЭ или ЕГЭ:`,
        reply_markup: examKeyboard(),
      });
    }
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
    await telegramApi("sendMessage", { chat_id: student.chatId, text: "Ваш профиль, ответы и прогресс удалены. Чтобы начать заново, отправьте /start." });
    return;
  }

  const examMatch = callback.data?.match(/^track:exam:(oge|ege)$/);
  if (examMatch && isExamTrack(examMatch[1])) {
    const exam = examMatch[1];
    const subject = isTrackAvailable(exam, student.subject) ? student.subject : "russian";
    const updated = await setStudentTrack(student.telegramId, exam, subject);
    await telegramApi("answerCallbackQuery", { callback_query_id: callback.id, text: `${exam.toUpperCase()} выбран` });
    if (updated) {
      await telegramApi("sendMessage", {
        chat_id: updated.chatId,
        text: `${exam.toUpperCase()}: теперь выберите предмет.`,
        reply_markup: subjectKeyboard(exam),
      });
    }
    return;
  }

  const subjectMatch = callback.data?.match(/^track:subject:([a-z]+)$/);
  if (subjectMatch && isSubjectTrack(subjectMatch[1])) {
    if (!isTrackAvailable(student.exam, subjectMatch[1])) {
      await telegramApi("answerCallbackQuery", { callback_query_id: callback.id, text: "Предмет недоступен для этого экзамена", show_alert: true });
      return;
    }
    const updated = await setStudentTrack(student.telegramId, student.exam, subjectMatch[1]);
    await telegramApi("answerCallbackQuery", { callback_query_id: callback.id, text: "Маршрут сохранён" });
    if (updated) {
      await telegramApi("sendMessage", { chat_id: updated.chatId, text: `✅ Выбрано: ${studentTrackLabel(updated)}. Начинаем с короткой диагностики.` });
      await sendTaskMessage(updated);
    }
    return;
  }

  // Compatibility with buttons sent by the previous bot revision.
  const legacyTrack = callback.data?.match(/^track:(oge|ege):([a-z]+)$/);
  if (legacyTrack && isExamTrack(legacyTrack[1]) && isSubjectTrack(legacyTrack[2]) && isTrackAvailable(legacyTrack[1], legacyTrack[2])) {
    const updated = await setStudentTrack(student.telegramId, legacyTrack[1], legacyTrack[2]);
    await telegramApi("answerCallbackQuery", { callback_query_id: callback.id, text: "Маршрут обновлён" });
    if (updated) await sendTaskMessage(updated);
    return;
  }

  if (callback.data === "today") {
    await telegramApi("answerCallbackQuery", { callback_query_id: callback.id });
    await sendTaskMessage(student);
    return;
  }
  const nextMatch = callback.data?.match(/^next:([^:]+)$/);
  if (nextMatch) {
    if (!(await hasPaidTelegramAccess(student.telegramId))) {
      const invoice = await createTelegramStarsInvoice(student);
      await telegramApi("answerCallbackQuery", { callback_query_id: callback.id, text: "Следующие задания входят в персональный план", show_alert: true });
      if (invoice.status !== "paid") {
        await telegramApi("sendMessage", {
          chat_id: student.chatId,
          text: "Персональная практика на 30 дней — 199 ⭐.",
          reply_markup: { inline_keyboard: [[{ text: "Оплатить 199 ⭐", url: invoice.invoiceLink }]] },
        });
      }
      return;
    }
    await telegramApi("answerCallbackQuery", { callback_query_id: callback.id });
    await sendTaskMessage(student, undefined, nextMatch[1]);
    return;
  }

  const answerMatch = callback.data?.match(/^a:([^:]+):(\d+)$/);
  if (!answerMatch) return;
  const task = findTelegramTask(answerMatch[1]);
  if (!task || task.exam !== student.exam || task.subject !== student.subject) {
    await telegramApi("answerCallbackQuery", { callback_query_id: callback.id, text: "Задание относится к старому маршруту. Запросите /today.", show_alert: true });
    return;
  }
  const result = await recordTelegramAnswer(student, task, Number(answerMatch[2]));
  await telegramApi("answerCallbackQuery", { callback_query_id: callback.id, text: result.correct ? "Верно!" : "Разберём ответ" });
  await telegramApi("sendMessage", {
    chat_id: student.chatId,
    text: `${result.correct ? "✅ Верно" : "🧩 Пока нет"}\n\nДиагноз: ${task.topic}.\n${task.explanation}\n\nСледующий шаг: ${task.skillHint}\n\nОсвоение темы: ${Math.round(result.mastery * 100)}%. Повторение запланировано на ${result.nextReviewAt}.`,
    reply_markup: { inline_keyboard: [[{ text: "Ещё одно короткое задание", callback_data: `next:${task.key}` }]] },
  });
}
