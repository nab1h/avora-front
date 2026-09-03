"use client";

import { useSelector } from "react-redux";

import type { RootState } from "@/lib/store";
import { ModeToggle } from "@/components/mode-toggle";
import { LogoutButton } from "@/components/logout-button";
import { AccountSwitcher } from "./account-switcher";



export function DashboardHeader() {
  const user = useSelector((state: RootState) => state.auth.user);

  const users = user
  ? [
      {
        id: String(user.id),
        name: user.name,
        email: user.email,
        role: user.roles?.[0]?.name ?? "user",
        avatar: "",
      },
    ]
  : [];

  return (
    <div className="top-4">
      <ModeToggle />

      <AccountSwitcher users={users} />

      <LogoutButton />
    </div>
  );
}