import Link from "next/link";

import { Globe } from "lucide-react";
import { APP_CONFIG } from "@/config/app-config";
import { ForgetPasswordForm } from "../_components/forget-password-form";
import { GuestRoute } from "@/components/GuestRoute";

export default function ForgetPassword() {
  return (
    <>
    <GuestRoute>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <h1 className="font-medium text-3xl">Reset your password</h1>
          <p className="text-muted-foreground text-sm">Please enter your details to reset your password.</p>
        </div>
        <div className="space-y-4">
          <ForgetPasswordForm />
        </div>
      </div>

      <div className="absolute top-5 flex w-full justify-end px-10">
        <div className="text-muted-foreground text-sm">
          Don&apos;t have an account?{" "}
          <Link prefetch={false} className="text-foreground" href="register">
            Register
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 flex w-full justify-between px-10">
        <div className="text-sm">{APP_CONFIG.copyright}</div>
        <div className="flex items-center gap-1 text-sm">
          <Globe className="size-4 text-muted-foreground" />
          ENG
        </div>
      </div>
      </GuestRoute>
    </>
  );
}
