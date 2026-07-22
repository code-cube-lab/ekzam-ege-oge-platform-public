import { getSession, saveDiagnostic } from "../../lib/demo-store";

const answerKey = [1, 2, 0, 1, 2];
const topics = [
  "Орфоэпия",
  "Слитное и раздельное написание НЕ",
  "Пунктуация",
  "Теория литературы",
  "Аргументация сочинения",
];

export async function POST(request: Request) {
  const session = await getSession(request);
  if (!session) return Response.json({ error: "Authentication required" }, { status: 401 });
  const body = (await request.json()) as { answers?: number[] };
  if (!Array.isArray(body.answers) || body.answers.length !== answerKey.length) {
    return Response.json({ error: "Five answers required" }, { status: 400 });
  }
  const correct = answerKey.reduce(
    (total, value, index) => total + (body.answers?.[index] === value ? 1 : 0),
    0,
  );
  const score = Math.round(44 + correct * 9.4);
  const weakTopics = topics.filter((_, index) => body.answers?.[index] !== answerKey[index]);
  await saveDiagnostic(session.id, score, weakTopics);
  return Response.json({
    score,
    correct,
    total: answerKey.length,
    weakTopics,
    nextLesson: weakTopics[0] ?? "Практика сочинения: точность формулировки",
  });
}
