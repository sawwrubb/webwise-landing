"use client";

import { ErrorState } from "@/components/states";

export default function Error({ error }: { error: Error }) {
  return <ErrorState message={error.message || "Unexpected error"} />;
}
