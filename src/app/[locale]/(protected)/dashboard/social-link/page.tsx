"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import type { SocialLink } from "@/lib/services/social-links";
import SocialLinksTable from "../_components/social-links/social-links-table";
import SocialLinkDialog from "../_components/social-links/social-link-dialog";

export default function SocialLinkPage() {
    const t = useTranslations("socialLinks");

    const [isDialogOpen, setIsDialogOpen] =
        useState(false);

    const [selectedSocialLink, setSelectedSocialLink] =
        useState<SocialLink | null>(null);

    const handleAdd = () => {
        setSelectedSocialLink(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (socialLink: SocialLink) => {
        setSelectedSocialLink(socialLink);
        setIsDialogOpen(true);
    };

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

                <Button onClick={handleAdd}>
                    <Plus className="size-4" />
                    {t("add")}
                </Button>
            </div>

            <SocialLinksTable
                onEdit={handleEdit}
            />

            <SocialLinkDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                socialLink={selectedSocialLink}
            />
        </div>
    );
}