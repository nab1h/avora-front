"use client";


import { Loader2 } from "lucide-react";


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


import {
    useDeleteUserMutation
} from "@/lib/services/users-api";





interface Props {

    user: {

        id:number;

        name:string;

    };


    open:boolean;


    setOpen:(value:boolean)=>void;

}







export default function DeleteUserDialog({

    user,

    open,

    setOpen

}:Props){





    const [

        deleteUser,

        {
            isLoading
        }

    ] = useDeleteUserMutation();







    async function handleDelete(){


        try {


            await deleteUser(user.id).unwrap();


            setOpen(false);



        }catch(error){


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

                        Delete User?

                    </AlertDialogTitle>





                    <AlertDialogDescription>


                        Are you sure you want to delete


                        <span className="font-semibold">

                            {" "}{user.name}

                        </span>


                        ?

                        This action cannot be undone.



                    </AlertDialogDescription>




                </AlertDialogHeader>







                <AlertDialogFooter>



                    <AlertDialogCancel

                        disabled={isLoading}

                    >

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