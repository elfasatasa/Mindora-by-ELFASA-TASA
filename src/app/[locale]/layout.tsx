import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from '@/provider/AuthProvider';
import { getMessages } from 'next-intl/server';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mindora",
  description: "Mindora by ELFASA TASA",
};
type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};
export default async function RootLayout({children, params}: Props) {
    const messages = await getMessages(); 
    const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  console.log(locale)
  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextIntlClientProvider messages={messages}> 
           <AuthProvider>
            {children}
          </AuthProvider>
          </NextIntlClientProvider>

      </body>
    </html>
  );
}
