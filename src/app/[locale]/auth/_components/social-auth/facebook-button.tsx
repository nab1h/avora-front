"use client";

import { siFacebook} from "simple-icons";
import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function FacebookButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  const t = useTranslations("auth.login");
  
function handleFacebookLogin() {

        window.location.href =
            `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook/redirect`;

    }

  return (
    <Button variant="secondary" className={cn(className)} {...props} onClick={handleFacebookLogin}>
      <SimpleIcon icon={siFacebook} className="size-4" />
      {t("continueWithFacebook")}
    </Button>
  );
}
