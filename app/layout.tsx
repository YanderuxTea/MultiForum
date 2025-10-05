import type { Metadata } from "next";
import "./globals.css";
import React from 'react'
import {ThemeProvider} from 'next-themes'
import {montserrat} from '@/styles/font'
import Preloader from '@/components/ui/Preloader'
import HeaderProviders from '@/components/providers/HeaderProviders'
import HeaderWrapper from '@/components/ui/HeaderWrapper'
import StubHeader from '@/components/shared/StubHeader'
import Footer from '@/components/ui/Footer'


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
        className={`antialiased ${montserrat.className} bg-[#EDF0F4] dark:bg-[#121212] flex flex-col min-h-screen`}
      >
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <Preloader/>
        <HeaderProviders>
          <HeaderWrapper/>
        </HeaderProviders>
        <StubHeader/>
          {children}
        <Footer/>
      </ThemeProvider>
      </body>
    </html>
  );
}
