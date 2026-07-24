import type { Metadata } from "next";
import { LearningPathDemoClient } from "../components/LearningPathDemoClient";

export const metadata: Metadata = {
  title: "Как работает подготовка к ЕГЭ",
  description: "Интерактивный путь: пробный вариант, диагноз ошибки, похожее задание, повторение и проверка учителем.",
};

export default function HowItWorksPage() {
  return <LearningPathDemoClient />;
}
