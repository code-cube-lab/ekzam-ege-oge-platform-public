import type { Metadata } from "next";
import { TextbookLibraryClient } from "../components/TextbookLibraryClient";

export const metadata: Metadata = {
  title: "Учебники 5–11 классов офлайн",
  description: "Авторские учебные главы по 15 предметам: теория, примеры, задания и сохранение для работы без интернета.",
};

export default function TextbooksPage() {
  return <TextbookLibraryClient />;
}
