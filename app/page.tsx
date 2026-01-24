import { Suspense } from "react";
import StubHeader from "@/components/shared/stubs/StubHeader";
import StubUnderHeader from "@/components/shared/stubs/StubUnderHeader";
import BlockCategoriesMain from "@/components/shared/categories/BlockCategoriesMain";
import BlockAdditionalInformation from "@/components/shared/categories/BlockAdditionalInformation";
export const revalidate = 30;
export default function Page() {
  return (
    <main className="flex flex-col grow px-2.5 py-5 w-full items-center">
      <StubHeader />
      <StubUnderHeader />
      <div className="flex flex-col lg:flex-row w-full max-w-300 gap-5">
        <Suspense>
          <BlockCategoriesMain />
        </Suspense>
        <BlockAdditionalInformation />
      </div>
    </main>
  );
}
