import type { Metadata } from "next";
import { DashboardClient } from "../components/DashboardClient";

export const metadata: Metadata = { title: "Кабинет ученика" };
export const dynamic = "force-dynamic";

export default function DashboardPage() { return <DashboardClient />; }
