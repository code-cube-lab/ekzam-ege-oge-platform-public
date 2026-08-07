import type { Metadata } from "next";
import { ReelsLabClient } from "../components/ReelsLabClient";

export const metadata: Metadata = {
  title: "Видеолаборатория преподавателя — Reels и Shorts",
  description: "Готовые идеи, сценарии, раскадровки и примеры коротких видео для преподавателей ОГЭ и ЕГЭ и рекламы платформы ЭКЗАМ.",
};

export default function ReelsPage() {
  return <ReelsLabClient />;
}
