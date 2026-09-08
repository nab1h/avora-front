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

      if (storedUser && storedUser !== "undefined") {
        try {
          dispatch(setUser(JSON.parse(storedUser) as User));
        } catch (error) {
          console.error("Invalid user data in localStorage:", error);
          localStorage.removeItem("user");
        }
      }
    }

  }, [dispatch, reduxUser, router, token]);


  const {
    data,
    isLoading,
    isError,
  } = useGetMeQuery(undefined, {
    skip: !token,
  });


  useEffect(() => {

    if (data) {
      const user = "user" in data ? data.user : data;
      dispatch(setUser(data.data));
      localStorage.setItem("user", JSON.stringify(data.data));
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