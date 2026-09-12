"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { setCredentials } from "@/lib/features/auth/auth-slice";

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Please enter a valid name." }),
    email: z.email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string().min(6, { message: "Confirm Password must be at least 6 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });


export function RegisterForm() {
  const dispatch = useDispatch();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
  try {
    const response = await api.post("/register", {
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
    });

    const { user, token } = response.data;

    dispatch(
      setCredentials({
        user,
        token,
      })
    );

    toast.success("Registration successful");

    localStorage.setItem("token", token);
    console.log("Registration successful:", response.data);

    router.push("/dashboard");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);

      const errors = error.response?.data?.errors;

      if (errors) {
        Object.values(errors).forEach((messages) => {
          if (Array.isArray(messages)) {
            messages.forEach((message) => toast.error(message));
          }
        });
      } else {
        toast.error(
          error.response?.data?.message || "Registration failed"
        );
      }
    } else {
      console.error(error);
      toast.error("Something went wrong");
    }
  }
}

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FieldGroup className="gap-4">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-email">Name</FieldLabel>
              <Input
                {...field}
                id="register-name"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-email">Email Address</FieldLabel>
              <Input
                {...field}
                id="register-email"
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
              <FieldLabel htmlFor="register-password">Password</FieldLabel>
              <Input
                {...field}
                id="register-password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-confirm-password">Confirm Password</FieldLabel>
              <Input
                {...field}
                id="register-confirm-password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
       <Button
        className="w-full"
        type="submit"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting
          ? "Registering..."
          : "Register"}
      </Button>
    </form>
  );
}
