"use client";

import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const changeLanguage = (newLocale: "ar" | "en") => {
    if (newLocale === locale) return;

    router.replace(
      { pathname, query: Object.fromEntries(searchParams.entries()) },
      { locale: newLocale }
    );
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border bg-background p-1">
      {routing.locales.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => changeLanguage(item)}
          disabled={item === locale}
          className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
            item === locale
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {item === "ar" ? "عربي" : "EN"}
        </button>
      ))}
    </div>
  );
}