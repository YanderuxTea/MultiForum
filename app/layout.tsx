import type {Metadata} from 'next'
import './globals.css'
import React from 'react'
import {ThemeProvider} from 'next-themes'
import {montserrat} from '@/styles/font'
import Preloader from '@/components/ui/Preloader'
import HeaderProviders from '@/components/providers/HeaderProviders'
import HeaderWrapper from '@/components/ui/HeaderWrapper'
import StubHeader from '@/components/shared/StubHeader'
import Footer from '@/components/ui/Footer'
import Notify from '@/components/shared/Notify'
import NotifyProvider from '@/components/providers/NotifyProvider'


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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased ${montserrat.className} bg-[#EDF0F4] dark:bg-[#121212] flex flex-col min-h-screen items-center`}
      >
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <NotifyProvider>
          <Preloader/>
          <Notify/>
          <HeaderProviders>
            <HeaderWrapper/>
          </HeaderProviders>
          <StubHeader/>
            {children}
          <Footer/>
        </NotifyProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
