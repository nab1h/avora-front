"use client";

import { useState } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";


import { useCreateRoleMutation } from "@/lib/services/roles-api";



const roleSchema = z.object({
    name: z
        .string()
        .min(2, "Role name must be at least 2 characters")
        .max(50, "Role name must be less than 50 characters"),
});


type RoleFormValues = z.infer<typeof roleSchema>;



export default function AddRoleButton() {


    const [open, setOpen] = useState(false);



    const [createRole, { isLoading }] =
        useCreateRoleMutation();




    const form = useForm<RoleFormValues>({

        resolver: zodResolver(roleSchema),

        defaultValues: {
            name: "",
        },

    });





    async function onSubmit(values: RoleFormValues) {

        try {

            await createRole(values).unwrap();


            form.reset();


            setOpen(false);


        } catch (error) {

            console.error(error);

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
                        + Add Role
                    </Button>
                }
            />



            <DialogContent>


                <DialogHeader>

                    <DialogTitle>
                        Create New Role
                    </DialogTitle>

                </DialogHeader>



                <form

                    onSubmit={
                        form.handleSubmit(onSubmit)
                    }

                    className="mt-6 space-y-5"

                >



                    <Controller

                        name="name"

                        control={form.control}


                        render={({
                            field,
                            fieldState
                        }) => (


                            <Field
                                data-invalid={
                                    fieldState.invalid
                                }
                            >


                                <FieldLabel>
                                    Role Name
                                </FieldLabel>



                                <Input

                                    {...field}

                                    placeholder="Enter role name"

                                    disabled={isLoading}

                                    aria-invalid={
                                        fieldState.invalid
                                    }

                                />



                                {
                                    fieldState.invalid && (

                                        <FieldError

                                            errors={[
                                                fieldState.error
                                            ]}

                                        />

                                    )
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

                                    Creating...

                                </>


                            ) : (

                                "Create Role"

                            )
                        }



                    </Button>



                </form>



            </DialogContent>


        </Dialog>

    );

}