"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/features/auth/auth-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export function LogoutButton() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);

  const handleLogout = () => {

    dispatch(logout());
    console.log(token);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <Button
      variant="destructive"
      className="fixed top-4 right-4 z-50"
      type="button"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}
