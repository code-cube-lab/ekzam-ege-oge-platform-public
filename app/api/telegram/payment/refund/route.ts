import { refundTelegramStars, telegramAdminSecret } from "../../../../lib/telegram";

export async function POST(request: Request) {
  const expected = telegramAdminSecret();
  const received = request.headers.get("x-ekzam-admin-secret") ?? "";
  if (!expected) return Response.json({ error: "Refund administration is not configured" }, { status: 503 });
  if (received !== expected) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { telegramId?: string; telegramPaymentChargeId?: string };
  if (!body.telegramId || !body.telegramPaymentChargeId) return Response.json({ error: "Payment identifiers are required" }, { status: 400 });
  try {
    return Response.json(await refundTelegramStars(body.telegramId, body.telegramPaymentChargeId));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Refund failed" }, { status: 409 });
  }
}
