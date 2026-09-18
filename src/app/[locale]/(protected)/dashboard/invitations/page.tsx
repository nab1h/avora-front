"use client";
import InvitationsTable from "./_components/invitations-table";
import AddInvitationDialog from "./_components/add-invitation-dialog";
import { useTranslations } from "next-intl";

export default function InvitationsPage(){
const t = useTranslations('invitations')
    return (
        <div className="flex w-full flex-col space-y-8 p-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-medium">
                        {t("title")}
                    </h1>

                    <p className="text-muted-foreground text-sm">
                        {t("description")}
                    </p>

                </div>
                <AddInvitationDialog />
            </div>
            <InvitationsTable />
        </div>
    );
}