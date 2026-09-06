"use client";


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
    useRouter,
    useParams
} from "next/navigation";


import {
    Loader2
} from "lucide-react";


import {
    Button
} from "@/components/ui/button";


import {
    Input
} from "@/components/ui/input";


import {
    Field,
    FieldError,
    FieldLabel
} from "@/components/ui/field";


import {
    useAcceptInvitationMutation
} from "@/lib/services/invitations-api";




const schema = z.object({

    name: z
        .string()
        .min(
            2,
            "Name must be at least 2 characters"
        ),


    password: z
        .string()
        .min(
            8,
            "Password must be at least 8 characters"
        ),


    password_confirmation: z
        .string()

})
.refine(
    (data)=>
        data.password === data.password_confirmation,
    {
        message:"Passwords do not match",
        path:["password_confirmation"]
    }
);



type FormValues = z.infer<typeof schema>;





export default function AcceptInvitationPage(){



    const router = useRouter();


    const params = useParams();


    const token =
        params.token as string;





    const [
        acceptInvitation,
        {
            isLoading
        }

    ] = useAcceptInvitationMutation();







    const form = useForm<FormValues>({

        resolver:zodResolver(schema),


        defaultValues:{

            name:"",

            password:"",

            password_confirmation:""

        }

    });








    async function onSubmit(
        values:FormValues

        
    ){

 console.log("FORM DATA", values);

    console.log("TOKEN", token);
        try{


            await acceptInvitation({

                token,

                name:values.name,

                password:values.password,

                password_confirmation:
                    values.password_confirmation


            }).unwrap();





            router.push("/auth/login");



        }catch(error){


            console.log(error);


        }


    }









    return (

        <div className="
            flex
            min-h-screen
            items-center
            justify-center
            p-4
        ">


            <div className="
                w-full
                max-w-md
                space-y-6
                rounded-lg
                border
                p-6
            ">



                <div>

                    <h1 className="
                        text-2xl
                        font-semibold
                    ">

                        Accept Invitation

                    </h1>


                    <p className="
                        text-sm
                        text-muted-foreground
                    ">

                        Complete your account setup

                    </p>


                </div>







                <form

                    onSubmit={
                        form.handleSubmit(onSubmit)
                    }

                    className="
                        space-y-5
                    "

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

                                    placeholder="Ahmed"

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


                        render={({field,fieldState})=>(


                            <Field
                                data-invalid={
                                    fieldState.invalid
                                }
                            >


                                <FieldLabel>
                                    Password
                                </FieldLabel>


                                <Input

                                    {...field}

                                    type="password"

                                    placeholder="********"

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

                        name="password_confirmation"

                        control={form.control}


                        render={({field,fieldState})=>(


                            <Field
                                data-invalid={
                                    fieldState.invalid
                                }
                            >


                                <FieldLabel>
                                    Confirm Password
                                </FieldLabel>


                                <Input

                                    {...field}

                                    type="password"

                                    placeholder="********"

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

                                    Creating Account...

                                </>


                            ) : (

                                "Create Account"

                            )
                        }


                    </Button>





                </form>






            </div>



        </div>

    );

}