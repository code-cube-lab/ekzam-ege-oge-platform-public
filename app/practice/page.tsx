import type { Metadata } from "next";
import { PracticeLibraryClient } from "../components/PracticeLibraryClient";

export const metadata: Metadata = {
  title: "Отработка заданий ОГЭ и ЕГЭ — ЭКЗАМ",
  description: "Выберите номер задания ОГЭ или ЕГЭ и закрепите его серией авторских вариантов с разбором ошибок.",
};

export default function PracticePage() {
  return <PracticeLibraryClient />;
}
