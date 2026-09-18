"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { api } from "@/lib/axios";
import axios from "axios";

import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { setCredentials } from "@/lib/features/auth/auth-slice";
import { api as rtkApi } from "@/lib/services/api";
import { useTranslations } from "next-intl";

export function LoginForm() {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const t = useTranslations("auth.login");
  const formSchema = z.object({
    email: z.email({ message: t("invalidEmail") }),
    password: z.string().min(6, { message: t("passwordMin") }),
    remember: z.boolean().optional(),
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

async function onSubmit(data: z.infer<typeof formSchema>) {

  try {
    const response = await api.post("/login", {
      email: data.email,
      password: data.password,
    });
    const { user, token } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    dispatch(rtkApi.util.resetApiState());
    dispatch(setCredentials({user,token,}));

    toast.success(t("success"));

    router.push("/dashboard");
    } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message || t("invalidCredentials")
      );
    } else {
      toast.error(t("error"));
    }
}
}



  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FieldGroup className="gap-4">
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-email">{t("email")}</FieldLabel>
              <Input
                {...field}
                id="login-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-password">{t("password")}</FieldLabel>
              <Input
                {...field}
                id="login-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="remember"
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <Checkbox
                id="login-remember"
                name={field.name}
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                aria-invalid={fieldState.invalid}
              />
              <FieldContent>
                <FieldLabel htmlFor="login-remember" className="font-normal">
                  {t("remember")}
                </FieldLabel>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>
      <Button
        className="w-full"
        type="submit"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? (
          <>
            {t("submitting")}
            <Spinner data-icon="inline-end" />
          </>
        ) : (
          t("submit")
        )}
      </Button>
      <div className="flex w-full justify-end px-10">
        <div className="text-muted-foreground text-sm">
          {t("forgotPassword")}{" "}
          <Link prefetch={false} className="text-foreground" href="forgot-password">
            {t("resetPassword")}
          </Link>
        </div>
      </div>
    </form>
  );
}
