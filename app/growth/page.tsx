import type { Metadata } from "next";
import { GrowthCenterClient } from "../components/GrowthCenterClient";

export const metadata: Metadata = {
  title: "Центр роста ЭКЗАМ — Reels, партнёры и поиск учеников",
  description: "Конструктор рекламных заданий для преподавателей ОГЭ и ЕГЭ, проверенные видеореференсы, партнёрства, сообщения и безопасный маршрут от ролика до учебной заявки.",
};

export default function GrowthPage() {
  return <GrowthCenterClient />;
}

