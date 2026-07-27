import type { Metadata } from "next";
import { TeacherClient } from "../components/TeacherClient";

export const metadata: Metadata = { title: "Кабинет преподавателя" };
export default function TeacherPage() { return <TeacherClient />; }
