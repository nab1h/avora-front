"use client";

import { useState } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateUserMutation } from "@/lib/services/users-api";

export default function AddUserButton() {
  const t = useTranslations();

  const [open, setOpen] = useState(false);
  const [createUser, { isLoading }] = useCreateUserMutation();

  const userSchema = z
    .object({
      name: z.string().min(2, t("validation.nameMin")),
      email: z.string().email(t("validation.emailInvalid")),
      password: z.string().min(8, t("validation.passwordMin")),
      password_confirmation: z.string(),
    })
    .refine((values) => values.password === values.password_confirmation, {
      message: t("validation.passwordsMismatch"),
      path: ["password_confirmation"],
    });

  type UserFormValues = z.infer<typeof userSchema>;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  async function onSubmit(values: UserFormValues) {
    try {
      await createUser(values).unwrap();

      form.reset();
      setOpen(false);

      toast.success(t("userCreatedSuccessfully"));
    } catch {
      toast.error(t("failedToCreateUser"));
    }
  }

  const fields = [
    ["name", "name", "enterUserName", "text"],
    ["email", "email", "emailPlaceholder", "email"],
    ["password", "password", "enterPassword", "password"],
    [
      "password_confirmation",
      "confirmPassword",
      "repeatPassword",
      "password",
    ],
  ] as const;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>{t("add-user")}</Button>} />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("createNewUser")}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-4 space-y-4"
        >
          {fields.map(([name, label, placeholder, type]) => (
            <Controller
              key={name}
              name={name}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`create-user-${name}`}>
                    {t(`fields.${label}`)}
                  </FieldLabel>

                  <Input
                    {...field}
                    id={`create-user-${name}`}
                    type={type}
                    placeholder={t(`fields.${placeholder}`)}
                    disabled={isLoading}
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          ))}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin" />}

            {isLoading
              ? t("creating")
              : t("createUser")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}