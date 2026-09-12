"use client";

import { useState } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateUserMutation } from "@/lib/services/users-api";

const userSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((values) => values.password === values.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type UserFormValues = z.infer<typeof userSchema>;

export default function AddUserButton() {
  const [open, setOpen] = useState(false);
  const [createUser, { isLoading }] = useCreateUserMutation();
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
      toast.success("User created successfully.");
    } catch {
      toast.error("Failed to create user. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Add User</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {([
            ["name", "Name", "Enter user name", "text"],
            ["email", "Email", "user@example.com", "email"],
            ["password", "Password", "Enter password", "password"],
            ["password_confirmation", "Confirm Password", "Repeat password", "password"],
          ] as const).map(([name, label, placeholder, type]) => (
            <Controller
              key={name}
              name={name}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`create-user-${name}`}>{label}</FieldLabel>
                  <Input
                    {...field}
                    id={`create-user-${name}`}
                    type={type}
                    placeholder={placeholder}
                    disabled={isLoading}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          ))}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? "Creating..." : "Create User"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}