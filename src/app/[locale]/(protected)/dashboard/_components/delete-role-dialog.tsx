"use client";


import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";


import { Loader2 } from "lucide-react";

import {
    useDeleteRoleMutation
} from "@/lib/services/roles-api";




interface Props {

    id: number;

    name: string;

    open: boolean;

    setOpen: (value: boolean) => void;

}





export default function DeleteRoleDialog({

    id,

    name,

    open,

    setOpen

}: Props) {



    const [
        deleteRole,
        {
            isLoading
        }

    ] = useDeleteRoleMutation();






    async function handleDelete() {


        try {


            await deleteRole(id).unwrap();


            setOpen(false);



        } catch (error) {


            console.log(error);


        }


    }





    return (


        <AlertDialog

            open={open}

            onOpenChange={setOpen}

        >



            <AlertDialogContent>



                <AlertDialogHeader>


                    <AlertDialogTitle>

                        Delete Role?

                    </AlertDialogTitle>



                    <AlertDialogDescription>


                        Are you sure you want to delete

                        <span className="font-semibold">

                            {" "}{name}

                        </span>


                        ?

                        This action cannot be undone.



                    </AlertDialogDescription>



                </AlertDialogHeader>






                <AlertDialogFooter>



                    <AlertDialogCancel>

                        Cancel

                    </AlertDialogCancel>





                    <AlertDialogAction

                        onClick={handleDelete}

                        disabled={isLoading}

                    >


                        {

                            isLoading ? (


                                <>

                                    <Loader2

                                        className="mr-2 h-4 w-4 animate-spin"

                                    />

                                    Deleting...


                                </>


                            ) : (


                                "Delete"


                            )


                        }



                    </AlertDialogAction>



                </AlertDialogFooter>




            </AlertDialogContent>



        </AlertDialog>


    );

}