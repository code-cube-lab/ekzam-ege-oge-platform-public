import type { Metadata } from "next";
import { ResumeDraftsClient } from "../components/ResumeDraftsClient";

export const metadata: Metadata = { title: "Продолжить работу — ЭКЗАМ", description: "Сохранённые черновики изложения и сочинения." };

export default function ResumePage() {
  return <ResumeDraftsClient />;
}
