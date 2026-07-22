import type { Metadata } from "next";
import { TelegramMiniAppClient } from "../components/TelegramMiniAppClient";

export const metadata: Metadata = { title: "Задание на сегодня" };
export const dynamic = "force-dynamic";

export default function TelegramPage() {
  return <TelegramMiniAppClient />;
}
