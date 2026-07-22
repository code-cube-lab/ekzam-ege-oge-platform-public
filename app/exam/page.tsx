import type { Metadata } from "next";
import { ExamSimulatorClient } from "../components/ExamSimulatorClient";

export const metadata: Metadata = { title: "Тренажёр форматов ЕГЭ", description: "Попробуйте выбор, краткий ответ, число и развёрнутую работу с полным решением." };

export default function ExamPage() { return <ExamSimulatorClient />; }
