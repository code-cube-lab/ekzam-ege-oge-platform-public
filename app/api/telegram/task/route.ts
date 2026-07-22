import {
  findTelegramTask,
  getTelegramStudent,
  recordTelegramAnswer,
  selectTaskForStudent,
  upsertTelegramStudent,
  verifyTelegramInitData,
} from "../../../lib/telegram";

async function authenticatedStudent(initData: string) {
  const verified = await verifyTelegramInitData(initData);
  if (!verified.ok) return { error: verified.error } as const;
  const student = (await getTelegramStudent(String(verified.user.id))) ?? (await upsertTelegramStudent(verified.user));
  if (!student) return { error: "Student profile unavailable" } as const;
  return { student } as const;
}

export async function POST(request: Request) {
  const body = (await request.json()) as { initData?: string; taskKey?: string; answerIndex?: number };
  const auth = await authenticatedStudent(body.initData ?? "");
  if ("error" in auth) return Response.json({ error: auth.error }, { status: 401 });

  if (body.taskKey && Number.isInteger(body.answerIndex)) {
    const task = findTelegramTask(body.taskKey);
    if (!task) return Response.json({ error: "Task not found" }, { status: 404 });
    const result = await recordTelegramAnswer(auth.student, task, Number(body.answerIndex));
    return Response.json({
      result: { correct: result.correct, explanation: task.explanation, skillHint: task.skillHint },
      weakTopics: result.weakTopics,
    });
  }

  const task = selectTaskForStudent(auth.student);
  return Response.json({
    task: {
      key: task.key,
      topic: task.topic,
      title: task.title,
      question: task.question,
      options: task.options,
    },
  });
}
