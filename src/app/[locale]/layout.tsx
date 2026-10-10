import type { Metadata } from "next";
import { Geist_Mono, Nunito_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";

import "../globals.css";

import { StoreProvider } from "@/providers/store-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import { getMessages, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import {
  getLocalizedSiteDetails,
  getPublicAssetUrl,
  getPublicSettings,
} from "@/lib/services/public-settings";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getPublicSettings();
  const branding = settings?.data.branding;
  const { siteName, siteDescription } = getLocalizedSiteDetails(settings, locale);
  const favicon = getPublicAssetUrl(branding?.site_favicon);
  const appleIcon = getPublicAssetUrl(branding?.site_apple_icon);

  return {
    title: siteName,
    description: siteDescription || "AVORA Application",
    icons: {
      icon: favicon ?? undefined,
      apple: appleIcon ?? undefined,
    },
    manifest: "/manifest.webmanifest",
  };
}

// ⭐ ضروري مع setRequestLocale عشان الـ static rendering
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }


  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${nunitoSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <StoreProvider>
              <Toaster />
              {children}
            </StoreProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}