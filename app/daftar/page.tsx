import { Suspense } from "react";
import { AccountForm } from "@/features/account";
export default function Page() {
  return (
    <Suspense fallback={<div className="skeleton" />}>
      <AccountForm signup />
    </Suspense>
  );
}
