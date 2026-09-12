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

import ManagePermissionsDialog from "./manage-permissions-dialog";
import DeleteRoleDialog from "./delete-role-dialog";


interface Permission {

    id:number;

    name:string;

}


interface Role {

    id:number;

    name:string;

    permissions: Permission[];

}

export default function RoleActions({
    role
}: {
    role: Role
}) {

    const [openManage, setOpenManage] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);


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
                        onClick={() => setOpenManage(true)}
                    >
                        Manage Permissions
                    </DropdownMenuItem>



                    <DropdownMenuSeparator />



                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setOpenDelete(true)}
                    >
                        Delete
                    </DropdownMenuItem>


                </DropdownMenuContent>


            </DropdownMenu>





            <ManagePermissionsDialog

                role={role}

                open={openManage}

                setOpen={setOpenManage}

            />





            <DeleteRoleDialog

                id={role.id}

                name={role.name}

                open={openDelete}

                setOpen={setOpenDelete}

            />



        </>

    );

}