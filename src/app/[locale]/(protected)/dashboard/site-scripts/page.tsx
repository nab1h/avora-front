"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";


import { Button } from "@/components/ui/button";
import SiteScriptsTable from "../_components/site-scripts/site-scripts/site-scripts-table";
import SiteScriptDialog from "../_components/site-scripts/site-scripts/site-script-dialog";

export default function SiteScriptsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const t = useTranslations("siteScripts");

  return (
    <div className="flex w-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1 text-start">
          <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="size-4" />
          {t("add")}
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