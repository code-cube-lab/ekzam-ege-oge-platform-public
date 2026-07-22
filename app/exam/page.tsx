import type { Metadata } from "next";
import { ExamSimulatorClient } from "../components/ExamSimulatorClient";

export const metadata: Metadata = { title: "Тренажёр форматов ЕГЭ", description: "Попробуйте выбор, краткий ответ, число и развёрнутую работу с полным решением." };

export default async function ExamPage({ searchParams }: { searchParams: Promise<{ subject?: string }> }) {
  const { subject } = await searchParams;
  return <ExamSimulatorClient initialSubject={subject} />;
}
