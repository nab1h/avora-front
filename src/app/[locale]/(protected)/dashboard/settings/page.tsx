import { useTranslations } from "next-intl";
import { ChangePasswordForm } from "../_components/change-password-form";

export default function ProfilePage() {
  const t = useTranslations("settings");

  return (
    <>
      <div className="flex w-full flex-col space-y-8 p-4 sm:px-6 lg:px-8">
        <div className="space-y-2 text-start">
          <h1 className="font-medium text-3xl">
            {t("title")}
          </h1>

          <p className="text-muted-foreground text-sm">
            {t("description")}
          </p>
        </div>

        <div className="w-full space-y-4">
          <ChangePasswordForm />
        </div>
      </div>
    </>
  );
}