import type { Metadata } from "next";
import { TeacherAcquisitionDirectoryClient } from "../../components/TeacherAcquisitionDirectoryClient";

export const metadata: Metadata = {
  title: "Маршруты преподавателей — ЭКЗАМ",
  description: "Отдельные планы привлечения учеников, Reels и партнёрские маршруты для каждого преподавателя платформы.",
};

export default function TeacherAcquisitionDirectoryPage() {
  return <TeacherAcquisitionDirectoryClient />;
}

