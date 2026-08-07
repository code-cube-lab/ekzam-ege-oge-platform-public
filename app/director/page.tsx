import type { Metadata } from "next";
import { PrivateAreaNotice } from "../components/PrivateAreaNotice";

export const metadata: Metadata = { title: "Закрытый кабинет администратора — ЭКЗАМ" };
export default function DirectorPage() { return <PrivateAreaNotice role="администратора" />; }
