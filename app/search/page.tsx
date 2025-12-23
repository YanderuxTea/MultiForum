"use client";
import SearchClient from "@/components/ui/searches/SearchClient";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <SearchClient />
    </Suspense>
  );
}
