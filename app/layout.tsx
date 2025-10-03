import type { Metadata } from "next";
import "./globals.css";
import React from 'react'
import {ThemeProvider} from 'next-themes'
import {montserrat} from '@/styles/font'


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
        className={`antialiased ${montserrat.className} bg-[#EDF0F4]`}
      >
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
      </body>
    </html>
  );
}
