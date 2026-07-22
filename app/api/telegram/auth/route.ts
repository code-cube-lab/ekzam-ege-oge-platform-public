import { getTelegramAccess, getTelegramStudent, TELEGRAM_PRODUCT, verifyTelegramInitData } from "../../../lib/telegram";

export async function POST(request: Request) {
  const body = (await request.json()) as { initData?: string };
  const verified = await verifyTelegramInitData(body.initData ?? "");
  if (!verified.ok) return Response.json({ error: verified.error }, { status: 401 });
  const student = await getTelegramStudent(String(verified.user.id));
  if (!student?.consentedAt) return Response.json({ error: "Сначала подтвердите согласие в чате бота командой /start" }, { status: 403 });
  const access = await getTelegramAccess(student.telegramId);
  return Response.json({
    student: {
      firstName: student?.firstName ?? verified.user.first_name ?? "Ученик",
      exam: student?.exam ?? "ege",
      subject: student?.subject ?? "russian",
      weakTopics: student?.weakTopics ?? [],
      lastScore: student?.lastScore ?? 0,
      remindersEnabled: student?.remindersEnabled ?? true,
    },
    access,
    product: { code: TELEGRAM_PRODUCT.code, title: TELEGRAM_PRODUCT.title, amount: TELEGRAM_PRODUCT.amount, currency: TELEGRAM_PRODUCT.currency, accessDays: TELEGRAM_PRODUCT.accessDays },
    verification: "telegram-init-data",
  });
}
