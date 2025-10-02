import type { Metadata } from "next";
import "./globals.css";
import React from 'react'
import {ThemeProvider} from 'next-themes'


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
        className={`antialiased`}
      >
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
      </body>
    </html>
  );
}
