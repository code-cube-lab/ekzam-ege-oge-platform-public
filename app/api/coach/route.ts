import { getSession } from "../../lib/demo-store";

export async function POST(request: Request) {
  const session = await getSession(request);
  if (!session) return Response.json({ error: "Authentication required" }, { status: 401 });
  if (session.state !== "paid" && session.state !== "admin" && session.state !== "director") {
    return Response.json({ error: "Paid entitlement required" }, { status: 403 });
  }
  const body = (await request.json()) as { text?: string };
  const text = body.text?.trim() ?? "";
  if (text.length < 20) {
    return Response.json(
      { error: "Добавьте тезис и хотя бы один аргумент — не менее 20 символов." },
      { status: 400 },
    );
  }

  const hasBecause = /потому|так как|поскольку|поэтому/i.test(text);
  const hasExample = /например|пример|герой|автор|произвед/i.test(text);
  return Response.json({
    mode: "rule-based-demo",
    strength: hasBecause
      ? "Логическая связь между тезисом и объяснением уже заметна."
      : "Тезис сформулирован достаточно ясно для дальнейшей работы.",
    issue: hasExample
      ? "Пример есть, но свяжите его с выводом отдельной фразой."
      : "Не хватает конкретного примера из текста или читательского опыта.",
    nextStep: "Добавьте связку «этот пример показывает, что…» и проверьте, отвечает ли вывод исходному тезису.",
    note: "Это локальный демонстрационный движок. Внешняя AI-модель подключается после выбора провайдера и загрузки методики эксперта.",
  });
}
