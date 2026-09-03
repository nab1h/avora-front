import type { ReactNode } from "react";
import { Command } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { APP_CONFIG } from "@/config/app-config";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { DashboardHeader } from "./_components/dashboard-header";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main>
      <DashboardHeader />
        <div className="relative order-1 flex h-full">{children}</div>
    </main>
  );
}
