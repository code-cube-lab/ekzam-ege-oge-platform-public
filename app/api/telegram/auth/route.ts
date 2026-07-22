import { getTelegramStudent, verifyTelegramInitData } from "../../../lib/telegram";

export async function POST(request: Request) {
  const body = (await request.json()) as { initData?: string };
  const verified = await verifyTelegramInitData(body.initData ?? "");
  if (!verified.ok) return Response.json({ error: verified.error }, { status: 401 });
  const student = await getTelegramStudent(String(verified.user.id));
  if (!student?.consentedAt) return Response.json({ error: "Сначала подтвердите согласие в чате бота командой /start" }, { status: 403 });
  return Response.json({
    student: {
      firstName: student?.firstName ?? verified.user.first_name ?? "Ученик",
      exam: student?.exam ?? "ege",
      subject: student?.subject ?? "russian",
      weakTopics: student?.weakTopics ?? [],
      lastScore: student?.lastScore ?? 0,
      remindersEnabled: student?.remindersEnabled ?? true,
    },
    verification: "telegram-init-data",
  });
}
