"use client";


import { useState } from "react";

import { Loader2 } from "lucide-react";


import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";


import {
    Button
} from "@/components/ui/button";


import {
    Checkbox
} from "@/components/ui/checkbox";


import {
    FieldLabel
} from "@/components/ui/field";


import {
    useUpdateUserRolesMutation,
    useUpdateUserPermissionsMutation,
} from "@/lib/services/users-api";
import { useGetPermissionsQuery, useGetRolesQuery } from "@/lib/services/roles-api";
import { toast } from "sonner";





interface UserRole {

    id:number;

    name:string;

}



interface UserPermission {

    id:number;

    name:string;

}



interface User {


    id:number;

    roles:UserRole[];

    permissions:UserPermission[];

}



interface Props {

    user:User;

    open:boolean;

    setOpen:(value:boolean)=>void;

}







export default function ManageAccessDialog({

    user,

    open,

    setOpen

}:Props){





    const [selectedRoles,setSelectedRoles] = useState<number[]>(

        user.roles.map(role=>role.id)

    );




    const [selectedPermissions,setSelectedPermissions] = useState<number[]>(

        user.permissions.map(permission=>permission.id)

    );







    const {
        data:rolesData
    } = useGetRolesQuery();



    const {
        data:permissionsData
    } = useGetPermissionsQuery();





const roles: UserRole[] = rolesData?.data ?? [];

const permissions: UserPermission[] = permissionsData?.data ?? [];





    const [
        updateRoles,
        {
            isLoading:rolesLoading
        }

    ] = useUpdateUserRolesMutation();





    const [
        updatePermissions,
        {
            isLoading:permissionsLoading
        }

    ] = useUpdateUserPermissionsMutation();






    function toggleRole(id:number){


        setSelectedRoles(prev=>

            prev.includes(id)

            ? prev.filter(item=>item!==id)

            : [...prev,id]

        );


    }






    function togglePermission(id:number){


        setSelectedPermissions(prev=>

            prev.includes(id)

            ? prev.filter(item=>item!==id)

            : [...prev,id]

        );


    }







    async function handleSave(){


        try {


            await updateRoles({

                id:user.id,

                roles:selectedRoles

            }).unwrap();





            if (selectedPermissions.length > 0) {
                await updatePermissions({
                    id: user.id,
                    permissions: selectedPermissions,
                }).unwrap();
            }





            setOpen(false);
            toast.success("User roles and permissions updated successfully.");



        } catch {


            toast.error("Failed to update user access. Please try again.");


        }



    }







    const loading =

        rolesLoading ||

        permissionsLoading;







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

                        Manage User Access

                    </DialogTitle>


                </DialogHeader>







                <div className="space-y-6 mt-4">





                    <div className="space-y-3">


                        <FieldLabel>

                            Roles

                        </FieldLabel>





                        <div className="grid gap-3">


                            {
                                roles.map(role=>(


                                    <div

                                        key={role.id}

                                        className="flex items-center gap-3"

                                    >


                                        <Checkbox

                                            checked={
                                                selectedRoles.includes(
                                                    role.id
                                                )
                                            }

                                            onCheckedChange={()=>
                                                toggleRole(role.id)
                                            }

                                        />


                                        <span>

                                            {role.name}

                                        </span>



                                    </div>


                                ))
                            }


                        </div>


                    </div>








                    <div className="space-y-3">


                        <FieldLabel>

                            Permissions

                        </FieldLabel>





                        <div className="grid gap-3">


                            {
                                permissions.map(permission=>(


                                    <div

                                        key={permission.id}

                                        className="flex items-center gap-3"

                                    >


                                        <Checkbox

                                            checked={
                                                selectedPermissions.includes(
                                                    permission.id
                                                )
                                            }


                                            onCheckedChange={()=>
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

                        className="w-full"

                        onClick={handleSave}

                        disabled={loading}

                    >


                        {
                            loading ? (

                                <>

                                    <Loader2

                                        className="mr-2 h-4 w-4 animate-spin"

                                    />

                                    Saving...

                                </>


                            ) : (

                                "Save Changes"

                            )
                        }



                    </Button>





                </div>




            </DialogContent>



        </Dialog>


    );

}