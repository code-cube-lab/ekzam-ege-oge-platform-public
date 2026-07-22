import type { Metadata } from "next";
import { TeacherClient } from "../components/TeacherClient";

export const metadata: Metadata = { title: "Кабинет преподавателя" };
export const dynamic = "force-dynamic";

export default function TeacherPage() { return <TeacherClient />; }
