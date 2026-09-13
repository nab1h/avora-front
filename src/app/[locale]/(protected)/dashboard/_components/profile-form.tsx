"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";

import { useUpdateProfileMutation } from "@/lib/services/profile-api";

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
import { useTranslations } from "next-intl";

export function ProfileForm() {
  const t = useTranslations("profile");

  const user = useSelector((state: RootState) => state.auth.user);

  const [updateProfile, { isLoading, isSuccess }] =
    useUpdateProfileMutation();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    try {
      await updateProfile({
        name,
        email,
      }).unwrap();

      toast.success(t("updatedSuccessfully"));
    } catch (error) {
      console.error(error);
      toast.error(t("failedToUpdate"));
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
            <Label htmlFor="name">
              {t("name")}
            </Label>

            <Input
              id="name"
              name="name"
              defaultValue={user.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              {t("email")}
            </Label>

            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
              required
            />
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