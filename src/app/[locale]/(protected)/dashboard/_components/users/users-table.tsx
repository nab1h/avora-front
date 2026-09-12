"use client";

import { useEffect, useState } from "react";

import {
    Card,
    CardContent,
} from "@/components/ui/card";


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";


import {
    Badge
} from "@/components/ui/badge";


import {
    Skeleton
} from "@/components/ui/skeleton";


import UserAvatar from "./user-avatar";


import type {
    User
} from "@/types/users";
import UserActions from "./user-actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUpdateUserStatusMutation } from "@/lib/services/users-api";
import { Loader2 } from "lucide-react";





interface Props {

    users: User[];

    isLoading: boolean;

}





export default function UsersTable({

    users,

    isLoading

}: Props) {
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
    const [updateStatus] = useUpdateUserStatusMutation();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            return;
        }

        try {
            const currentUser = JSON.parse(storedUser) as { id?: number };
            setCurrentUserId(currentUser.id ?? null);
        } catch {
            setCurrentUserId(null);
        }
    }, []);

    async function handleStatusChange(userId: number, isActive: boolean) {
        setUpdatingUserId(userId);

        try {
            await updateStatus({ id: userId, is_active: !isActive }).unwrap();
            toast.success(isActive ? "User disabled successfully." : "User enabled successfully.");
        } catch {
            toast.error("Failed to update user status. Please try again.");
        } finally {
            setUpdatingUserId(null);
        }
    }

    return (


        <Card>


            <CardContent>



                <Table>



                    <TableHeader>


                        <TableRow>


                            <TableHead>
                                User
                            </TableHead>


                            <TableHead>
                                Email
                            </TableHead>


                            <TableHead>
                                Roles
                            </TableHead>


                            <TableHead>
                                Permissions
                            </TableHead>


                            <TableHead>
                                Status
                            </TableHead>


                            <TableHead className="text-right">
                                Actions
                            </TableHead>


                        </TableRow>


                    </TableHeader>





                    <TableBody>





                        {
                            isLoading &&

                            Array.from({
                                length: 5
                            }).map((_, index) => (


                                <TableRow key={index}>


                                    <TableCell>

                                        <div className="flex items-center gap-3">

                                            <Skeleton
                                                className="h-10 w-10 rounded-full"
                                            />


                                            <Skeleton
                                                className="h-5 w-32"
                                            />

                                        </div>

                                    </TableCell>




                                    <TableCell>

                                        <Skeleton
                                            className="h-5 w-40"
                                        />

                                    </TableCell>





                                    <TableCell>

                                        <Skeleton
                                            className="h-5 w-24"
                                        />

                                    </TableCell>





                                    <TableCell>

                                        <Skeleton
                                            className="h-5 w-24"
                                        />

                                    </TableCell>





                                    <TableCell>

                                        <Skeleton
                                            className="h-5 w-20"
                                        />

                                    </TableCell>





                                    <TableCell>

                                        <Skeleton
                                            className="h-8 w-8 ml-auto"
                                        />

                                    </TableCell>



                                </TableRow>


                            ))

                        }








                        {
                            !isLoading && users.map((user) => (



                                <TableRow
                                    key={user.id}
                                    className={user.id === currentUserId ? "bg-primary/5" : undefined}
                                >





                                    <TableCell>



                                        <div className="flex items-center gap-3">



                                            <UserAvatar

                                                name={user.name}

                                                image={user.avatar}

                                            />



                                            <span className="font-medium">

                                                {user.name}

                                            </span>

                                            {user.id === currentUserId && (
                                                <Badge variant="outline">You</Badge>
                                            )}



                                        </div>



                                    </TableCell>








                                    <TableCell>

                                        {user.email}

                                    </TableCell>








                                    <TableCell>
                                        <div className="flex flex-wrap gap-2">
                                            {user.roles.length > 0 ? (
                                                user.roles.map((role) => (
                                                    <Badge key={role.id} variant="secondary">
                                                        {role.name}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-muted-foreground">No roles</span>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-wrap gap-2">
                                            {user.permissions.length > 0 ? (
                                                user.permissions.map((permission) => (
                                                    <Badge key={permission.id} variant="outline">
                                                        {permission.name}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-muted-foreground">No permissions</span>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            className={user.is_active
                                                ? "border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                : "border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"}
                                            disabled={updatingUserId !== null}
                                            onClick={() => handleStatusChange(user.id, user.is_active)}
                                        >
                                            {updatingUserId === user.id && <Loader2 className="animate-spin" />}
                                            {user.is_active ? "Disable" : "Enable"}
                                        </Button>
                                    </TableCell>

                                    <TableCell className="text-right">

                                        <UserActions user={user} />

                                    </TableCell>
                                </TableRow>
                            ))

                        }






                        {
                            !isLoading && users.length === 0 && (


                                <TableRow>


                                    <TableCell

                                        colSpan={6}

                                        className="text-center text-muted-foreground"

                                    >

                                        No users found


                                    </TableCell>


                                </TableRow>


                            )
                        }





                    </TableBody>



                </Table>



            </CardContent>



        </Card>


    );

}