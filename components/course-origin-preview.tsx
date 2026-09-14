import type { CSSProperties } from "react";
import origins from "@/data/course-origins.json";

export function CourseOriginPreview({ courseId }: { courseId: string }) {
  const origin = origins[courseId as keyof typeof origins] || origins.jawa;
  const style = {
    "--origin-x": `${(origin.position[0] / 1000) * 100}%`,
    "--origin-y": `${(origin.position[1] / 470) * 100}%`,
  } as CSSProperties;
  return (
    <div className="course-origin-preview" style={style} aria-hidden="true">
      <i />
    </div>
  );
}
