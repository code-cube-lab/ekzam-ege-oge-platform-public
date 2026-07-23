import type { Metadata } from "next";
import { ExamSimulatorClient } from "../components/ExamSimulatorClient";

export const metadata: Metadata = { title: "Банк заданий ЕГЭ по типам", description: "Практика по типам ЕГЭ: после ошибки — теория, похожее задание и разбор." };

export default async function ExamPage({ searchParams }: { searchParams: Promise<{ subject?: string; family?: string; count?: string }> }) {
  const { subject, family, count } = await searchParams;
  return <ExamSimulatorClient initialSubject={subject} initialFamily={family} initialCount={Number(count) || 0} />;
}
