import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeacherAcquisitionClient } from "../../../components/TeacherAcquisitionClient";
import { teacherAcquisitionPlaybooks } from "../../../../knowledge-base/marketing/teacher-acquisition";

export const dynamicParams = false;

export function generateStaticParams() {
  return teacherAcquisitionPlaybooks.map((teacher) => ({ teacherId: teacher.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ teacherId: string }> }): Promise<Metadata> {
  const { teacherId } = await params;
  const teacher = teacherAcquisitionPlaybooks.find((item) => item.id === teacherId);
  return teacher ? { title: `${teacher.name}: поиск учеников — ЭКЗАМ`, description: teacher.positioning } : { title: "Преподаватель — ЭКЗАМ" };
}

export default async function TeacherAcquisitionPage({ params }: { params: Promise<{ teacherId: string }> }) {
  const { teacherId } = await params;
  const teacher = teacherAcquisitionPlaybooks.find((item) => item.id === teacherId);
  if (!teacher) notFound();
  return <TeacherAcquisitionClient playbook={teacher} />;
}

