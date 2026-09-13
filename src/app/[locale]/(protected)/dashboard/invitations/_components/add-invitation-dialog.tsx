"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


import {
    useCreateInvitationMutation
} from "@/lib/services/invitations-api";


import {
    useGetRolesQuery
} from "@/lib/services/roles-api";
import React from "react";
import { toast } from "sonner";



const schema = z.object({

    email: z
        .string()
        .email("Please enter a valid email"),


    role_id: z
        .string()
        .min(1, "Please select a role"),

});



type FormValues = z.infer<typeof schema>;





export default function AddInvitationDialog() {



    const [open, setOpen] = React.useState(false);



    const {
        data: rolesData
    } = useGetRolesQuery();



    const roles =
        rolesData?.data ?? [];




    const [
        createInvitation,
        {
            isLoading
        }

    ] = useCreateInvitationMutation();




    const form = useForm<FormValues>({

        resolver: zodResolver(schema),

        defaultValues: {

            email: "",

            role_id: ""

        }

    });





    async function onSubmit(values: FormValues) {


        try {


            await createInvitation({

                email: values.email,

                role_id: Number(values.role_id)

            }).unwrap();



            form.reset();

            setOpen(false);

            toast.success("Invitation sent successfully");



        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to send invitation. Please try again.");
        }


    }





    return (

        <Dialog

            open={open}

            onOpenChange={setOpen}

        >


            <DialogTrigger
                render={
                    <Button>
                        + Add Invitation
                    </Button>
                }
            />



            <DialogContent>


                <DialogHeader>

                    <DialogTitle>
                        Send Invitation
                    </DialogTitle>

                </DialogHeader>




                <form

                    onSubmit={
                        form.handleSubmit(onSubmit)
                    }

                    className="space-y-5 mt-4"

                >



                    <Controller

                        name="email"

                        control={form.control}

                        render={({ field, fieldState }) => (

                            <Field
                                data-invalid={
                                    fieldState.invalid
                                }
                            >

                                <FieldLabel>
                                    Email
                                </FieldLabel>


                                <Input

                                    {...field}

                                    placeholder="user@example.com"

                                />


                                {
                                    fieldState.invalid &&
                                    <FieldError
                                        errors={[
                                            fieldState.error
                                        ]}
                                    />
                                }


                            </Field>

                        )}

                    />






                    <Controller
                        name="role_id"
                        control={form.control}
                        render={({ field, fieldState }) => (

                            <Field
                                data-invalid={fieldState.invalid}
                            >

                                <FieldLabel>
                                    Role
                                </FieldLabel>


                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >

                                    <SelectTrigger>

                                        <SelectValue placeholder="Select role">
                                            {
                                                roles.find(
                                                    (role) =>
                                                        String(role.id) === field.value
                                                )?.name
                                            }
                                        </SelectValue>

                                    </SelectTrigger>


                                    <SelectContent>

                                        {
                                            roles.map((role) => (

                                                <SelectItem
                                                    key={role.id}
                                                    value={String(role.id)}
                                                >
                                                    {role.name}
                                                </SelectItem>

                                            ))
                                        }

                                    </SelectContent>


                                </Select>


                                {
                                    fieldState.invalid &&
                                    <FieldError
                                        errors={[
                                            fieldState.error
                                        ]}
                                    />
                                }


                            </Field>

                        )}
                    />





                    <Button

                        type="submit"

                        className="w-full"

                        disabled={isLoading}

                    >


                        {
                            isLoading ? (

                                <>

                                    <Loader2
                                        className="
                                        mr-2
                                        h-4
                                        w-4
                                        animate-spin
                                        "
                                    />

                                    Sending...

                                </>

                            ) : (
                                "Send Invitation"
                            )
                        }


                    </Button>



                </form>


            </DialogContent>


        </Dialog>

    );

}