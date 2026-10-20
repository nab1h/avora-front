
"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import SpecificationsTable from "../_components/specifications/specifications-table";
import AddSpecificationDialog from "../_components/specifications/add-specification-dialog";


export default function SpecificationsPage() {
    const t = useTranslations("specifications");

    const [isAddSpecificationOpen, setIsAddSpecificationOpen] =
        useState(false);

    return (
        <div className="flex w-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1 text-start">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        {t("title")}
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        {t("description")}
                    </p>
                </div>

                <Button
                    onClick={() => setIsAddSpecificationOpen(true)}
                >
                    <Plus className="size-4" />
                    {t("add")}
                </Button>
            </div>

            <SpecificationsTable />

            <AddSpecificationDialog
                open={isAddSpecificationOpen}
                setOpen={setIsAddSpecificationOpen}
            />
        </div>
    );
}
