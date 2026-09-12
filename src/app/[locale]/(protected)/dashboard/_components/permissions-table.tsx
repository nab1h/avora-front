"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetPermissionsQuery } from "@/lib/services/roles-api";




interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}


export default function PermissionsTable() {

    const { data, isLoading } = useGetPermissionsQuery();

    console.log("Permissions data:", data);

    const permissions: Permission[] = data?.data ?? [];


    return (
        <Card>
            <CardContent>

                <Table>

                    <TableHeader>
                        <TableRow>
                            <TableHead>id</TableHead>
                            <TableHead>name</TableHead>
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
                                        <Skeleton className="h-5 w-40" />
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <Skeleton className="h-8 w-8 ml-auto rounded-md" />
                                    </TableCell>

                                </TableRow>
                            ))
                        }



                        {!isLoading && permissions.map((permission) => (

                            <TableRow key={permission.id}>

                                <TableCell className="font-medium">
                                    {permission.id}
                                </TableCell>


                                <TableCell>
                                    {permission.name}
                                </TableCell>


                                <TableCell className="text-right">

                                    <DropdownMenu>

                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8"
                                                >
                                                    <MoreHorizontalIcon />

                                                    <span className="sr-only">
                                                        Open menu
                                                    </span>

                                                </Button>
                                            }
                                        />


                                        <DropdownMenuContent align="end">

                                            <DropdownMenuItem>
                                                Edit
                                            </DropdownMenuItem>


                                            <DropdownMenuItem>
                                                Duplicate
                                            </DropdownMenuItem>


                                            <DropdownMenuSeparator />


                                            <DropdownMenuItem variant="destructive">
                                                Delete
                                            </DropdownMenuItem>


                                        </DropdownMenuContent>

                                    </DropdownMenu>

                                </TableCell>


                            </TableRow>

                        ))}


                    </TableBody>


                </Table>

            </CardContent>
        </Card>
    );
}