"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";

import {
  useSendVerificationNotificationMutation,
  useUpdateProfileMutation,
} from "@/lib/services/profile-api";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function ProfileForm() {
  const user = useSelector((state: RootState) => state.auth.user);
  const t = useTranslations("profile");


  const [updateProfile, { isLoading, isSuccess }] = useUpdateProfileMutation();
  const [sendVerificationNotification, { isLoading: isSendingVerification }] =
    useSendVerificationNotificationMutation();

  const handleSendVerification = async () => {
    try {
      const response = await sendVerificationNotification().unwrap();
      toast.success(response.message || t("verificationEmailSent"));
    } catch {
      toast.error(t("failedToSendVerification"));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    try {
      const response = await updateProfile({
        name,
        email,
      }).unwrap();

      toast.success(t("updatedSuccessfully"));

    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("personalInformation")}</CardTitle>
        <CardDescription>
          {t("updateNameAndEmail")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSuccess && (
            <p className="text-sm text-green-500">
              {t("updatedSuccessfully")}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">{t("name")}</Label>

            <Input
              id="name"
              name="name"
              defaultValue={user.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>

            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
              required
            />

            {!user.email_verified_at && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200">
                <span>{t("verifyEmailInstruction")}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleSendVerification}
                  disabled={isSendingVerification}
                >
                  {isSendingVerification ? t("sending") : t("verifyEmail")}
                </Button>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>{user.email}</span>

              {user?.email_verified_at && (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {t("verified")}
                </span>
              )}
            </div>
          </div>


          {isLoading ? (
            <Button variant="secondary" disabled>
              {t("changing")}
              <Spinner data-icon="inline-start" />
            </Button>
          ) : (
            <Button type="submit">
              {t("changeInformation")}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}