import type { Metadata } from "next";
import { ParentReportClient } from "../components/ParentReportClient";

export const metadata: Metadata = {
  title: "Отчёт родителю — ЭКЗАМ",
  description: "Понятный отчёт по ответам ребёнка: сильные темы, слабые места и следующий шаг подготовки.",
};

export default function ParentReportPage() {
  return <ParentReportClient />;
}
