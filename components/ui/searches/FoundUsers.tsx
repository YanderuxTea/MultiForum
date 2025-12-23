"use client";

import { IFoundUsers } from "@/app/api/searchUsersThemes/route";
import Pagination from "@/components/shared/Pagination";
import FoundUsersCard from "@/components/shared/searches/FoundUsersCard";
import React from "react";

export default function FoundUsers({
  countUsers,
  users,
  totalPagesUsers,
  pageNumber,
  setPageNumber,
}: {
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  countUsers: number;
  totalPagesUsers: number;
  users: IFoundUsers[];
}) {
  return (
    <div className="divide-y divide-neutral-300 dark:divide-neutral-700">
      {countUsers === 0 ? (
        <p className="text-neutral-700 dark:text-neutral-300 font-medium text-center py-2.5">
          Пользователей с таким никнеймом нет
        </p>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-neutral-300 dark:divide-neutral-700">
            {users.map((user) => {
              return <FoundUsersCard key={user.id} user={user} />;
            })}
          </div>
          {totalPagesUsers > 1 && (
            <div className="p-2.5">
              <Pagination
                id="foundUsersPagination"
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                count={countUsers}
                totalPages={totalPagesUsers}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
