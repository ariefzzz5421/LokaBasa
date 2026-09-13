import { Suspense } from "react";
import { Onboarding } from "@/features/onboarding";
export default function Page() {
  return (
    <Suspense fallback={<div className="skeleton" />}>
      <Onboarding />
    </Suspense>
  );
}
