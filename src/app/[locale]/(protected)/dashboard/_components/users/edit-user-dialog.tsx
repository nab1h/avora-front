"use client";


import { Loader2 } from "lucide-react";


import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";


import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";


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
    useUpdateUserMutation
} from "@/lib/services/users-api";
import { toast } from "sonner";




const userSchema = z.object({

    name: z
        .string()
        .min(2, "Name must be at least 2 characters"),


    email: z
        .string()
        .email("Invalid email"),


    password: z
        .string()
        .optional()
        .or(z.literal("")),

});



type UserFormValues = z.infer<typeof userSchema>;





interface User {


    id:number;

    name:string;

    email:string;


}




interface Props {

    user:User;

    open:boolean;

    setOpen:(value:boolean)=>void;

}






export default function EditUserDialog({

    user,

    open,

    setOpen

}:Props){





    const [

        updateUser,

        {
            isLoading
        }

    ] = useUpdateUserMutation();







    const form = useForm<UserFormValues>({


        resolver:zodResolver(userSchema),


        defaultValues:{


            name:user.name,


            email:user.email,


            password:""


        }


    });







    async function onSubmit(values:UserFormValues){



        try {


            await updateUser({


                id:user.id,


                name:values.name,


                email:values.email,


                ...(values.password && {

                    password:values.password

                })



            }).unwrap();





            setOpen(false);




            form.reset();
            toast.success("User updated successfully.");



        } catch {


            toast.error("Failed to update user. Please try again.");


        }



    }







    return (



        <Dialog

            open={open}

            onOpenChange={setOpen}

        >



            <DialogContent>



                <DialogHeader>


                    <DialogTitle>

                        Edit User

                    </DialogTitle>


                </DialogHeader>







                <form

                    onSubmit={
                        form.handleSubmit(onSubmit)
                    }

                    className="space-y-5 mt-4"

                >






                    <Controller

                        name="name"

                        control={form.control}


                        render={({field,fieldState})=>(


                            <Field

                                data-invalid={
                                    fieldState.invalid
                                }

                            >


                                <FieldLabel>

                                    Name

                                </FieldLabel>



                                <Input

                                    {...field}

                                    disabled={isLoading}

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

                        name="email"

                        control={form.control}


                        render={({field,fieldState})=>(


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

                                    disabled={isLoading}

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

                        name="password"

                        control={form.control}


                        render={({field})=>(


                            <Field>


                                <FieldLabel>

                                    Password

                                </FieldLabel>



                                <Input

                                    {...field}

                                    type="password"

                                    placeholder="Leave empty to keep current password"

                                    disabled={isLoading}

                                />



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

                                    Saving...


                                </>


                            ):(


                                "Save Changes"


                            )

                        }


                    </Button>





                </form>





            </DialogContent>





        </Dialog>



    );


}