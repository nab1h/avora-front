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

import { Input } from "@/components/ui/input";

import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import { useCreateRoleMutation } from "@/lib/services/roles-api";

export default function AddRoleButton() {
  const t = useTranslations("roles");

  const [open, setOpen] = useState(false);

  const [createRole, { isLoading }] = useCreateRoleMutation();

  const roleSchema = z.object({
    name: z
      .string()
      .min(2, t("validation.nameMin"))
      .max(50, t("validation.nameMax")),
  });

  type RoleFormValues = {
    name: string;
  };

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: RoleFormValues) {
    try {
      await createRole(values).unwrap();

      form.reset();

      setOpen(false);

      toast.success(t("roleCreatedSuccessfully"));
    } catch {
      toast.error(t("failedToCreateRole"));
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger
        render={
          <Button>
            + {t("addRole")}
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("createNewRole")}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 space-y-5"
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  {t("roleName")}
                </FieldLabel>

                <Input
                  {...field}
                  placeholder={t("enterRoleName")}
                  disabled={isLoading}
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("creating")}
              </>
            ) : (
              t("createRole")
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

