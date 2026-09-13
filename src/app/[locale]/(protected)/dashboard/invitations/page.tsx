import InvitationsTable from "./_components/invitations-table";
import AddInvitationDialog from "./_components/add-invitation-dialog";


export default function InvitationsPage(){

    return (

        <div className="flex w-full flex-col space-y-8 p-4 sm:px-6 lg:px-8">


            <div className="flex items-center justify-between">

                <div className="space-y-2">

                    <h1 className="text-3xl font-medium">
                        Invitations
                    </h1>

                    <p className="text-muted-foreground text-sm">
                        Manage user invitations and access.
                    </p>

                </div>


                <AddInvitationDialog />


            </div>




            <InvitationsTable />


        </div>

    );

}