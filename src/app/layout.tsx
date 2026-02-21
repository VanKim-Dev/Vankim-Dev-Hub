import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
// import { ThemeProvider } from 'next-themes'
import { ThemeProvider } from "@/components/theme-provider"
import NextTopLoader from 'nextjs-toploader'
import { Analytics } from '@vercel/analytics/react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './globals.css'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/context/LanguageContext";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  display: 'swap',
  subsets: ['latin'],
})

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <NextTopLoader showSpinner={false} height={2} color="#2acf80" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ReactQueryProvider>
            <LanguageProvider>
            {children}
            </LanguageProvider>
            <Toaster 
              position="top-right"     // 기본 위치 (오른쪽 위)
              richColors               // 색상 더 예쁘게
              duration={3000}          // 자동 사라지는 시간
              closeButton              // 닫기 버튼 보이게
            />
            <Analytics />
            <ReactQueryDevtools initialIsOpen={false} />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
