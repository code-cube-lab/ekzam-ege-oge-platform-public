import {
  getTelegramStudent,
  isExamTrack,
  isSubjectTrack,
  isTrackAvailable,
  setStudentTrack,
  verifyTelegramInitData,
} from "../../../lib/telegram";

export async function POST(request: Request) {
  const body = (await request.json()) as { initData?: string; exam?: string; subject?: string };
  const verified = await verifyTelegramInitData(body.initData ?? "");
  if (!verified.ok) return Response.json({ error: verified.error }, { status: 401 });
  const telegramId = String(verified.user.id);
  const student = await getTelegramStudent(telegramId);
  if (!student?.consentedAt) {
    return Response.json({ error: "Сначала подтвердите согласие в чате бота командой /start" }, { status: 403 });
  }
  if (!body.exam || !isExamTrack(body.exam) || !body.subject || !isSubjectTrack(body.subject) || !isTrackAvailable(body.exam, body.subject)) {
    return Response.json({ error: "Этот предмет недоступен для выбранного экзамена" }, { status: 400 });
  }
  const updated = await setStudentTrack(telegramId, body.exam, body.subject);
  return Response.json({
    student: updated && {
      exam: updated.exam,
      subject: updated.subject,
      weakTopics: updated.weakTopics,
      lastScore: updated.lastScore,
    },
  });
}
