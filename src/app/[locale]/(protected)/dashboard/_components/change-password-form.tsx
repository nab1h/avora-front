"use client";

import { useChangePasswordMutation } from "@/lib/services/profile-api";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

type LaravelError = {
  message?: string;
  errors?: Record<string, string[]>;
};

export function ChangePasswordForm() {
  const t = useTranslations("profile");

  const changePasswordSchema = z
    .object({
      current_password: z.string().min(1, t("validation.currentPasswordRequired")),
      password: z.string().min(8, t("validation.passwordMin")),
      password_confirmation: z
        .string()
        .min(1, t("validation.confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t("validation.passwordsMismatch"),
      path: ["password_confirmation"],
    });

  type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

  const [changePassword, { isLoading, isSuccess }] =
    useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      const response = await changePassword(data).unwrap();

      toast.success(response.message || t("passwordChangedSuccessfully"));

      reset();
    } catch (error) {
      const apiError = error as {
        data?: LaravelError;
      };

      toast.error(
        apiError.data?.errors?.password?.[0] ??
          apiError.data?.message ??
          t("somethingWentWrong")
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("changePassword")}</CardTitle>

        <CardDescription>
          {t("changePasswordDescription")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {isSuccess && (
            <p className="text-sm text-green-500">
              {t("passwordChangedSuccessfully")}
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="current_password">
              {t("currentPassword")}
            </Label>

            <Input
              id="current_password"
              type="password"
              {...register("current_password")}
            />

            {errors.current_password && (
              <p className="text-sm text-destructive">
                {errors.current_password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {t("newPassword")}
            </Label>

            <Input
              id="password"
              type="password"
              {...register("password")}
            />

            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation">
              {t("confirmNewPassword")}
            </Label>

            <Input
              id="password_confirmation"
              type="password"
              {...register("password_confirmation")}
            />

            {errors.password_confirmation && (
              <p className="text-sm text-destructive">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          {isLoading ? (
            <Button variant="secondary" disabled>
              {t("changing")}
              <Spinner data-icon="inline-start" />
            </Button>
          ) : (
            <Button type="submit">
              {t("changePasswordButton")}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}