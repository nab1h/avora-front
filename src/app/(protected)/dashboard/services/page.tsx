"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddServiceDialog from "../_components/services/add-service-dialog";
import ServicesTable from "../_components/services/services-table";

export default function ServicesPage() {
    const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);

    return (
        <div className="flex w-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1 text-start">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Services
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your services.
                    </p>
                </div>
                <Button onClick={() => setIsAddServiceOpen(true)}>
                    <Plus className="size-4" />
                    Add Service
                </Button>
            </div>
            <ServicesTable />
            <AddServiceDialog
                open={isAddServiceOpen}
                setOpen={setIsAddServiceOpen}
            />
        </div>
    );
}