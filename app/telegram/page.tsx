import type { Metadata } from "next";
import { TelegramMiniAppClient } from "../components/TelegramMiniAppClient";

export const metadata: Metadata = { title: "Задание на сегодня" };
export default function TelegramPage() {
  return <TelegramMiniAppClient />;
}
