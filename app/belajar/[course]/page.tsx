import { courses } from "@/courses/catalog";
import { CoursePath } from "@/features/learning";
import { notFound } from "next/navigation";
export function generateStaticParams() {
  return courses.map((c) => ({ course: c.id }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  const c = courses.find((c) => c.id === course);
  if (!c) notFound();
  return <CoursePath course={c} />;
}
