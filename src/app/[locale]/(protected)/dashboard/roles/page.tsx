import { useTranslations } from "next-intl";
import RolesTable from "../_components/roles-table";
import AddRoleButton from "../_components/add-role-button";

export default function RolesPage() {
  const t = useTranslations("roles");

  return (
    <>
      <div className="flex w-full flex-col space-y-8 p-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between">
          <div className="space-y-2 text-start">
            <h1 className="font-medium text-3xl">
              {t("title")}
            </h1>

            <p className="text-muted-foreground text-sm">
              {t("description")}
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