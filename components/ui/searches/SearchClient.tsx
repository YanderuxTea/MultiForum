"use client";
import SearchForm from "@/components/ui/searches/SearchForm";
import StubHeader from "@/components/shared/stubs/StubHeader";
import StubUnderHeader from "@/components/shared/stubs/StubUnderHeader";
import React, { RefObject, useEffect, useMemo, useRef, useState } from "react";
import FoundThemes from "@/components/ui/searches/FoundThemes";
import TimeoutSearch from "@/components/shared/searches/TimeoutSearch";
import { useSearchParams } from "next/navigation";
import useLoader from "@/hooks/useLoader";
import { IFoundUsers, IThemesSearch } from "@/app/api/searchUsersThemes/route";
import FoundUsers from "@/components/ui/searches/FoundUsers";
export async function getUsersThemes(
  setLoading: React.TransitionStartFunction,
  query: string | null,
  searchFilter: string | null,
  pageNumber: number,
  setUsers: React.Dispatch<React.SetStateAction<IFoundUsers[]>>,
  setThemes: React.Dispatch<React.SetStateAction<IThemesSearch[]>>,
  setCountThemes: React.Dispatch<React.SetStateAction<number>>,
  setCountUsers: React.Dispatch<React.SetStateAction<number>>,
  setTimeLeft: React.Dispatch<React.SetStateAction<number | null>>,
  refTypeSearch: RefObject<string>,
  refLoading: RefObject<boolean>
) {
  setLoading(async () => {
    if (query && searchFilter) {
      const req = await fetch("/api/searchUsersThemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query,
          searchParams: searchFilter,
          pageNumber: pageNumber,
          typeSearch: refTypeSearch.current,
        }),
      });
      const res = await req.json();
      if (res.ok) {
        refLoading.current = false;
        setTimeLeft(null);
        if (refTypeSearch.current === "all") {
          setCountThemes(res.countThemes);
          setThemes(res.themes);
          setUsers(res.users);
          setCountUsers(res.countUsers);
          refTypeSearch.current = "";
        } else if (refTypeSearch.current === "themes") {
          setThemes(res.themes);
          setCountThemes(res.countThemes);
          if (searchFilter === "Themes") {
            setCountUsers(0);
            setUsers([]);
          }

          refTypeSearch.current = "";
        } else if (refTypeSearch.current === "users") {
          setUsers(res.users);
          setCountUsers(res.countUsers);
          if (searchFilter === "User") {
            setThemes([]);
            setCountThemes(0);
          }

          refTypeSearch.current = "";
        }
      } else if (res.status === 429) {
        refLoading.current = false;
        setTimeLeft(res.error);
      } else if (!res.ok) {
        refLoading.current = false;
        setUsers([]);
        setThemes([]);
      }
    }
  });
}
export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const searchFilter = searchParams.get("searchParams");
  const [users, setUsers] = useState<IFoundUsers[]>([]);
  const [themes, setThemes] = useState<IThemesSearch[]>([]);
  const [countThemes, setCountThemes] = useState<number>(0);
  const [countUsers, setCountUsers] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const { setLoading } = useLoader();
  const [pageNumberUsers, setPageNumberUsers] = useState<number>(0);
  const [pageNumberThemes, setPageNumberThemes] = useState<number>(0);
  const typeSearch = useRef<string>("");
  const isLoading = useRef<boolean>(false);
  const totalPagesThemes = useMemo(() => {
    return Math.ceil(countThemes / 10);
  }, [countThemes]);
  const totalPagesUsers = useMemo(() => {
    return Math.ceil(countUsers / 10);
  }, [countUsers]);
  useEffect(() => {
    if (isLoading.current || !query || !searchFilter) return;
    typeSearch.current = "themes";
  }, [pageNumberThemes]);
  useEffect(() => {
    if (isLoading.current || !query || !searchFilter) return;
    typeSearch.current = "users";
  }, [pageNumberUsers]);
  useEffect(() => {
    if (isLoading.current || !query || !searchFilter) return;
    isLoading.current = true;
    if (searchFilter === "All") {
      typeSearch.current = "all";
      if (pageNumberThemes > 0 || pageNumberUsers > 0) {
        setPageNumberThemes(0);
        setPageNumberUsers(0);
        getUsersThemes(
          setLoading,
          query,
          searchFilter,
          0,
          setUsers,
          setThemes,
          setCountThemes,
          setCountUsers,
          setTimeLeft,
          typeSearch,
          isLoading
        );
      } else {
        getUsersThemes(
          setLoading,
          query,
          searchFilter,
          0,
          setUsers,
          setThemes,
          setCountThemes,
          setCountUsers,
          setTimeLeft,
          typeSearch,
          isLoading
        );
      }
    } else if (searchFilter === "User") {
      typeSearch.current = "users";
      if (pageNumberUsers > 0) {
        setPageNumberUsers(0);
        isLoading.current = false;
      } else {
        getUsersThemes(
          setLoading,
          query,
          searchFilter,
          0,
          setUsers,
          setThemes,
          setCountThemes,
          setCountUsers,
          setTimeLeft,
          typeSearch,
          isLoading
        );
      }
    } else if (searchFilter === "Themes") {
      typeSearch.current = "themes";
      if (pageNumberThemes > 0) {
        setPageNumberThemes(0);
        isLoading.current = false;
      } else {
        getUsersThemes(
          setLoading,
          query,
          searchFilter,
          0,
          setUsers,
          setThemes,
          setCountThemes,
          setCountUsers,
          setTimeLeft,
          typeSearch,
          isLoading
        );
      }
    }
  }, [query, searchFilter, searchParams]);

  useEffect(() => {
    if (
      typeSearch.current.trim().length === 0 ||
      isLoading.current ||
      !query ||
      !searchFilter
    ) {
      return;
    }
    isLoading.current = true;

    if (typeSearch.current === "users") {
      getUsersThemes(
        setLoading,
        query,
        searchFilter,
        pageNumberUsers,
        setUsers,
        setThemes,
        setCountThemes,
        setCountUsers,
        setTimeLeft,
        typeSearch,
        isLoading
      );
    } else if (typeSearch.current === "themes") {
      getUsersThemes(
        setLoading,
        query,
        searchFilter,
        pageNumberThemes,
        setUsers,
        setThemes,
        setCountThemes,
        setCountUsers,
        setTimeLeft,
        typeSearch,
        isLoading
      );
    }
  }, [pageNumberThemes, pageNumberUsers]);
  return (
    <div className="min-h-screen mt-5 w-full gap-2.5 flex flex-col px-2.5 py-5">
      <div>
        <StubHeader />
        <StubUnderHeader />
        <div className="w-full bg-white dark:bg-[#212121] flex justify-center p-2.5 max-w-200 mx-auto rounded-md border border-neutral-300 dark:border-neutral-700">
          <SearchForm
            query={query ?? undefined}
            searchFilter={searchFilter ?? undefined}
          />
        </div>
      </div>
      {typeof timeLeft === "number" && (
        <div className="max-w-200 bg-white dark:bg-[#212121] mx-auto w-full rounded-md border border-neutral-300 dark:border-neutral-700 text-center py-5">
          <TimeoutSearch timeout={timeLeft} />
        </div>
      )}
      {query && searchParams && timeLeft === null && (
        <div className="flex bg-neutral-100 dark:bg-neutral-900 rounded-md border border-neutral-300 dark:border-neutral-700 flex-col justify-center max-w-200 mx-auto w-full">
          {(searchFilter === "All" || searchFilter === "User") && (
            <div className="flex flex-col divide-y divide-neutral-300 dark:divide-neutral-700">
              <p className="text-lg font-bold text-neutral-800 dark:text-neutral-200 px-2.5 py-2.5 bg-white dark:bg-[#212121] rounded-t-md">
                Пользователи
              </p>
              <FoundUsers
                countUsers={countUsers}
                totalPagesUsers={totalPagesUsers}
                users={users}
                pageNumber={pageNumberUsers}
                setPageNumber={setPageNumberUsers}
              />
            </div>
          )}
          {(searchFilter === "All" || searchFilter === "Themes") && (
            <div
              className={`flex flex-col divide-y divide-neutral-300 dark:divide-neutral-700 ${
                countUsers > 0
                  ? "border-t border-neutral-300 dark:border-neutral-700"
                  : "rounded-t-md"
              }`}
            >
              <p
                className={`text-lg font-bold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-[#212121] p-2.5 ${
                  countUsers === 0 && "rounded-t-md"
                }`}
              >
                Темы
              </p>
              <FoundThemes
                countThemes={countThemes}
                totalPagesThemes={totalPagesThemes}
                themes={themes}
                setPageNumber={setPageNumberThemes}
                pageNumber={pageNumberThemes}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
