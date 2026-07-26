import type { Metadata } from "next";
import { TeacherAcademyClient } from "../components/TeacherAcademyClient";

export const metadata: Metadata = {
  title: "Академия педагога — методики по 15 предметам",
  description:
    "Предметные методики ОГЭ и ЕГЭ, типичные ошибки, сценарии уроков и конструктор заданий для педагогов.",
};

export default async function TeacherAcademyPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const subject = typeof params.subject === "string" ? params.subject : "russian";
  return <TeacherAcademyClient initialSubject={subject} />;
}
