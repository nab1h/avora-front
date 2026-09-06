import { api } from "./api";



interface InvitationRole {

    id:number;

    name:string;

}



export interface Invitation {


    id:number;

    email:string;

    token:string;

    role_id:number;

    invited_by:number;


    expires_at:string;

    accepted_at:string | null;

    revoked_at:string | null;


    created_at:string;

    updated_at:string;



    role:InvitationRole;



    inviter:{

        id:number;

        name:string;

        email:string;

    };


}




interface InvitationsResponse {


    invitations:{

        current_page:number;

        data:Invitation[];

        last_page:number;

        total:number;

        per_page:number;

    };


}





export const invitationsApi = api.injectEndpoints({

    endpoints:(builder)=>({





        // Get all invitations
        getInvitations: builder.query<

            InvitationsResponse,

            void

        >({

            query:()=>({

                url:"/invitations",

                method:"GET"

            }),


            providesTags:["Invitations"]

        }),







        // Create invitation
        createInvitation: builder.mutation<

            Invitation,

            {

                email:string;

                role_id:number;

            }

        >({

            query:(body)=>({


                url:"/invitations",

                method:"POST",

                body


            }),


            invalidatesTags:["Invitations"]


        }),







        // Resend invitation
        resendInvitation: builder.mutation<

            any,

            number

        >({

            query:(id)=>({


                url:`/invitations/${id}/resend`,

                method:"POST"


            }),


            invalidatesTags:["Invitations"]


        }),







        // Accept invitation
        acceptInvitation: builder.mutation<

            any,

            {

                token:string;

                name:string;

                password:string;

                password_confirmation:string;

            }

        >({

            query:(body)=>({


                url:"/invitations/accept",

                method:"POST",

                body


            })


        })






    })

});







export const {


    useGetInvitationsQuery,


    useCreateInvitationMutation,


    useResendInvitationMutation,


    useAcceptInvitationMutation



}=invitationsApi;