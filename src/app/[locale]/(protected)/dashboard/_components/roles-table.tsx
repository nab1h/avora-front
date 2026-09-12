"use client";

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

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontalIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetRolesQuery } from "@/lib/services/roles-api";
import DeleteRoleDialog from "./delete-role-dialog";
import ManageRoleDialog from "./manage-role-dialog";
import RoleActions from "./role-actions";



interface Permission {
    id: number;
    name: string;
}


interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions: Permission[];
}


export default function RolesTable() {


    const { data, isLoading } = useGetRolesQuery();


    const roles: Role[] = data?.data ?? [];



    return (

        <Card>

            <CardContent>


                <Table>


                    <TableHeader>

                        <TableRow>

                            <TableHead>
                                ID
                            </TableHead>


                            <TableHead>
                                Role Name
                            </TableHead>


                            <TableHead>
                                Permissions
                            </TableHead>


                            <TableHead className="text-right">
                                Actions
                            </TableHead>


                        </TableRow>

                    </TableHeader>



                    <TableBody>


                        {isLoading &&

                            Array.from({ length: 5 }).map((_, index) => (

                                <TableRow key={index}>

                                    <TableCell>
                                        <Skeleton className="h-5 w-10" />
                                    </TableCell>


                                    <TableCell>
                                        <Skeleton className="h-5 w-32" />
                                    </TableCell>


                                    <TableCell>
                                        <Skeleton className="h-5 w-60" />
                                    </TableCell>


                                    <TableCell>
                                        <Skeleton className="h-8 w-8 ml-auto" />
                                    </TableCell>


                                </TableRow>

                            ))

                        }




                        {!isLoading && roles.map((role) => (


                            <TableRow key={role.id}>


                                <TableCell>
                                    {role.id}
                                </TableCell>



                                <TableCell className="font-medium">
                                    {role.name}
                                </TableCell>



                                <TableCell>


                                    {role.permissions.length > 0 ? (

                                        <div className="flex flex-wrap gap-2">

                                            {role.permissions.map((permission) => (

                                                <Badge
                                                    key={permission.id}
                                                    variant="secondary"
                                                >
                                                    {permission.name}
                                                </Badge>

                                            ))}


                                        </div>


                                    ) : (

                                        <span className="text-muted-foreground">
                                            No permissions
                                        </span>

                                    )}


                                </TableCell>




                                <TableCell className="text-right">


                                   <RoleActions role={role} />


                                </TableCell>



                            </TableRow>


                        ))}



                    </TableBody>



                </Table>


            </CardContent>


        </Card>

    );
}