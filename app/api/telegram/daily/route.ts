import {
  cronSecret,
  listReminderStudents,
  markDailySent,
  sendTaskMessage,
} from "../../../lib/telegram";

export async function POST(request: Request) {
  const expected = cronSecret();
  const authorization = request.headers.get("authorization") ?? "";
  if (!expected || authorization !== `Bearer ${expected}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const day = new Date().toISOString().slice(0, 10);
  const students = await listReminderStudents();
  let sent = 0;
  const errors: string[] = [];
  for (const student of students) {
    if (student.lastDailySent === day) continue;
    try {
      await sendTaskMessage(student);
      await markDailySent(student.telegramId, day);
      sent += 1;
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "Unknown delivery error");
    }
  }
  return Response.json({ day, eligible: students.length, sent, errors: errors.slice(0, 5) });
}
