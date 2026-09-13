
import type { Metadata } from "next";
import { Geist_Mono, Nunito_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";

import "../globals.css";

import { StoreProvider } from "@/providers/store-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import { getMessages } from "next-intl/server";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AVORA",
  description: "AVORA Application",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocaleLayout({
  children,
  params,
}: Props) {
  const { locale } = await params;
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