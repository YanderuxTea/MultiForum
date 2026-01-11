"use client";
import useCategories from "@/hooks/useCategories";
import useCheckingStaff from "@/hooks/useCheckingStaff";
import useDataUser from "@/hooks/useDataUser";
import CategoriesMain from "@/components/shared/categories/CategoriesMain";
import ManagementCategoriesButton from "@/components/shared/buttons/ManagementCategoriesButton";

export default function BlockCategoriesMain() {
  const dataUser = useDataUser();
  const { isAdmin } = useCheckingStaff({ role: dataUser?.role || "User" });
  const categories = useCategories();
  return (
    <div className="flex flex-col gap-5 w-full lg:w-5/7">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-2.5">
        <p className="text-lg lg:text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Категории и разделы
        </p>
        {isAdmin && <ManagementCategoriesButton />}
      </div>
      {categories.categories.map((category) => {
        return <CategoriesMain props={category} key={category.id} />;
      })}
    </div>
  );
}
