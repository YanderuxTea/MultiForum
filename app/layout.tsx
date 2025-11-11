import type {Metadata} from 'next'
import './globals.css'
import React from 'react'
import {ThemeProvider} from 'next-themes'
import {montserrat} from '@/styles/font'
import Preloader from '@/components/ui/Preloader'
import HeaderProviders from '@/components/providers/HeaderProviders'
import HeaderWrapper from '@/components/ui/headers/HeaderWrapper'
import Footer from '@/components/ui/Footer'
import Notify from '@/components/shared/notifys/Notify'
import NotifyProvider from '@/components/providers/NotifyProvider'
import DataUserProvider from '@/components/providers/DataUserProvider'
import LoaderProvider from '@/components/providers/LoaderProvider'
import NotifyVerifyEmail from '@/components/shared/notifys/NotifyVerifyEmail'
import UnderHeader from '@/components/ui/headers/UnderHeader'


export const metadata: Metadata = {
  title: "Multi Forum главная",
  description: "Форум разработчиков и программистов",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`antialiased ${montserrat.className} bg-[#EDF0F4] dark:bg-[#121212] flex flex-col min-h-screen items-center`}
      >
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <LoaderProvider>
          <DataUserProvider>
            <NotifyProvider>
                <Preloader/>
                <Notify/>
                <NotifyVerifyEmail/>
                <HeaderProviders>
                  <HeaderWrapper/>
                </HeaderProviders>
                <UnderHeader/>
                  {children}
                <Footer/>
            </NotifyProvider>
          </DataUserProvider>
        </LoaderProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
