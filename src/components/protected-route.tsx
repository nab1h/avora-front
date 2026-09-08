"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAppDispatch } from "@/lib/hooks";
import { setUser } from "@/lib/features/auth/auth-slice";
import { useGetMeQuery } from "@/lib/services/auth-api";

export function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [token] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : localStorage.getItem("token")
  );



  useEffect(() => {
    if (!token) {
      router.replace("/auth/login");
    }
  }, [token, router]);

    const {
    data,
    isLoading,
    isError,
  } = useGetMeQuery(undefined, {
    skip: !token,
  });

  
  useEffect(() => {
    if (data?.data) {
      dispatch(setUser(data.data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("token");
      router.replace("/auth/login");
    }
  }, [isError, router]);

  if (!token || isLoading || !data?.data) {
    return null;
  }

  return children;
}