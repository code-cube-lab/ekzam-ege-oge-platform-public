import type { Metadata } from "next";
import { PrivateAreaNotice } from "../components/PrivateAreaNotice";

export const metadata: Metadata = { title: "Закрытый кабинет преподавателя — ЭКЗАМ" };
export default function TeacherPage() { return <PrivateAreaNotice role="преподавателя" />; }
