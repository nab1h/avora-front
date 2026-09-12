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




export default function UserActions({
    user
}: {
    user: User
}) {


    const [editOpen, setEditOpen] = useState(false);

    const [accessOpen, setAccessOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);



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

                        Edit User

                    </DropdownMenuItem>





                    <DropdownMenuItem

                        onClick={() => setAccessOpen(true)}

                    >

                        Manage Roles & Permissions

                    </DropdownMenuItem>





                    <DropdownMenuSeparator />





                    <DropdownMenuItem

                        variant="destructive"

                        onClick={() => setDeleteOpen(true)}

                    >

                        Delete User

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