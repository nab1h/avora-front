"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setUser, type User } from "@/lib/features/auth/auth-slice";
import { useGetMeQuery } from "@/lib/services/auth-api";



export function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
  const dispatch = useAppDispatch();

  const reduxUser = useAppSelector(
    (state) => state.auth.user
  );

  const [token] = useState<string | null>(() =>
    typeof window === "undefined" ? null : localStorage.getItem("token")
  );


  useEffect(() => {
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    if (!reduxUser) {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        dispatch(setUser(JSON.parse(storedUser) as User));
      }
    }

  }, [dispatch, reduxUser, router, token]);


  const {
    data,
    isLoading,
    isError,
  } = useGetMeQuery(undefined, {
    skip: !token || !!reduxUser,
  });


  useEffect(() => {

    if (data) {
      const user = "user" in data ? data.user : data;
      dispatch(setUser(user));
      localStorage.setItem("user", JSON.stringify(user));
    }

  }, [data, dispatch]);


  useEffect(() => {

    if (isError) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/auth/login");
    }

  }, [isError, router]);


  if (!token || isLoading) {
    return null;
  }


  return children;
}