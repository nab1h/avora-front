"use client";

import { useChangePasswordMutation } from "@/lib/services/profile-api";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LaravelError = {
  message?: string;
  errors?: Record<string, string[]>;
};

const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });


type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;


export function ChangePasswordForm() {
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

      toast.success(response.message);

      reset();
    } catch (error) {
      const apiError = error as {
        data?: LaravelError;
      };

      toast.error(
        apiError.data?.errors?.password?.[0] ??
        apiError.data?.message ??
        "Something went wrong"
      );
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            {isSuccess && (
            <p className="text-sm text-green-500">
              Password changed successfully
            </p>
          )}
            <Label htmlFor="current_password">
              Current Password
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
              New Password
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
              Confirm New Password
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
              Changing...
              <Spinner data-icon="inline-start" />
            </Button>
          ) : (
            <Button type="submit">
              Change password
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}