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


import {
    Badge
} from "@/components/ui/badge";


import {
    Skeleton
} from "@/components/ui/skeleton";


import {
    Button
} from "@/components/ui/button";


import {
    useGetInvitationsQuery,
    useResendInvitationMutation
} from "@/lib/services/invitations-api";


import {
    Loader2
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


export default function InvitationsTable() {


    const [resendingId, setResendingId] = useState<number | null>(null);

    const {
        data,
        isLoading
    } = useGetInvitationsQuery();




    const invitations =
        data?.invitations.data ?? [];





    const [
        resendInvitation,
        {
            isLoading: resendLoading
        }

    ] = useResendInvitationMutation();





    async function handleResend(id: number) {


        try {

            setResendingId(id);
            await resendInvitation(id).unwrap();

            toast.success("Invitation resent successfully!");

        } catch (error: any) {

            console.log(error);
            toast.error(
                error?.data?.message ||
                "Failed to resend invitation. Please try again."
            );

        }

        finally {
            setResendingId(null);
        }

    }


    function getStatus(invitation: any) {


        if (invitation.accepted_at) {

            return (

                <Badge>
                    Accepted
                </Badge>

            );

        }



        if (invitation.revoked_at) {

            return (

                <Badge variant="destructive">
                    Revoked
                </Badge>

            );

        }



        return (

            <Badge variant="secondary">
                Pending
            </Badge>

        );

    }





    return (

        <Card>


            <CardContent>


                <Table>


                    <TableHeader>


                        <TableRow>


                            <TableHead>
                                Email
                            </TableHead>


                            <TableHead>
                                Role
                            </TableHead>


                            <TableHead>
                                Invited By
                            </TableHead>


                            <TableHead>
                                Status
                            </TableHead>


                            <TableHead>
                                Created At
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
                                        <Skeleton className="h-5 w-40" />
                                    </TableCell>


                                    <TableCell>
                                        <Skeleton className="h-5 w-24" />
                                    </TableCell>


                                    <TableCell>
                                        <Skeleton className="h-5 w-32" />
                                    </TableCell>


                                    <TableCell>
                                        <Skeleton className="h-5 w-20" />
                                    </TableCell>


                                    <TableCell>
                                        <Skeleton className="h-5 w-28" />
                                    </TableCell>


                                </TableRow>


                            ))

                        }





                        {
                            !isLoading &&

                            invitations.map(invitation => (


                                <TableRow
                                    key={invitation.id}
                                >



                                    <TableCell>

                                        {invitation.email}

                                    </TableCell>




                                    <TableCell>

                                        <Badge
                                            variant="secondary"
                                        >

                                            {
                                                invitation.role.name
                                            }

                                        </Badge>

                                    </TableCell>




                                    <TableCell>

                                        {invitation.inviter.name}

                                    </TableCell>




                                    <TableCell>

                                        {
                                            getStatus(invitation)
                                        }

                                    </TableCell>




                                    <TableCell>

                                        {
                                            new Date(
                                                invitation.created_at
                                            )
                                                .toLocaleDateString()
                                        }

                                    </TableCell>





                                    <TableCell className="text-right">


                                        {
                                            !invitation.accepted_at &&
                                            !invitation.revoked_at &&

                                            <Button

                                                variant="outline"

                                                size="sm"

                                                onClick={() =>
                                                    handleResend(
                                                        invitation.id
                                                    )
                                                }

                                                disabled={resendingId === invitation.id}

                                            >

                                                {
                                                    resendingId === invitation.id ? (

                                                        <Loader2
                                                            className="
                                                                h-4
                                                                w-4
                                                                animate-spin
                                                                "
                                                        />

                                                    ) : (

                                                        "Resend"

                                                    )
                                                }


                                            </Button>

                                        }



                                    </TableCell>




                                </TableRow>


                            ))

                        }



                    </TableBody>


                </Table>


            </CardContent>


        </Card>

    );

}