import { ResetPasswordForm } from "./_components/reset-password-form";
import { useTranslations } from "next-intl";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string;
    email?: string;
  }>;
}) {
  const params = await searchParams;
  const t = useTranslations("auth.passwordReset");

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
      <div className="space-y-2 text-center">
        <h1 className="font-medium text-3xl">
          {t("resetTitle")}
        </h1>

        <p className="text-muted-foreground text-sm">
          {t("resetDescription")}
        </p>
      </div>

      <ResetPasswordForm
        token={params.token ?? ""}
        email={params.email ?? ""}
      />
    </div>
  );
}