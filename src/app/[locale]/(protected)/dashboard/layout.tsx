import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/layout/header";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
   <SidebarProvider>
      <AppSidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <Header />
        {children}
      </main>
    </SidebarProvider>
  );
}
