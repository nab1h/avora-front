"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import SiteScriptDialog from "@/app/(protected)/dashboard/_components/site-scripts/site-script-dialog";
import SiteScriptsTable from "@/app/(protected)/dashboard/_components/site-scripts/site-scripts-table";
import { Button } from "@/components/ui/button";

export default function SiteScriptsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="flex w-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1 text-start">
          <h1 className="text-3xl font-semibold tracking-tight">Site Scripts</h1>
          <p className="text-sm text-muted-foreground">
            Manage tracking, verification, and custom scripts that run on the public website.
          </p>
        </div>

        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="size-4" />
          Add Script
        </Button>
      </div>

      <SiteScriptsTable onCreate={() => setIsCreateDialogOpen(true)} />

      <SiteScriptDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        mode="create"
      />
    </div>
  );
}
