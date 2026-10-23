import type { Metadata } from "next";
import { Geist_Mono, Nunito_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import "../globals.css";

import { StoreProvider } from "@/providers/store-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { routing } from "@/i18n/routing";
import { getPublicAssetUrl, getPublicSettings } from "@/lib/services/public-settings";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  const general = settings?.data.general;
  const branding = settings?.data.branding;
  const favicon = getPublicAssetUrl(branding?.site_favicon);
  const appleIcon = getPublicAssetUrl(branding?.site_apple_icon);

  return {
    title: general?.site_name || "CORE LIGHTING",
    description: general?.site_description || "Architectural lighting solutions.",
    icons: {
      icon: favicon ? [{ url: favicon }] : [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: appleIcon ? [{ url: appleIcon }] : undefined,
    },
  };
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

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
          <ThemeProvider>
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
