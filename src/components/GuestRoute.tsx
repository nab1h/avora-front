"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function GuestRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/dashboard");
      return;
    }

    setChecking(false);
  }, [router]);

  if (checking) {
    return null;
  }

  return children;
}
