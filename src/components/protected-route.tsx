"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAppDispatch } from "@/lib/hooks";
import { setUser } from "@/lib/features/auth/auth-slice";
import { useGetMeQuery } from "@/lib/services/auth-api";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [token] = useState<string | null>(() =>
    typeof window === "undefined" ? null : localStorage.getItem("token")
  );



  useEffect(() => {
    if (!token) {
      router.replace("/auth/login");
    }
  }, [router, token]);

    const {
    data,
    isLoading,
    isError,
  } = useGetMeQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  
  useEffect(() => {
    if (data?.data) {
      dispatch(setUser(data.data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    const isUnauthorized = (isError as unknown as FetchBaseQueryError)?.status === 401;

    if (isUnauthorized && currentToken === token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/auth/login");
    }
  }, [isError, router, token]);

  if (!token || isLoading || !data?.data) {
    return null;
  }

  return children;
}