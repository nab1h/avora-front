"use client";

import { Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

/** Compact language toggle that switches directly to the other supported locale. */
export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const isArabic = locale === "ar";

  function changeLanguage() {
    router.replace(pathname, { locale: isArabic ? "en" : "ar" });
  }

  return (
    <button
      type="button"
      onClick={changeLanguage}
      aria-label={isArabic ? "تغيير اللغة إلى الإنجليزية" : "Switch language to Arabic"}
      title={isArabic ? "English" : "العربية"}
      className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Languages className="size-[18px]" aria-hidden="true" />
    </button>
  );
}
