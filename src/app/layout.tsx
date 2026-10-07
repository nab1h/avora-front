import type { Metadata } from "next";
import { Geist_Mono, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from '@/providers/store-provider';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getPublicAssetUrl, getPublicSettings } from '@/lib/services/public-settings';



const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  const branding = settings?.data.branding;
  const favicon = getPublicAssetUrl(branding?.site_favicon);
  const appleIcon = getPublicAssetUrl(branding?.site_apple_icon);
  const androidIcon = getPublicAssetUrl(branding?.site_android_icon);
  const maskableIcon = getPublicAssetUrl(branding?.site_maskable_icon);

  return {
    title: settings?.data.general?.site_name || 'AVORA',
    description: settings?.data.general?.site_description || 'Digital Card Platform',
    icons: {
      icon: [
        ...(favicon ? [{ url: favicon }] : []),
        ...(androidIcon ? [{ url: androidIcon, sizes: '192x192' }] : []),
        ...(maskableIcon ? [{ url: maskableIcon, sizes: '512x512' }] : []),
      ],
      apple: appleIcon ? [{ url: appleIcon, sizes: '180x180' }] : [],
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${nunitoSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
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
      </body>
    </html>
  );
}
