import { ResetPasswordForm } from "./_components/reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string;
    email?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
      <div className="space-y-2 text-center">
        <h1 className="font-medium text-3xl">
          Reset your password
        </h1>

        <p className="text-muted-foreground text-sm">
          Enter your new password below.
        </p>
      </div>

      <ResetPasswordForm
        token={params.token ?? ""}
        email={params.email ?? ""}
      />
    </div>
  );
}