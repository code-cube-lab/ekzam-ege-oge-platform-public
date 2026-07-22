import { recordConsent, type ConsentActor } from "../../lib/demo-store";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    actor?: ConsentActor;
    personalDataAccepted?: boolean;
    termsAccepted?: boolean;
  };
  if (body.actor !== "adult_student" && body.actor !== "parent") {
    return Response.json({ error: "Выберите, кто даёт согласие" }, { status: 400 });
  }
  if (body.personalDataAccepted !== true || body.termsAccepted !== true) {
    return Response.json({ error: "Нужны две отдельные отметки" }, { status: 400 });
  }
  try {
    const session = await recordConsent(request, body.actor);
    return Response.json({ session, recorded: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Не удалось сохранить согласие" }, { status: 401 });
  }
}
