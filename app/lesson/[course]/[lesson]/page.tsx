import { courses, lessonsOf } from "@/courses/catalog";
import { LessonRunner } from "@/features/lesson";
import { notFound } from "next/navigation";
export function generateStaticParams() {
  return courses.flatMap((c) =>
    lessonsOf(c).map((l) => ({ course: c.id, lesson: l.id })),
  );
}
export default async function Page({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>;
}) {
  const paramsValue = await params;
  const c = courses.find((c) => c.id === paramsValue.course);
  const l = c && lessonsOf(c).find((l) => l.id === paramsValue.lesson);
  if (!c || !l) notFound();
  return <LessonRunner course={c} lesson={l} />;
}
