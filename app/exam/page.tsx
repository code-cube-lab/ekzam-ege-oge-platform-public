import type { Metadata } from "next";
import { ExamSimulatorClient } from "../components/ExamSimulatorClient";

export const metadata: Metadata = { title: "Задания ОГЭ и ЕГЭ онлайн", description: "Последовательная практика ОГЭ и ЕГЭ на сайте: ответ, разбор, похожее задание и анализ слабых тем." };

export default async function ExamPage({ searchParams }: { searchParams: Promise<{ subject?: string; family?: string; count?: string; level?: string }> }) {
  const { subject, family, count, level } = await searchParams;
  return <ExamSimulatorClient initialSubject={subject} initialFamily={family} initialCount={Number(count) || 0} initialLevel={level} />;
}
