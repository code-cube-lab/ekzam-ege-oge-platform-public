import type { Metadata } from "next";
import { LessonClient } from "../components/LessonClient";
import { firstLesson } from "../../knowledge-base/lessons/lesson-units";

export const metadata: Metadata = {
  title: "Открытый урок",
  description: "Видео, объяснение преподавателя, задание и разбор ответа по уровню ученика.",
};

export default function LearnPage() {
  return <LessonClient lesson={firstLesson} />;
}
