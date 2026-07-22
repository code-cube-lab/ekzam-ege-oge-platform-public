import {
  createTelegramStarsInvoice,
  getTelegramStudent,
  verifyTelegramInitData,
} from "../../../../lib/telegram";

export async function POST(request: Request) {
  const body = (await request.json()) as { initData?: string };
  const verified = await verifyTelegramInitData(body.initData ?? "");
  if (!verified.ok) return Response.json({ error: verified.error }, { status: 401 });
  const student = await getTelegramStudent(String(verified.user.id));
  if (!student?.consentedAt) return Response.json({ error: "Сначала подтвердите согласие через /start" }, { status: 403 });
  try {
    return Response.json(await createTelegramStarsInvoice(student));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Не удалось создать счёт" }, { status: 502 });
  }
}
