"use client";
import Profile from "@/components/ui/profiles/Profile";
import { notFound, useParams } from "next/navigation";
import ChoosePhotoProvider from "@/components/providers/ChoosePhotoProvider";
import StubHeader from "@/components/shared/stubs/StubHeader";
import StubUnderHeader from "@/components/shared/stubs/StubUnderHeader";
import React, { useEffect } from "react";
import useLoader from "@/hooks/useLoader";

export default function Page() {
  const params = useParams();
  const [data, setData] = React.useState();
  const { setLoading } = useLoader();
  useEffect(() => {
    setLoading(async () => {
      const req = await fetch("/api/getDataProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: params.login }),
      });
      const res = await req.json();
      if (res.ok) {
        setData(res.data);
      } else {
        notFound();
      }
    });
  }, []);
  return (
    typeof data !== "undefined" && (
      <ChoosePhotoProvider>
        <StubHeader />
        <StubUnderHeader />
        {data ? <Profile props={data} /> : null}
      </ChoosePhotoProvider>
    )
  );
}
