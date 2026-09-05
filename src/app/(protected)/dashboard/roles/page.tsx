import RolesTable from "../_components/roles-table";
import AddRoleButton from "../_components/add-role-button";


export default function ProfilePage() {
  return (
    <>
      <div className="flex w-full flex-col space-y-8 p-4 sm:px-6 lg:px-8">

        <div className="flex items-start justify-between">

          <div className="space-y-2 text-start">
            <h1 className="font-medium text-3xl">
              Roles
            </h1>

            <p className="text-muted-foreground text-sm">
              Manage your roles and access controls.
            </p>
          </div>


<div className="flex items-bottom justify-end space-x-2"> 

          <AddRoleButton />

</div>

        </div>


        <div className="w-full space-y-4">
          <RolesTable />
        </div>


      </div>
    </>
  );
}