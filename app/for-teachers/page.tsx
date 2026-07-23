import type { Metadata } from "next";
import { TeacherProductClient } from "../components/TeacherProductClient";

export const metadata: Metadata = {
  title: "ЭКЗАМ для педагогов — банк заданий и аналитика",
  description: "Соберите работу по типу ЕГЭ, отправьте ученикам и получите аналитику слабых тем.",
};

export default function ForTeachersPage() {
  return <TeacherProductClient />;
}
