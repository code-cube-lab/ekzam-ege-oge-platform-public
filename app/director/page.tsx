import type { Metadata } from "next";
import { DirectorClient } from "../components/DirectorClient";

export const metadata: Metadata = { title: "Управление школой" };
export default function DirectorPage() { return <DirectorClient />; }
