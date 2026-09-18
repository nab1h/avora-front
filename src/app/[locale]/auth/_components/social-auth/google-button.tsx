"use client";

import { siGoogle } from "simple-icons";
import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";


export function GoogleButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  const t = useTranslations("auth.login");

  function handleGoogleLogin() {

        window.location.href =
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google/redirect`;



    }

  return (
    <Button variant="secondary" className={cn(className)} {...props} onClick={handleGoogleLogin}>
      <SimpleIcon icon={siGoogle} className="size-4" />
      {t("continueWithGoogle")}
    </Button>
  );
}
