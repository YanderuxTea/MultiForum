import MessangerPage from "@/components/ui/messanger/MessangerPage";
import { Metadata } from "next";
import { Suspense } from "react";
import ContextMenuProvider from "@/components/providers/ContextMenuProvider.tsx";
import PanelAdvancedTimeProvider from "@/components/providers/PanelAdvancedTimeProvider.tsx";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const login = resolvedSearchParams.login;
  if (!login) {
    return {
      title: "Multi Forum | Мессенджер",
    };
  } else {
    return {
      title: `Переписка | ${login}`,
    };
  }
}
export default function Page() {
  return (
    <Suspense fallback={null}>
      <PanelAdvancedTimeProvider>
        <ContextMenuProvider>
          <MessangerPage />
        </ContextMenuProvider>
      </PanelAdvancedTimeProvider>
    </Suspense>
  );
}
