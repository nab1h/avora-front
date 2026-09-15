"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { LogoutButton } from "@/components/logout-button";

export function DashboardHeader() {
  return (
    <div className="top-4">
      <ModeToggle />
      <LogoutButton />
    </div>
  );
}