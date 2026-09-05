"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";

import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";

import {
    Controller,
    useForm
} from "react-hook-form";

import {
    z
} from "zod";

import {
    zodResolver
} from "@hookform/resolvers/zod";


import {
    useGetPermissionsQuery,
    useSyncRolePermissionsMutation,
    useUpdateRoleMutation
} from "@/lib/services/roles-api";



const roleSchema = z.object({

    name: z
        .string()
        .min(2, "Role name must be at least 2 characters"),

});



type RoleFormValues = z.infer<typeof roleSchema>;



interface Permission {

    id: number;

    name: string;

}



interface Role {

    id: number;

    name: string;

    permissions: Permission[];

}



interface ManagePermissionsDialogProps {

    role: Role;

    open: boolean;

    setOpen: (value: boolean) => void;

}





export default function ManagePermissionsDialog({

    role,

    open,

    setOpen

}: ManagePermissionsDialogProps) {



    const [selectedPermissions, setSelectedPermissions] =
        useState<number[]>(
            role.permissions.map(
                (permission) => permission.id
            )
        );




    const {
        data: permissionsData
    } = useGetPermissionsQuery();




    const permissions =
        permissionsData?.data ?? [];





    const [
        updateRole,
        {
            isLoading: updateLoading
        }

    ] = useUpdateRoleMutation();





    const [
        syncPermissions,
        {
            isLoading: permissionsLoading
        }

    ] = useSyncRolePermissionsMutation();






    const form = useForm<RoleFormValues>({

        resolver: zodResolver(roleSchema),

        defaultValues: {

            name: role.name

        }

    });








    function togglePermission(id: number) {


        setSelectedPermissions((prev) =>


            prev.includes(id)

                ? prev.filter(
                    permissionId =>
                        permissionId !== id
                )

                : [
                    ...prev,
                    id
                ]

        );


    }








    async function onSubmit(values: RoleFormValues) {


        try {


            await updateRole({

                id: role.id,

                name: values.name

            }).unwrap();




            await syncPermissions({

                id: role.id,

                permissions: selectedPermissions

            }).unwrap();




            setOpen(false);



        } catch (error) {


            console.log(error);


        }


    }







    return (


        <Dialog

            open={open}

            onOpenChange={setOpen}

        >



            <DialogContent

                className="max-h-[80vh] overflow-y-auto"

            >



                <DialogHeader>


                    <DialogTitle>

                        Manage Role Permissions

                    </DialogTitle>


                </DialogHeader>






                <form

                    onSubmit={
                        form.handleSubmit(onSubmit)
                    }

                    className="mt-4 space-y-6"

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

                                    disabled={
                                        updateLoading ||
                                        permissionsLoading
                                    }

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








                    <div className="space-y-3">



                        <FieldLabel>

                            Permissions

                        </FieldLabel>





                        <div className="grid gap-3">



                            {
                                permissions.map((permission) => (



                                    <div

                                        key={permission.id}

                                        className="
                                            flex
                                            items-center
                                            gap-3
                                        "

                                    >



                                        <Checkbox


                                            checked={

                                                selectedPermissions.includes(

                                                    permission.id

                                                )

                                            }



                                            onCheckedChange={() =>

                                                togglePermission(

                                                    permission.id

                                                )

                                            }


                                        />




                                        <span>

                                            {permission.name}

                                        </span>



                                    </div>



                                ))
                            }




                        </div>



                    </div>







                    <Button


                        type="submit"


                        className="w-full"


                        disabled={

                            updateLoading ||

                            permissionsLoading

                        }


                    >



                        {

                            updateLoading ||

                            permissionsLoading ? (



                                <>


                                    <Loader2

                                        className="
                                            mr-2
                                            h-4
                                            w-4
                                            animate-spin
                                        "

                                    />


                                    Saving...


                                </>



                            ) : (


                                "Save Changes"


                            )

                        }



                    </Button>





                </form>




            </DialogContent>




        </Dialog>


    );

}