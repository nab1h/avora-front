"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForgotPasswordMutation } from "@/lib/services/auth-api";
import { useTranslations } from "next-intl";

export function ForgetPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const t = useTranslations("auth.passwordReset");
  const formSchema = z.object({
    email: z.email({
      message: t("invalidEmail"),
    }),
  });

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const response = await forgotPassword(data).unwrap();

      toast.success(
        response.message || t("linkSent")
      );

      form.reset();
      setIsSuccess(true);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          t("error")
      );
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-8 text-green-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m5 12 4 4L19 6"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            {t("checkEmail")}
          </h2>

          <p className="text-sm text-muted-foreground">
            {t("checkEmailDescription")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <FieldGroup className="gap-4">
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field
              className="gap-1.5"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel htmlFor="login-email">
                {t("email")}
              </FieldLabel>

              <Input
                {...field}
                id="login-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        className="w-full"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? t("sending") : t("requestSubmit")}
      </Button>
    </form>
  );
}