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
import CategoriesProvider from '@/components/providers/CategoriesProvider'

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL,
  title: "Multi Forum | Главная",
  description: "Форум для разработчиков и программистов. Обсуждайте Python, JavaScript, C++, Node.js, Next.js и другие технологии. Находите ответы по категориям.",
  openGraph:{
    title: 'Multi Forum | Главная',
    description: 'Форум для разработчиков и программистов. Обсуждайте Python, JavaScript, C++, Node.js, Next.js и другие технологии. Находите ответы по категориям.',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Multi Forum',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630
      }
    ],
    locale: 'ru_RU',
    type:'website',
  },
  other:{
    'google-site-verification': '7RpuUJB_0Q46YWoZus_7cr6G5ZnHbwp1xdtJKFdfCGA',
    'yandex-verification': '539326b454f48665'
  },
  icons:{
    icon:'/favicon.ico',
    shortcut: '/favicon.ico',
    apple:'/favicon.ico',
  }
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`antialiased ${montserrat.className} bg-[#EDF0F4] dark:bg-[#121212] flex flex-col min-h-screen items-center`}>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <LoaderProvider>
          <DataUserProvider>
            <CategoriesProvider>
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
            </CategoriesProvider>
          </DataUserProvider>
        </LoaderProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
