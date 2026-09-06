"use client";


import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";



interface UserAvatarProps {

    name:string;

    image?:string | null;

}




export default function UserAvatar({

    name,

    image

}:UserAvatarProps){



    function getInitials(name:string){


        const words = name
            .trim()
            .split(" ")
            .filter(Boolean);



        if(words.length === 1){

            return words[0]
                .slice(0,2)
                .toUpperCase();

        }



        return (

            words[0][0] +

            words[words.length - 1][0]

        ).toUpperCase();


    }





    return (

        <Avatar>


            {
                image &&

                <AvatarImage
                    src={image}
                    alt={name}
                />
            }



            <AvatarFallback>

                {getInitials(name)}

            </AvatarFallback>


        </Avatar>

    );


}