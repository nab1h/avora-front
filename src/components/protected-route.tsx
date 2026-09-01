"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";

export function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const reduxToken = useAppSelector((state) => state.auth.token);

  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    } else {
      router.replace("/auth/login");
    }

    setChecking(false);
  }, [router]);

  if (checking) {
    return null;
  }

  if (!token && !reduxToken) {
    return null;
  }

  return children;
}
