import type { Metadata } from "next";
import { SchoolHubClient } from "../components/SchoolHubClient";

export const metadata: Metadata = {
  title: "Школа 6–11 классов — учебник, ОГЭ, ЕГЭ и дневник",
  description:
    "Единый учебный маршрут: школьная программа, адаптивная практика, игровые задания, электронный дневник и кабинеты ученика, родителя и педагога.",
};

export default function SchoolPage() {
  return <SchoolHubClient />;
}
