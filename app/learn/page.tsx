import type { Metadata } from "next";
import { AdaptiveLessonClient } from "../components/AdaptiveLessonClient";
import { LessonClient } from "../components/LessonClient";
import { firstLesson } from "../../knowledge-base/lessons/lesson-units";

export const metadata: Metadata = {
  title: "Открытый урок",
  description: "Видео, объяснение преподавателя, задание и разбор ответа по уровню ученика.",
};

export default async function LearnPage({ searchParams }: { searchParams: Promise<{ subject?: string; topic?: string; variant?: string }> }) {
  const { subject, topic, variant } = await searchParams;
  if (subject && topic) {
    return <AdaptiveLessonClient subjectSlug={subject} topic={topic} variantId={Math.min(3, Math.max(1, Number(variant) || 1))} />;
  }
  return <LessonClient lesson={firstLesson} />;
}
