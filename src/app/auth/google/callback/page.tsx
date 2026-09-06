"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppDispatch } from "@/lib/hooks";
import { setCredentials } from "@/lib/features/auth/auth-slice";


export default function GoogleCallbackPage(){

    const router = useRouter();

    const dispatch = useAppDispatch();



    useEffect(()=>{


        const params =
            new URLSearchParams(
                window.location.search
            );


        const token =
            params.get("token");


        const userParam =
            params.get("user");



        if(token && userParam){


            const user =
                JSON.parse(
                    userParam
                );



            dispatch(
                setCredentials({

                    user,

                    token

                })
            );



            localStorage.setItem(
                "token",
                token
            );


            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );



            router.replace("/dashboard");

        }


    },[dispatch,router]);



    return (
        <div>
            Signing in...
        </div>
    );

}