import type { Metadata } from "next";
import { PrivateAreaNotice } from "../components/PrivateAreaNotice";

export const metadata: Metadata = { title: "Закрытый кабинет ученика — ЭКЗАМ" };
export default function DashboardPage() { return <PrivateAreaNotice role="ученика" />; }
