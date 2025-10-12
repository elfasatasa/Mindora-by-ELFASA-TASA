import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { routing } from '@/i18n/routing';
import AuthProvider from '@/provider/AuthProvider';

import Menu from '@/components/Menu/Menu';

import "@/styles/global.scss";
import "@/styles/main.scss";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mindora",
  description: "Mindora by ELFASA TASA",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const messages = await getMessages();
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning className={rubik.className}>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reset-css@5.0.2/reset.min.css" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
         
            <div className='container'>
                <Menu/>
              {children}
            </div>
            
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
