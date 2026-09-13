"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppDispatch } from "@/lib/hooks";
import { setCredentials } from "@/lib/features/auth/auth-slice";


export default function FacebookCallbackPage(){


    const router = useRouter();

    const dispatch = useAppDispatch();



    useEffect(()=>{


        const params =
            new URLSearchParams(
                window.location.search
            );


        const token =
            params.get("token");



        if(token){


            localStorage.setItem(
                "token",
                token
            );



            router.replace("/dashboard");


        }


    },[router,dispatch]);



    return (

        <div>
            Signing in...
        </div>

    );

}