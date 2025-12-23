"use client";

import { IThemesSearch } from "@/app/api/searchUsersThemes/route";
import Pagination from "@/components/shared/Pagination";
import FoundThemesCard from "@/components/shared/searches/FoundThemesCard";
import React from "react";

export default function FoundThemes({
  countThemes,
  themes,
  totalPagesThemes,
  pageNumber,
  setPageNumber,
}: {
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  countThemes: number;
  themes: IThemesSearch[];
  totalPagesThemes: number;
}) {
  return (
    <div className="divide-y divide-neutral-300 dark:divide-neutral-700">
      {countThemes === 0 ? (
        <p className="text-balance text-center text-neutral-700 font-medium dark:text-neutral-300 py-2.5">
          Тем с таким названием нет
        </p>
      ) : (
        <>
          <div className="divide-y divide-neutral-300 dark:divide-neutral-700">
            {themes.map((theme) => {
              return <FoundThemesCard key={theme.id} theme={theme} />;
            })}
          </div>
          {totalPagesThemes > 1 && (
            <div className="p-2.5">
              <Pagination
                id="foundThemesPagination"
                pageNumber={pageNumber}
                totalPages={totalPagesThemes}
                setPageNumber={setPageNumber}
                count={countThemes}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
