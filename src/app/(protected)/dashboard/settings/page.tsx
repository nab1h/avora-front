import { ChangePasswordForm } from "../_components/change-password-form";

export default function SettingsPage() {
  return (
    <>
      <div className="flex w-full flex-col space-y-8 p-4 sm:px-6 lg:px-8">
        <div className="space-y-2 text-start">
          <h1 className="font-medium text-3xl">
            Settings
          </h1>

          <p className="text-muted-foreground text-sm">
            change password
          </p>
        </div>

        <div className="w-full space-y-4">
          <ChangePasswordForm />
        </div>
      </div>
    </>
  );
}