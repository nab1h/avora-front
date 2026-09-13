"use client";

import { useState } from "react";

import { MoreHorizontalIcon } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import EditUserDialog from "./edit-user-dialog";
import DeleteUserDialog from "./delete-user-dialog";
import ManageAccessDialog from "./manage-access-dialog";
import { User } from "@/lib/features/auth/auth-slice";
import { useTranslations } from "next-intl";


export default function UserActions({
    user
}: {
    user: User
}) {

    const [editOpen, setEditOpen] = useState(false);
    const [accessOpen, setAccessOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const t = useTranslations('users')
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button
                            variant="ghost"
                            size="icon"
                        >
                            <MoreHorizontalIcon />
                        </Button>
                    }
                />

                <DropdownMenuContent align="end">

                    <DropdownMenuItem
                        onClick={() => setEditOpen(true)}
                    >
                        {t("edit-user")}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => setAccessOpen(true)}
                    >
                        {t("edit-user-roles")}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDeleteOpen(true)}
                    >
                        {t("delete-user")}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditUserDialog
                user={user}
                open={editOpen}
                setOpen={setEditOpen}
            />

            <ManageAccessDialog
                user={user}
                open={accessOpen}
                setOpen={setAccessOpen}
            />

            <DeleteUserDialog
                user={user}
                open={deleteOpen}
                setOpen={setDeleteOpen}
            />
        </>

    );

}