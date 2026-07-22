import type { Metadata } from "next";
import { DirectorClient } from "../components/DirectorClient";

export const metadata: Metadata = { title: "Управление школой" };
export const dynamic = "force-dynamic";

export default function DirectorPage() { return <DirectorClient />; }
