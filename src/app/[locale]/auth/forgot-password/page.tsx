import Link from "next/link";

import { Globe } from "lucide-react";
import { APP_CONFIG } from "@/config/app-config";
import { ForgetPasswordForm } from "../_components/forget-password-form";
import { GuestRoute } from "@/components/GuestRoute";
import { useLocale, useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function ForgetPassword() {
  const t = useTranslations("auth.passwordReset");
  const locale = useLocale();

  return (
    <>
      <GuestRoute>
        <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
          <div className="space-y-2 text-center">
            <h1 className="font-medium text-3xl">{t("requestTitle")}</h1>
            <p className="text-muted-foreground text-sm">{t("requestDescription")}</p>
          </div>
          <div className="space-y-4">
            <ForgetPasswordForm />
          </div>
        </div>

        <div className="absolute top-5 flex w-full justify-end px-10">
          <div className="text-muted-foreground text-sm">
            {t("noAccount")}{" "}
            <Link prefetch={false} className="text-foreground" href="register">
              {t("register")}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-5 flex w-full justify-between px-10">
          <div className="text-sm">{APP_CONFIG.copyright}</div>
          <LanguageSwitcher />
        </div>
      </GuestRoute>
    </>
  );
}
