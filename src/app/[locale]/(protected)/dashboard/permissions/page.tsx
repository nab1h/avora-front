import PermissionsTable from "../_components/permissions-table";


export default function ProfilePage() {
  return (
    <>
      <div className="flex w-full flex-col space-y-8 p-4 sm:px-6 lg:px-8">
        <div className="space-y-2 text-start">
          <h1 className="font-medium text-3xl">Permissions</h1>
          <p className="text-muted-foreground text-sm">Manage your permissions and access controls.</p>
        </div>
        <div className="w-full space-y-4 ">
          <PermissionsTable />

        </div>
      </div>
    </>
  );
}