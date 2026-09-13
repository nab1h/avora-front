"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useResetPasswordMutation } from "@/lib/services/auth-api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),

    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  });

type FormValues = z.infer<typeof formSchema>;

interface ResetPasswordFormProps {
  token: string;
  email: string;
}

export function ResetPasswordForm({
  token,
  email,
}: ResetPasswordFormProps) {
  const router = useRouter();

  const [resetPassword, { isLoading }] =
    useResetPasswordMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      const response = await resetPassword({
        token,
        email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      }).unwrap();

      toast.success(response.message);

      router.push("/auth/login");
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          "Unable to reset password. Please try again."
      );
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="New password"
          {...form.register("password")}
        />

        {form.formState.errors.password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Confirm password"
          {...form.register("password_confirmation")}
        />

        {form.formState.errors.password_confirmation && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password_confirmation.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Resetting..." : "Reset password"}
      </Button>
    </form>
  );
}