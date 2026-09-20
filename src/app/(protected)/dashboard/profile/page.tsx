<<<<<<< HEAD:src/app/(protected)/dashboard/profile/page.tsx
import { ChangePasswordForm } from "../_components/change-password-form";
=======
import { useTranslations } from "next-intl";
>>>>>>> 1ac9351 (finish v2-ar):src/app/[locale]/(protected)/dashboard/profile/page.tsx
import { ProfileForm } from "../_components/profile-form";

export default function ProfilePage() {
  return (
    <>
      <div className="flex w-full flex-col space-y-8 p-4 sm:px-6 lg:px-8">
        <div className="space-y-2 text-start">
          <h1 className="font-medium text-3xl">Profile</h1>
          <p className="text-muted-foreground text-sm">Please enter your details to update your profile.</p>
        </div>
        <div className="w-full space-y-4 ">
          <ProfileForm />
        </div>
      </div>
    </>
  );
}